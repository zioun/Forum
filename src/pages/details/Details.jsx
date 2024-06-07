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
      <div className="flex gap-10 px-80 mt-10">
        <div className="px-20">
          <div className="border-t mb-5">
            <div className="border-b px-10 w-full py-10">
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
                <div className="flex gap-1 bg-[#E5EBEE] p-1 px-3 rounded-full">
                  <button
                    onClick={(e) => handleVote(e, true)}
                    className={`hover:text-[#D93900] ${
                      activeUp ? "text-red-500" : ""
                    }`}
                  >
                    upVote
                  </button>
                  <h4>{upVotes}</h4>
                  <button
                    onClick={(e) => handleVote(e, false)}
                    className={`hover:text-[#6A5CFF] ${
                      activeDown ? "text-blue-500" : ""
                    }`}
                  >
                    downVote
                  </button>
                  <h4>{downVotes}</h4>
                </div>
                <div className="flex gap-3 bg-[#E5EBEE] p-1 px-3 rounded-full cursor-pointer">
                  <h1>{filteredComments.length}</h1>
                </div>
                <div className="object-cover w-5">
                  <img
                    className="w-full"
                    src="https://i.ibb.co/SxmByX6/gold-silver-bronze-medal-badge-and-trophy-with-red-ribbon-flat-illustration-vector-2.jpg"
                    alt="Medal"
                  />
                </div>
                <div className="dropdown">
                  <div
                    tabIndex={0}
                    role="button"
                    className="flex gap-3 bg-[#E5EBEE] p-1 px-3 rounded-full cursor-pointer justify-center items-center"
                  >
                    Share
                  </div>
                  <div
                    tabIndex={0}
                    className="dropdown-content z-[1] card card-compact shadow bg-[#E5EBEE] text-primary-content mt-3"
                  >
                    <div className="card-body">
                      <div className="flex justify-between flex-col gap-5 border">
                        <FacebookShareButton url={shareUrl} quote={shareTitle}>
                          Facebook
                        </FacebookShareButton>
                        <TwitterShareButton url={shareUrl} title={shareTitle}>
                          Twitter
                        </TwitterShareButton>
                        <TelegramShareButton url={shareUrl} title={shareTitle}>
                          Telegram
                        </TelegramShareButton>
                        <WhatsappShareButton url={shareUrl} title={shareTitle}>
                          Whatsapp
                        </WhatsappShareButton>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div>
                {userData?.restriction == 'yes' ? (
                  <div>
                    <textarea
                      className="border rounded-2xl min-h-[100px] outline-none p-3 mt-5 w-full"
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
                              src={"https://i.ibb.co/SsKJ9HL/icons8-close.gif"}
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
                      className="border rounded-2xl min-h-[100px] outline-none p-3 mt-5 w-full"
                      name="comment"
                      placeholder="Type your comment"
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                    ></textarea>
                    <div className="flex justify-end">
                      <button
                        className={`px-5 py-2 text-white rounded-full ${
                          comment.trim() === "" ? "bg-gray-500" : "bg-[#155E75]"
                        }`}
                        disabled={comment.trim() === ""}
                      >
                        Comment
                      </button>
                    </div>
                  </form>
                )}
              </div>
              <div>
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
