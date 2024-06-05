import React, { useState } from "react";
import useAxiosPublic from "../hooks/useAxiosPublic";
import { useQuery } from "@tanstack/react-query";

const Notifications = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);
  const axiosPublic = useAxiosPublic();

  const {
    data: announcements,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["announcement"],
    queryFn: async () => {
      const { data } = await axiosPublic.get(`/announcement`);
      console.log("Fetched announcement data:", data);
      return data;
    },
  });

  const handleAnnouncementClick = (announce) => {
    setSelectedAnnouncement(announce);
    setModalOpen(true);
    setIsOpen(false); // Close the notifications dropdown
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div>
      <div className="flex">
        <div className="relative inline-block">
          {/* Dropdown toggle button */}
          <div className="flex">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="relative z-10 block text-gray-700 bg-white border border-transparent rounded-md dark:text-white focus:border-blue-500 focus:ring-opacity-40 dark:focus:ring-opacity-40 focus:ring-blue-300 dark:focus:ring-blue-400 focus:ring dark:bg-gray-800 focus:outline-none"
            >
              notifications
            </button>
            <div className="h-[5px] w-[5px] bg-[#155E75]"></div>
          </div>

          {/* Dropdown menu */}
          {isOpen && (
            <div className="absolute right-0 z-20 w-64 mt-2 overflow-hidden origin-top-right bg-white rounded-md shadow-lg sm:w-80 dark:bg-gray-800 border">
              <div className="py-2 max-h-[230px] overflow-y-auto overflow-x-hidden">
                {announcements.map((announce) => (
                  <div
                    key={announce._id}
                    onClick={() => handleAnnouncementClick(announce)}
                  >
                    <a
                      href="#"
                      className="flex items-center px-4 py-3 -mx-2 transition-colors duration-300 transform border-b border-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700 dark:border-gray-700"
                    >
                      <img
                        className="flex-shrink-0 object-cover w-8 h-8 mx-1 rounded-full"
                        src={announce.author.photo}
                        alt={announce.author.name}
                      />
                      <p className="mx-2 text-sm text-gray-600 dark:text-white">
                        <span className="font-bold">
                          {announce.author.name}
                        </span>
                        <span className="ml-2">
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
              className="absolute top-2 right-2 btn btn-sm btn-circle btn-ghost"
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
                    alt=""
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
