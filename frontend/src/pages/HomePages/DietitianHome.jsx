import React from 'react';
import '/index.css';

const DietitianHome = () => {
    return (
        <main className="flex-1 py-20 px-4 md:px-8 text-center bg-gray-50">
            <h1 className="text-4xl font-bold text-[#1E6F5C] mb-4">Welcome to Your Dietitian Dashboard!</h1>
            <p className="text-lg text-gray-700 max-w-2xl mx-auto">
                Create nutrition plans, connect with clients, and manage your professional profile.
            </p>
        </main>
    );
};

export default DietitianHome;