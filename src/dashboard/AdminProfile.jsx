import React, { useContext } from "react";
import PostTag from "./PostTag";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { AuthContext } from "../providers/AuthProvider";
import { useQuery } from "@tanstack/react-query";
import useAxiosPublic from "./../hooks/useAxiosPublic";
import { Helmet } from "react-helmet";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28"];

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
  index,
}) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor={x > cx ? "start" : "end"}
      dominantBaseline="central"
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

const AdminProfile = () => {
  const { user } = useContext(AuthContext);
  const axiosPublic = useAxiosPublic();

  const { data: getPosts } = useQuery({
    queryKey: ["getPosts"],
    queryFn: async () => {
      const { data } = await axiosPublic.get(`/posts`);
      return data;
    },
  });
  const { data: getComments } = useQuery({
    queryKey: ["getComments"],
    queryFn: async () => {
      const { data } = await axiosPublic.get(`/comments`);
      return data;
    },
  });
  const { data: getUsers } = useQuery({
    queryKey: ["getUsers"],
    queryFn: async () => {
      const { data } = await axiosPublic.get(`/users`);
      return data;
    },
  });

  const postCount = getPosts?.length || 0;
  const commentCount = getComments?.length || 0;
  const userCount = getUsers?.length || 0;

  const data = [
    { name: "Posts", value: postCount },
    { name: "Comments", value: commentCount },
    { name: "Users", value: userCount },
  ];

  return (
    <div>
      <Helmet><title>Barta - Dashboard - Admin Profile</title></Helmet>
      <div className="flex w-[250px] md:w-[500px] lg:w-[600px] xl:w-[800px] justify-center items-center mt-5 border shadow-md rounded-2xl">
        <div className=" bg-white rounded-lg dark:bg-gray-800 ">
          <div className="flex justify-center mt-5">
            <img
              className="object-cover max-w-28 h-28 rounded-full"
              src={user?.photoURL}
              alt="avatar"
            />
          </div>
          <div className="mt-3 mb-5 text-center">
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
      </div>
      <div className="flex flex-wrap gap-5">
        <div className="w-[300px] px-8 py-5 bg-white rounded-lg shadow-md dark:bg-gray-800 mt-5 border">
          <div className="flex items-center justify-between">
            <img src="https://i.ibb.co/gzNJj0w/icons8-post-64.png" alt="" />
          </div>
          <div>
            <h1 className="text-2xl font-bold mt-4">{postCount}</h1>
            <p>Total Post</p>
          </div>
        </div>
        <div className="w-[300px] px-8 py-5 bg-white rounded-lg shadow-md dark:bg-gray-800 mt-5 border">
          <div className="flex items-center justify-between">
            <img src="https://i.ibb.co/HHCCBTQ/icons8-comments-64.png" alt="" />
          </div>
          <div>
            <h1 className="text-2xl font-bold mt-4">{commentCount}</h1>
            <p>Total Comments</p>
          </div>
        </div>
        <div className="w-[300px] px-8 py-5 bg-white rounded-lg shadow-md dark:bg-gray-800 mt-5 border">
          <div className="flex items-center justify-between">
            <img
              className="w-16"
              src="https://i.ibb.co/bFGw2Ww/icons8-users-96.png"
              alt=""
            />
          </div>
          <div>
            <h1 className="text-2xl font-bold mt-4">{userCount}</h1>
            <p>Total Users</p>
          </div>
        </div>
      </div>
      <div className="flex gap-5 mt-10 flex-wrap">
        <PostTag />
        <div className=" rounded-lg border flex flex-col md:flex-row justify-center items-center shadow-md">
          <div className="w-[200px] h-[240px]">
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={renderCustomizedLabel}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {data.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-col justify-start gap-3 p-10">
            <div className="flex items-center gap-2">
              <div className="h-5 w-5 bg-[#0088FE]"></div>
              <h1>Posts</h1>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-5 w-5 bg-[#00C49F]"></div>
              <h1>Comments</h1>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-5 w-5 bg-[#FFBB28]"></div>
              <h1>Users</h1>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;
