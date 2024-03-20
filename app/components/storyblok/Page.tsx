
import { StoryblokComponent, storyblokEditable } from "@storyblok/react";
import {PageStoryblok} from '~/storyblok-components';

const Page = ( { blok }: { blok: PageStoryblok } ) => {
	return (
		<div {...storyblokEditable( blok )} key={blok._uid} className="w-full p-12">
			<h3 className="text-2xl text-[#1d243d] font-bold"> {blok.name} </h3>
			{blok.body
				? blok.body.map( ( bodyBlok ) => (
					<StoryblokComponent blok={bodyBlok} key={bodyBlok._uid} />
				) )
				: null
			}
		</div>
	);
};

export default Page;
