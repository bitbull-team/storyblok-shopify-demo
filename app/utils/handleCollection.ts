import {COLLECTION_QUERY} from '~/utils/queries';

export const handleCollection = async (context, story) => {
  let collection;

  const shouldFetchProducts = (story) =>
    story.content.body.some((item) => {
      return (
        item.component === 'Collection' && item.shopify_connect?.items.length
      );
    });

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
  return collection;
};

export default handleCollection;
