import {flattenConnection} from '@shopify/hydrogen';
import {ProductFilter} from '@shopify/hydrogen/storefront-api-types';
import {FILTER_URL_PREFIX, SortParam} from '~/components/SortFIlter';
import {parseAsCurrency} from '~/lib/utils';
import {getSortValuesFromParam} from '~/utils/getSortValuesFromParam';
import {COLLECTION_QUERY} from '~/utils/queries';

export const handleCollection = async (context, request, story) => {
  const shouldFetchProducts = (story) =>
    story.content.body.some((item) => {
      return (
        item.component === 'Collection' && item.shopify_connect?.items.length
      );
    });

  if (!shouldFetchProducts(story)) {
    return {collections: null, collection: null};
  }
  const locale = context.storefront.i18n;
  const searchParams = new URL(request.url).searchParams;

  const {sortKey, reverse} = getSortValuesFromParam(
    searchParams.get('sort') as SortParam,
  );
  const filters = [...searchParams.entries()].reduce(
    (filters, [key, value]) => {
      if (key.startsWith(FILTER_URL_PREFIX)) {
        const filterKey = key.substring(FILTER_URL_PREFIX.length);
        filters.push({
          [filterKey]: JSON.parse(value),
        });
      }
      return filters;
    },
    [] as ProductFilter[],
  );

  console.log('FETCH COLLECTION PRODUCTS');
  const storyblokComponent = story.content.body.filter(
    (item) => item.component === 'Collection',
  )[0];
  const handle = storyblokComponent.shopify_connect.items[0].handle;
  const {collections, collection} = await context.storefront.query(
    COLLECTION_QUERY,
    {
      variables: {
        handle,
        filters,
        sortKey,
        reverse,
        country: context.storefront.i18n.country,
        language: context.storefront.i18n.language,
        first: 40,
      },
    },
  );

  if (!collection) {
    throw new Response('collection', {status: 404});
  }

  const allFilterValues = collection.products.filters.flatMap(
    (filter) => filter.values,
  );

  const appliedFilters = filters
    .map((filter) => {
      const foundValue = allFilterValues.find((value) => {
        const valueInput = JSON.parse(value.input as string) as ProductFilter;
        // special case for price, the user can enter something freeform (still a number, though)
        // that may not make sense for the locale/currency.
        // Basically just check if the price filter is applied at all.
        if (valueInput.price && filter.price) {
          return true;
        }
        return (
          // This comparison should be okay as long as we're not manipulating the input we
          // get from the API before using it as a URL param.
          JSON.stringify(valueInput) === JSON.stringify(filter)
        );
      });
      if (!foundValue) {
        // eslint-disable-next-line no-console
        console.error('Could not find filter value for filter', filter);
        return null;
      }

      if (foundValue.id === 'filter.v.price') {
        // Special case for price, we want to show the min and max values as the label.
        const input = JSON.parse(foundValue.input as string) as ProductFilter;
        const min = parseAsCurrency(
          input.price?.min ?? 0,
          locale,
        );
        const max = input.price?.max
          ? parseAsCurrency(input.price.max, locale)
          : '';
        const label = min && max ? `${min} - ${max}` : 'Price';

        return {
          filter,
          label,
        };
      }
      return {
        filter,
        label: foundValue.label,
      };
    })
    .filter((filter): filter is NonNullable<typeof filter> => filter !== null);

  return {
    collection,
    collections: flattenConnection(collections),
    appliedFilters,
  };
};

export default handleCollection;
