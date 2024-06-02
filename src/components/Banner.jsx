import React from "react";

const Banner = () => {
  return (
    <div className="relative bg-[#f8f9ff]">
      <div className="px-4 sm:px-10">
        <div className="pt-16 max-w-4xl mx-auto text-center relative z-10">
          <h1 className="md:text-6xl text-4xl font-extrabold mb-6 md:!leading-[75px]">
            Build Landing Pages with Typeform Integration
          </h1>
          <p className="text-base">
            Embark on a gastronomic journey with our curated dishes, delivered
            promptly to your doorstep. Elevate your dining experience today.
            Lorem ipsum dolor sit amet, consectetur adipiscing elit.
          </p>
          <div className="bg-white mt-10 flex px-1 py-1.5 rounded-full shadow-[0_2px_10px_-3px_rgba(6,81,237,0.3)] overflow-hidden">
            <input
              type="email"
              placeholder="Search Something..."
              className="w-full outline-none bg-white pl-4"
            />
            <button
              type="button"
              className="bg-cyan-900  hover:bg-cyan-800 transition-all text-white rounded-full px-3 py-3"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="size-6"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                />
              </svg>
            </button>
          </div>
        </div>
        <hr className="my-12 border-gray-300" />
      </div>
      <img
        src="https://readymadeui.com/bg-effect.svg"
        className="absolute inset-0 w-full h-full"
        alt="background-effect"
      />
    </div>
  );
};

export default Banner;
