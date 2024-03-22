
import { StoryblokComponent, storyblokEditable } from "@storyblok/react";
import {PageStoryblok} from '~/storyblok-components';

const Collection = ( { blok }: { blok: PageStoryblok } ) => {
  return (
    <div {...storyblokEditable( blok )} key={blok._uid} className="w-full">
      <StoryblokComponent blok={blok} key={blok._uid} />
    </div>
  );
};

export default Collection;
