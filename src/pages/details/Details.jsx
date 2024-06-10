import React, { useContext, useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import useAxiosPublic from "../../hooks/useAxiosPublic";
import { AuthContext } from "../../providers/AuthProvider";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import toast from "react-hot-toast";
import {
  FacebookShareButton,
  TelegramShareButton,
  TwitterShareButton,
  WhatsappShareButton,
} from "react-share";
import axios from "axios";
import { Helmet } from "react-helmet";

const Details = () => {
  const { user } = useContext(AuthContext);
  const [comment, setComment] = useState("");

  const [upVotes, setUpVotes] = useState(0);
  const [downVotes, setDownVotes] = useState(0);

  const [activeUp, setActiveUp] = useState(false);
  const [activeDown, setActiveDown] = useState(false);

  const axiosPublic = useAxiosPublic();
  const { id } = useParams(); // Assuming `id` is the postId
  const queryClient = useQueryClient();

  const fetchVotes = async () => {
    try {
      const { data } = await axiosPublic.get(`/votes/${id}`);
      setUpVotes(data.totalUpVotes);
      setDownVotes(data.totalDownVotes);

      // Check if the current user has already voted
      const userVote = data.votes.find((vote) => vote.email === user?.email);
      if (userVote) {
        setActiveUp(userVote.upVote === 1);
        setActiveDown(userVote.downVote === 1);
      }
    } catch (error) {
      console.error("Error fetching votes:", error);
    }
  };

  useEffect(() => {
    fetchVotes();
  }, [axiosPublic, id, user?.email]);

  const handleComment = async (e) => {
    e.preventDefault();
    const form = e.target;
    const commentText = form.comment.value;
    if (commentText === "") {
      return toast.error("Input Can't be empty");
    }
    const postData = {
      comment: commentText,
      postId: id,
      date: new Date(),
      commenter: {
        email: user?.email,
        name: user?.displayName,
        photo: user?.photoURL,
      },
    };
    try {
      await axiosPublic.post(`/comments`, postData);
      toast.success("Thanks for your comment");
      setComment("");
      form.reset();
      queryClient.invalidateQueries({ queryKey: ["comments", id] });
    } catch (err) {
      console.log(err);
    }
  };

  const {
    data: comments,
    isLoading: commentsLoading,
    error: commentsError,
  } = useQuery({
    queryKey: ["comments", id],
    queryFn: async () => {
      const { data } = await axiosPublic.get(`/comments/`);
      return data.sort((a, b) => new Date(b.date) - new Date(a.date));
    },
  });

  const {
    data: post,
    isLoading: postLoading,
    error: postError,
  } = useQuery({
    queryKey: ["post", id],
    queryFn: async () => {
      const { data } = await axiosPublic.get(`/posts/${id}`);
      return data;
    },
  });

  const handleVote = async (e, upVote) => {
    e.preventDefault();
    const postData = {
      postId: id,
      email: user?.email,
      upVote: upVote ? 1 : 0,
      downVote: upVote ? 0 : 1,
    };
    try {
      const { data } = await axiosPublic.patch(`/votes`, postData);
      if (data.success) {
        console.log("Vote sent successfully");
        fetchVotes(); // Fetch the updated votes immediately after voting
      } else {
        console.log("Vote already sent");
      }
    } catch (err) {
      console.log(err);
    }
  };

  const email = user?.email;
  const { data: userData, refetch } = useQuery({
    queryKey: ["user", email],
    queryFn: async () => {
      if (!email) return null;
      const { data } = await axiosPublic.get(`/users/${email}`);
      return data;
    },
    enabled: !!email,
  });
  useEffect(() => {
    if (email) {
      refetch();
    }
  }, [email, refetch]);
  console.log("User data:", userData?.restriction);
  // if (!userData) {
  //   return <div>Loading...</div>;
  // }

  if (postLoading || commentsLoading) {
    return <div>Loading...</div>;
  }

  if (postError) {
    return <div>Error: {postError.message}</div>;
  }

  if (commentsError) {
    return <div>Error: {commentsError.message}</div>;
  }

  const filteredComments = comments.filter((comment) => comment.postId === id);
  const timeAgo = post
    ? formatDistanceToNow(new Date(post.date), { addSuffix: true })
    : "Unknown date";
  const shareUrl = `https://forum-b54c7.web.app/details/${id}`;
  const shareTitle = post?.title || "Check this out!";

  return (
    <div>
      <Helmet>
        <title>Barta - Details</title>
      </Helmet>
      <div className="flex gap-10 px-3 mt-10">
        <div className="container m-auto">
          <div className="mb-5">
            <div className="w-full">
              <div className="bg-[#F8F9FF] p-5 md:p-10 rounded-2xl">
                <div className="flex gap-3 items-center">
                  <div className="">
                    <img
                      className="rounded-full object-cover w-10 h-10"
                      src={post.author.photo}
                      alt={post.author.name}
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="text-[#333D42] font-semibold">
                      {post.author.name}
                    </div>
                    <div className="bg-[#5C6C74] h-[5px] w-[5px] rounded-full mt-2"></div>
                    <div className="text-[#5C6C74]">{timeAgo}</div>
                  </div>
                </div>
                <div>
                  <div className="mt-3">
                    <span className="text-[#155E75] font-bold rounded-full">
                      {post.category}
                    </span>
                  </div>
                  <div>
                    <h1 className="text-xl pb-3 text-[#181C1F] font-semibold">
                      {post.title}
                    </h1>
                  </div>
                  <div>
                    <p className="text-[#333D42] text-[14px]">
                      {post.description}
                    </p>
                  </div>
                </div>
                <div className="mt-7 flex gap-3">
                  {user ? (
                    <div className="flex gap-1 bg-[#E7EDFF] p-1 px-3 rounded-full">
                      <button
                        onClick={(e) => handleVote(e, true)}
                        className={`hover:text-[#D93900] ${
                          activeUp ? "text-red-500" : ""
                        }`}
                      >
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
                      </button>
                      <h4>{upVotes}</h4>
                      <button
                        onClick={(e) => handleVote(e, false)}
                        className={`hover:text-[#6A5CFF] ${
                          activeDown ? "text-blue-500" : ""
                        }`}
                      >
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
                      </button>
                      {/* <h4>{downVotes}</h4> */}
                    </div>
                  ) : (
                    <Link to="/login">
                      <div className="flex gap-1 bg-[#E7EDFF] p-1 px-3 rounded-full">
                        <button
                          className={`hover:text-[#D93900] ${
                            activeUp ? "text-red-500" : ""
                          }`}
                        >
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
                        </button>
                        <h4>{upVotes}</h4>
                        <button
                          className={`hover:text-[#6A5CFF] ${
                            activeDown ? "text-blue-500" : ""
                          }`}
                        >
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
                        </button>
                        {/* <h4>{downVotes}</h4> */}
                      </div>
                    </Link>
                  )}
                  <div className="flex gap-3 bg-[#E7EDFF] p-1 px-3 rounded-full cursor-pointer">
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
                        d="M2.25 12.76c0 1.6 1.123 2.994 2.707 3.227 1.068.157 2.148.279 3.238.364.466.037.893.281 1.153.671L12 21l2.652-3.978c.26-.39.687-.634 1.153-.67 1.09-.086 2.17-.208 3.238-.365 1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z"
                      />
                    </svg>
                    <h1>{filteredComments.length}</h1>
                  </div>
                  {user ? (
                    <div className="dropdown">
                      <div
                        tabIndex={0}
                        role="button"
                        className="flex gap-3 bg-[#E7EDFF] p-1 px-3 rounded-full cursor-pointer justify-center items-center"
                      >
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
                            d="M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186 9.566-5.314m-9.566 7.5 9.566 5.314m0 0a2.25 2.25 0 1 0 3.935 2.186 2.25 2.25 0 0 0-3.935-2.186Zm0-12.814a2.25 2.25 0 1 0 3.933-2.185 2.25 2.25 0 0 0-3.933 2.185Z"
                          />
                        </svg>
                      </div>
                      <div
                        tabIndex={0}
                        className="dropdown-content z-[1] card card-compact shadow bg-[#E5EBEE] text-primary-content mt-3"
                      >
                        <div className="card-body">
                          <div className="flex justify-between flex-col gap-5 border">
                            <FacebookShareButton
                              url={shareUrl}
                              quote={shareTitle}
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                x="0px"
                                y="0px"
                                width="30"
                                height="30"
                                viewBox="0 0 48 48"
                              >
                                <path
                                  fill="#039be5"
                                  d="M24 5A19 19 0 1 0 24 43A19 19 0 1 0 24 5Z"
                                ></path>
                                <path
                                  fill="#fff"
                                  d="M26.572,29.036h4.917l0.772-4.995h-5.69v-2.73c0-2.075,0.678-3.915,2.619-3.915h3.119v-4.359c-0.548-0.074-1.707-0.236-3.897-0.236c-4.573,0-7.254,2.415-7.254,7.917v3.323h-4.701v4.995h4.701v13.729C22.089,42.905,23.032,43,24,43c0.875,0,1.729-0.08,2.572-0.194V29.036z"
                                ></path>
                              </svg>
                            </FacebookShareButton>
                            <TwitterShareButton
                              url={shareUrl}
                              title={shareTitle}
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                x="0px"
                                y="0px"
                                width="30"
                                height="30"
                                viewBox="0 0 48 48"
                              >
                                <path
                                  fill="#03A9F4"
                                  d="M42,12.429c-1.323,0.586-2.746,0.977-4.247,1.162c1.526-0.906,2.7-2.351,3.251-4.058c-1.428,0.837-3.01,1.452-4.693,1.776C34.967,9.884,33.05,9,30.926,9c-4.08,0-7.387,3.278-7.387,7.32c0,0.572,0.067,1.129,0.193,1.67c-6.138-0.308-11.582-3.226-15.224-7.654c-0.64,1.082-1,2.349-1,3.686c0,2.541,1.301,4.778,3.285,6.096c-1.211-0.037-2.351-0.374-3.349-0.914c0,0.022,0,0.055,0,0.086c0,3.551,2.547,6.508,5.923,7.181c-0.617,0.169-1.269,0.263-1.941,0.263c-0.477,0-0.942-0.054-1.392-0.135c0.94,2.902,3.667,5.023,6.898,5.086c-2.528,1.96-5.712,3.134-9.174,3.134c-0.598,0-1.183-0.034-1.761-0.104C9.268,36.786,13.152,38,17.321,38c13.585,0,21.017-11.156,21.017-20.834c0-0.317-0.01-0.633-0.025-0.945C39.763,15.197,41.013,13.905,42,12.429"
                                ></path>
                              </svg>
                            </TwitterShareButton>
                            <TelegramShareButton
                              url={shareUrl}
                              title={shareTitle}
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                x="0px"
                                y="0px"
                                width="30"
                                height="30"
                                viewBox="0 0 48 48"
                              >
                                <path
                                  fill="#29b6f6"
                                  d="M24 4A20 20 0 1 0 24 44A20 20 0 1 0 24 4Z"
                                ></path>
                                <path
                                  fill="#fff"
                                  d="M33.95,15l-3.746,19.126c0,0-0.161,0.874-1.245,0.874c-0.576,0-0.873-0.274-0.873-0.274l-8.114-6.733 l-3.97-2.001l-5.095-1.355c0,0-0.907-0.262-0.907-1.012c0-0.625,0.933-0.923,0.933-0.923l21.316-8.468 c-0.001-0.001,0.651-0.235,1.126-0.234C33.667,14,34,14.125,34,14.5C34,14.75,33.95,15,33.95,15z"
                                ></path>
                                <path
                                  fill="#b0bec5"
                                  d="M23,30.505l-3.426,3.374c0,0-0.149,0.115-0.348,0.12c-0.069,0.002-0.143-0.009-0.219-0.043 l0.964-5.965L23,30.505z"
                                ></path>
                                <path
                                  fill="#cfd8dc"
                                  d="M29.897,18.196c-0.169-0.22-0.481-0.26-0.701-0.093L16,26c0,0,2.106,5.892,2.427,6.912 c0.322,1.021,0.58,1.045,0.58,1.045l0.964-5.965l9.832-9.096C30.023,18.729,30.064,18.416,29.897,18.196z"
                                ></path>
                              </svg>
                            </TelegramShareButton>
                            <WhatsappShareButton
                              url={shareUrl}
                              title={shareTitle}
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                x="0px"
                                y="0px"
                                width="30"
                                height="30"
                                viewBox="0 0 48 48"
                              >
                                <path
                                  fill="#fff"
                                  d="M4.868,43.303l2.694-9.835C5.9,30.59,5.026,27.324,5.027,23.979C5.032,13.514,13.548,5,24.014,5c5.079,0.002,9.845,1.979,13.43,5.566c3.584,3.588,5.558,8.356,5.556,13.428c-0.004,10.465-8.522,18.98-18.986,18.98c-0.001,0,0,0,0,0h-0.008c-3.177-0.001-6.3-0.798-9.073-2.311L4.868,43.303z"
                                ></path>
                                <path
                                  fill="#fff"
                                  d="M4.868,43.803c-0.132,0-0.26-0.052-0.355-0.148c-0.125-0.127-0.174-0.312-0.127-0.483l2.639-9.636c-1.636-2.906-2.499-6.206-2.497-9.556C4.532,13.238,13.273,4.5,24.014,4.5c5.21,0.002,10.105,2.031,13.784,5.713c3.679,3.683,5.704,8.577,5.702,13.781c-0.004,10.741-8.746,19.48-19.486,19.48c-3.189-0.001-6.344-0.788-9.144-2.277l-9.875,2.589C4.953,43.798,4.911,43.803,4.868,43.803z"
                                ></path>
                                <path
                                  fill="#cfd8dc"
                                  d="M24.014,5c5.079,0.002,9.845,1.979,13.43,5.566c3.584,3.588,5.558,8.356,5.556,13.428c-0.004,10.465-8.522,18.98-18.986,18.98h-0.008c-3.177-0.001-6.3-0.798-9.073-2.311L4.868,43.303l2.694-9.835C5.9,30.59,5.026,27.324,5.027,23.979C5.032,13.514,13.548,5,24.014,5 M24.014,42.974C24.014,42.974,24.014,42.974,24.014,42.974C24.014,42.974,24.014,42.974,24.014,42.974 M24.014,42.974C24.014,42.974,24.014,42.974,24.014,42.974C24.014,42.974,24.014,42.974,24.014,42.974 M24.014,4C24.014,4,24.014,4,24.014,4C12.998,4,4.032,12.962,4.027,23.979c-0.001,3.367,0.849,6.685,2.461,9.622l-2.585,9.439c-0.094,0.345,0.002,0.713,0.254,0.967c0.19,0.192,0.447,0.297,0.711,0.297c0.085,0,0.17-0.011,0.254-0.033l9.687-2.54c2.828,1.468,5.998,2.243,9.197,2.244c11.024,0,19.99-8.963,19.995-19.98c0.002-5.339-2.075-10.359-5.848-14.135C34.378,6.083,29.357,4.002,24.014,4L24.014,4z"
                                ></path>
                                <path
                                  fill="#40c351"
                                  d="M35.176,12.832c-2.98-2.982-6.941-4.625-11.157-4.626c-8.704,0-15.783,7.076-15.787,15.774c-0.001,2.981,0.833,5.883,2.413,8.396l0.376,0.597l-1.595,5.821l5.973-1.566l0.577,0.342c2.422,1.438,5.2,2.198,8.032,2.199h0.006c8.698,0,15.777-7.077,15.78-15.776C39.795,19.778,38.156,15.814,35.176,12.832z"
                                ></path>
                                <path
                                  fill="#fff"
                                  fill-rule="evenodd"
                                  d="M19.268,16.045c-0.355-0.79-0.729-0.806-1.068-0.82c-0.277-0.012-0.593-0.011-0.909-0.011c-0.316,0-0.83,0.119-1.265,0.594c-0.435,0.475-1.661,1.622-1.661,3.956c0,2.334,1.7,4.59,1.937,4.906c0.237,0.316,3.282,5.259,8.104,7.161c4.007,1.58,4.823,1.266,5.693,1.187c0.87-0.079,2.807-1.147,3.202-2.255c0.395-1.108,0.395-2.057,0.277-2.255c-0.119-0.198-0.435-0.316-0.909-0.554s-2.807-1.385-3.242-1.543c-0.435-0.158-0.751-0.237-1.068,0.238c-0.316,0.474-1.225,1.543-1.502,1.859c-0.277,0.317-0.554,0.357-1.028,0.119c-0.474-0.238-2.002-0.738-3.815-2.354c-1.41-1.257-2.362-2.81-2.639-3.285c-0.277-0.474-0.03-0.731,0.208-0.968c0.213-0.213,0.474-0.554,0.712-0.831c0.237-0.277,0.316-0.475,0.474-0.791c0.158-0.317,0.079-0.594-0.04-0.831C20.612,19.329,19.69,16.983,19.268,16.045z"
                                  clip-rule="evenodd"
                                ></path>
                              </svg>
                            </WhatsappShareButton>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <Link to={"/login"}>
                      <div className="dropdown">
                        <div
                          tabIndex={0}
                          role="button"
                          className="flex gap-3 bg-[#E7EDFF] p-1 px-3 rounded-full cursor-pointer justify-center items-center"
                        >
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
                              d="M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186 9.566-5.314m-9.566 7.5 9.566 5.314m0 0a2.25 2.25 0 1 0 3.935 2.186 2.25 2.25 0 0 0-3.935-2.186Zm0-12.814a2.25 2.25 0 1 0 3.933-2.185 2.25 2.25 0 0 0-3.933 2.185Z"
                            />
                          </svg>
                        </div>
                      </div>
                    </Link>
                  )}
                </div>
                <div>
                  {userData?.restriction == "yes" ? (
                    <div>
                      <textarea
                        className="border bg-[#ffffff]  rounded-2xl min-h-[100px] outline-none p-3 mt-5 w-full"
                        name="comment"
                        placeholder="Type your comment"
                      ></textarea>
                      <div className="flex justify-end">
                        <button
                          onClick={() =>
                            document.getElementById("my_modal_3").showModal()
                          }
                          className={
                            "px-5 py-2 text-white rounded-full bg-gray-500"
                          }
                        >
                          Comment
                        </button>
                        <dialog id="my_modal_3" className="modal text-center">
                          <div className="modal-box">
                            <form method="dialog">
                              <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
                                ✕
                              </button>
                            </form>
                            <div className="flex justify-center">
                              <img
                                src={
                                  "https://i.ibb.co/SsKJ9HL/icons8-close.gif"
                                }
                                alt=""
                              />
                            </div>
                            <h3 className="font-bold text-lg">
                              Your account is restricted right now
                            </h3>
                            <div className="">
                              <textarea
                                className="w-full h-[205px] mt-2"
                                readOnly
                                value="Interactively target low-risk high-yield customer service with just in time users. Holisticly strategize reliable resources after unique potentialities. Conveniently embrace multidisciplinary methods of empowerment and highly efficient expertise. Dramatically recaptiualize turnkey processes whereas standardized experiences. Dramatically."
                              />
                              <h1 className="font-bold">
                                Support :{" "}
                                <span className="text-green-900">
                                  jionkhan0@gmail.com
                                </span>
                              </h1>
                            </div>
                          </div>
                        </dialog>
                      </div>
                    </div>
                  ) : (
                    <form onSubmit={handleComment}>
                      <textarea
                        className="border bg-[#ffffff] rounded-2xl min-h-[100px] outline-none p-3 mt-5 w-full"
                        name="comment"
                        placeholder="Type your comment"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                      ></textarea>
                      <div className="flex justify-end">
                        {user ? (
                          <button
                            className={`px-5 py-2 text-white rounded-full ${
                              comment.trim() === ""
                                ? "bg-gray-500"
                                : "bg-[#155E75]"
                            }`}
                            disabled={comment.trim() === ""}
                          >
                            Comment
                          </button>
                        ) : (
                          <Link className="mt-3" to={"/login"}>
                            <span
                              className={`px-5 py-2 text-white rounded-full ${
                                comment.trim() === ""
                                  ? "bg-gray-500"
                                  : "bg-[#155E75]"
                              }`}
                              disabled={comment.trim() === ""}
                            >
                              Comment
                            </span>
                          </Link>
                        )}
                      </div>
                    </form>
                  )}
                </div>
              </div>
              <div className="mt-10">
                {filteredComments.map((comment) => {
                  const commentAgo = comment
                    ? formatDistanceToNow(new Date(comment.date), {
                        addSuffix: true,
                      })
                    : "Unknown date";
                  return (
                    <div className="py-3 border-b" key={comment._id}>
                      <div className="flex gap-3 items-center">
                        <div className="w-8">
                          <img
                            className="rounded-full"
                            src={comment.commenter.photo}
                            alt={comment.commenter.name}
                          />
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="text-[#333D42] text-[14px] font-semibold">
                            {comment.commenter.name}
                          </div>
                          <div className="bg-[#5C6C74] h-[5px] w-[5px] rounded-full mt-2"></div>
                          <div className="text-[#5C6C74] text-[14px]">
                            {commentAgo}
                          </div>
                        </div>
                      </div>
                      <div>
                        <p className="text-[#333D42] text-[13px] ml-[45px]">
                          {comment.comment}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

   
export default Details;
