import {PageStoryblok} from '../../component-types-sb';

export function Collections({blok, ...props}: PageStoryblok) {
  console.log('DENTRO COLLECTIONS: ', {blok, ...props});
  return (
    <div>
      QUESTO È IL COMPONENTE COLLECTIONS MAPPATO SU STORYBLOK CHE SI OCCUPA DI RENDERIZZARE LE COLLECTIONS
      {props.collectionslist.map((collection, index) => (
        <div key={index}>{collection.title}</div>
      ))}
    </div>
  );
}
