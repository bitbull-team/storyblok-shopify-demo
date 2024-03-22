import {StoryblokComponent, storyblokEditable} from '@storyblok/react';
import {PageStoryblok} from '../../component-types-sb';

export function Page({blok, ...props}: PageStoryblok) {
  console.log('DENTRO PAGE: ', {blok, ...props});
  return (
    <main className={'page'} {...storyblokEditable(blok)}>
      {blok.body.map((nestedBlok) => (
        <StoryblokComponent blok={nestedBlok} key={nestedBlok._uid} {...props} />
      ))}
    </main>
  );
}
