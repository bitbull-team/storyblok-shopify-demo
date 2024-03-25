import {json, type LoaderArgs} from '@shopify/remix-oxygen';
import {useLoaderData} from '@remix-run/react';
import {StoryblokComponent, useStoryblokState} from '@storyblok/react';
import {PRODUCT_CARD_FRAGMENT} from '~/data/fragments';

const shouldFetchCollections = (story) => story.content.body.some(item => item.component === 'Collections');
const shouldFetchProducts = (story) => story.content.body.some(item => {
  return item.component === 'Collection' && item.shopify_connect?.items.length
});

export async function loader({context, params}: LoaderArgs) {
  const slug = params['*'] ?? 'home';
  // todo check params.handle

  const cms = await context.storyblok.get(`cdn/stories/${slug}`, {
    version: 'draft',
  });

  const story = cms?.data?.story || null;
  let collections = null;
  let collection = null;

  if (shouldFetchCollections(story)) {
    collections = await context.storefront.query(COLLECTIONS_QUERY, {
      variables: {
        country: context.storefront.i18n.country,
        language: context.storefront.i18n.language,
        first: 10,
      },
    });
  }

  if (shouldFetchProducts(story)) {
    console.log('STO FETCHANDO DI NUOVO I PRODOTTI AL CAMBIO FILTRI');
    const storyblokComponent = story.content.body.filter(item => item.component === 'Collection')[0];
    const handle = storyblokComponent.shopify_connect.items[0].handle;
    collection = await context.storefront.query(COLLECTION_QUERY, {
      variables: {
        sortKey: 'PRICE',
        first: 40,
        handle,
        country: context.storefront.i18n.country,
        language: context.storefront.i18n.language,
      },
    });
  }

  return json({
    story,
    ...(shouldFetchCollections(story) && collections),
    ...(shouldFetchProducts(story) && collection),
    slug: params.slug,
  });
}

export default function PageTemplate() {
  let {story, collections, collection} = useLoaderData<typeof loader>();
  story = useStoryblokState(story);
  return (
    <>
      <StoryblokComponent
        blok={story?.content}
        collections={collections}
        collection={collection}
      />
    </>
  );
}

const COLLECTIONS_QUERY = `#graphql
  query Collections(
    $country: CountryCode
    $language: LanguageCode
    $first: Int
    $last: Int
    $startCursor: String
    $endCursor: String
  ) @inContext(country: $country, language: $language) {
    collections(first: $first, last: $last, before: $startCursor, after: $endCursor) {
      nodes {
        id
        title
        description
        handle
        seo {
          description
          title
        }
        image {
          id
          url
          width
          height
          altText
        }
      }
      pageInfo {
        hasPreviousPage
        hasNextPage
        startCursor
        endCursor
      }
    }
  }
`;

const COLLECTION_QUERY = `#graphql
  query CollectionDetails(
    $handle: String!
    $country: CountryCode
    $language: LanguageCode
    $filters: [ProductFilter!]
    $sortKey: ProductCollectionSortKeys!
    $reverse: Boolean
    $first: Int
    $last: Int
    $startCursor: String
    $endCursor: String
  ) @inContext(country: $country, language: $language) {
    collection(handle: $handle) {
      id
      handle
      title
      description
      seo {
        description
        title
      }
      image {
        id
        url
        width
        height
        altText
      }
      products(
        first: $first,
        last: $last,
        before: $startCursor,
        after: $endCursor,
        filters: $filters,
        sortKey: $sortKey,
        reverse: $reverse
      ) {
        filters {
          id
          label
          type
          values {
            id
            label
            count
            input
          }
        }
        nodes {
          ...ProductCard
        }
        pageInfo {
          hasPreviousPage
          hasNextPage
          endCursor
          startCursor
        }
      }
    }
    collections(first: 100) {
      edges {
        node {
          title
          handle
        }
      }
    }
  }
  ${PRODUCT_CARD_FRAGMENT}
` as const;
