import React from "react";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import CheckoutForm from "./CheckoutForm";

const stripePromise = loadStripe(import.meta.env.VITE_Payment_Gateway_PK);
const Payment = () => {
  return (
    <div>
      <div className="flex justify-center mt-20 px-3 my-40">
        <div class="w-full border max-w-md px-8 py-4 mt-16 bg-white rounded-lg shadow-lg dark:bg-gray-800">
          <h2 class="mt-2 pt-1 text-xl font-semibold text-gray-800 dark:text-white md:mt-0">
            Premium Subscription
          </h2>

          <Elements stripe={stripePromise}>
            <CheckoutForm></CheckoutForm>
          </Elements>
        </div>
      </div>
    </div>
  );
};

export default Payment;
