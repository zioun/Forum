import { useQuery } from "@tanstack/react-query";
import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../providers/AuthProvider";
import useAxiosPublic from "../../hooks/useAxiosPublic";
import { Helmet } from "react-helmet";

const Membership = () => {
  const { user } = useContext(AuthContext);
  const axiosPublic = useAxiosPublic();
  const { data: userData = [] } = useQuery({
    queryKey: ["payments"],
    queryFn: async () => {
      const { data } = await axiosPublic.get(`/payments`);
      return data;
    },
  });

  const hasPaid = userData.some((item) => item.email === user?.email);
  return (
    <div className="px-3">
      <Helmet><title>Barta - Membership</title></Helmet>
      {!hasPaid ? (
        <div className="flex justify-center my-40">
          <div class="w-full border max-w-md px-8 py-4 mt-16 bg-white rounded-lg shadow-lg dark:bg-gray-800">
            <div class="flex justify-center -mt-16 md:justify-end ">
              <img
                class=" w-14 h-20 dark:border-blue-400 "
                alt="Testimonial avatar"
                src="https://i.ibb.co/ZmvjVWS/gold-silver-bronze-medal-badge-and-trophy-with-red-ribbon-flat-illustration-vector-3-removebg-previe.png"
              />
            </div>

            <h2 class="mt-2 text-xl font-semibold text-gray-800 dark:text-white md:mt-0">
              Premium Subscription $10
            </h2>

            <p class="mt-2 text-sm text-gray-600 dark:text-gray-200">
            Could you provide more details about your subscription service? For example, what does it offer, who is it for, and any key features or benefits? The more details you provide, the better I can tailor the description.
            </p>

            <div class="flex justify-end mt-4">
              <Link to={"/payment"}>
                <span
                  href="#"
                  class="text-lg font-medium text-blue-600 dark:text-blue-300"
                  tabindex="0"
                  role="link"
                >
                  Subscribe
                </span>
              </Link>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex justify-center my-40">
          <div class="w-full border max-w-md px-8 py-4 mt-16 bg-white rounded-lg shadow-lg dark:bg-gray-800">
            <div class="flex justify-center -mt-16 md:justify-end ">
              <img
                class=" w-14 h-20 dark:border-blue-400 "
                alt="Testimonial avatar"
                src="https://i.ibb.co/ZmvjVWS/gold-silver-bronze-medal-badge-and-trophy-with-red-ribbon-flat-illustration-vector-3-removebg-previe.png"
              />
            </div>

            <h2 class="mt-2 text-xl font-semibold text-gray-800 dark:text-white md:mt-0">
              Thanks For Subscription
            </h2>

            <p class="mt-2 text-sm text-gray-600 dark:text-gray-200">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Quae
              dolores deserunt ea doloremque natus error, rerum quas odio
              quaerat nam ex commodi hic, suscipit in a veritatis pariatur minus
              consequuntur!
            </p>
            <div class="flex justify-end mt-4"></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Membership;
