import React, { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import PostItem from "../../components/PostItem";
import { useQuery } from "@tanstack/react-query";
import useAxiosPublic from "./../../hooks/useAxiosPublic";

const Home = () => {
  const axiosPublic = useAxiosPublic();
  const { data: getPost = [] } = useQuery({
    queryKey: ["getPost"],
    queryFn: async () => {
      const { data } = await axiosPublic.get(`http://localhost:5000/posts`);
      return data;
    },
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [filteredPosts, setFilteredPosts] = useState(getPost);

  useEffect(() => {
    setFilteredPosts(
      getPost.filter((post) =>
        post.title.toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
  }, [searchQuery, getPost]);

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  return (
    <div>
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
                type="text"
                placeholder="Search Something..."
                className="w-full outline-none bg-white pl-4"
                value={searchQuery}
                onChange={handleSearchChange}
              />
              <button
                type="button"
                className="bg-cyan-900 hover:bg-cyan-800 transition-all text-white rounded-full px-3 py-3"
              >
                search
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
      <div className="flex gap-10 px-20">
        <div>
          <Sidebar />
        </div>
        <div className="px-20 w-full">
          <div className="border-t mb-5">
            {filteredPosts.length === 0 ? (
              <div className="flex justify-center">
                <img
                  className=""
                  src="https://i.ibb.co/z87QRK7/empty.gif"
                  alt="No results found"
                />
              </div>
            ) : (
              filteredPosts.map((post) => (
                <PostItem key={post._id} getPost={post} />
              ))
            )}
          </div>
          <div className="flex justify-center pb-5">
            <a
              href="#"
              className="flex items-center justify-center px-4 py-2 mx-1 text-gray-500 capitalize bg-[#F3F4F6] rounded-md cursor-not-allowed rtl:-scale-x-100 dark:bg-gray-800 dark:text-gray-600"
            >
              prev
            </a>

            <a
              href="#"
              className="hidden px-4 py-2 mx-1 text-gray-700 transition-colors duration-300 transform bg-[#F3F4F6] rounded-md sm:inline dark:bg-gray-800 dark:text-gray-200 hover:bg-[#155E75] dark:hover:bg-blue-500 hover:text-white dark:hover:text-gray-200"
            >
              1
            </a>

            <a
              href="#"
              className="hidden px-4 py-2 mx-1 text-gray-700 transition-colors duration-300 transform bg-[#F3F4F6] rounded-md sm:inline dark:bg-gray-800 dark:text-gray-200 hover:bg-[#155E75] dark:hover:bg-blue-500 hover:text-white dark:hover:text-gray-200"
            >
              2
            </a>

            <a
              href="#"
              className="hidden px-4 py-2 mx-1 text-gray-700 transition-colors duration-300 transform bg-[#F3F4F6] rounded-md sm:inline dark:bg-gray-800 dark:text-gray-200 hover:bg-[#155E75] dark:hover:bg-blue-500 hover:text-white dark:hover:text-gray-200"
            >
              ...
            </a>

            <a
              href="#"
              className="hidden px-4 py-2 mx-1 text-gray-700 transition-colors duration-300 transform bg-[#F3F4F6] rounded-md sm:inline dark:bg-gray-800 dark:text-gray-200 hover:bg-[#155E75] dark:hover:bg-blue-500 hover:text-white dark:hover:text-gray-200"
            >
              9
            </a>

            <a
              href="#"
              className="hidden px-4 py-2 mx-1 text-gray-700 transition-colors duration-300 transform bg-[#F3F4F6] rounded-md sm:inline dark:bg-gray-800 dark:text-gray-200 hover:bg-[#155E75] dark:hover:bg-blue-500 hover:text-white dark:hover:text-gray-200"
            >
              10
            </a>

            <a
              href="#"
              className="flex items-center justify-center px-4 py-2 mx-1 text-gray-700 transition-colors duration-300 transform bg-[#F3F4F6] rounded-md rtl:-scale-x-100 dark:bg-gray-800 dark:text-gray-200 hover:bg-[#155E75] dark:hover:bg-blue-500 hover:text-white dark:hover:text-gray-200"
            >
              next
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
