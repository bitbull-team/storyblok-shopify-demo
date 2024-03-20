import {renderRichText} from '@storyblok/react';

const HeroMedia = ({
  blok = {},
  ...props
}: {
  blok: any;
} & React.HTMLAttributes<HTMLHeadingElement>) => {
  const obj: any = JSON.parse(blok);
  const renderedRichText = renderRichText(obj.editorial_content[0].rich_text);

  return <div {...props}>{renderedRichText}</div>;
};

export default HeroMedia;
