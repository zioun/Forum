import React from "react";
import useAxiosPublic from "../hooks/useAxiosPublic";
import { useQuery } from "@tanstack/react-query";

const Sidebar = () => {
  const axiosPublic = useAxiosPublic();
  // get tags
  const { data: tags = [] } = useQuery({
    queryKey: ["tags"],
    queryFn: async () => {
      const { data } = await axiosPublic.get(`http://localhost:5000/tags`);
      return data;
    },
  });
  return (
    <aside
      className="flex flex-col w-64 sticky top-5 px-4 py-8 overflow-y-auto bg-white border-r rtl:border-r-0 rtl:border-l dark:bg-gray-900 dark:border-gray-700 rounded-xl"
      style={{ boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px" }}
    >
      <div className="flex flex-col justify-between flex-1 mt-2">
        <nav>
          <a
            className="flex items-center px-4 py-2 text-gray-700 bg-gray-100 rounded-md dark:bg-gray-800 dark:text-gray-200"
            href="#"
          >
            <img src="https://i.ibb.co/vYgj36c/popularity.png" alt="" />
            <span className="mx-4 font-medium">Popularity</span>
          </a>
          <hr className="my-3 border-gray-200 dark:border-gray-600" />
          {tags.map((tag) => (
            <a
              className="flex items-center px-4 py-2 mt-2 text-gray-600 transition-colors duration-300 transform rounded-md dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 dark:hover:text-gray-200 hover:text-gray-700"
              href="#"
            >
              <div className="w-[20px]">
                <img
                  className="object-cover"
                  src="https://i.ibb.co/N7dRVwD/label.png"
                  alt=""
                />
              </div>
              <span className="mx-1 font-medium ml-3">{tag.tag}</span>
            </a>
          ))}
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;
