import {renderRichText} from '@storyblok/react';
import {Image} from '@shopify/hydrogen';

const HeroMedia = ({
  blok = {},
  ...props
}: {
  blok: any;
} & React.HTMLAttributes<HTMLHeadingElement>) => {
  const renderedRichText = renderRichText(blok.rich_text);
  return (
      <div
          style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              background: '#000',
              height: '150px',
              padding: '30px',
              color: 'white',
          }}
      >
          <div
              style={{
                  fontSize: '20px',
                  fontWeight: 'normal',
                  textTransform: 'uppercase',
              }}
              {...props}
              dangerouslySetInnerHTML={{__html: renderedRichText}}
          ></div>
          <img style={{height: '100%'}} src={`${blok.media.filename}`} />
      </div>
  );
};

export default HeroMedia;
