import type { ISbStoriesParams, ISbStory, ISbStoryData, StoryblokClient, StoryblokComponentType } from "@storyblok/react";
// import { asError } from "~/utils/index.js";

export type TStoryblokComponent = StoryblokComponentType<string> & { [index: string]: unknown };
export type TStoryblokStory = ISbStoryData<TStoryblokComponent>;

export function getStory( storyblok: StoryblokClient, slug: string, params: ISbStoriesParams ): Promise<ISbStory | null> {
	const path = `${slug}`;
	return storyblok.getStory( path, params ).catch( e => {
		if ( is404( e ) ) {
			return null;
		} else {
			throw new Error(e);
		}
	} );
}

export function traverseStoryTree<T extends TStoryblokComponent>( story: ISbStoryData, filter: ( node: TStoryblokComponent ) => node is T ): T[] {
	return traverseComponentTree( story.content, filter );
}

function traverseComponentTree<T extends TStoryblokComponent>( node: TStoryblokComponent, filter: ( node: TStoryblokComponent ) => node is T ): T[] {
	// console.info( 'Exploring node: ', node._uid, node.component );
	const ret: TStoryblokComponent[] = [];
	return [filter( node ) ? node : null, ...Object.keys( node )
		.filter( key => key !== '_uid' && key !== '_editable' && key !== 'component' )
		.flatMap( key => {
			const value = node[key];
			if ( !isArrayOrDictionary( value ) ) {
				// console.info( '-> Discarding ' + key );
				return null;
			}
			if ( Array.isArray( value ) ) {
				// console.info( '-> isArray: ' + key );
				return value.flatMap( child => traverseComponentTree( child as TStoryblokComponent, filter ) );
			} else {
				// console.info( '-> isDictionary: ' + key );
				return traverseComponentTree( value, filter );
			}
		} )]
		.filter( Boolean );
}

function isArrayOrDictionary( value: unknown ): value is Record<string | number, unknown> {
	return ( value !== null && value !== undefined && typeof value === "object" );
}

function is404( value: unknown ): boolean {
	return !!value && typeof value === "object" && "status" in value && value.status === 404;
}
