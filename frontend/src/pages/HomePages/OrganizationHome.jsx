import React from 'react';
import '/index.css';

const OrganizationHome = () => {
    return (
        <main className="flex-1 py-20 px-4 md:px-8 text-center bg-gray-50">
            <h1 className="text-4xl font-bold text-[#1E6F5C] mb-4">Welcome to Your Organization Portal!</h1>
            <p className="text-lg text-gray-700 max-w-2xl mx-auto">
                Manage certifications, collaborate with dietitians, and access organizational resources.
            </p>
        </main>
    );
};

export default OrganizationHome;