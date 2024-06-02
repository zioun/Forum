import { createBrowserRouter } from "react-router-dom";
import Root from "../layout/Root";
import Home from "../pages/home/Home";
import Login from './../pages/Login/Login';
import Register from './../pages/Register/Register';
import Dashboard from "../layout/Dashboard";
import MyProfile from "../dashboard/MyProfile";
import AddPost from "../dashboard/AddPost";

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
    ],
  },
]);
