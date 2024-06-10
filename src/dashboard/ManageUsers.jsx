import React, { useContext, useEffect } from "react";
import { AuthContext } from "../providers/AuthProvider";
import { useQuery } from "@tanstack/react-query";
import useAxiosPublic from "../hooks/useAxiosPublic";
import Swal from "sweetalert2";
import { Helmet } from "react-helmet";

const ManageUsers = () => {
  const { user } = useContext(AuthContext);
  const axiosPublic = useAxiosPublic();

  // Fetch all users
  const { data: users = [], refetch: refetchUsers } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const { data } = await axiosPublic.get(`/users`);
      return data;
    },
  });

  // Handle role change to admin
  const handleRole = (userId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You are about to make this user an admin!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, make admin!",
    }).then((result) => {
      if (result.isConfirmed) {
        axiosPublic.patch(`/users/${userId}/role`).then((res) => {
          if (res.data.modifiedCount > 0) {
            Swal.fire({
              title: "Success!",
              text: "User has been made an admin.",
              icon: "success",
            });
            refetchUsers();
          }
        });
      }
    });
  };

  // Handle restriction change
  const handleRestriction = (userId, currentRestriction) => {
    const newRestriction = currentRestriction === "yes" ? "no" : "yes";
    Swal.fire({
      title: "Are you sure?",
      text: `You are about to ${
        newRestriction === "yes" ? "restrict" : "unrestrict"
      } this user!`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: `Yes, ${
        newRestriction === "yes" ? "restrict" : "unrestrict"
      }!`,
    }).then((result) => {
      if (result.isConfirmed) {
        axiosPublic
          .patch(`/users/${userId}/restriction`, {
            restriction: newRestriction,
          })
          .then((res) => {
            if (res.data.modifiedCount > 0) {
              Swal.fire({
                title: "Success!",
                text: `User has been ${
                  newRestriction === "yes" ? "restricted" : "unrestricted"
                }.`,
                icon: "success",
              });
              refetchUsers();
            }
          });
      }
    });
  };

  const email = user?.email;

  // Fetch user data based on email
  const { data: userData } = useQuery({
    queryKey: ["user", email],
    queryFn: async () => {
      if (!email) return null;
      const { data } = await axiosPublic.get(`/users/${email}`);
      return data;
    },
    enabled: !!email,
  });

  useEffect(() => {
    if (email) {
      refetchUsers();
    }
  }, [email, refetchUsers]);

  console.log("User data:", userData?.restriction);

  if (!userData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="mt-5">
      <Helmet><title>Barta - Dashboard - Manage Users</title></Helmet>
      <div className="w-[250px] md:w-[500px] lg:w-[600px] xl:w-[800px] px-8 py-4 bg-white rounded-lg shadow-md dark:bg-gray-800 border relative">
        <div className="font-sans overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-100 whitespace-nowrap">
              <tr>
                <th className="px-4 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-4 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-4 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-4 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Subscription
                </th>
                <th className="px-4 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Restriction
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200 whitespace-nowrap">
              {users.map((user) => (
                <tr key={user._id}>
                  <td className="px-4 py-4 text-sm text-gray-800 flex items-center gap-3">
                    <img
                      className="h-[50px] rounded-full"
                      src={user.photo}
                      alt=""
                    />
                    <div>
                      <h1 className="font-bold">{user.name}</h1>
                      <p>{user.email}</p>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-800">
                    {user.email}
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-800">
                    <span className="badge bg-green-100 text-green-600">
                      <button
                        disabled={user.role === "admin"}
                        onClick={() => handleRole(user._id)}
                      >
                        {user.role === "admin" ? (
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
                              d="M18 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM3 19.235v-.11a6.375 6.375 0 0 1 12.75 0v.109A12.318 12.318 0 0 1 9.374 21c-2.331 0-4.512-.645-6.374-1.766Z"
                            />
                          </svg>
                        ) : (
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
                              d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
                            />
                          </svg>
                        )}
                      </button>
                    </span>
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-800">
                    <span className="">
                      {user.subscription === "true" ? (
                        <p className="badge bg-green-100 text-green-600" >Subscribed</p>
                      ) : (
                        <p className="badge bg-red-100 text-red-600">Unsubscribe</p>
                      )}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-800">
                    <button
                      onClick={() =>
                        handleRestriction(user._id, user.restriction)
                      }
                      className=""
                    >
                      {user.restriction === "yes"
                        ? <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
                      </svg>
                      
                        : <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 10.5V6.75a4.5 4.5 0 1 1 9 0v3.75M3.75 21.75h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H3.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
                      </svg>
                      }
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ManageUsers;
