import React from "react";
import { formatDistanceToNow } from "date-fns";

const PostItem = ({ getPost }) => {
  const { _id, title, category, description, date, award, upVote, downVote, author } = getPost;

  // Convert date to "time ago" format
  const timeAgo = formatDistanceToNow(new Date(date), { addSuffix: true });

  return (
    <div className="border-b px-10 w-full py-10">
      <div className="flex gap-3 items-center">
        <div className="w-10">
          <img
            className="rounded-full"
            src={author.photo}
            alt=""
          />
        </div>
        <div className="text-[#333D42] font-semibold">{author.name}</div>
        <div className="text-[#5C6C74]">{timeAgo}</div>
        <div className="object-cover w-5">
          <img
            className="w-full"
            src="https://i.ibb.co/SxmByX6/gold-silver-bronze-medal-badge-and-trophy-with-red-ribbon-flat-illustration-vector-2.jpg"
            alt=""
          />
        </div>
      </div>
      <div className="">
        <div className="">
          <div className="py-3">
            <span className="bg-[#155E75] text-[12px] text-white px-5 py-1 rounded-full">
              {category}
            </span>
          </div>
          <div>
            <h1 className="text-xl pb-3 text-[#181C1F] font-semibold">
              {title}
            </h1>
          </div>
          <div>
            <p className="text-[#333D42] text-[14px]">
              {description}
            </p>
          </div>
        </div>
      </div>
      <div className="mt-7 flex gap-3">
        <div className="flex gap-1 bg-[#E5EBEE] p-1 px-3 rounded-full">
          <button className="hover:text-[#D93900]">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              className="size-6"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M4.5 10.5 12 3m0 0 7.5 7.5M12 3v18"
              />
            </svg>
          </button>
          <h4>{upVote}</h4>
          <button className="hover:text-[#6A5CFF]">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              className="size-6"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M19.5 13.5 12 21m0 0-7.5-7.5M12 21V3"
              />
            </svg>
          </button>
          <h1>{downVote}</h1>
        </div>
        <div className="flex gap-3 bg-[#E5EBEE] p-1 px-3 rounded-full cursor-pointer">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            className="size-6"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 0 1 .865-.501 48.172 48.172 0 0 0 3.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z"
            />
          </svg>
          <h1>25</h1>
        </div>
        <div className="flex gap-3 bg-[#E5EBEE] p-1 px-3 rounded-full cursor-pointer">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            className="size-6"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186 9.566-5.314m-9.566 7.5 9.566 5.314m0 0a2.25 2.25 0 1 0 3.935 2.186 2.25 2.25 0 0 0-3.935-2.186Zm0-12.814a2.25 2.25 0 1 0 3.933-2.185 2.25 2.25 0 0 0-3.933 2.185Z"
            />
          </svg>
          <h1>Share</h1>
        </div>
      </div>
    </div>
  );
};

export default PostItem;
