import {useLoaderData} from '@remix-run/react';
import {StoryblokComponent, useStoryblokState} from '@storyblok/react';
import loaderHandler from '~/utils/loaderHandle';

export async function loader(props) {
  return loaderHandler(props);
}

export default function PageTemplate() {
  let {story} = useLoaderData<typeof loader>();
  story = useStoryblokState(story);
  return (
    <>
      <StoryblokComponent blok={story?.content} />
    </>
  );
}
