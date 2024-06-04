import { createBrowserRouter } from "react-router-dom";
import Root from "../layout/Root";
import Home from "../pages/home/Home";
import Login from './../pages/Login/Login';
import Register from './../pages/Register/Register';
import Dashboard from "../layout/Dashboard";
import MyProfile from "../dashboard/MyProfile";
import AddPost from "../dashboard/AddPost";
import MyPosts from "../dashboard/MyPosts";
import Details from './../pages/details/Details';
import AllComments from "../dashboard/AllComments";
import AdminProfile from "../dashboard/AdminProfile";
import Activities from "../dashboard/Activities";
import Announcement from "../dashboard/Announcement";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Root></Root>,
    children: [
      {
        path: "/",
        element: <Home></Home>,
      },
      {
        path: "/details/:id",
        element: <Details></Details>,
      },
      {
        path: "/login",
        element: <Login></Login>,
      },
      {
        path: "/register",
        element: <Register></Register>,
      },
    ],
  },
  {
    path: "/dashboard",
    element: <Dashboard></Dashboard>,
    children: [
      {
        path: "my-profile",
        element: <MyProfile></MyProfile>,
      },
      {
        path: "add-post",
        element: <AddPost></AddPost>,
      },
      {
        path: "my-post",
        element: <MyPosts></MyPosts>,
      },
      {
        path: "all-comments/:id",
        element: <AllComments></AllComments>,
      },
      {
        path: "admin-profile",
        element: <AdminProfile></AdminProfile>,
      },
      {
        path: "activities",
        element: <Activities></Activities>,
      },
      {
        path: "announcement",
        element: <Announcement></Announcement>,
      },
    ],
  },
]);
