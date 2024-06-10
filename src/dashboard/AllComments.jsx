import React, { useContext, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import toast, { Toaster } from "react-hot-toast";
import useAxiosPublic from "../hooks/useAxiosPublic";
import { AuthContext } from "../providers/AuthProvider";
import { Helmet } from "react-helmet";

const AllComments = () => {
  const { user } = useContext(AuthContext);
  const [comment, setComment] = useState("");
  const axiosPublic = useAxiosPublic();
  const { id } = useParams();
  const [comments, setComments] = useState([]);
  const [selectedComment, setSelectedComment] = useState(""); // State to hold the selected comment
  const [selectedOptions, setSelectedOptions] = useState({}); // State to hold selected options for each comment
  const [disabledButtons, setDisabledButtons] = useState({}); // State to hold disabled state of report buttons

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
        `/posts/${id}`
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

  // Handle option change for a comment
  const handleOptionChange = (commentId, event) => {
    const { value } = event.target;
    setSelectedOptions((prevOptions) => ({
      ...prevOptions,
      [commentId]: value,
    }));
  };

  // Handle report button click
  const handleReportClick = async (comment) => {
    const feedback = selectedOptions[comment._id];
    if (!feedback) {
      toast.error("Please select feedback before reporting.");
      return;
    }

    try {
      const response = await axiosPublic.post("/reports", {
        commentId: comment._id,
        comment: comment.comment,
        postId: comment.postId,
        date: comment.date,
        commenter: comment.commenter,
        feedback: feedback, // Correctly use selected feedback
      });
      toast.success("Reported successfully!");
      console.log("Report response:", response.data);

      // Disable the report button for the reported comment
      setDisabledButtons((prevDisabledButtons) => ({
        ...prevDisabledButtons,
        [comment._id]: true,
      }));
    } catch (err) {
      console.error(err);
      toast.error("Failed to report.");
    }
  };

  return (
    <div>
      <Helmet><title>Barta - Dashboard - All comments</title></Helmet>
      <Toaster />
      <div className="mt-5">
        <div className="w-[250px] md:w-[500px] lg:w-[600px] xl:w-[800px] px-8 py-4 bg-white rounded-lg shadow-md dark:bg-gray-800 border relative">
          <div className="font-sans overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-100 whitespace-nowrap">
                <tr>
                  <th className="px-4 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Commenter
                  </th>
                  <th className="px-4 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Comment
                  </th>
                  <th className="px-4 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Feedback
                  </th>
                  <th className="px-4 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Report
                  </th>
                </tr>
              </thead>

              <tbody className="bg-white divide-y divide-gray-200 whitespace-nowrap">
                {filteredComments.map((comment) => (
                  <tr key={comment._id}>
                    <td className="px-4 py-4 text-sm text-gray-800">
                      <div className="flex items-center gap-3">
                        <img
                          src={comment.commenter.photo}
                          className="h-[50px] rounded-full object-cover"
                          alt=""
                        />
                        <div>
                          <h1 className="font-bold">
                            {comment.commenter.name}
                          </h1>
                          <h1>{comment.commenter.email}</h1>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-800">
                      <div>
                        <div className="flex">
                          <p>{comment.comment.slice(0, 21)}...</p>
                          <span
                            onClick={() => {
                              setSelectedComment(comment.comment); // Set the selected comment
                              document.getElementById("my_modal_3").showModal();
                            }}
                            className="text-[#1A73E8] font-semibold cursor-pointer"
                          >
                            Read More
                          </span>
                          <dialog id="my_modal_3" className="modal">
                            <div className="modal-box">
                              <form method="dialog">
                                <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
                                  ✕
                                </button>
                              </form>
                              <h3 className="font-bold text-lg">Comment</h3>
                              <div className="">
                                <textarea
                                  className="w-full h-[205px] mt-2"
                                  readOnly
                                  value={selectedComment}
                                />
                              </div>
                            </div>
                          </dialog>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-800">
                      <select
                        value={selectedOptions[comment._id] || ""}
                        onChange={(event) =>
                          handleOptionChange(comment._id, event)
                        }
                        className="select select-bordered w-full max-w-xs"
                        name="feedback"
                      >
                        <option value={""} disabled>
                          Feedback
                        </option>
                        <option value="Inappropriate Content">Inappropriate Content</option>
                        <option value="Spam">Spam</option>
                        <option value="Harassment">Harassment</option>
                      </select>
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-800">
                      <button
                        disabled={
                          !selectedOptions[comment._id] ||
                          disabledButtons[comment._id]
                        }
                        className="btn"
                        onClick={() => handleReportClick(comment)}
                      >
                        Report
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllComments;
