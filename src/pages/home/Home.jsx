import React, { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import PostItem from "../../components/PostItem";
import { useQuery } from "@tanstack/react-query";
import useAxiosPublic from "./../../hooks/useAxiosPublic";
import ReactPaginate from "react-paginate";
import "./pagination.css";
import { Helmet } from "react-helmet";

const Home = () => {
  const axiosPublic = useAxiosPublic();

  // Get categories
  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data } = await axiosPublic.get(`/tags`);
      return data;
    },
  });

  // Get posts
  const { data: getPost = [] } = useQuery({
    queryKey: ["getPost"],
    queryFn: async () => {
      const { data } = await axiosPublic.get(`/posts`);
      return data;
    },
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [filterQuery, setFilterQuery] = useState("");
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 5;

  useEffect(() => {
    let posts = [...getPost];

    // Sort posts by date in descending order
    posts.sort((a, b) => new Date(b.date) - new Date(a.date));

    if (searchQuery) {
      posts = posts.filter((post) =>
        post.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (filterQuery) {
      posts = posts.filter((post) =>
        post.category.toLowerCase().includes(filterQuery.toLowerCase())
      );
    }

    setFilteredPosts(posts);
    setCurrentPage(0); // Reset to the first page after filtering
  }, [searchQuery, filterQuery, getPost]);

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handlePageClick = (data) => {
    setCurrentPage(data.selected);
  };

  const handleTagClick = (tag) => {
    setFilterQuery(tag);
  };
  

  const indexOfLastItem = (currentPage + 1) * itemsPerPage;
  const indexOfFirstItem = currentPage * itemsPerPage;
  const currentItems = filteredPosts.slice(indexOfFirstItem, indexOfLastItem);
  const pageCount = Math.ceil(filteredPosts.length / itemsPerPage);

  return (
    <div>
      <Helmet>
        <title>Barta - Home</title>
      </Helmet>
      <div className="relative bg-[#f8f9ff]">
        <div className="px-4 sm:px-10 mb-10">
          <div className="pt-16 max-w-4xl mx-auto text-center relative z-10 pb-10">
            <h1 className="md:text-6xl text-4xl font-extrabold mb-6 md:!leading-[75px]">
            Barta Where Voices Connect, Ideas Flourish
            </h1>
            <p className="text-base">
            Join our thriving community for dynamic discussions on diverse topics. Share ideas, connect with like-minded individuals, and explore new perspectives. Start engaging conversations and broaden your horizons with us today!
            </p>
            <div className="bg-white mt-10 flex px-1 py-1.5 rounded-full shadow-[0_2px_10px_-3px_rgba(6,81,237,0.3)] overflow-hidden">
              <input
                type="text"
                placeholder="Search Something..."
                className="w-full outline-none bg-white pl-4"
                value={searchQuery}
                onChange={handleSearchChange}
              />
              <button
                type="button"
                className="bg-cyan-900 hover:bg-cyan-800 transition-all text-white rounded-full px-3 py-3"
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
                    d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
        <img
          src="https://readymadeui.com/bg-effect.svg"
          className="absolute inset-0 w-full h-full"
          alt="background-effect"
        />
      </div>
      <div className="container flex m-auto gap-10 px-3">
        <div className="hidden lg:block">
          <aside
            className="flex flex-col w-64 sticky top-5 px-4 py-8 overflow-y-auto bg-white border-r rtl:border-r-0 rtl:border-l dark:bg-gray-900 dark:border-gray-700 rounded-xl"
            style={{ boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px" }}
          >
            <div className="flex flex-col justify-between flex-1 mt-2">
              <nav>
                <a
                  onClick={() => handlePopularPost(filterVoteByThousand)}
                  className="flex items-center px-4 py-2 text-gray-700 bg-gray-100 rounded-md dark:bg-gray-800 dark:text-gray-200 justify-center"
                  href="#"
                >
                  <img src="https://i.ibb.co/vYgj36c/popularity.png" alt="" />
                  <span className="mx-4 font-medium">Popularity</span>
                </a>
                <hr className="my-3 border-gray-200 dark:border-gray-600" />
                {categories.map((category) => (
                  <a
                    key={category._id}
                    onClick={() => handleTagClick(category.tag)}
                    className={`flex items-center px-4 py-2 mt-2 text-gray-600 transition-colors duration-300 transform rounded-md dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 dark:hover:text-gray-200 hover:text-gray-700`}
                    href="#"
                  >
                    <div className="w-[20px]">
                      <img
                        className="object-cover"
                        src="https://i.ibb.co/N31Ctyt/icons8-category-16.png"
                        alt=""
                      />
                    </div>
                    <span className="mx-1 font-medium ml-3">
                      {category.tag}
                    </span>
                  </a>
                ))}
              </nav>
            </div>
          </aside>
        </div>
        <div className="w-full">
          <div className="mb-5 flex flex-col gap-3 w-full">
            {currentItems.length === 0 ? (
              <div className="flex justify-center">
                <img
                  className=""
                  src="https://i.ibb.co/z87QRK7/empty.gif"
                  alt="No results found"
                />
              </div>
            ) : (
              currentItems.map((post) => (
                <PostItem key={post._id} getPost={post} />
              ))
            )}
          </div>
          <div className="md:flex justify-between items-center pb-5">
            <span>
              Showing {indexOfFirstItem + 1}-
              {Math.min(indexOfLastItem, filteredPosts.length)} of{" "}
              {filteredPosts.length}
            </span>
            <ReactPaginate
              previousLabel={"<"}
              nextLabel={">"}
              breakLabel={"..."}
              breakClassName={"break-me"}
              pageCount={pageCount}
              marginPagesDisplayed={1}
              pageRangeDisplayed={1}
              onPageChange={handlePageClick}
              containerClassName={"pagination"}
              subContainerClassName={"pages pagination"}
              activeClassName={"active"}
              pageClassName={"page-item"}
              pageLinkClassName={"page-link"}
              previousClassName={"page-item"}
              previousLinkClassName={"page-link"}
              nextClassName={"page-item"}
              nextLinkClassName={"page-link"}
              disabledClassName={"disabled"}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
