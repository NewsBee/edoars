"use client"

import React from 'react';
import { useRouter } from 'next/navigation';
import { FaLock } from 'react-icons/fa';




const Unauthorized = () => {
    const router = useRouter();

    const handleGoBack = () => {
        router.back();
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white p-10 rounded-lg shadow-lg text-center max-w-md">
                <FaLock className="text-red-500 text-6xl mx-auto mb-6" />
                <h1 className="text-3xl font-semibold text-gray-800">Access Denied</h1>
                <p className="mt-4 text-gray-600">
                    Sorry, you don't have permission to view this page.
                </p>
                <button
                    onClick={handleGoBack}
                    className="mt-6 px-5 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-300"
                >
                    Go Back
                </button>
            </div>
        </div>
    );
};

export default Unauthorized;