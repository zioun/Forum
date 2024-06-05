import React, { useContext, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../../providers/AuthProvider";
import toast from "react-hot-toast";
import axios from "axios";

const Register = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const form = location.state || "/";
  const { createUser, updateUserProfile, user, setUser } =
    useContext(AuthContext);
  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [navigate, user]);

  const handleSignUp = async (e) => {
    e.preventDefault();
    const form = e.target;
    const email = form.email.value;
    const name = form.name.value;
    const photo = form.photo.value;
    const pass = form.password.value;
    console.log({ email, pass, name, photo });
    if (email === "" || name === "" || photo === "" || pass === "") {
      return toast.error("Input must not be empty");
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return toast.error("Email address is not valid!");
    } else if (!(pass.match(/[a-z]/) && pass.match(/[A-Z]/))) {
      return toast.error(
        "Password must contain at least one uppercase letter and one lowercase letter"
      );
    } else if (pass.length < 6) {
      return toast.error("Password length must be at least 6 characters");
    }

    try {
      const result = await createUser(email, pass);
      console.log(result);
      await updateUserProfile(name, photo);
      //optimistic ui update
      setUser({ ...user, photoURL: photo, displayName: name });
      navigate(location.state ? location.state : "/");
      const postData = {
        name: name,
        email: email,
        photo: photo,
        role: "user",
        subscription: "false",
        restriction: "no",
      };
      try {
        const { data } = await axios.post(
          `http://localhost:5000/users`,
          postData
        );
        console.log(data);
        form.reset();
      } catch (err) {
        console.log(err);
      }
      toast.success("Signup Successful");
    } catch (err) {
      console.log(err);
      toast.error(err?.message);
    }
    console.log(user);
  };
  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-306px)] my-7">
      <div className="flex w-full max-w-sm mx-auto overflow-hidden bg-white rounded-lg shadow-lg  border">
        <div className="w-full px-6 py-8 md:px-8">
          <div className="flex items-center justify-between"></div>
          <form onSubmit={handleSignUp}>
            <div className="mt-2">
              <label
                className="block mb-2 text-sm font-medium text-gray-600 "
                htmlFor="name"
              >
                Username
              </label>
              <input
                placeholder="Enter Your Name"
                id="name"
                autoComplete="name"
                name="name"
                className="block w-full px-4 py-2 text-gray-700 bg-white border rounded-lg    focus:border-blue-400 focus:ring-opacity-40  focus:outline-none focus:ring focus:ring-blue-300"
                type="text"
              />
            </div>
            <div className="mt-4">
              <label
                className="block mb-2 text-sm font-medium text-gray-600 "
                htmlFor="LoggingEmailAddress"
              >
                Email Address
              </label>

              <input
                placeholder="Enter Your Email"
                id="LoggingEmailAddress"
                autoComplete="email"
                name="email"
                className="block w-full px-4 py-2 text-gray-700 bg-white border rounded-lg    focus:border-blue-400 focus:ring-opacity-40  focus:outline-none focus:ring focus:ring-blue-300"
                type="email"
              />
            </div>

            <div className="mt-4">
              <div className="flex justify-between">
                <label
                  className="block mb-2 text-sm font-medium text-gray-600 "
                  htmlFor="loggingPassword"
                >
                  Password
                </label>
              </div>

              <input
                placeholder="Enter Your Password"
                id="loggingPassword"
                autoComplete="current-password"
                name="password"
                className="block w-full px-4 py-2 text-gray-700 bg-white border rounded-lg    focus:border-blue-400 focus:ring-opacity-40  focus:outline-none focus:ring focus:ring-blue-300"
                type="password"
              />
            </div>
            <div className="mt-4">
              <label
                className="block mb-2 text-sm font-medium text-gray-600 "
                htmlFor="photo"
              >
                Photo URL
              </label>
              <input
                placeholder="Enter Your Photo URL"
                id="photo"
                autoComplete="photo"
                name="photo"
                className="block w-full px-3 py-2 mt-2 text-sm text-gray-600 bg-white border border-gray-200 rounded-lg file:bg-gray-200 file:text-gray-700 file:text-sm file:px-4 file:py-1 file:border-none file:rounded-full dark:file:bg-gray-800 dark:file:text-gray-200 dark:text-gray-300 placeholder-gray-400/70 dark:placeholder-gray-500 focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40 dark:border-gray-600 dark:bg-gray-900 dark:focus:border-blue-300"
                type="text"
              />
            </div>
            <div className="mt-6">
              <button
                type="submit"
                className="w-full px-6 py-3 text-sm font-medium tracking-wide text-white capitalize transition-colors duration-300 transform bg-cyan-900 rounded-lg hover:bg-cyan-800 focus:outline-none focus:ring focus:ring-gray-300 focus:ring-opacity-50"
              >
                Sign Up
              </button>
            </div>
          </form>

          <div className="flex items-center justify-between mt-4">
            <span className="w-1/5 border-b  md:w-1/4"></span>

            <Link
              to="/login"
              className="text-xs text-gray-500 uppercase  hover:underline"
            >
              or sign in
            </Link>

            <span className="w-1/5 border-b  md:w-1/4"></span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
