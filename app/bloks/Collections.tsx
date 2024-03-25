import {PageStoryblok} from '../../component-types-sb';
import {Link} from '~/components/Link';
import {Image} from '@shopify/hydrogen';

export function Collections({blok, ...props}: PageStoryblok) {
  return (
    <div>
      QUESTO È IL COMPONENTE COLLECTIONS MAPPATO SU STORYBLOK CHE SI OCCUPA DI RENDERIZZARE LE COLLECTIONS
      {props.collections.nodes.map((collection, index) => (
        <Link to={`demo/catalog/${collection.handle}`} className="grid gap-4" key={index}>
          <div className="card-image bg-primary/5 aspect-[3/2]">
              {collection?.image && (
                  <Image
                      data={collection.image}
                      sizes="(max-width: 32em) 100vw, 45vw"
                  />
              )}
          </div>
          <div>
              {collection.title}
          </div>
        </Link>
      ))}
    </div>
  );
}
