import React, { useContext, useEffect, useState } from "react";
import Banner from "../../components/Banner";
import Sidebar from "../../components/Sidebar";
import PostItem from "../../components/PostItem";
import axios from "axios";

const Home = () => {
  const [getPost, setPost] = useState([]);

  useEffect(() => {
    reqgetData();
  }, []);

  const reqgetData = async () => {
    const { data } = await axios(`http://localhost:5000/posts`);
    setPost(data);
  };
  console.log(getPost)
  return (
    <div>
      <Banner></Banner>
      <div className="flex gap-10 px-20">
        <div>
          <Sidebar></Sidebar>
        </div>
        <div className="px-20">
          <div className="border-t mb-5">
            {getPost.map(getPost => <PostItem key={getPost._id} getPost={getPost}></PostItem>)}
            
          </div>
          <div class="flex justify-center pb-5">
            <a
              href="#"
              class="flex items-center justify-center px-4 py-2 mx-1 text-gray-500 capitalize bg-[#F3F4F6] rounded-md cursor-not-allowed rtl:-scale-x-100 dark:bg-gray-800 dark:text-gray-600"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="w-5 h-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fill-rule="evenodd"
                  d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                  clip-rule="evenodd"
                />
              </svg>
            </a>

            <a
              href="#"
              class="hidden px-4 py-2 mx-1 text-gray-700 transition-colors duration-300 transform bg-[#F3F4F6] rounded-md sm:inline dark:bg-gray-800 dark:text-gray-200 hover:bg-[#155E75] dark:hover:bg-blue-500 hover:text-white dark:hover:text-gray-200"
            >
              1
            </a>

            <a
              href="#"
              class="hidden px-4 py-2 mx-1 text-gray-700 transition-colors duration-300 transform bg-[#F3F4F6] rounded-md sm:inline dark:bg-gray-800 dark:text-gray-200 hover:bg-[#155E75] dark:hover:bg-blue-500 hover:text-white dark:hover:text-gray-200"
            >
              2
            </a>

            <a
              href="#"
              class="hidden px-4 py-2 mx-1 text-gray-700 transition-colors duration-300 transform bg-[#F3F4F6] rounded-md sm:inline dark:bg-gray-800 dark:text-gray-200 hover:bg-[#155E75] dark:hover:bg-blue-500 hover:text-white dark:hover:text-gray-200"
            >
              ...
            </a>

            <a
              href="#"
              class="hidden px-4 py-2 mx-1 text-gray-700 transition-colors duration-300 transform bg-[#F3F4F6] rounded-md sm:inline dark:bg-gray-800 dark:text-gray-200 hover:bg-[#155E75] dark:hover:bg-blue-500 hover:text-white dark:hover:text-gray-200"
            >
              9
            </a>

            <a
              href="#"
              class="hidden px-4 py-2 mx-1 text-gray-700 transition-colors duration-300 transform bg-[#F3F4F6] rounded-md sm:inline dark:bg-gray-800 dark:text-gray-200 hover:bg-[#155E75] dark:hover:bg-blue-500 hover:text-white dark:hover:text-gray-200"
            >
              10
            </a>

            <a
              href="#"
              class="flex items-center justify-center px-4 py-2 mx-1 text-gray-700 transition-colors duration-300 transform bg-[#F3F4F6] rounded-md rtl:-scale-x-100 dark:bg-gray-800 dark:text-gray-200 hover:bg-[#155E75] dark:hover:bg-blue-500 hover:text-white dark:hover:text-gray-200"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="w-5 h-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fill-rule="evenodd"
                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                  clip-rule="evenodd"
                />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
