import React, { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import PostItem from "../../components/PostItem";
import { useQuery } from "@tanstack/react-query";
import useAxiosPublic from "./../../hooks/useAxiosPublic";
import ReactPaginate from "react-paginate";
import "./pagination.css";

const Home = () => {
  const axiosPublic = useAxiosPublic();
  const { data: getPost = [] } = useQuery({
    queryKey: ["getPost"],
    queryFn: async () => {
      const { data } = await axiosPublic.get(`http://localhost:5000/posts`);
      return data;
    },
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 5;

  useEffect(() => {
    setFilteredPosts(
      getPost.filter((post) =>
        post.title.toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
    setCurrentPage(0); // Reset to the first page after filtering
  }, [searchQuery, getPost]);

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handlePageClick = (data) => {
    setCurrentPage(data.selected);
  };

  const indexOfLastItem = (currentPage + 1) * itemsPerPage;
  const indexOfFirstItem = currentPage * itemsPerPage;
  const currentItems = filteredPosts.slice(indexOfFirstItem, indexOfLastItem);
  const pageCount = Math.ceil(filteredPosts.length / itemsPerPage);

  return (
    <div>
      <div className="relative bg-[#f8f9ff]">
        <div className="px-4 sm:px-10">
          <div className="pt-16 max-w-4xl mx-auto text-center relative z-10">
            <h1 className="md:text-6xl text-4xl font-extrabold mb-6 md:!leading-[75px]">
              Build Landing Pages with Typeform Integration
            </h1>
            <p className="text-base">
              Embark on a gastronomic journey with our curated dishes, delivered
              promptly to your doorstep. Elevate your dining experience today.
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
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
                search
              </button>
            </div>
          </div>
          <hr className="my-12 border-gray-300" />
        </div>
        <img
          src="https://readymadeui.com/bg-effect.svg"
          className="absolute inset-0 w-full h-full"
          alt="background-effect"
        />
      </div>
      <div className="flex gap-10 px-20">
        <div>
          <Sidebar />
        </div>
        <div className="px-20 w-full">
          <div className="border-t mb-5">
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
          <div className="flex justify-between items-center pb-5">
            <span>
              Showing {indexOfFirstItem + 1}-
              {Math.min(indexOfLastItem, filteredPosts.length)} of{" "}
              {filteredPosts.length}
            </span>
            <ReactPaginate
              previousLabel={"Previous"}
              nextLabel={"Next"}
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
