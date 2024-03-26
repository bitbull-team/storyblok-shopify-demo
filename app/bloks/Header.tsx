import {renderRichText} from '@storyblok/react';
import {Image} from '@shopify/hydrogen';

const Header = ({
  blok = {},
  ...props
}: {
  blok: any;
} & React.HTMLAttributes<HTMLHeadingElement>) => {
  return <div className={'pippo'}>HEADER</div>;
};

export default Header;
