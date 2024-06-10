import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../providers/AuthProvider";

const Footer = () => {
  const { user } = useContext(AuthContext);
  return (
    <footer class="bg-[#F6F8F9] mt-20 p-10 font-[sans-serif] tracking-wide">
      <div class="md:flex md:-mx-3 md:items-center md:justify-between">
        <div class="mt-6 md:mx-3 shrink-0 md:mt-0 md:w-auto">
          {!user && (
            <Link to={"/login"}>
              <span class="inline-flex items-center justify-center w-full px-4 py-2 text-sm text-white duration-300 bg-cyan-800 rounded-lg gap-x-3 hover:bg-cyan-700 focus:ring focus:ring-gray-300 focus:ring-opacity-80">
                <span>Sign Up Now</span>

                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  class="w-5 h-5"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3"
                  />
                </svg>
              </span>
            </Link>
          )}
        </div>
      </div>
      <hr className="my-10" />
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        <div className="flex items-center gap-2">
          <img
            src="https://i.ibb.co/hcmRW8M/Untitled-design.png"
            alt="logo"
            className="w-14"
          />
          <h1 className="text-[25px] font-semibold">Barta</h1>
        </div>

        <div class="lg:flex lg:items-center">
          <ul class="flex space-x-6">
            <li>
              <a href="javascript:void(0)">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="fill-dark-300 hover:fill-dark w-7 h-7"
                  viewBox="0 0 24 24"
                >
                  <path
                    fill-rule="evenodd"
                    d="M19 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h7v-7h-2v-3h2V8.5A3.5 3.5 0 0 1 15.5 5H18v3h-2a1 1 0 0 0-1 1v2h3v3h-3v7h4a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2z"
                    clip-rule="evenodd"
                  />
                </svg>
              </a>
            </li>
            <li>
              <a href="javascript:void(0)">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="fill-dark-300 hover:fill-dark w-7 h-7"
                  viewBox="0 0 24 24"
                >
                  <path
                    fill-rule="evenodd"
                    d="M21 5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5zm-2.5 8.2v5.3h-2.79v-4.93a1.4 1.4 0 0 0-1.4-1.4c-.77 0-1.39.63-1.39 1.4v4.93h-2.79v-8.37h2.79v1.11c.48-.78 1.47-1.3 2.32-1.3 1.8 0 3.26 1.46 3.26 3.26zM6.88 8.56a1.686 1.686 0 0 0 0-3.37 1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68zm1.39 1.57v8.37H5.5v-8.37h2.77z"
                    clip-rule="evenodd"
                  />
                </svg>
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h4 class="text-lg font-semibold mb-6 text-dark">Contact Us</h4>
          <ul class="space-y-4">
            <li>
              <a
                href="javascript:void(0)"
                class="text-dark-300 hover:text-dark text-sm"
              >
                Email :{" "}
                <span className="text-gray-500">jionkhan0@gmail.com</span>
              </a>
            </li>
            <li>
              <a
                href="javascript:void(0)"
                class="text-dark-300 hover:text-dark text-sm"
              >
                Phone : <span className="text-gray-500">+880 1619971997</span>
              </a>
            </li>
            <li>
              <a
                href="javascript:void(0)"
                class="text-dark-300 hover:text-dark text-sm"
              >
                Address :{" "}
                <span className="text-gray-500">Dhaka, Bangladesh</span>
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h4 class="text-lg font-semibold mb-6 text-dark">Information</h4>
          <ul class="space-y-4">
            <li>
              <a
                href="javascript:void(0)"
                class="text-dark-300 hover:text-dark text-sm"
              >
                Membership
              </a>
            </li>
            <li>
              <a
                href="javascript:void(0)"
                class="text-dark-300 hover:text-dark text-sm"
              >
                Dashboard
              </a>
            </li>
            <li>
              <a
                href="javascript:void(0)"
                class="text-dark-300 hover:text-dark text-sm"
              >
                Privacy Policy
              </a>
            </li>
          </ul>
        </div>
      </div>
      <hr className="my-10 text-center" />
      <p class="text-dark-300 text-center text-sm mt-10">
        © 2024
        <a
          href="https://readymadeui.com/"
          target="_blank"
          class="hover:underline mx-1"
        >
          Barta
        </a>
        All Rights Reserved.
      </p>
    </footer>
  );
};

export default Footer;
