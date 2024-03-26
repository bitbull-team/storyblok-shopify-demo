import {StoryblokComponent, storyblokEditable} from '@storyblok/react';
import {PageStoryblok} from '../../component-types-sb';

export function Page({blok, ...props}: PageStoryblok) {
  return (
    <main className={'page'} {...storyblokEditable(blok)}>
      <StoryblokComponent blok={blok.header} {...props} />
      {blok.body.map((nestedBlok) => (
        <StoryblokComponent blok={nestedBlok} key={nestedBlok._uid} {...props} />
      ))}
    </main>
  );
}
