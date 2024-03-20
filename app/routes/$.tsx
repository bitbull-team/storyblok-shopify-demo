import { useLoaderData } from "@remix-run/react";
import type { LoaderFunctionArgs } from "@remix-run/server-runtime";
import { ISbStoryData, StoryblokClient, StoryblokComponent, useStoryblokState, type ISbStoriesParams, type StoryblokBridgeConfigV2 } from "@storyblok/react";
import { getShopifyProductsFromStory, getShopifyProductsFullInfos, type TShopifyFullProductInfo, type TShopifyProductInfo } from "~/lib/shopyblok.js";
import { getStory, type TStoryblokStory } from "~/lib/storyblok.js";

const storyblokStoryResolveOpts = {
	resolve_relations: "ProductPage2.product",
	resolve_links: "story",
	resolve_assets: 1,
} as const satisfies ISbStoriesParams;

const storyblokBridgeResolveOpts = {
	resolveRelations: storyblokStoryResolveOpts.resolve_relations,
	resolveLinks: storyblokStoryResolveOpts.resolve_links,
} as const satisfies StoryblokBridgeConfigV2;

export default function StoryblokGenericPageRoute() {

	const data = useLoaderData<typeof loader>();
	const story = useStoryblokState( data.story ? data.story as ISbStoryData : null, {
		language: 'en',
		...storyblokBridgeResolveOpts,
	} );
	// console.info( 'StoryblokGenericPageRoute => ', data.url );

	return (
		<>
			{story ?
				<>
					<StoryblokComponent blok={story!.content} />
					<hr />
					<p>JSON:
						{<pre dangerouslySetInnerHTML={{
							__html: JSON.stringify( story, null, 2 ),
						}} />}
					</p>
				</>
				: <p>Story not found</p>
			}
		</>
	)
}

/**
 * Remix loader that manages all Storyblok routes. <br/>
 * Given an HTTP request to an URL, it tries to fetch a Storyblok story that matches, and return it to the user.
 */
export const loader = async ( { request, context, params /*, preview = false*/ }: LoaderFunctionArgs ) => {

	console.info( 'Loading storyblok page', params["*"] );

	const rawSlug = params["*"] ?? "home";

	const sbParams: ISbStoriesParams = {
		version: "draft",
		language: 'en',
		...storyblokStoryResolveOpts
	};

	const sbStory = await fetchStory( context.storyblok, rawSlug, sbParams );

	const story = sbStory.data.story;
	return {
		...storyblokStoryToShopifyProducts( story ),
		url: request.url,
		story,
	};

}

async function fetchStory( storyblok: StoryblokClient, slug: string, params: ISbStoriesParams ) {
	const regionalStory = await getStory( storyblok, slug, params );
	if ( regionalStory ) return regionalStory;

	throw new StoryNotFoundError( slug );
}

function storyblokStoryToShopifyProducts( story: TStoryblokStory | null ): { products: TShopifyProductInfo[], fullProductsPromise: Promise<TShopifyFullProductInfo[]> } {
	const empty = { products: [], fullProductsPromise: Promise.resolve( [] ) };
	if ( !story )
		return empty;
	const products = getShopifyProductsFromStory( story );
	if ( !products || !products.length )
		return empty;
	return {
		products,
		fullProductsPromise: getShopifyProductsFullInfos( products )
	};
}

class StoryNotFoundError extends Error {

	constructor( public readonly slug: string ) {
		super( `Story not found: "${slug}"` );
	}

}
