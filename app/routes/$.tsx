import {json, type LoaderArgs} from '@shopify/remix-oxygen';
import {useLoaderData} from '@remix-run/react';
import {StoryblokComponent, useStoryblokState} from '@storyblok/react';

const isCollectionsPage = (story) => story.content.body.some(item => item.component === 'Collections');
const PAGINATION_SIZE = 4;

export async function loader({context, params}: LoaderArgs) {
  const slug = params['*'] ?? 'home';
  // todo check params.handle

  const cms = await context.storyblok.get(`cdn/stories/${slug}`, {
    version: 'draft',
  });

  const pageTypes = ['SIMPLE', 'COLLECTIONS', 'COLLECTION', 'PRODUCT'];

  const story = cms?.data?.story || null;
  let collections = [];

  if (isCollectionsPage(story)) {
    collections = await context.storefront.query(COLLECTIONS_QUERY, {
      variables: {
        country: context.storefront.i18n.country,
        language: context.storefront.i18n.language,
        first: 10,
      },
    });
  }

  return json({
    story,
    ...(isCollectionsPage(story) && collections),
    slug: params.slug,
  });
}

export default function PageTemplate() {
  let {story, collections} = useLoaderData<typeof loader>();
  story = useStoryblokState(story);
  return (
    <>
      <StoryblokComponent
        blok={story?.content}
        collectionslist={collections?.nodes}
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
