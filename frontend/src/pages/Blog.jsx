import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import moment from 'moment';
import { FaHeart, FaComment, FaEye, FaSearch, FaPlus } from 'react-icons/fa';

const BlogPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState('createdAt');
    const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userRole, setUserRole] = useState(null);

    // Get role from URL path
    const getRoleFromPath = () => {
        const path = location.pathname;
        if (path.startsWith('/user')) return 'user';
        if (path.startsWith('/dietitian')) return 'dietitian';
        if (path.startsWith('/organization')) return 'organization';
        if (path.startsWith('/admin')) return 'admin';
        if (path.startsWith('/corporatepartner')) return 'corporatepartner';
        return null;
    };

    useEffect(() => {
        // Scroll to top when component mounts
        window.scrollTo(0, 0);
        
        // Get role from URL
        const roleFromUrl = getRoleFromPath();
        
        // Check if user is authenticated for THIS specific role only
        const token = roleFromUrl ? localStorage.getItem(`authToken_${roleFromUrl}`) : null;
        
        if (token) {
            setIsAuthenticated(true);
        } else {
            setIsAuthenticated(false);
        }
        
        // Set role from URL path
        setUserRole(roleFromUrl);
        
        fetchCategories();
        fetchBlogs();
    }, [selectedCategory, searchQuery, sortBy, pagination.page, location.pathname]);

    const fetchCategories = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/blogs/categories');
            if (response.data.success) {
                setCategories(response.data.categories);
            }
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    const fetchBlogs = async () => {
        try {
            setLoading(true);
            // Get the current role from URL and use ONLY that token
            const currentRole = getRoleFromPath();
            const token = currentRole ? localStorage.getItem(`authToken_${currentRole}`) : null;
            
            const config = token ? {
                headers: { Authorization: `Bearer ${token}` }
            } : {};

            const params = {
                page: pagination.page,
                limit: 9,
                sortBy,
                order: 'desc'
            };

            if (selectedCategory !== 'all') {
                params.category = selectedCategory;
            }

            if (searchQuery) {
                params.search = searchQuery;
            }

            const response = await axios.get('http://localhost:5000/api/blogs', { ...config, params });
            
            if (response.data.success) {
                setBlogs(response.data.blogs);
                setPagination(response.data.pagination);
            }
        } catch (error) {
            console.error('Error fetching blogs:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        setPagination({ ...pagination, page: 1 });
        fetchBlogs();
    };

    const getCategoryColor = (category) => {
        const colors = {
            'Nutrition Tips': 'bg-green-100 text-green-800',
            'Weight Management': 'bg-blue-100 text-blue-800',
            'Healthy Recipes': 'bg-yellow-100 text-yellow-800',
            'Fitness & Exercise': 'bg-red-100 text-red-800',
            'Mental Health & Wellness': 'bg-purple-100 text-purple-800',
            'Disease Management': 'bg-orange-100 text-orange-800'
        };
        return colors[category] || 'bg-gray-100 text-gray-800';
    };

    const getRoleBadgeColor = (role) => {
        return role === 'dietitian' 
            ? 'bg-[#1E6F5C] text-white' 
            : 'bg-[#E8B86D] text-gray-800';
    };

    const getRoleLabel = (role) => {
        const roleLabels = {
            'user': 'Client',
            'dietitian': 'Dietitian',
            'admin': 'Admin',
            'organization': 'Organization',
            'corporatepartner': 'Corporate Partner'
        };
        return roleLabels[role] || 'Unknown';
    };

    const stripHtmlTags = (html) => {
        const tmp = document.createElement('DIV');
        tmp.innerHTML = html;
        return tmp.textContent || tmp.innerText || '';
    };

    return (
        <div className="min-h-screen bg-linear-to-b from-green-50 to-white">
            {/* Header Section */}
            <div className="bg-[#1E6F5C] text-white py-16 px-4">
                <div className="max-w-7xl mx-auto">
                    <h1 className="text-5xl font-bold mb-4 text-center">Nutrition & Wellness Blog</h1>
                    <p className="text-xl text-center mb-8 text-green-100">
                        Discover insights, tips, and stories from our community
                    </p>
                    
                    {/* Create Blog Button */}
                    {isAuthenticated && (userRole === 'user' || userRole === 'dietitian') && (
                        <div className="text-center">
                            <button
                                onClick={() => {
                                    // Navigate to create blog within the same role context
                                    navigate(`/${userRole}/create-blog`);
                                }}
                                className="bg-white text-[#1E6F5C] px-6 py-3 rounded-lg font-semibold hover:bg-green-50 transition-colors duration-300 inline-flex items-center gap-2"
                            >
                                <FaPlus /> Create New Blog Post
                            </button>
                        </div>
                    )}
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-8">
                {/* Search and Filter Section */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Search Bar */}
                        <form onSubmit={handleSearch} className="md:col-span-2">
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Search blogs..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E6F5C]"
                                />
                                <button
                                    type="submit"
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#1E6F5C] hover:text-green-700"
                                >
                                    <FaSearch size={20} />
                                </button>
                            </div>
                        </form>

                        {/* Sort By */}
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E6F5C]"
                        >
                            <option value="createdAt">Latest</option>
                            <option value="views">Most Viewed</option>
                            <option value="likesCount">Most Liked</option>
                            <option value="commentsCount">Most Commented</option>
                        </select>
                    </div>

                    {/* Category Filter */}
                    <div className="mt-4 flex flex-wrap gap-2">
                        <button
                            onClick={() => setSelectedCategory('all')}
                            className={`px-4 py-2 rounded-full font-medium transition-colors ${
                                selectedCategory === 'all'
                                    ? 'bg-[#1E6F5C] text-white'
                                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }`}
                        >
                            All Categories
                        </button>
                        {categories.map((category) => (
                            <button
                                key={category}
                                onClick={() => setSelectedCategory(category)}
                                className={`px-4 py-2 rounded-full font-medium transition-colors ${
                                    selectedCategory === category
                                        ? 'bg-[#1E6F5C] text-white'
                                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                }`}
                            >
                                {category}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Blog Grid */}
                {loading ? (
                    <div className="text-center py-20">
                        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#1E6F5C]"></div>
                        <p className="mt-4 text-gray-600">Loading blogs...</p>
                    </div>
                ) : blogs.length === 0 ? (
                    <div className="text-center py-20">
                        <p className="text-xl text-gray-600">No blogs found</p>
                        <p className="text-gray-500 mt-2">Try adjusting your search or filters</p>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {blogs.map((blog) => (
                                <div
                                    key={blog._id}
                                    className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 cursor-pointer"
                                    onClick={() => {
                                        // Navigate to blog post within the same role context
                                        if (userRole) {
                                            navigate(`/${userRole}/blog/${blog._id}`);
                                        } else {
                                            // Fallback to /blog for public access
                                            navigate(`/blog/${blog._id}`);
                                        }
                                    }}
                                >
                                    {/* Featured Image */}
                                    {blog.featuredImage?.url ? (
                                        <img
                                            src={blog.featuredImage.url}
                                            alt={blog.title}
                                            className="w-full h-48 object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-48 bg-linear-to-br from-[#1E6F5C] to-[#289672] flex items-center justify-center">
                                            <span className="text-white text-4xl font-bold">
                                                {blog.title.charAt(0)}
                                            </span>
                                        </div>
                                    )}

                                    <div className="p-5">
                                        {/* Category and Role Badge */}
                                        <div className="flex items-center justify-between mb-3">
                                            <span className={`text-xs px-3 py-1 rounded-full font-semibold ${getCategoryColor(blog.category)}`}>
                                                {blog.category}
                                            </span>
                                            <span className={`text-xs px-3 py-1 rounded-full font-semibold ${getRoleBadgeColor(blog.author.role)}`}>
                                                {getRoleLabel(blog.author.role)}
                                            </span>
                                        </div>

                                        {/* Title */}
                                        <h3 className="text-xl font-bold text-gray-800 mb-2 line-clamp-2">
                                            {blog.title}
                                        </h3>

                                        {/* Excerpt */}
                                        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                                            {blog.excerpt || stripHtmlTags(blog.content).substring(0, 150) + '...'}
                                        </p>

                                        {/* Author and Date */}
                                        <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                                            <span className="font-medium">{blog.author.name}</span>
                                            <span>{moment(blog.createdAt).format('MMM DD, YYYY')}</span>
                                        </div>

                                        {/* Stats */}
                                        <div className="flex items-center gap-4 text-sm text-gray-600 pt-3 border-t border-gray-200">
                                            <span className="flex items-center gap-1">
                                                <FaHeart className="text-red-500" /> {blog.likesCount || 0}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <FaComment className="text-blue-500" /> {blog.commentsCount || 0}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <FaEye className="text-gray-500" /> {blog.views || 0}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Pagination */}
                        {pagination.pages > 1 && (
                            <div className="flex justify-center items-center gap-2 mt-8">
                                <button
                                    onClick={() => setPagination({ ...pagination, page: pagination.page - 1 })}
                                    disabled={pagination.page === 1}
                                    className="px-4 py-2 bg-[#1E6F5C] text-white rounded-lg disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-green-700 transition-colors"
                                >
                                    Previous
                                </button>
                                <span className="text-gray-600">
                                    Page {pagination.page} of {pagination.pages}
                                </span>
                                <button
                                    onClick={() => setPagination({ ...pagination, page: pagination.page + 1 })}
                                    disabled={pagination.page === pagination.pages}
                                    className="px-4 py-2 bg-[#1E6F5C] text-white rounded-lg disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-green-700 transition-colors"
                                >
                                    Next
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default BlogPage;