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
import ManageUsers from "../dashboard/ManageUsers";
import Activities from "../dashboard/Activities";
import Announcement from "../dashboard/Announcement";
import PrivateRoute from "./PrivateRoute";
import Membership from "../pages/membership/Membership";
import AdminRoute from "./AdminRoute";
import Payment from "../pages/membership/Payment";
import CheckoutForm from "../pages/membership/CheckoutForm";
import ErrorPage from "../pages/404/ErrorPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Root></Root>,
    errorElement: <ErrorPage/>,
    children: [
      {
        path: "/",
        element: <Home></Home>,
      },
      {
        path: "/membership",
        element: <PrivateRoute><Membership></Membership></PrivateRoute>,
      },
      {
        path: "/payment",
        element: <Payment></Payment>,
      },
      {
        path: "/checkout",
        element: <CheckoutForm></CheckoutForm>,
      },
      {
        path: "/details/:id",
        element: <Details></Details>
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
    element: <PrivateRoute><Dashboard></Dashboard></PrivateRoute>,
    errorElement: <ErrorPage/>,
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
        element: <AdminRoute><AdminProfile></AdminProfile></AdminRoute>,
      },
      {
        path: "manage-users",
        element: <AdminRoute><ManageUsers></ManageUsers></AdminRoute>,
      },
      {
        path: "activities",
        element: <AdminRoute><Activities></Activities></AdminRoute>,
      },
      {
        path: "announcement",
        element: <AdminRoute><Announcement></Announcement></AdminRoute>,
      },
    ],
  },
]);
