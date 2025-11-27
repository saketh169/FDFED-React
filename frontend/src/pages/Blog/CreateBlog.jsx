import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { Editor } from '@tinymce/tinymce-react';
import axios from 'axios';
import { FaArrowLeft, FaSave, FaImage } from 'react-icons/fa';
import SubscriptionAlert from '../../middleware/SubscriptionAlert';

const CreateBlog = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { id } = useParams(); // For edit mode
    const editorRef = useRef(null);
    
    // Get role from URL path
    const getRoleFromPath = () => {
        const path = location.pathname;
        if (path.startsWith('/user')) return 'user';
        if (path.startsWith('/dietitian')) return 'dietitian';
        if (path.startsWith('/organization')) return 'organization';
        if (path.startsWith('/admin')) return 'admin';
        if (path.startsWith('/corporatepartner')) return 'corporatepartner';
        return 'user'; // fallback
    };
    
    const [formData, setFormData] = useState({
        title: '',
        content: '',
        category: '',
        tags: '',
        excerpt: ''
    });
    const [featuredImage, setFeaturedImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [isEditMode, setIsEditMode] = useState(false);
    const [showSubscriptionAlert, setShowSubscriptionAlert] = useState(false);
    const [subscriptionAlertData, setSubscriptionAlertData] = useState({});

    useEffect(() => {
        // Scroll to top when component mounts
        window.scrollTo(0, 0);
        
        console.log('CreateBlog - id from params:', id);
        console.log('CreateBlog - isEditMode:', !!id);
        
        fetchCategories();
        
        // If id exists, fetch blog data for editing
        if (id) {
            setIsEditMode(true);
            fetchBlogData();
        }
    }, [id]);

    const getAuthToken = () => {
        // Get the current role from URL and use ONLY that token
        const currentRole = getRoleFromPath();
        const token = localStorage.getItem(`authToken_${currentRole}`);
        return token;
    };

    const fetchCategories = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/blogs/categories');
            if (response.data.success) {
                setCategories(response.data.categories);
                if (!isEditMode && response.data.categories.length > 0) {
                    setFormData(prev => ({ ...prev, category: response.data.categories[0] }));
                }
            }
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    const fetchBlogData = async () => {
        try {
            const token = getAuthToken();
            const response = await axios.get(`http://localhost:5000/api/blogs/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            if (response.data.success) {
                const blog = response.data.blog;
                setFormData({
                    title: blog.title,
                    content: blog.content,
                    category: blog.category,
                    tags: blog.tags.join(', '),
                    excerpt: blog.excerpt || ''
                });
                
                if (blog.featuredImage?.url) {
                    setImagePreview(blog.featuredImage.url);
                }
            }
        } catch (error) {
            console.error('Error fetching blog:', error);
            setError('Failed to load blog data');
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                setError('Image size should be less than 5MB');
                return;
            }
            
            setFeaturedImage(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // Validation
        if (!formData.title.trim()) {
            setError('Title is required');
            return;
        }

        if (editorRef.current) {
            const content = editorRef.current.getContent();
            if (!content || content.trim().length < 50) {
                setError('Content must be at least 50 characters');
                return;
            }
            formData.content = content;
        }

        if (!formData.category) {
            setError('Please select a category');
            return;
        }

        try {
            setLoading(true);
            const token = getAuthToken();
            
            if (!token) {
                setError('You must be logged in to create a blog post');
                setLoading(false);
                return;
            }
            
            console.log('Token found:', token ? 'Yes' : 'No');
            
            const submitData = new FormData();
            submitData.append('title', formData.title);
            submitData.append('content', formData.content);
            submitData.append('category', formData.category);
            submitData.append('tags', formData.tags);
            submitData.append('excerpt', formData.excerpt);
            
            if (featuredImage) {
                submitData.append('featuredImage', featuredImage);
            }

            let response;
            console.log('Submitting - isEditMode:', isEditMode, 'id:', id);
            if (isEditMode) {
                response = await axios.put(
                    `http://localhost:5000/api/blogs/${id}`,
                    submitData,
                    {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'multipart/form-data'
                        }
                    }
                );
            } else {
                response = await axios.post(
                    'http://localhost:5000/api/blogs',
                    submitData,
                    {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'multipart/form-data'
                        }
                    }
                );
            }

            if (response.data.success) {
                // Get user role from URL path to navigate to correct route
                const userRole = getRoleFromPath();
                navigate(`/${userRole}/blog/${response.data.blog._id}`);
            }
        } catch (error) {
            console.error('Error submitting blog:', error);
            console.error('Error response:', error.response?.data);
            console.error('Error status:', error.response?.status);
            
            // Check if it's a subscription limit error
            if (error.response?.data?.limitReached) {
                const errorData = error.response.data;
                setShowSubscriptionAlert(true);
                setSubscriptionAlertData({
                    message: errorData.message,
                    planType: errorData.planType || 'free',
                    limitType: 'blog',
                    currentCount: errorData.currentCount || 0,
                    limit: errorData.limit || 0
                });
            } else {
                setError(error.response?.data?.message || 'Failed to submit blog post');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-linear-to-b from-green-50 to-white py-8">
            <div className="max-w-5xl mx-auto px-4">
                {/* Header */}
                <div className="mb-8">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 text-[#1E6F5C] hover:text-green-700 mb-4 font-medium"
                    >
                        <FaArrowLeft /> Back
                    </button>
                    <h1 className="text-4xl font-bold text-gray-800">
                        {isEditMode ? 'Edit Blog Post' : 'Create New Blog Post'}
                    </h1>
                    <p className="text-gray-600 mt-2">Share your knowledge with the community</p>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
                        {error}
                    </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 space-y-6">
                    {/* Title */}
                    <div>
                        <label className="block text-gray-700 font-semibold mb-2">
                            Title <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleInputChange}
                            placeholder="Enter an engaging title..."
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E6F5C]"
                            maxLength="200"
                        />
                        <p className="text-sm text-gray-500 mt-1">{formData.title.length}/200 characters</p>
                    </div>

                    {/* Category */}
                    <div>
                        <label className="block text-gray-700 font-semibold mb-2">
                            Category <span className="text-red-500">*</span>
                        </label>
                        <select
                            name="category"
                            value={formData.category}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E6F5C]"
                        >
                            <option value="">Select a category</option>
                            {categories.map((cat) => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                    </div>

                    {/* Featured Image */}
                    <div>
                        <label className="block text-gray-700 font-semibold mb-2">
                            Featured Image
                        </label>
                        <div className="flex items-center gap-4">
                            <label className="cursor-pointer bg-[#1E6F5C] text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors inline-flex items-center gap-2">
                                <FaImage /> Choose Image
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="hidden"
                                />
                            </label>
                            <span className="text-sm text-gray-500">Max size: 5MB</span>
                        </div>
                        
                        {imagePreview && (
                            <div className="mt-4">
                                <img
                                    src={imagePreview}
                                    alt="Preview"
                                    className="w-full max-w-md h-48 object-cover rounded-lg border border-gray-300"
                                />
                            </div>
                        )}
                    </div>

                    {/* Content Editor */}
                    <div>
                        <label className="block text-gray-700 font-semibold mb-2">
                            Content <span className="text-red-500">*</span>
                        </label>
                        <Editor
                            apiKey={import.meta.env.VITE_TINYMCE_API_KEY}
                            onInit={(evt, editor) => editorRef.current = editor}
                            value={formData.content}
                            onEditorChange={(content) => setFormData({ ...formData, content })}
                            init={{
                                height: 500,
                                menubar: true,
                                plugins: [
                                    'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
                                    'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                                    'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'
                                ],
                                toolbar: 'undo redo | blocks | ' +
                                    'bold italic forecolor | alignleft aligncenter ' +
                                    'alignright alignjustify | bullist numlist outdent indent | ' +
                                    'removeformat | help',
                                content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
                                placeholder: 'Write your blog content here...'
                            }}
                        />
                    </div>

                    {/* Excerpt */}
                    <div>
                        <label className="block text-gray-700 font-semibold mb-2">
                            Excerpt (Optional)
                        </label>
                        <textarea
                            name="excerpt"
                            value={formData.excerpt}
                            onChange={handleInputChange}
                            placeholder="Brief summary of your blog post..."
                            rows="3"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E6F5C]"
                            maxLength="300"
                        />
                        <p className="text-sm text-gray-500 mt-1">{formData.excerpt.length}/300 characters</p>
                    </div>

                    {/* Tags */}
                    <div>
                        <label className="block text-gray-700 font-semibold mb-2">
                            Tags (Optional)
                        </label>
                        <input
                            type="text"
                            name="tags"
                            value={formData.tags}
                            onChange={handleInputChange}
                            placeholder="Enter tags separated by commas (e.g., healthy eating, diet, nutrition)"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E6F5C]"
                        />
                        <p className="text-sm text-gray-500 mt-1">Separate tags with commas</p>
                    </div>

                    {/* Submit Buttons */}
                    <div className="flex items-center gap-4 pt-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-[#1E6F5C] text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed inline-flex items-center gap-2"
                        >
                            <FaSave />
                            {loading ? 'Publishing...' : (isEditMode ? 'Update Post' : 'Publish Post')}
                        </button>
                        <button
                            type="button"
                            onClick={() => navigate(-1)}
                            className="bg-gray-200 text-gray-700 px-8 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>

            {/* Subscription Alert Modal */}
            {showSubscriptionAlert && (
                <SubscriptionAlert
                    message={subscriptionAlertData.message}
                    planType={subscriptionAlertData.planType}
                    limitType={subscriptionAlertData.limitType}
                    currentCount={subscriptionAlertData.currentCount}
                    limit={subscriptionAlertData.limit}
                    onClose={() => setShowSubscriptionAlert(false)}
                />
            )}
        </div>
    );
};

export default CreateBlog;
