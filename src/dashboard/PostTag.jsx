import React, { useContext, useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { AuthContext } from "../providers/AuthProvider";
import axios from "axios";
import Swal from "sweetalert2";
import useAxiosPublic from "../hooks/useAxiosPublic";

const PostTag = () => {
  const { user } = useContext(AuthContext);
  const axiosPublic = useAxiosPublic();

  const handlePost = async (e) => {
    e.preventDefault();
    const form = e.target;
    const tag = form.tag.value;
    if (tag === "") {
      return toast.error("Input Can't be empty");
    }
    const postData = {
      tag,
    };
    try {
      const { data } = await axiosPublic.post(`/tags`, postData);
      console.log(data);
      Swal.fire({
        title: "Success!",
        text: "Volunteer post added Successfully!",
        icon: "success",
      });
      form.reset();
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <div className="w-[300px]">
      <Toaster />
      <section className="max-w-4xl p-6 mx-auto bg-white rounded-md shadow-md dark:bg-gray-800 border">
        <h2 className="text-lg font-semibold text-gray-700  dark:text-white">
          Tag insert form
        </h2>

        <form onSubmit={handlePost}>
          <div className="w-[455px]">
            <div className="w-full mt-5 flex flex-col">
              <label className="text-gray-700 dark:text-gray-200" htmlFor="tag">
                Enter Tag
              </label>
              <input
                id="postTag"
                name="tag"
                type="text"
                placeholder="Type tag"
                className="inline-block w-[200px] px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 dark:focus:border-blue-300 focus:outline-none focus:ring h-[47px]"
              />
            </div>
          </div>

          <div className="flex justify-end mt-6">
            <button className="px-8 py-2.5 leading-5 text-white transition-colors duration-300 transform bg-gray-700 rounded-md hover:bg-gray-600 focus:outline-none focus:bg-gray-600">
              Send
            </button>
          </div>
        </form>
      </section>
    </div>
  );
};

export default PostTag;
