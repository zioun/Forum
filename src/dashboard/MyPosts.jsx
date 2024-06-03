import React, { useContext } from "react";
import { AuthContext } from "../providers/AuthProvider";
import { useQuery } from "@tanstack/react-query";
import useAxiosPublic from "../hooks/useAxiosPublic";
import { Link } from "react-router-dom";

const MyPosts = () => {
  const { user } = useContext(AuthContext);
  const axiosPublic = useAxiosPublic();
  const { data: posts = [] } = useQuery({
    queryKey: ["posts"],
    queryFn: async () => {
      const { data } = await axiosPublic.get(`http://localhost:5000/posts`);
      const filteredData = data.filter(
        (item) => item.author.email === user.email
      );
      const sortedData = filteredData.sort(
        (a, b) => new Date(b.date) - new Date(a.date)
      );
      return sortedData;
    },
  });

  return (
    <div className="mt-5">
      <div className="max-w-[1000px] px-8 py-4 bg-white rounded-lg shadow-md dark:bg-gray-800 border relative">
        <div className="font-sans overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-100 whitespace-nowrap">
              <tr>
                <th className="px-4 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Title
                </th>
                <th className="px-4 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Up Vote
                </th>
                <th className="px-4 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Down Vote
                </th>
                <th className="px-4 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Comment
                </th>
                <th className="px-4 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Delete
                </th>
              </tr>
            </thead>

            <tbody className="bg-white divide-y divide-gray-200 whitespace-nowrap">
              {posts.map((post) => (
                <tr key={post._id}>
                  <td className="px-4 py-4 text-sm text-gray-800">
                    <textarea className="border p-2" name="" id="" readOnly>
                      {post.title}
                    </textarea>
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-800">
                    <span className="badge bg-blue-100 text-blue-600">
                      {post.upVote}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-800">
                    <span className="badge bg-red-100 text-red-600">
                      {post.downVote}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-800">
                    <Link to={`/dashboard/all-comments/${post._id}`}><span className="badge bg-[#155E75] text-white">
                      <button>Comment</button>
                    </span></Link>
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-800">
                    <span className="badge bg-[#751515] text-white">
                      <button>Delete</button>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default MyPosts;
