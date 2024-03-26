import {LoaderArgs, json} from '@shopify/remix-oxygen';
import handleCollection from '~/utils/handleCollection';

export const handleLoader = async ({context, params}: LoaderArgs) => {
  const slug = params['*'] ?? 'home';
  // todo check params.handle

  const cms = await context.storyblok.get(`cdn/stories/${slug}`, {
    version: 'draft',
  });

  const story = cms?.data?.story || null;
  const {collection} = await handleCollection(context, story);

  return json({
    story,
    collection,
    slug: params.slug,
  });
};

export default handleLoader;
