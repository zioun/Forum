import React, { useContext, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../../providers/AuthProvider";
import toast from "react-hot-toast";
import axios from "axios";
import { Helmet } from "react-helmet";
import { useForm } from "react-hook-form";
import useAxiosPublic from "../../hooks/useAxiosPublic";

const Login = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { signIn, googleSignIn, user } = useContext(AuthContext);
  const axiosPublic = useAxiosPublic();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [navigate, user]);

  const handleGoogleSignIn = async () => {
    try {
      const result = await googleSignIn();
      const signedInUser = result.user;

      // Check if the user exists in the database
      const response = await axiosPublic.get(
        `/users?email=${signedInUser.email}`
      );

      // Assuming response.data is an array of users
      if (!response.data.some((user) => user.email === signedInUser.email)) {
        // User does not exist, proceed to add to the database
        const postData = {
          name: signedInUser.displayName,
          email: signedInUser.email,
          photo: signedInUser.photoURL,
          role: "user",
          subscription: "false",
          restriction: "no",
        };
        const { data } = await axiosPublic.post(
          `/users`,
          postData
        );
        console.log(data);
      }

      toast.success("Signin Successfully");
      navigate(location.state?.from?.pathname || "/");
    } catch (err) {
      console.log(err);
      toast.error(err?.message);
    }
  };

  const onSubmit = async (data) => {
    const { email, password } = data;

    try {
      const result = await signIn(email, password);
      const signedInUser = result.user;

      console.log(signedInUser);
      toast.success("Signin Successfully");
      navigate(location.state?.from?.pathname || "/");
    } catch (err) {
      console.log(err);
      toast.error("Email or password is incorrect");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-306px)]">
      <Helmet><title>Barta - Login</title></Helmet>
      <div className="flex w-full max-w-sm mx-auto overflow-hidden bg-white rounded-lg shadow-lg border">
        <div className="w-full px-6 py-8 md:px-8">
          <div className="">
            <div
              onClick={handleGoogleSignIn}
              className="flex cursor-pointer items-center justify-center mt-4 text-gray-600 transition-colors duration-300 transform border rounded-lg hover:bg-gray-50"
            >
              <div className="px-4 py-2">
                <svg className="w-6 h-6" viewBox="0 0 40 40">
                  <path
                    d="M36.3425 16.7358H35V16.6667H20V23.3333H29.4192C28.045 27.2142 24.3525 30 20 30C14.4775 30 10 25.5225 10 20C10 14.4775 14.4775 9.99999 20 9.99999C22.5492 9.99999 24.8683 10.9617 26.6342 12.5325L31.3483 7.81833C28.3717 5.04416 24.39 3.33333 20 3.33333C10.7958 3.33333 3.33335 10.7958 3.33335 20C3.33335 29.2042 10.7958 36.6667 20 36.6667C29.2042 36.6667 36.6667 29.2042 36.6667 20C36.6667 18.8825 36.5517 17.7917 36.3425 16.7358Z"
                    fill="#FFC107"
                  />
                  <path
                    d="M5.25497 12.2425L10.7308 16.2583C12.2125 12.59 15.8008 9.99999 20 9.99999C22.5491 9.99999 24.8683 10.9617 26.6341 12.5325L31.3483 7.81833C28.3716 5.04416 24.39 3.33333 20 3.33333C13.5983 3.33333 8.04663 6.94749 5.25497 12.2425Z"
                    fill="#FF3D00"
                  />
                  <path
                    d="M20 36.6667C24.305 36.6667 28.2167 35.0192 31.1742 32.34L26.0159 27.975C24.3425 29.2425 22.2625 30 20 30C15.665 30 11.9842 27.2359 10.5975 23.3784L5.16254 27.5659C7.92087 32.9634 13.5225 36.6667 20 36.6667Z"
                    fill="#4CAF50"
                  />
                  <path
                    d="M36.3425 16.7358H35V16.6667H20V23.3333H29.4192C28.7592 25.1975 27.56 26.805 26.0133 27.9758C26.0142 27.975 26.015 27.975 26.0158 27.9742L31.1742 32.3392C30.8092 32.6708 36.6667 28.3333 36.6667 20C36.6667 18.8825 36.5517 17.7917 36.3425 16.7358Z"
                    fill="#1976D2"
                  />
                </svg>
              </div>
              <span className="px-4 py-3 font-bold text-center">
                Sign in with Google
              </span>
            </div>
          </div>
          

          <div className="flex items-center justify-between mt-4">
            <span className="w-1/5 border-b lg:w-1/4"></span>
            <div className="text-xs text-center text-gray-500 uppercase hover:underline">
              or login with email
            </div>
            <span className="w-1/5 border-b lg:w-1/4"></span>
          </div>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mt-4">
              <label
                className="block mb-2 text-sm font-medium text-gray-600"
                htmlFor="LoggingEmailAddress"
              >
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
                <label
                  className="block mb-2 text-sm font-medium text-gray-600"
                  htmlFor="loggingPassword"
                >
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
            <div className="mt-6">
              <button
                type="submit"
                className="w-full px-6 py-3 text-sm font-medium tracking-wide text-white capitalize transition-colors duration-300 transform bg-cyan-900 rounded-lg hover:bg-cyan-800 focus:outline-none focus:ring focus:ring-gray-300 focus:ring-opacity-50"
              >
                Sign In
              </button>
            </div>
          </form>

          <div className="flex items-center justify-between mt-4">
            <span className="w-1/5 border-b md:w-1/4"></span>
            <Link
              to="/register"
              className="text-xs text-gray-500 uppercase hover:underline"
            >
              or sign up
            </Link>
            <span className="w-1/5 border-b md:w-1/4"></span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
