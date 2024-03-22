
import { storyblokEditable } from "@storyblok/react";

const Collections = ({ blok }) => {
  return (
    <div {...storyblokEditable(blok)} key={blok._uid} className="w-full p-12 bg-[#f7f6fd] rounded-[5px] text-center">
      <div className="text-2xl text-[#1d243d] font-bold"> {blok.name} </div>
    </div>
  );
};

export default Collections;
