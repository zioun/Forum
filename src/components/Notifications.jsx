import React, { useContext, useState } from "react";
import useAxiosPublic from "../hooks/useAxiosPublic";
import { useQuery } from "@tanstack/react-query";
import { AuthContext } from "../providers/AuthProvider";

const Notifications = () => {
  const { user } = useContext(AuthContext);
  const [isOpen, setIsOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);
  const axiosPublic = useAxiosPublic();

  // Fetch announcements data
  const {
    data: announcements = [],
    isLoading: announcementsLoading,
    error: announcementsError,
  } = useQuery({
    queryKey: ["announcement"],
    queryFn: async () => {
      const { data } = await axiosPublic.get(`/announcement`);
      console.log("Fetched announcement data:", data);
      // Sort announcements by date (newest to oldest)
      const sortedData = data.sort((a, b) => new Date(b.date) - new Date(a.date));
      console.log("Sorted announcement data:", sortedData);
      return sortedData;
    },
  });

  // Fetch notifications data specific to the current user
  const { data: notifications = [], refetch: refetchNotifications } = useQuery({
    queryKey: ["notifications"],
    queryFn: async () => {
      const { data } = await axiosPublic.get(`/notifications`);
      return data.filter((item) => item.email === user.email);
    },
    refetchInterval: 60000, // Polling interval in milliseconds (1 minute)
  });

  const handleAnnouncementClick = (announce) => {
    setSelectedAnnouncement(announce);
    setModalOpen(true);
    setIsOpen(false); // Close the notifications dropdown
  };

  const handleNotificationClick = async (e, id) => {
    e.preventDefault();
    const postData = {
      notifyId: id,
      email: user?.email,
    };
    try {
      const { data } = await axiosPublic.patch(`/notifications`, postData);
      if (data.success) {
        console.log("Notification sent successfully");
        // After successfully sending notification, refetch notifications to update count
        refetchNotifications();
      } else {
        console.log("Notification already sent");
      }
    } catch (err) {
      console.log(err);
    }
  };

  if (announcementsLoading) {
    return <div>Loading...</div>;
  }

  if (announcementsError) {
    return <div>Error: {announcementsError.message}</div>;
  }

  return (
    <div>
      <div className="flex">
        <div className="relative inline-block">
          {/* Dropdown toggle button */}
          <div className="flex">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="relative z-10 block text-gray-700 border border-transparent rounded-md focus:outline-none"
            >
              <div className="indicator">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                  />
                </svg>
                <span className="w-[20px] text-[12px] rounded-full text-white bg-[#155E75] indicator-item">{announcements.length - notifications.length}</span>
              </div>
            </button>
          </div>

          {/* Dropdown menu */}
          {isOpen && (
            <div className="absolute flex right-0 z-20 w-64 mt-2 overflow-hidden origin-top-right bg-white rounded-md shadow-lg sm:w-80 dark:bg-gray-800 border">
              <div className="py-2 max-h-[230px] overflow-y-auto overflow-x-hidden">
                {announcements.map((announce) => (
                  <div
                    key={announce._id}
                    onClick={() => handleAnnouncementClick(announce)}
                  >
                    <a
                      href="#"
                      onClick={(e) => handleNotificationClick(e, announce._id)}
                      className={`flex items-center px-4 py-3 -mx-2 transition-colors duration-300 transform border-b border-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700 dark:border-gray-700 ${
                        notifications.some(
                          (notification) =>
                            notification.notifyId === announce._id &&
                            notification.email === user.email
                        )
                          ? "text-gray-400"
                          : ""
                      }`}
                    >
                      <img
                        className={`flex-shrink-0 object-cover w-8 h-8 mx-1 rounded-full ${
                          notifications.some(
                            (notification) =>
                              notification.notifyId === announce._id &&
                              notification.email === user.email
                          )
                            ? "opacity-40"
                            : ""
                        }`}
                        src={announce.author.photo}
                        alt={announce.author.name}
                      />
                      <p className="mx-2 text-sm text-gray-600 dark:text-white">
                        <span
                          className={`font-bold ${
                            notifications.some(
                              (notification) =>
                                notification.notifyId === announce._id &&
                                notification.email === user.email
                            )
                              ? "opacity-70"
                              : ""
                          }`}
                        >
                          {announce.author.name}
                        </span>
                        <span
                          className={`ml-2 ${
                            notifications.some(
                              (notification) =>
                                notification.notifyId === announce._id &&
                                notification.email === user.email
                            )
                              ? "text-gray-400"
                              : ""
                          }`}
                        >
                          {announce.title.length > 20
                            ? `${announce.title.slice(0, 35)}...`
                            : announce.title}
                        </span>
                        <span className="ml-2 text-[12px] text-[#155E75] hover:text-[#194857] font-bold">
                          Read More
                        </span>
                      </p>
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="fixed inset-0 bg-black opacity-50"></div>
          <div className="relative bg-white rounded-lg shadow-lg z-40 p-6 w-11/12 md:w-1/3">
            <button
              className="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
              onClick={() => setModalOpen(false)}
            >
              ✕
            </button>
            {selectedAnnouncement && (
              <>
                <div className="flex justify-center mb-2">
                  <img
                    className="bg-[#90caf93a] p-5 rounded-full"
                    src="https://i.ibb.co/FDV0qT9/icons8-announcement-48.png"
                    alt="Announcement"
                  />
                </div>
                <h3 className="font-bold text-lg">
                  {selectedAnnouncement.title}
                </h3>
                <div className="mt-2">
                  <textarea
                    className="w-full h-[205px]"
                    readOnly
                    value={selectedAnnouncement.description}
                  />
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Notifications;
