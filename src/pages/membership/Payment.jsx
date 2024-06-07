import React from 'react';
import {Elements} from "@stripe/react-stripe-js"
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe("");
const Payment = () => {
    return (
        <div>
            <Elements stripe={stripePromise}>
                
            </Elements>
        </div>
    );
};

export default Payment;