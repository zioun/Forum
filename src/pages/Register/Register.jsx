import React, { useContext, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../../providers/AuthProvider";
import toast from "react-hot-toast";
import axios from "axios";
import { Helmet } from "react-helmet";
import { useForm } from "react-hook-form";
import useAxiosPublic from "../../hooks/useAxiosPublic";

const Register = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const axiosPublic = useAxiosPublic();
  const { createUser, updateUserProfile, user, setUser } = useContext(AuthContext);
  
  const { register, handleSubmit, formState: { errors }, reset } = useForm();

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [navigate, user]);

  const onSubmit = async (data) => {
    const { email, name, photo, password } = data;

    try {
      const result = await createUser(email, password);
      await updateUserProfile(name, photo);
      setUser({ ...user, photoURL: photo, displayName: name });

      const postData = {
        name,
        email,
        photo,
        role: "user",
        subscription: "false",
        restriction: "no",
      };

      try {
        await axiosPublic.post(`/users`, postData);
        reset();
      } catch (err) {
        console.error(err);
      }

      toast.success("Signup Successful");
      navigate(location.state ? location.state : "/");
    } catch (err) {
      console.error(err);
      toast.error(err?.message);
    }
  };
  

  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-306px)] my-7">
      <Helmet><title>Barta - Register</title></Helmet>
      <div className="flex w-full max-w-sm mx-auto overflow-hidden bg-white rounded-lg shadow-lg border">
        <div className="w-full px-6 py-8 md:px-8">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mt-2">
              <label className="block mb-2 text-sm font-medium text-gray-600" htmlFor="name">
                Username
              </label>
              <input
                placeholder="Enter Your Name"
                id="name"
                autoComplete="name"
                {...register("name", { required: "Username is required" })}
                className="block w-full px-4 py-2 text-gray-700 bg-white border rounded-lg focus:border-blue-400 focus:ring-opacity-40 focus:outline-none focus:ring focus:ring-blue-300"
                type="text"
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
              )}
            </div>
            <div className="mt-4">
              <label className="block mb-2 text-sm font-medium text-gray-600" htmlFor="LoggingEmailAddress">
                Email Address
              </label>
              <input
                placeholder="Enter Your Email"
                id="LoggingEmailAddress"
                autoComplete="email"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Email address is not valid!",
                  },
                })}
                className="block w-full px-4 py-2 text-gray-700 bg-white border rounded-lg focus:border-blue-400 focus:ring-opacity-40 focus:outline-none focus:ring focus:ring-blue-300"
                type="email"
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
              )}
            </div>
            <div className="mt-4">
              <div className="flex justify-between">
                <label className="block mb-2 text-sm font-medium text-gray-600" htmlFor="loggingPassword">
                  Password
                </label>
              </div>
              <input
                placeholder="Enter Your Password"
                id="loggingPassword"
                autoComplete="current-password"
                {...register("password", {
                  required: "Password is required",
                  validate: {
                    hasUpperCase: (value) =>
                      /[A-Z]/.test(value) || "Password must contain at least one uppercase letter",
                    hasLowerCase: (value) =>
                      /[a-z]/.test(value) || "Password must contain at least one lowercase letter",
                    minLength: (value) =>
                      value.length >= 6 || "Password length must be at least 6 characters",
                  },
                })}
                className="block w-full px-4 py-2 text-gray-700 bg-white border rounded-lg focus:border-blue-400 focus:ring-opacity-40 focus:outline-none focus:ring focus:ring-blue-300"
                type="password"
              />
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
              )}
            </div>
            <div className="mt-4">
              <label className="block mb-2 text-sm font-medium text-gray-600" htmlFor="photo">
                Photo URL
              </label>
              <input
                placeholder="Enter Your Photo URL"
                id="photo"
                autoComplete="photo"
                {...register("photo", { required: "Photo URL is required" })}
                className="block w-full px-3 py-2 mt-2 text-sm text-gray-600 bg-white border border-gray-200 rounded-lg file:bg-gray-200 file:text-gray-700 file:text-sm file:px-4 file:py-1 file:border-none file:rounded-full dark:file:bg-gray-800 dark:file:text-gray-200 dark:text-gray-300 placeholder-gray-400/70 dark:placeholder-gray-500 focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40 dark:border-gray-600 dark:bg-gray-900 dark:focus:border-blue-300"
                type="text"
              />
              {errors.photo && (
                <p className="text-red-500 text-sm mt-1">{errors.photo.message}</p>
              )}
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
            <span className="w-1/5 border-b md:w-1/4"></span>
            <Link to="/login" className="text-xs text-gray-500 uppercase hover:underline">
              or sign in
            </Link>
            <span className="w-1/5 border-b md:w-1/4"></span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
