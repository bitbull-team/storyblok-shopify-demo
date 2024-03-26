import {useLoaderData} from '@remix-run/react';
import {StoryblokComponent, useStoryblokState} from '@storyblok/react';
import handleLoader from '~/utils/handleLoader';

export async function loader(props) {
  return handleLoader(props);
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
