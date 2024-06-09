import React, { useContext, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
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
      const { data } = await axiosPublic.get(
        `http://localhost:5000/votes/${id}`
      );
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
      const { data } = await axiosPublic.get(
        `http://localhost:5000/posts/${id}`
      );
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
      const { data } = await axios.get(`http://localhost:5000/users/${email}`);
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
  if (!userData) {
    return <div>Loading...</div>;
  }

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
  const shareUrl = `${window.location.href}`;
  const shareTitle = post?.title || "Check this out!";

  return (
    <div>
      <div className="flex gap-10 px-3 mt-10">
        <div className="container m-auto">
          <div className="mb-5">
            <div className="w-full">
              <div className="bg-[#F8F9FF] p-5 md:p-10 rounded-2xl">
                <div className="flex gap-3 items-center">
                  <div className="w-10">
                    <img
                      className="rounded-full"
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
                  <div className="object-cover w-5">
                    {post.award == "gold" ? (
                      <img
                        className="w-full"
                        src="https://i.ibb.co/ZmvjVWS/gold-silver-bronze-medal-badge-and-trophy-with-red-ribbon-flat-illustration-vector-3-removebg-previe.png"
                        alt=""
                      />
                    ) : (
                      <img
                        className="w-full"
                        src="https://i.ibb.co/MDks0zR/gold-silver-bronze-medal-badge-and-trophy-with-red-ribbon-flat-illustration-vector-2-removebg-previe.png"
                        alt=""
                      />
                    )}
                  </div>
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
                            Facebook
                          </FacebookShareButton>
                          <TwitterShareButton url={shareUrl} title={shareTitle}>
                            Twitter
                          </TwitterShareButton>
                          <TelegramShareButton
                            url={shareUrl}
                            title={shareTitle}
                          >
                            Telegram
                          </TelegramShareButton>
                          <WhatsappShareButton
                            url={shareUrl}
                            title={shareTitle}
                          >
                            Whatsapp
                          </WhatsappShareButton>
                        </div>
                      </div>
                    </div>
                  </div>
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
