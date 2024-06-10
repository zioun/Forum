import React, { useContext, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { AuthContext } from "../providers/AuthProvider";
import axios from "axios";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";
import useAxiosPublic from "../hooks/useAxiosPublic";
import { useQuery } from "@tanstack/react-query";
import { Helmet } from "react-helmet";

const AddPost = () => {
  const { user } = useContext(AuthContext);
  const axiosPublic = useAxiosPublic();
  const [userPosts, setUserPosts] = useState([]);

  const { data: userData = [] } = useQuery({
    queryKey: ["payments"],
    queryFn: async () => {
      const { data } = await axiosPublic.get(`/payments`);
      return data;
    },
  });

  const hasPaid = userData.some((item) => item.email === user?.email);

  // get tags
  const { data: tags = [] } = useQuery({
    queryKey: ["tags"],
    queryFn: async () => {
      const { data } = await axiosPublic.get(`/tags`);
      return data;
    },
  });

  useQuery({
    queryKey: ["posts"],
    queryFn: async () => {
      const { data } = await axiosPublic.get(`/posts`);
      const filteredData = data.filter(
        (item) => item.author.email === user?.email
      );
      setUserPosts(filteredData);
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
      return toast.error("Input can't be empty");
    }

    if (!hasPaid && userPosts.length >= 5) {
      return Swal.fire({
        title: "Limit Reached",
        text: "You have reached the limit of posts you can add. Please become a member to add more posts.",
        icon: "warning",
      });
    }

    const award = hasPaid ? "gold" : "bronze";

    const postData = {
      title,
      category,
      description,
      date: new Date(),
      award,
      upVote: 0,
      downVote: 0,
      author: {
        email: user?.email,
        name: user?.displayName,
        photo: user?.photoURL,
      },
    };

    try {
      const { data } = await axiosPublic.post(
        `/posts`,
        postData
      );
      console.log(data);
      Swal.fire({
        title: "Success!",
        text: "Volunteer post added successfully!",
        icon: "success",
      });
      form.reset();
      setUserPosts((prevPosts) => [...prevPosts, postData]);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div>
      <Helmet>
        <title>Barta - Dashboard - Add Post</title>
      </Helmet>
      <Toaster />
      <section className="max-w-4xl p-6 mx-auto bg-white rounded-md shadow-md dark:bg-gray-800 mt-5 border">
        <h2 className="text-lg font-semibold text-gray-700 capitalize dark:text-white">
          Add Post
        </h2>

        <form onSubmit={handlePost}>
      {hasPaid || userPosts.length < 5 ? (
        <>
          <div className="grid grid-cols-1 gap-6 mt-4 sm:grid-cols-2">
            <div>
              <label className="text-gray-700 dark:text-gray-200" htmlFor="postTitle">
                Post Title
              </label>
              <input
                id="postTitle"
                name="title"
                type="text"
                placeholder="Type Post Title"
                className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 dark:focus:border-blue-300 focus:outline-none focus:ring h-[47px]"
              />
            </div>

            <div>
              <label className="text-gray-700 dark:text-gray-200" htmlFor="postCategory">
                Post Category
              </label>
              <select
                name="category"
                className="select block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 dark:focus:border-blue-300 focus:outline-none focus:ring"
              >
                <option value="" disabled selected>
                  Select Category
                </option>
                {tags.map((tag) => (
                  <option key={tag.tag} value={tag.tag}>
                    {tag.tag}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-4">
            <label className="text-gray-700 dark:text-gray-200" htmlFor="postContent">
              Description
            </label>
            <textarea
              name="description"
              id="postContent"
              placeholder="Type Description"
              className="block w-full px-4 py-3 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 dark:focus:border-blue-300 focus:outline-none focus:ring h-32"
            />
          </div>
        </>
      ) : (
        <div className="mt-4">
          <p className="text-gray-700 dark:text-gray-200">
            You have reached the limit of posts you can add. Become a member to add more posts.
          </p>
        </div>
      )}

      <div className="flex justify-end mt-6">
        {hasPaid || userPosts.length < 5 ? (
          <button className="px-8 py-2.5 leading-5 text-white transition-colors duration-300 transform bg-gray-700 rounded-md hover:bg-gray-600 focus:outline-none focus:bg-gray-600">
            Post
          </button>
        ) : (
          <Link to="/membership">
            <span
              className="tooltip px-8 py-2.5 leading-5 text-white transition-colors duration-300 transform bg-gray-700 rounded-md hover:bg-gray-600 focus:outline-none focus:bg-gray-600"
              data-tip="You have reached the limit of posts you can add."
            >
              Become a Member
            </span>
          </Link>
        )}
      </div>
    </form>
      </section>
    </div>
  );
};

export default AddPost;
