import React from "react";
import { formatDistanceToNow } from "date-fns";
import { Link } from "react-router-dom";
import useAxiosPublic from "../hooks/useAxiosPublic";
import { useQuery } from "@tanstack/react-query";

const PostItem = ({ getPost }) => {
  const axiosPublic = useAxiosPublic();

  const {
    _id,
    title,
    category,
    description,
    date,
    award,
    upVote,
    downVote,
    author,
  } = getPost;

  // Convert date to "time ago" format
  const timeAgo = formatDistanceToNow(new Date(date), { addSuffix: true });

  // Fetch comments
  const { data: comments = [], isLoading: commentsLoading, error: commentsError } = useQuery({
    queryKey: ["comments", _id],
    queryFn: async () => {
      const { data } = await axiosPublic.get(`/comments/`);
      return data.sort((a, b) => new Date(b.date) - new Date(a.date));
    }
  });

  // Filter comments based on postId
  const filteredComments = comments.filter((comment) => comment.postId === _id);

  return (
    <div className="border-b px-10 w-full py-10 hover:bg-[#F6F8F9]">
      <Link to={`/details/${_id}`}>
        <div className="flex gap-3 items-center">
          <div className="w-10">
            <img className="rounded-full" src={author?.photo} alt={author?.name} />
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
          <button className="hover:text-[#D93900]">
          </button>
          <h4>{upVote}</h4>
          <button className="hover:text-[#6A5CFF]">
          </button>
          <h1>{downVote}</h1>
        </div>
        <div className="flex gap-3 bg-[#E5EBEE] p-1 px-3 rounded-full cursor-pointer">
          <h1>{filteredComments.length}</h1>
        </div>
        <div className="object-cover w-5">
          <img
            className="w-full"
            src="https://i.ibb.co/SxmByX6/gold-silver-bronze-medal-badge-and-trophy-with-red-ribbon-flat-illustration-vector-2.jpg"
            alt=""
          />
        </div>
        <div className="flex gap-3 bg-[#E5EBEE] p-1 px-3 rounded-full cursor-pointer">
          <h1>Share</h1>
        </div>
      </div>
    </div>
  );
};

export default PostItem;
