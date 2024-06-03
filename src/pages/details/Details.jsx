import React, { useContext, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import useAxiosPublic from "../../hooks/useAxiosPublic";
import { AuthContext } from "../../providers/AuthProvider";
import { useQuery } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import toast from "react-hot-toast";

const Details = () => {
  const { user } = useContext(AuthContext);
  const [comment, setComment] = useState("");
  const axiosPublic = useAxiosPublic();
  const { id } = useParams();
  const [comments, setComments] = useState([]);

  //post comment
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
      // Fetch updated comments after posting a comment
      fetchComments();
    } catch (err) {
      console.log(err);
    }
  };

  // Fetch comments
  const fetchComments = async () => {
    try {
      const { data } = await axiosPublic.get(`/comments/`);
      const sortedData = data.sort(
        (a, b) => new Date(b.date) - new Date(a.date)
      );
      setComments(sortedData);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchComments();
  }, []);

  // Filter comments based on postId
  const filteredComments = comments.filter((comment) => comment.postId === id);

  // get post data by id
  const {
    data: post,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["post", id],
    queryFn: async () => {
      const { data } = await axiosPublic.get(
        `http://localhost:5000/posts/${id}`
      );
      console.log("Fetched post data:", data);
      return data;
    },
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  // Ensure post is defined before accessing its properties
  const timeAgo = post
    ? formatDistanceToNow(new Date(post.date), { addSuffix: true })
    : "Unknown date";

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
                  <button className="hover:text-[#D93900]"></button>
                  <h4>{post.upVote}</h4>
                  <button className="hover:text-[#6A5CFF]"></button>
                  <h1>{post.downVote}</h1>
                </div>
                <div className="flex gap-3 bg-[#E5EBEE] p-1 px-3 rounded-full cursor-pointer">
                  <h1>25</h1>
                </div>
                <div className="object-cover w-5">
                  <img
                    className="w-full"
                    src="https://i.ibb.co/SxmByX6/gold-silver-bronze-medal-badge-and-trophy-with-red-ribbon-flat-illustration-vector-2.jpg"
                    alt="Medal"
                  />
                </div>
                <div className="flex gap-3 bg-[#E5EBEE] p-1 px-3 rounded-full cursor-pointer">
                  <h1>Share</h1>
                </div>
              </div>
              <div>
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
              </div>
              <div>
                {/* Render filtered comments */}
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
