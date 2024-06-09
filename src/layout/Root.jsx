import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../shared/Navbar';
import { Toaster } from 'react-hot-toast';
import Footer from '../shared/Footer';

const Root = () => {
    return (
        <div className="max-w-[1920px] mx-auto text-black text-[15px]">
            <Toaster />
            <Navbar></Navbar>
            <Outlet></Outlet>
            <div><Footer></Footer></div>
        </div>
    );
};

export default Root;