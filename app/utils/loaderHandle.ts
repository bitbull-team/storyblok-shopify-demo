import {LoaderArgs, json} from '@shopify/remix-oxygen';
import {COLLECTION_QUERY} from '~/utils/queries';

const shouldFetchProducts = (story) =>
  story.content.body.some((item) => {
    return (
      item.component === 'Collection' && item.shopify_connect?.items.length
    );
  });

export const loaderHandler = async ({context, params}: LoaderArgs) => {
  const slug = params['*'] ?? 'home';
  // todo check params.handle

  const cms = await context.storyblok.get(`cdn/stories/${slug}`, {
    version: 'draft',
  });

  const story = cms?.data?.story || null;
  const collections = null;
  let collection = null;

  if (shouldFetchProducts(story)) {
    console.log('FETCH COLLECTION PRODUCTS');
    const storyblokComponent = story.content.body.filter(
      (item) => item.component === 'Collection',
    )[0];
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
    ...(shouldFetchProducts(story) && collection),
    slug: params.slug,
  });
};

export default loaderHandler;
