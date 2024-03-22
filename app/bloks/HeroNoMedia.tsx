import {renderRichText} from '@storyblok/react';

const HeroNoMedia = ({
  blok = {},
  ...props
}: {
  blok: any;
} & React.HTMLAttributes<HTMLHeadingElement>) => {
  const renderedRichText = renderRichText(blok.rich_text);

  return (
    <div style={{
      display: 'flex',
      background: '#000',
      height: '150px',
      padding: '30px',
        color: 'white',
    }}>
      <div style={{
          fontSize: '20px',
          fontWeight: 'normal',
          textTransform: 'uppercase'
      }} {...props} dangerouslySetInnerHTML={{__html: renderedRichText}}></div>
    </div>

  )
};

export default HeroNoMedia;
