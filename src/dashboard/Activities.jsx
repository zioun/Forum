import React, { useContext } from "react";
import { AuthContext } from "../providers/AuthProvider";
import { useQuery } from "@tanstack/react-query";
import useAxiosPublic from "../hooks/useAxiosPublic";

const Activities = () => {
  const { user } = useContext(AuthContext);
  const axiosPublic = useAxiosPublic();
  const { data: reports = [] } = useQuery({
    queryKey: ["reports"],
    queryFn: async () => {
      const { data } = await axiosPublic.get(`/reports`);
      const sortedData = data.sort(
        (a, b) => new Date(b.date) - new Date(a.date)
      );
      return sortedData;
    },
  });

  console.log(reports);

  return (
    <div className="mt-5">
      <div className="max-w-[1000px] max-h-[590px] overflow-x-auto px-8 py-4 bg-white rounded-lg shadow-md dark:bg-gray-800 border relative">
        <div className="font-sans overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-100 whitespace-nowrap">
              <tr>
                <th className="px-4 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Commenter
                </th>
                <th className="px-4 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Comment
                </th>
                <th className="px-4 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Feedback
                </th>
                <th className="px-4 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Delete
                </th>
              </tr>
            </thead>

            <tbody className="bg-white divide-y divide-gray-200 whitespace-nowrap">
              {reports.map((report) => (
                <tr key={report._id}>
                  <td className="px-4 py-4 text-sm text-gray-800 flex items-center gap-3">
                    <img
                      className="w-[50px] object-cover rounded-full"
                      src={report.commenter.photo}
                      alt=""
                    />
                    <div>
                      <h1 className="font-bold">{report.commenter.name}</h1>
                      <p>{report.commenter.email}</p>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-800">
                    <textarea className="border p-2" name="" id="" readOnly>
                      {report.comment}
                    </textarea>
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-800">
                      {report.feedback}
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-800">
                    <span className="badge bg-[#751515] text-white">
                      <button>Delete</button>
                    </span>
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

export default Activities;
