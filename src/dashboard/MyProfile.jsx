import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../providers/AuthProvider";
import { formatDistanceToNow } from "date-fns";
import { useQuery } from '@tanstack/react-query';
import useAxiosPublic from "../hooks/useAxiosPublic";

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
      const { data } = await axiosPublic.get(`http://localhost:5000/posts`);
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
        [postId]: { upVotes: data.totalUpVotes, downVotes: data.totalDownVotes }
      }));
    } catch (error) {
      console.error("Error fetching votes:", error);
    }
  };

  useEffect(() => {
    posts.forEach(post => {
      fetchVotes(post._id);
    });
  }, [posts]);

  return (
    <div className="mt-5">
      <div className="max-w-[1000px] px-8 py-4 bg-white rounded-lg shadow-md dark:bg-gray-800 border relative">
        <div className="w-full max-w-40 bg-white rounded-lg dark:bg-gray-800">
          <img
            className="object-cover w-32 h-32 rounded-full"
            src={user?.photoURL}
            alt="avatar"
          />
          {!hasPaid ? (<img
            className="drop-shadow-2xl shadow-white object-cover w-[30px] h-[50px] absolute top-[100px] left-32"
            src="https://i.ibb.co/MDks0zR/gold-silver-bronze-medal-badge-and-trophy-with-red-ribbon-flat-illustration-vector-2-removebg-previe.png"
            alt="medal"
          />):(<img
            className="drop-shadow-2xl shadow-white object-cover w-[30px] h-[50px] absolute top-[100px] left-32"
            src="https://i.ibb.co/ZmvjVWS/gold-silver-bronze-medal-badge-and-trophy-with-red-ribbon-flat-illustration-vector-3-removebg-previe.png"
            alt="medal"
          />)}
          
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
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-100 whitespace-nowrap">
              <tr>
                <th className="px-4 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Title
                </th>
                <th className="px-4 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-4 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-4 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-4 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Up Vote
                </th>
                <th className="px-4 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Down Vote
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
                    <span className="badge bg-slate-100">{post.category}</span>
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-800">
                    <textarea className="border p-2" name="" id="" readOnly>
                      {post.description}
                    </textarea>
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-800">
                    {formatDistanceToNow(new Date(post.date), {
                      addSuffix: true,
                    })}
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
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default MyProfile;
