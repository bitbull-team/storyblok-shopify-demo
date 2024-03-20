import type { ISbStoryData } from "@storyblok/react";
import { traverseStoryTree } from "~/lib/storyblok.js";

type TShopifyProductId = `gid://shopify/Product/${number}`;
export type TShopifyProductInfo = {
	id: TShopifyProductId;
	url: string;
}
export type TShopifyFullProductInfo = TShopifyProductInfo & {
	price: number;
	stock: number;
}

// TODO: Move to shopify.ts
export async function getShopifyProductsFullInfos( products: Array<TShopifyProductInfo> /*, shopifyInstance, country*/ ): Promise<Array<TShopifyFullProductInfo>> {
	return timeout( 1250 ).then( _ => {
		return products.map( p => ( { ...p, price: 0, stock: 0 } ) )
	} );
}

export function getShopifyProductsFromStory( story: ISbStoryData/* shopifyInstance, country*/ ): Array<TShopifyProductInfo> {
	const shopifyProductUrls = retrieveShopifyProductsFromStory( story );
	const shopifyProducts = shopifyProductUrls
		.map( url => url.match( /^https:\/\/admin.shopify.com\/store\/\w+\/products\/(\d+)$/ ) ?? [] )
		.map( ( [url, id] ) => ( url ? { url, id: `gid://shopify/Product/${Number( id )}` } as const : null ) )
		.filter( Boolean )
		;

	return shopifyProducts;
}

function retrieveShopifyProductsFromStory( story: ISbStoryData ): Array<string> {
	return traverseStoryTree( story, ( node ): node is Record<"shopify_product", { url: string }> => typeof node === "object" && "shopify_product" in node )
		.map( mpv => mpv.shopify_product.url.trim() )
		.filter( Boolean )
		.reduce( unique, [] )
		;
}

function unique( previousValue: Array<string>, currentValue: string ): Array<string> {
	return ( previousValue.indexOf( currentValue ) > -1 ) ? previousValue : [...previousValue, currentValue];
}

function timeout( ms: number ): Promise<void> {
	return new Promise( ( resolve ) => {
		setTimeout( () => resolve(), ms );
	} );
}
