import {LoaderArgs, json} from '@shopify/remix-oxygen';
import handleCollection from '~/utils/handleCollection';

export const handleLoader = async ({context, params, request}: LoaderArgs) => {
  const slug = params['*'] ?? 'home';
  // todo check params.handle

  const cms = await context.storyblok.get(`cdn/stories/${slug}`, {
    version: 'draft',
  });

  const story = cms?.data?.story || null;
  const {collections, collection, appliedFilters} = await handleCollection(
    context,
    request,
    story,
  );

  return json({
    story,
    collections,
    collection,
    appliedFilters,
    slug: params.slug,
  });
};

export default handleLoader;
