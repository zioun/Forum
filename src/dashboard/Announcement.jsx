import React, { useContext, useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { AuthContext } from "../providers/AuthProvider";
import axios from "axios";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";
import useAxiosPublic from "../hooks/useAxiosPublic";
import { useQuery } from "@tanstack/react-query";

const Announcement = () => {
  const { user } = useContext(AuthContext);

  const axiosPublic = useAxiosPublic();
  const { data: posts = [] } = useQuery({
    queryKey: ["posts"],
    queryFn: async () => {
      const { data } = await axiosPublic.get(`http://localhost:5000/posts`);
      const filteredData = data.filter(
        (item) => item.author.email === user.email
      );
      return filteredData;
    },
  });

  const handlePost = async (e) => {
    e.preventDefault();
    const form = e.target;
    const title = form.title.value;
    const category = form.category.value;
    const description = form.description.value;
    if (title === "" || category === "" || description === "") {
      return toast.error("Input Can't be empty");
    }
    const postData = {
      title,
      category,
      description,
      date: new Date(),
      award: "bronze",
      upVote: 0,
      downVote: 0,
      author: {
        email: user?.email,
        name: user?.displayName,
        photo: user?.photoURL,
      },
    };
    try {
      const { data } = await axios.post(
        `http://localhost:5000/posts`,
        postData
      );
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
    <div>
      <Toaster />
      <section className="max-w-4xl p-6 mx-auto bg-white rounded-md shadow-md dark:bg-gray-800 mt-5 border">
        <h2 className="text-lg font-semibold text-gray-700 capitalize dark:text-white">
          Announcement
        </h2>

        <form onSubmit={handlePost}>
          <div className="w-[455px]">
            <div className="w-full mt-5">
              <label
                className="text-gray-700 dark:text-gray-200"
                htmlFor="postTitle"
              >
                Title
              </label>
              <input
                id="postTitle"
                name="title"
                type="text"
                placeholder="Type Announcement Title"
                className="inline-block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 dark:focus:border-blue-300 focus:outline-none focus:ring h-[47px]"
              />
            </div>
          </div>

          <div className="mt-4">
            <label
              className="text-gray-700 dark:text-gray-200"
              htmlFor="postContent"
            >
              Description
            </label>
            <textarea
              name="description"
              id="postContent"
              placeholder="Type Description"
              className="block w-full px-4 py-3 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 dark:focus:border-blue-300 focus:outline-none focus:ring h-32"
            />
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

export default Announcement;
