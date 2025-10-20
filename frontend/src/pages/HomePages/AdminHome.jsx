import React from 'react';
import '/index.css';

const AdminHome = () => {
    return (
        <main className="flex-1 py-20 px-4 md:px-8 text-center bg-gray-50">
            <h1 className="text-4xl font-bold text-[#1E6F5C] mb-4">Welcome to the Admin Portal!</h1>
            <p className="text-lg text-gray-700 max-w-2xl mx-auto">
                Manage users, review documents, and oversee platform operations with ease.
            </p>
        </main>
    );
};

export default AdminHome;