import React, { useRef, useEffect, useContext, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../providers/AuthProvider";
import Notifications from "../components/Notifications";
import useAxiosPublic from "../hooks/useAxiosPublic";
import { useQuery } from "@tanstack/react-query";

const Navbar = () => {
  const { user, logOut } = useContext(AuthContext);
  const toggleOpenRef = useRef(null);
  const toggleCloseRef = useRef(null);
  const collapseMenuRef = useRef(null);

  const axiosPublic = useAxiosPublic();

  const { data: admin, isPending: isAdminLoading } = useQuery({
    queryKey: [user?.email, "admin"],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosPublic.get(`/users/${user.email}`);
      return res.data.role === "admin";
    },
  });

  useEffect(() => {
    const handleClick = () => {
      if (collapseMenuRef.current.style.display === "block") {
        collapseMenuRef.current.style.display = "none";
      } else {
        collapseMenuRef.current.style.display = "block";
      }
    };

    const toggleOpen = toggleOpenRef.current;
    const toggleClose = toggleCloseRef.current;

    toggleOpen.addEventListener("click", handleClick);
    toggleClose.addEventListener("click", handleClick);

    // Cleanup event listeners on component unmount
    return () => {
      toggleOpen.removeEventListener("click", handleClick);
      toggleClose.removeEventListener("click", handleClick);
    };
  }, []);

  return (
    <header className="py-4 px-4 sm:px-10 z-50 min-h-[70px] bg-[#f8f9ff]">
      <div className="relative flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <img
            src="https://i.ibb.co/hcmRW8M/Untitled-design.png"
            alt="logo"
            className="w-14"
          />
          <h1 className="text-[25px] font-semibold">Barta</h1>
        </div>

        <div
          id="collapseMenu"
          ref={collapseMenuRef}
          className="max-lg:hidden lg:!block max-lg:fixed max-lg:before:fixed max-lg:before:bg-black max-lg:before:opacity-50 max-lg:before:inset-0 max-lg:before:z-50 z-50"
        >
          <button
            id="toggleClose"
            ref={toggleCloseRef}
            className="lg:hidden fixed top-2 right-4 z-[100] rounded-full bg-white p-3"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-4 fill-black"
              viewBox="0 0 320.591 320.591"
            >
              <path
                d="M30.391 318.583a30.37 30.37 0 0 1-21.56-7.288c-11.774-11.844-11.774-30.973 0-42.817L266.643 10.665c12.246-11.459 31.462-10.822 42.921 1.424 10.362 11.074 10.966 28.095 1.414 39.875L51.647 311.295a30.366 30.366 0 0 1-21.256 7.288z"
                data-original="#000000"
              ></path>
              <path
                d="M287.9 318.583a30.37 30.37 0 0 1-21.257-8.806L8.83 51.963C-2.078 39.225-.595 20.055 12.143 9.146c11.369-9.736 28.136-9.736 39.504 0l259.331 257.813c12.243 11.462 12.876 30.679 1.414 42.922-.456.487-.927.958-1.414 1.414a30.368 30.368 0 0 1-23.078 7.288z"
                data-original="#000000"
              ></path>
            </svg>
          </button>

          <ul className="lg:ml-12 lg:flex gap-x-6 max-lg:space-y-3 max-lg:fixed max-lg:bg-white max-lg:w-1/2 max-lg:min-w-[300px] max-lg:top-0 max-lg:left-0 max-lg:p-6 max-lg:h-full max-lg:shadow-md max-lg:overflow-auto z-50">
            <li className="mb-6 hidden max-lg:block">
              <a href="#">
                <img
                  src="https://readymadeui.com/readymadeui.svg"
                  alt="logo"
                  className="w-36"
                />
              </a>
            </li>
            <li className="max-lg:border-b max-lg:py-3 px-3 flex justify-end">
              <span
                href="#"
                className="hover:text-blue-600 text-blue-600 block font-semibold transition-all"
              >
                <Link to={"/"}>Home</Link>
              </span>
            </li>
            <li className="max-lg:border-b max-lg:py-3 px-3 flex justify-end">
              <a
                href="#"
                className="hover:text-blue-600 block font-semibold transition-all"
              >
                <Link to={"/membership"}>Membership</Link>
              </a>
            </li>

            <li className="max-lg:border-b max-lg:py-3 px-3 flex justify-end">
              {user && <Notifications></Notifications>}
            </li>
          </ul>
        </div>

        <div className="flex ml-auto">
          {user ? (
            <div className="dropdown dropdown-end z-40">
              <div
                tabIndex={0}
                role="button"
                className="btn btn-ghost btn-circle avatar"
              >
                <div className="w-10 rounded-full">
                  {
                    <img
                      alt="Tailwind CSS Navbar component"
                      src={user?.photoURL}
                    />
                  }
                </div>
              </div>
              <div
                tabIndex={0}
                className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52"
              >
                <a
                  href="#"
                  class="flex items-center p-3 -mt-2 text-sm text-gray-600 transition-colors duration-300 transform dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 dark:hover:text-white"
                >
                  <div class="mx-1 cursor-default">
                    <h1 class="text-sm font-semibold text-gray-700 dark:text-gray-200">
                      {user?.displayName}
                    </h1>
                    <p class="text-sm text-gray-500 dark:text-gray-400">
                      {user?.email}
                    </p>
                  </div>
                </a>

                <hr class="border-gray-200 dark:border-gray-700 " />
                {!admin ? (
                  <>
                    <Link to={"/dashboard/my-profile"}>
                      <span
                        href="#"
                        class="block px-4 py-3 text-sm text-gray-600 capitalize transition-colors duration-300 transform dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 dark:hover:text-white"
                      >
                        Dashboard
                      </span>
                    </Link>
                  </>
                ) : (
                  <>
                    <Link to={"/dashboard/admin-profile"}>
                      <span
                        href="#"
                        class="block px-4 py-3 text-sm text-gray-600 capitalize transition-colors duration-300 transform dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 dark:hover:text-white"
                      >
                        Dashboard
                      </span>
                    </Link>
                  </>
                )}

                <hr class="border-gray-200 dark:border-gray-700 " />

                <a
                  onClick={logOut}
                  href="#"
                  class="block px-4 py-3 text-sm text-gray-600 capitalize transition-colors duration-300 transform dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 dark:hover:text-white"
                >
                  Sign Out
                </a>
              </div>
            </div>
          ) : (
            <Link to="/login">
              <button className="px-5 py-2 rounded-xl text-white bg-cyan-900 transition-all hover:bg-cyan-800">
                Join Us
              </button>
            </Link>
          )}

          <button
            id="toggleOpen"
            ref={toggleOpenRef}
            className="lg:hidden ml-7"
          >
            <svg
              className="w-7 h-7"
              fill="#000"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                clipRule="evenodd"
              ></path>
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
