
import { useEffect, useState } from 'react';
import { NavLink } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { logoutUser } from '../../authSlice';
import axiosClient from '../../utils/axiosClient';
import { leetcodeLogo } from '../../assets/images';

function ProblemPage() {
    const dispatch = useDispatch();
    const { isAuthenticated, user, authChecked } = useSelector((state) => state.auth);
    const [problems, setProblems] = useState([]);
    const [solvedProblems, setSolvedProblems] = useState([]);
    const [filters, setFilters] = useState({
        difficulty: 'all',
        tag: 'all',
        status: 'all'
    });
    const [searchQuery, setSearchQuery] = useState('');




    useEffect(() => {
        const fetchProblems = async () => {
            try {
                const { data } = await axiosClient.get('/problem/getAllProblem');
                setProblems(data);
            } catch (error) {
                console.error('Error fetching problems:', error);
            }
        };

        const fetchSolvedProblems = async () => {
            try {
                const { data } = await axiosClient.get('/problem/problemSolvedByUser');
                setSolvedProblems(data);
            } catch (error) {
                console.error('Error fetching solved problems:', error);
            }
        };

        fetchProblems();
        if (isAuthenticated && user) fetchSolvedProblems();
    }, [user, isAuthenticated , authChecked]);

    const handleLogout = () => {
        dispatch(logoutUser());
        setSolvedProblems([]);
    };

    const filteredProblems = problems.filter(problem => {
        const difficultyMatch = filters.difficulty === 'all' || problem.difficulty === filters.difficulty;
        const tagMatch = filters.tag === 'all' || problem.tags === filters.tag;
        const isSolved = solvedProblems.some(sp => sp._id === problem._id);
        const statusMatch = filters.status === 'all' ||
            (filters.status === 'solved' && isSolved) ||
            (filters.status === 'unsolved' && !isSolved);
        const searchMatch = problem.title.toLowerCase().includes(searchQuery.toLowerCase());
        return difficultyMatch && tagMatch && statusMatch && searchMatch;
    });

    // Add loading check
    if (!authChecked) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-pulse">Loading...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Navigation Bar */}
            <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        {/* Logo and Navigation */}
                        <div className="flex items-center h-16 space-x-8 overflow-hidden">
                            <NavLink to="/" className="flex items-center h-full">
                                <img
                                    src={leetcodeLogo}
                                    alt="LeetCode"
                                    className="h-full w-30 object-contain"
                                />
                            </NavLink>


                            <div className="hidden md:flex items-center space-x-1">
                                <NavLink to="https://leetcode.com/explore/" className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 rounded-md hover:bg-gray-100 transition-colors">
                                    Explore
                                </NavLink>
                                <NavLink to="/problems" className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 rounded-md hover:bg-gray-100 transition-colors">
                                    Problems
                                </NavLink>
                                <NavLink to="https://leetcode.com/discuss/" className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 rounded-md hover:bg-gray-100 transition-colors">
                                    Discuss
                                </NavLink>
                                <NavLink to="https://leetcode.com/contest/" className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 rounded-md hover:bg-gray-100 transition-colors">
                                    Contest
                                </NavLink>
                            </div>
                        </div>

                        {/* User Profile */}
                        <div className="flex items-center space-x-4">
                            <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                                </svg>
                            </button>

                            <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                                </svg>
                            </button>

                            {/* Only show dropdown if user exists */}
                            {user && (
                                <div className="dropdown dropdown-end">
                                    <div tabIndex={0} className="flex items-center space-x-3 cursor-pointer px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors">
                                        <div className="w-8 h-8 bg-linear-to-br from-orange-400 to-pink-500 rounded-full flex items-center justify-center shadow-sm">
                                            <span className="text-white font-bold text-sm">{user.firstName?.[0]?.toUpperCase()}</span>
                                        </div>
                                        <span className="hidden md:block text-sm font-medium text-gray-900">{user.firstName}</span>
                                        <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </div>
                                    <ul className="mt-2 p-2 shadow-xl menu dropdown-content bg-white rounded-lg w-56 border border-gray-200">
                                        <li className="mb-1">
                                            <NavLink to="/profile" className="flex items-center space-x-3 px-4 py-3 rounded-md hover:bg-gray-100 transition-colors">
                                                <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                </svg>
                                                <span className="text-gray-700 font-medium">Profile</span>
                                            </NavLink>
                                        </li>
                                        {user.role === 'admin' && (
                                            <li className="mb-1">
                                                <NavLink to="/admin_panel" className="flex items-center space-x-3 px-4 py-3 rounded-md hover:bg-gray-100 transition-colors">
                                                    <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                    </svg>
                                                    <span className="text-gray-700 font-medium">Admin Panel</span>
                                                </NavLink>
                                            </li>
                                        )}
                                        <li className="border-t border-gray-200 mt-2 pt-2">
                                            <button onClick={handleLogout} className="flex items-center space-x-3 px-4 py-3 rounded-md hover:bg-red-50 w-full transition-colors">
                                                <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                                </svg>
                                                <span className="text-red-600 font-medium">Logout</span>
                                            </button>
                                        </li>
                                    </ul>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Page Header */}
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-gray-900 mb-1">Problem Set</h1>
                    <p className="text-sm text-gray-600">Showing {filteredProblems.length} of {problems.length} problems</p>
                </div>

                {/* Filters Section */}
                <div className="bg-white rounded-lg border border-gray-200 p-5 mb-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                        {/* Search Bar */}
                        <div className="relative">
                            <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                            <input
                                type="text"
                                placeholder="Search questions"
                                className="w-full pl-9 pr-3 py-2.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>

                        {/* Status Filter */}
                        <select
                            className="px-3 py-2.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white cursor-pointer text-gray-700"
                            value={filters.status}
                            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                        >
                            <option value="all">All Status</option>
                            <option value="solved">Solved</option>
                        </select>

                        {/* Difficulty Filter */}
                        <select
                            className="px-3 py-2.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white cursor-pointer text-gray-700"
                            value={filters.difficulty}
                            onChange={(e) => setFilters({ ...filters, difficulty: e.target.value })}
                        >
                            <option value="all">All Difficulties</option>
                            <option value="Easy">Easy</option>
                            <option value="Medium">Medium</option>
                            <option value="Hard">Hard</option>
                        </select>

                        {/* Tags Filter */}
                        <select
                            className="px-3 py-2.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white cursor-pointer text-gray-700"
                            value={filters.tag}
                            onChange={(e) => setFilters({ ...filters, tag: e.target.value })}
                        >
                            <option value="all">All Tags</option>
                            <option value="array">Array</option>
                            <option value="linkedList">Linked List</option>
                            <option value="graph">Graph</option>
                            <option value="dp">Dynamic Programming</option>
                        </select>
                    </div>
                </div>

                {/* Problems Table */}
                <div className="bg-white rounded-lg border border-gray-200 overflow-hidden mb-6">
                    {/* Table Header */}
                    <div className="grid grid-cols-12 gap-4 px-5 py-3 bg-gray-50 border-b border-gray-200">
                        <div className="col-span-6 text-xs font-semibold text-gray-600 uppercase tracking-wider">Title</div>
                        <div className="col-span-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Tags</div>
                        <div className="col-span-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Difficulty</div>
                    </div>

                    {/* Table Body */}
                    {filteredProblems.length === 0 ? (
                        <div className="px-5 py-16 text-center">
                            <svg className="w-12 h-12 text-gray-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <p className="text-sm text-gray-500">No problems found matching your filters.</p>
                        </div>
                    ) : (
                        <div className="divide-y divide-gray-200">
                            {filteredProblems.map((problem) => {
                                const isSolved = solvedProblems.some(sp => sp._id === problem._id);
                                return (
                                    <div
                                        key={problem._id}
                                        className="grid grid-cols-12 gap-4 px-5 py-3.5 hover:bg-gray-50 transition-colors"
                                    >
                                        {/* Title with Status */}
                                        <div className="col-span-6 flex items-center gap-3">
                                            {isSolved ? (
                                                <svg className="w-4 h-4 text-green-600 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                </svg>
                                            ) : (
                                                <div className="w-4 h-4 border-2 border-gray-300 rounded-full shrink-0"></div>
                                            )}
                                            <NavLink
                                                to={`/problem/${problem._id}`}
                                                className="text-sm text-gray-800 hover:text-blue-600 transition-colors font-medium truncate"
                                            >
                                                {problem.title}
                                            </NavLink>
                                        </div>

                                        {/* Tags */}
                                        <div className="col-span-3 flex items-center gap-1">
                                            <span className="px-2.5 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                                                {`${problem.tags} `}
                                            </span>
                                        </div>

                                        {/* Difficulty */}
                                        <div className="col-span-3 flex items-center">
                                            <span className={`text-sm font-medium ${getDifficultyTextColor(problem.difficulty)}`}>
                                                {problem.difficulty}
                                            </span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>


            </div>
        </div>
    );
}

const getDifficultyTextColor = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
        case 'easy':
            return 'text-green-600';
        case 'medium':
            return 'text-yellow-600';
        case 'hard':
            return 'text-red-600';
        default:
            return 'text-gray-600';
    }
};

export default ProblemPage;