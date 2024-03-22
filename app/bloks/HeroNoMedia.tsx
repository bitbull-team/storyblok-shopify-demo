import {renderRichText} from '@storyblok/react';

const HeroNoMedia = ({
  blok = {},
  ...props
}: {
  blok: any;
} & React.HTMLAttributes<HTMLHeadingElement>) => {
  const renderedRichText = renderRichText(blok.rich_text);

  return (
    <div className="h-150 bg-black p-12">
      <div className="text-3xl text-white font-bold" {...props} dangerouslySetInnerHTML={{__html: renderedRichText}}></div>
    </div>

  )
};

export default HeroNoMedia;
