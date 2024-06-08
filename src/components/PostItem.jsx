import React, { useContext, useEffect, useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { Link } from "react-router-dom";
import useAxiosPublic from "../hooks/useAxiosPublic";
import { useQuery } from "@tanstack/react-query";
import {
  FacebookShareButton,
  TelegramShareButton,
  TwitterShareButton,
  WhatsappShareButton,
} from "react-share";
import { AuthContext } from "../providers/AuthProvider";

const PostItem = ({ getPost }) => {
  const axiosPublic = useAxiosPublic();
  const { user } = useContext(AuthContext);

  const [upVotes, setUpVotes] = useState(0);
  const [downVotes, setDownVotes] = useState(0);
  const [activeUp, setActiveUp] = useState(false);
  const [activeDown, setActiveDown] = useState(false);

  const { _id, title, category, description, date, author, award } = getPost;

  // Convert date to "time ago" format
  const timeAgo = formatDistanceToNow(new Date(date), { addSuffix: true });

  // Fetch comments
  const {
    data: comments,
    isLoading: commentsLoading,
    error: commentsError,
  } = useQuery({
    queryKey: ["comments", _id],
    queryFn: async () => {
      const { data } = await axiosPublic.get(`/comments/`);
      return data.sort((a, b) => new Date(b.date) - new Date(a.date));
    },
  });
  const filteredComments =
    comments && comments.filter((comment) => comment.postId === _id);

  const shareUrl = `${window.location.origin}/details/${_id}`;
  const shareTitle = title;

  const fetchVotes = async () => {
    try {
      const { data } = await axiosPublic.get(`/votes/${_id}`);
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
  }, [axiosPublic, _id, user?.email]);

  const handleVote = async (e, upVote) => {
    e.preventDefault();
    const postData = {
      postId: _id,
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

  return (
    <div className="border-b px-10 w-full py-10 hover:bg-[#F6F8F9]">
      <Link to={`/details/${_id}`}>
        <div className="flex gap-3 items-center">
          <div className="w-10">
            <img
              className="rounded-full"
              src={author?.photo}
              alt={author?.name}
            />
          </div>
          <div className="flex items-center gap-2">
            <div className="text-[#333D42] font-semibold">{author?.name}</div>
            <div className="bg-[#5C6C74] h-[5px] w-[5px] rounded-full mt-2"></div>
            <div className="text-[#5C6C74]">{timeAgo}</div>
          </div>
        </div>
        <div>
          <div className="mt-3">
            <span className="text-[#155E75] font-bold rounded-full">
              {category}
            </span>
          </div>
          <div>
            <h1 className="text-xl pb-3 text-[#181C1F] font-semibold">
              {title}
            </h1>
          </div>
          <div>
            <p className="text-[#333D42] text-[14px]">{description}</p>
          </div>
        </div>
      </Link>
      {/* bottom function */}
      <div className="mt-7 flex gap-3">
        <div className="flex gap-1 bg-[#E5EBEE] p-1 px-3 rounded-full">
          <button
            onClick={(e) => handleVote(e, true)}
            className={`hover:text-[#D93900] ${activeUp ? "text-red-500" : ""}`}
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
          {commentsLoading ? (
            <span>Loading comments...</span>
          ) : commentsError ? (
            <span>Error loading comments</span>
          ) : (
            <h1>{filteredComments.length}</h1>
          )}
        </div>
        <div className="object-cover w-5">
          {award == "gold" ? (
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
                  FacebookShareButton
                </FacebookShareButton>
                <TwitterShareButton url={shareUrl} title={shareTitle}>
                  TwitterShareButton
                </TwitterShareButton>
                <TelegramShareButton url={shareUrl} title={shareTitle}>
                  TelegramShareButton
                </TelegramShareButton>
                <WhatsappShareButton url={shareUrl} title={shareTitle}>
                  WhatsappShareButton
                </WhatsappShareButton>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostItem;
