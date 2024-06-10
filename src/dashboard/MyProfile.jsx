import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../providers/AuthProvider";
import { formatDistanceToNow } from "date-fns";
import { useQuery } from "@tanstack/react-query";
import useAxiosPublic from "../hooks/useAxiosPublic";
import { Helmet } from "react-helmet";

const MyProfile = () => {
  const { user } = useContext(AuthContext);
  const [votes, setVotes] = useState({});
  const axiosPublic = useAxiosPublic();

  const { data: userData = [] } = useQuery({
    queryKey: ["payments"],
    queryFn: async () => {
      const { data } = await axiosPublic.get(`/payments`);
      return data;
    },
  });
  const hasPaid = userData.some((item) => item.email === user?.email);

  const { data: posts = [] } = useQuery({
    queryKey: ["posts"],
    queryFn: async () => {
      const { data } = await axiosPublic.get(`/posts`);
      const filteredData = data.filter(
        (item) => item.author.email === user.email
      );
      const sortedData = filteredData.sort(
        (a, b) => new Date(b.date) - new Date(a.date)
      );
      const topPosts = sortedData.slice(0, 3);
      return topPosts;
    },
  });

  const fetchVotes = async (postId) => {
    try {
      const { data } = await axiosPublic.get(`/votes/${postId}`);
      setVotes((prevVotes) => ({
        ...prevVotes,
        [postId]: {
          upVotes: data.totalUpVotes,
          downVotes: data.totalDownVotes,
        },
      }));
    } catch (error) {
      console.error("Error fetching votes:", error);
    }
  };

  useEffect(() => {
    posts.forEach((post) => {
      fetchVotes(post._id);
    });
  }, [posts]);

  return (
    <div className="mt-5">
      <Helmet><title>Barta - Dashboard - My Profile</title></Helmet>
      <div className="px-2 lg:px-8 py-4 w-[300px] md:w-[600px] lg:w-[700px] xl:w-[800px]   rounded-lg shadow-md dark:bg-gray-800 border relative">
        <div className="w-full max-w-40 bg-white rounded-lg dark:bg-gray-800">
          <img
            className="object-cover lg:w-32 lg:h-32 rounded-full"
            src={user?.photoURL}
            alt="avatar"
          />
          {!hasPaid ? (
            <img
              className="drop-shadow-2xl shadow-white object-cover w-[30px] h-[50px] absolute top-[70px] md:top-[100px] left-[80px] md:left-32"
              src="https://i.ibb.co/MDks0zR/gold-silver-bronze-medal-badge-and-trophy-with-red-ribbon-flat-illustration-vector-2-removebg-previe.png"
              alt="medal"
            />
          ) : (
            <img
              className="drop-shadow-2xl shadow-white object-cover w-[30px] h-[50px] absolute top-[100px] left-32"
              src="https://i.ibb.co/ZmvjVWS/gold-silver-bronze-medal-badge-and-trophy-with-red-ribbon-flat-illustration-vector-3-removebg-previe.png"
              alt="medal"
            />
          )}

          <div className="py-5 text-center">
            <a
              href="#"
              className="block text-xl font-bold text-gray-800 dark:text-white"
              tabIndex="0"
              role="link"
            >
              {user?.displayName}
            </a>
            <span className="text-sm text-gray-700 dark:text-gray-200">
              {user?.email}
            </span>
          </div>
        </div>

        <div className="font-sans overflow-x-auto">
          <div className="max-w-full md:max-w-[800px]  overflow-y-auto p-2 divide-y divide-gray-200">
            <table className="min-w-[900px] table-auto overflow-x-auto">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-2 md:px-4 py-2 md:py-4 text-left text-xs md:text-sm font-semibold text-gray-500 uppercase tracking-wider">
                    Title
                  </th>
                  <th className="px-2 md:px-4 py-2 md:py-4 text-left text-xs md:text-sm font-semibold text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-2 md:px-4 py-2 md:py-4 text-left text-xs md:text-sm font-semibold text-gray-500 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-2 md:px-4 py-2 md:py-4 text-left text-xs md:text-sm font-semibold text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-2 md:px-4 py-2 md:py-4 text-left text-xs md:text-sm font-semibold text-gray-500 uppercase tracking-wider">
                    Up Vote
                  </th>
                  <th className="px-2 md:px-4 py-2 md:py-4 text-left text-xs md:text-sm font-semibold text-gray-500 uppercase tracking-wider">
                    Down Vote
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {posts.map((post) => (
                  <tr key={post._id}>
                    <td className="px-2 md:px-4 py-2 md:py-4 text-xs md:text-sm text-gray-800">
                      <textarea
                        className="w-full border p-2 resize-none"
                        readOnly
                      >
                        {post.title}
                      </textarea>
                    </td>
                    <td className="px-2 md:px-4 py-2 md:py-4 text-xs md:text-sm text-gray-800">
                      <span className="badge bg-slate-100">
                        {post.category}
                      </span>
                    </td>
                    <td className="px-2 md:px-4 py-2 md:py-4 text-xs md:text-sm text-gray-800">
                      <textarea
                        className="w-full border p-2 resize-none"
                        readOnly
                      >
                        {post.description}
                      </textarea>
                    </td>
                    <td className="px-2 md:px-4 py-2 md:py-4 text-xs md:text-sm text-gray-800">
                      {formatDistanceToNow(new Date(post.date), {
                        addSuffix: true,
                      })}
                    </td>
                    <td className="px-2 md:px-4 py-2 md:py-4 text-xs md:text-sm text-gray-800">
                      <span className="badge bg-blue-100 text-blue-600">
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
                            d="M4.5 10.5 12 3m0 0 7.5 7.5M12 3v18"
                          />
                        </svg>
                        {votes[post._id]?.upVotes || 0}
                      </span>
                    </td>
                    <td className="px-2 md:px-4 py-2 md:py-4 text-xs md:text-sm text-gray-800">
                      <span className="badge bg-red-100 text-red-600">
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
                            d="M19.5 13.5 12 21m0 0-7.5-7.5M12 21V3"
                          />
                        </svg>
                        {votes[post._id]?.downVotes || 0}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyProfile;
