import React, { useContext, useEffect } from "react";
import { AuthContext } from "../providers/AuthProvider";
import { useQuery } from "@tanstack/react-query";
import useAxiosPublic from "../hooks/useAxiosPublic";
import Swal from "sweetalert2";

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
      text: `You are about to ${newRestriction === "yes" ? "restrict" : "unrestrict"} this user!`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: `Yes, ${newRestriction === "yes" ? "restrict" : "unrestrict"}!`,
    }).then((result) => {
      if (result.isConfirmed) {
        axiosPublic.patch(`/users/${userId}/restriction`, { restriction: newRestriction }).then((res) => {
          if (res.data.modifiedCount > 0) {
            Swal.fire({
              title: "Success!",
              text: `User has been ${newRestriction === "yes" ? "restricted" : "unrestricted"}.`,
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
      <div className="max-w-[1000px] px-8 py-4 bg-white rounded-lg shadow-md dark:bg-gray-800 border relative">
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
                    <img className="h-[50px] rounded-full" src={user.photo} alt="" />
                    <div>
                      <h1 className="font-bold">{user.name}</h1>
                      <p>{user.email}</p>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-800">{user.email}</td>
                  <td className="px-4 py-4 text-sm text-gray-800">
                    <span className="badge bg-green-100 text-green-600">
                      <button disabled={user.role === "admin"} onClick={() => handleRole(user._id)}>
                        {user.role === "admin" ? "Admin" : "User"}
                      </button>
                    </span>
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-800">
                    <span className="badge bg-red-100 text-red-600">
                      {user.subscription === "true" ? <p>Subscribe</p> : <p>Unsubscribe</p>}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-800">
                    <button onClick={() => handleRestriction(user._id, user.restriction)} className="badge bg-green-100 text-green-600">
                      {user.restriction === "yes" ? "Restricted" : "Unrestricted"}
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
