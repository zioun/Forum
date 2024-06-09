import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../providers/AuthProvider";
import { useQuery } from "@tanstack/react-query";
import useAxiosPublic from "../hooks/useAxiosPublic";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";

const MyPosts = () => {
  const { user } = useContext(AuthContext);
  const [votes, setVotes] = useState({});
  const axiosPublic = useAxiosPublic();

  const { data: posts = [], refetch } = useQuery({
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

  const { data: comments = [] } = useQuery({
    queryKey: ["comments"],
    queryFn: async () => {
      const { data } = await axiosPublic.get(`http://localhost:5000/comments`);
      return data;
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

  const handleDelete = (post) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        axiosPublic
          .delete(`/posts/${post._id}`)
          .then((res) => {
            if (res.data.deletedCount > 0) {
              Swal.fire({
                title: "Deleted!",
                text: "Your post has been deleted.",
                icon: "success",
              });
              // Delete associated comments
              axiosPublic
                .delete(`/comments/byPost/${post._id}`)
                .then((res) => {
                  if (res.data.deletedCount > 0) {
                    Swal.fire({
                      title: "Deleted!",
                      text: "Associated comments have been deleted.",
                      icon: "success",
                    });
                  }
                  refetch(); // Refetch posts and comments
                })
                .catch((error) => {
                  console.error("Error deleting comments:", error);
                  Swal.fire({
                    title: "Error!",
                    text: "There was an error deleting the associated comments.",
                    icon: "error",
                  });
                });
            }
          })
          .catch((error) => {
            console.error("Error deleting post:", error);
            Swal.fire({
              title: "Error!",
              text: "There was an error deleting the post.",
              icon: "error",
            });
          });
      }
    });
  };

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
                      {votes[post._id]?.upVotes || 0}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-800">
                    <span className="badge bg-red-100 text-red-600">
                      {votes[post._id]?.downVotes || 0}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-800">
                    <Link to={`/dashboard/all-comments/${post._id}`}>
                      <span className="badge bg-[#155E75] text-white">
                        <button>Comment</button>
                      </span>
                    </Link>
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-800">
                    <span className="badge bg-[#751515] text-white">
                      <button onClick={() => handleDelete(post)}>Delete</button>
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
