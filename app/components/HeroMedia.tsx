import { storyblokEditable } from "@storyblok/react";

// @ts-ignore
const HeroMedia = ({blok}) => {
  return (
    <div {...storyblokEditable(blok)}>
      <h2>{blok.rich_text}</h2>
    </div>
  );
};

export default HeroMedia;
