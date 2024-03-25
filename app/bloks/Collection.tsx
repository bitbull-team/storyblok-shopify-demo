import {PageStoryblok} from '../../component-types-sb';
import {Link} from '~/components/Link';
import {Image} from '@shopify/hydrogen';
import {SortFilter} from '~/components/SortFIlter';

export function Collection({blok, ...props}: PageStoryblok) {
    console.log(props.collection.products.nodes[0].variants.nodes[0].price.amount);
  return (
    <div style={{width: 'calc(100% - 40px)', margin: '0 auto'}}>
        <h2>{props.collection.title}</h2>
        <h3>{props.collection.description}</h3>
        <div style={{display: 'flex'}}>
            <div style={{width: '200px'}}>
                <SortFilter
                    filters={props.collection.products.filters}
                    collections={props.collections}
                />
            </div>
            <div
                style={{
                    flex: 1,
                    display: 'grid',
                    gridTemplateColumns: 'repeat(4, 1fr)',
                    gridColumnGap: '20px',
                    gridRowGap: '20px',
                }}
            >
                {props.collection.products.nodes.map((item) => (
                    <div key={item.id}>
                        <div style={{background: '#fafafa', padding: '20px'}}>
                            <Image
                                style={{maxWidth: '100%', height: 'auto', display: 'block', mixBlendMode: 'multiply'}}
                                data={item.variants.nodes[0].image}
                                alt={item.title}
                            />
                        </div>
                        <h3>{item.title}</h3>
                        <h3>{item.variants.nodes[0].price.amount}</h3>
                    </div>
                ))}
            </div>
        </div>
    </div>
  );
}
