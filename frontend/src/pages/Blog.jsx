import React from 'react';
import '/index.css';

const BlogPage = () => {
    return (
        <main className="flex-1 py-20 px-4 md:px-8 text-center bg-gray-50">
            <h1 className="text-4xl font-bold text-[#1E6F5C] mb-4">Welcome to our Blog!</h1>
            <p className="text-lg text-gray-700 max-w-2xl mx-auto">
                Discover the latest articles on nutrition, health, and wellness.
            </p>
        </main>
    );
};

export default BlogPage;