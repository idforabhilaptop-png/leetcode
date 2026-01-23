import React, { useState, useEffect, useMemo } from 'react';
import { Layers, Zap, Flame, Leaf, Code2, Pencil, Trash, Loader2 } from 'lucide-react';
import axiosClient from '../../utils/axiosClient';
import { useNavigate } from 'react-router';

const AdminUpdateDelete = () => {
    const [problems, setProblems] = useState([]);
    const [loading, setLoading] = useState(true);
    // eslint-disable-next-line no-unused-vars
    const [isDeleting, setIsDeleting] = useState(null);
    // eslint-disable-next-line no-unused-vars
    const [isUpdating, setIsUpdating] = useState(null)
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [difficultyFilter, setDifficultyFilter] = useState('All');

    // Simulated API call

    const navigate = useNavigate();
    const handleCreateProblem = () => {
        navigate('/admin_panel/create-problem');
    };

    const handleUpdate = async (id) => {
        try {
            navigate(`/admin_panel/update/${id}`)
        } catch (err) {
            setError('Failed to Update problem');
            console.error(err);
        }
    }


    useEffect(() => {
        fetchProblems();
    }, []);

    const fetchProblems = async () => {
        try {
            setLoading(true);
            const { data } = await axiosClient.get('/problem/getAllProblem');
            setProblems(data);
        } catch (err) {
            setError('Failed to fetch problems');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this problem?')) return;

        try {
            await axiosClient.delete(`/problem/delete/${id}`);
            setProblems(problems.filter(problem => problem._id !== id));
        } catch (err) {
            setError('Failed to delete problem');
            console.error(err);
        }
    };



    const filteredProblems = useMemo(() => {
        return problems.filter(p => {
            const searchStr = (p.title + p.tags.join(' ') + p.description).toLowerCase();
            const matchesSearch = searchStr.includes(searchQuery.toLowerCase());
            const matchesDifficulty = difficultyFilter === 'All' || p.difficulty === difficultyFilter;
            return matchesSearch && matchesDifficulty;
        });
    }, [problems, searchQuery, difficultyFilter]);

    const stats = useMemo(() => ({
        total: problems.length,
        easy: problems.filter(p => p.difficulty === 'Easy').length,
        medium: problems.filter(p => p.difficulty === 'Medium').length,
        hard: problems.filter(p => p.difficulty === 'Hard').length,
    }), [problems]);

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
                <div className="w-12 h-12 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin mb-4"></div>
                <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Syncing Records...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#F8FAFC] font-sans">
            {/* Navigation */}
            <nav className="bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm shadow-blue-900/5">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/30">
                            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/30 transition-transform hover:scale-105">
                                <Code2 size={22} strokeWidth={2.5} className="text-white" />
                            </div>

                        </div>
                        <div>
                            <h2 className="text-lg font-black text-gray-900 tracking-tight uppercase">Admin<span className="text-blue-600">Hub</span></h2>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Inventory Control</p>
                        </div>
                    </div>
                    <div className="flex items-center space-x-6">
                        <div className="hidden sm:block text-right">
                            <p className="text-xs font-bold text-gray-900">Platform Admin</p>
                            <p className="text-[10px] font-medium text-green-500">System Live</p>
                        </div>
                    </div>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                {error && (
                    <div className="mb-8 p-4 bg-rose-50 border border-rose-100 rounded-2xl flex items-center text-rose-600">
                        <i className="fa-solid fa-circle-exclamation mr-3 text-lg"></i>
                        <p className="text-sm font-bold">{error}</p>
                        <button onClick={() => setError(null)} className="ml-auto p-1 hover:bg-rose-100 rounded-lg">
                            <i className="fa-solid fa-xmark"></i>
                        </button>
                    </div>
                )}

                {/* Header Section */}
                <div className="mb-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                    <div>
                        <h1 className="text-4xl font-black text-gray-900 tracking-tight mb-2">Challenge Library</h1>
                        <p className="text-gray-500 font-medium">Audit and manage technical assessment content.</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button onClick={fetchProblems} className="px-5 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-50 transition-all flex items-center space-x-2 shadow-sm active:scale-95">
                            <i className="fa-solid fa-arrows-rotate"></i>
                            <span>Refresh</span>
                        </button>
                        <button onClick={handleCreateProblem} className="px-5 py-2.5 bg-blue-600 rounded-xl text-sm font-bold text-white hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20 flex items-center space-x-2 active:scale-95">
                            <i className="fa-solid fa-plus"></i>
                            <span>New Problem</span>
                        </button>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                    {[
                        { label: 'Total Items', value: stats.total, icon: Layers, color: 'bg-slate-800' },
                        { label: 'Easy Tier', value: stats.easy, icon: Leaf, color: 'bg-emerald-500' },
                        { label: 'Standard Tier', value: stats.medium, icon: Zap, color: 'bg-amber-500' },
                        { label: 'Complex Tier', value: stats.hard, icon: Flame, color: 'bg-rose-500' }
                    ].map((stat, i) => {
                        const Icon = stat.icon;
                        return (
                            <div
                                key={i}
                                className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center space-x-4 transition-all hover:shadow-md hover:-translate-y-1"
                            >
                                <div className={`${stat.color} w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-lg shadow-current/20`}>
                                    <Icon size={22} strokeWidth={2.5} />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{stat.label}</p>
                                    <p className="text-2xl font-black text-gray-800">{stat.value}</p>
                                </div>
                            </div>
                        );
                    })}

                </div>

                {/* Controls Bar */}
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 mb-8">
                    <div className="flex flex-col md:flex-row gap-6 items-center">
                        <div className="relative flex-1 w-full">
                            <i className="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
                            <input
                                type="text"
                                placeholder="Search by title, tags, or description..."
                                className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-gray-50/50 border border-gray-100 focus:outline-none focus:ring-4 focus:ring-blue-100 focus:bg-white focus:border-blue-400 transition-all text-sm font-medium placeholder:text-gray-400 text-gray-700"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>

                        <div className="flex items-center gap-4 w-full md:w-auto">
                            <div className="flex items-center bg-gray-50 border border-gray-100 rounded-2xl px-4 py-1.5 flex-1 md:flex-initial">
                                <span className="text-[10px] font-black text-gray-400 uppercase mr-3">Difficulty</span>
                                <select
                                    className="bg-transparent text-sm font-bold text-gray-700 focus:outline-none appearance-none pr-6 cursor-pointer text-[12px]"
                                    value={difficultyFilter}
                                    onChange={(e) => setDifficultyFilter(e.target.value)}
                                >
                                    <option value="All">All Tiers</option>
                                    <option value="Easy">Easy</option>
                                    <option value="Medium">Medium</option>
                                    <option value="Hard">Hard</option>
                                </select>
                                <i className="fa-solid fa-chevron-down text-[10px] text-gray-400 pointer-events-none -ml-4"></i>
                            </div>

                            <button
                                onClick={() => { setSearchQuery(''); setDifficultyFilter('All'); }}
                                className="p-3 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-2xl transition-all active:scale-90"
                                title="Reset Filters"
                            >
                                <i className="fa-solid fa-filter-circle-xmark text-lg"></i>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Table View */}
                {filteredProblems.length === 0 ? (
                    <div className="text-center py-24 bg-white rounded-3xl border-2 border-dashed border-gray-200">
                        <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-50 rounded-full mb-4 text-gray-300 text-3xl">
                            <i className="fa-solid fa-folder-open"></i>
                        </div>
                        <h3 className="text-xl font-bold text-gray-800">No results found</h3>
                        <p className="text-gray-500 mt-1">Try refining your search terms.</p>
                    </div>
                ) : (
                    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-linear-to-r from-gray-50 to-slate-50 border-b border-gray-200">
                                    <th className="px-6 py-4 text-[11px] font-black text-gray-500 uppercase tracking-wider">ID</th>
                                    <th className="px-6 py-4 text-[11px] font-black text-gray-500 uppercase tracking-wider">Details</th>
                                    <th className="px-6 py-4 text-[11px] font-black text-gray-500 uppercase tracking-wider">Tier</th>
                                    <th className="px-6 py-4 text-[11px] font-black text-gray-500 uppercase tracking-wider">Tags</th>
                                    <th className="px-6 py-4 text-[11px] font-black text-gray-500 uppercase tracking-wider text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {filteredProblems.map((problem, index) => {
                                    const getStyle = (diff) => {
                                        if (diff === 'Easy') return 'bg-emerald-50 text-emerald-700 border-emerald-200';
                                        if (diff === 'Medium') return 'bg-amber-50 text-amber-700 border-amber-200';
                                        return 'bg-rose-50 text-rose-700 border-rose-200';
                                    };
                                    return (
                                        <tr key={problem._id} className="hover:bg-blue-50/40 transition-all duration-200 group">
                                            <td className="px-6 py-5">
                                                <span className="text-sm font-bold text-gray-400 font-mono">
                                                    {(index + 1).toString().padStart(2, '0')}
                                                </span>
                                            </td>
                                            <td className="px-6 py-5">
                                                <div className="flex flex-col gap-1">
                                                    <span className="text-sm font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                                                        {problem.title}
                                                    </span>
                                                    <span className="text-xs text-gray-500 line-clamp-1 max-w-md">
                                                        {problem.description}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5">
                                                <span className={`inline-flex px-3 py-1.5 rounded-lg text-[10px] font-black uppercase border tracking-wider ${getStyle(problem.difficulty)}`}>
                                                    {problem.difficulty}
                                                </span>
                                            </td>
                                            <td className="px-6 py-5">
                                                <div className="flex flex-wrap gap-2">
                                                    {problem.tags.map(tag => (
                                                        <span key={tag} className="inline-flex px-2.5 py-1 rounded-md bg-gray-50 border border-gray-200 text-gray-600 text-[11px] font-semibold hover:bg-gray-100 transition-colors">
                                                            {tag}
                                                        </span>
                                                    ))}
                                                </div>
                                            </td>
                                            <td className="px-6 py-5">
                                                <div className="flex items-center justify-center gap-2">
                                                    <button
                                                        onClick={() => handleUpdate(problem._id)}
                                                        disabled={isUpdating === problem._id}
                                                        className="p-2.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
                                                        title="Update Problem"
                                                    >
                                                        {isUpdating === problem._id ? (
                                                            <Loader2 className="animate-spin" size={18} />
                                                        ) : (
                                                            <Pencil size={18} />
                                                        )}
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(problem._id)}
                                                        disabled={isDeleting === problem._id}
                                                        className="p-2.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all duration-200 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
                                                        title="Delete Problem"
                                                    >
                                                        {isDeleting === problem._id ? (
                                                            <Loader2 className="animate-spin" size={18} />
                                                        ) : (
                                                            <Trash size={18} />
                                                        )}
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}

                <footer className="mt-20 py-8 border-t border-gray-100 flex flex-col md:flex-row items-center justify-between text-[10px] font-black text-gray-400 uppercase tracking-widest gap-4 text-center">
                    <p>© {new Date().getFullYear()} PROBLEM MASTER HUB • V3.2.0</p>
                    <div className="flex items-center space-x-6">
                        <a href="#" className="hover:text-blue-600 transition-colors">Documentation</a>
                        <a href="#" className="hover:text-blue-600 transition-colors">Audit Logs</a>
                        <a href="#" className="hover:text-blue-600 transition-colors">Support</a>
                    </div>
                </footer>
            </main>
        </div>
    );
};

export default AdminUpdateDelete

