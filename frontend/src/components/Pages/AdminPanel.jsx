
import { useState } from 'react';
import { Routes, Route, Link, useNavigate, NavLink } from 'react-router';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Plus, Trash2, Code2, FileText, Beaker, ChevronRight, Info,
  CheckCircle2, AlertCircle, Code, Layout, LayoutGrid,
  Database, Users, Settings, PlusCircle, ArrowLeft, Send, X,
  Pencil, Trash, Video,
  Home,
  Puzzle
} from 'lucide-react';
import axiosClient from '../../utils/axiosClient';
import AdminUpdateDelete from '../admin/AdminUpdateDelete';
import UpdatePanel from '../admin/UpdatePanel';
import AdminVideo from '../admin/AdminVideo';
import UploadVideoPanel from '../admin/UploadVideoPanel';



// 1. Zod Schema - FIXED to match backend
const problemSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  difficulty: z.enum(["Easy", "Medium", "Hard"]),
  tags: z.array(z.enum([
    "Array", "String", "Dynamic Programming", "Graph", "Tree",
    "Math", "Sorting", "Searching", "Backtracking", "Greedy",
    "Linked List", "Stack", "Queue", "Heap", "Hash Table", "Recursion"
  ])).min(1, 'At least one tag required'),
  visibleTestCases: z.array(
    z.object({
      input: z.string().min(1, 'Input is required'),
      output: z.string().min(1, 'Output is required'),
      explanation: z.string().min(1, 'Explanation is required')
    })
  ).min(1, 'At least one visible test case required'),
  invisibleTestCases: z.array(
    z.object({
      input: z.string().min(1, 'Input is required'),
      output: z.string().min(1, 'Output is required')
    })
  ).min(1, 'At least one hidden test case required'),
  startCode: z.array(
    z.object({
      language: z.string().min(1, 'Language is required'),
      initialCode: z.string().min(1, 'Initial code is required')
    })
  ).min(1, 'At least one start code template required'),
  referenceSolution: z.array(
    z.object({
      language: z.string().min(1, 'Language is required'),
      completeCode: z.string().min(1, 'Complete code is required')
    })
  ).min(1, 'At least one reference solution required')
});

const NavTab = {
  GENERAL: 'General',
  TESTCASES: 'Test Cases',
  TEMPLATES: 'Code Templates'
};

// eslint-disable-next-line no-unused-vars
const StatCard = ({ label, value, icon: Icon, color, bg }) => (
  <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex items-center gap-5 transition-transform hover:scale-[1.02]">
    <div className={`p-4 rounded-2xl ${bg} ${color}`}>
      <Icon size={24} strokeWidth={2.5} />
    </div>
    <div>
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">{label}</p>
      <p className="text-2xl font-bold text-slate-900 leading-none">{value}</p>
    </div>
  </div>
);

// Main Panel Component
const Panel = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(NavTab.GENERAL);
  const [loading, setLoading] = useState(false);
  const [selectedTags, setSelectedTags] = useState(['Array']);

  const availableTags = [
    "Array", "String", "Dynamic Programming", "Graph", "Tree",
    "Math", "Sorting", "Searching", "Backtracking", "Greedy",
    "Linked List", "Stack", "Queue", "Heap", "Hash Table", "Recursion"
  ];

  const {
    register,
    control,
    handleSubmit,
    trigger,
    setValue,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(problemSchema),
    mode: 'onBlur',
    defaultValues: {
      difficulty: 'Medium',
      tags: ['Array'],
      visibleTestCases: [{ input: '', output: '', explanation: '' }],
      invisibleTestCases: [{ input: '', output: '' }],
      startCode: [
        { language: 'C++', initialCode: 'class Solution {\npublic:\n    void solve() {\n        \n    }\n};' },
        { language: 'Java', initialCode: 'class Solution {\n    public void solve() {\n        \n    }\n}' },
        { language: 'JavaScript', initialCode: '/**\n * @return {void}\n */\nvar solve = function() {\n    \n};' }
      ],
      referenceSolution: [
        { language: 'C++', completeCode: '' },
        { language: 'Java', completeCode: '' },
        { language: 'JavaScript', completeCode: '' }
      ]
    }
  });

  const { fields: visibleFields, append: appendVisible, remove: removeVisible } = useFieldArray({
    control,
    name: 'visibleTestCases'
  });

  const { fields: hiddenFields, append: appendHidden, remove: removeHidden } = useFieldArray({
    control,
    name: 'invisibleTestCases'
  });

  const toggleTag = (tag) => {
    const newTags = selectedTags.includes(tag)
      ? selectedTags.filter(t => t !== tag)
      : [...selectedTags, tag];
    setSelectedTags(newTags);
    setValue('tags', newTags, { shouldValidate: true });
  };

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const payload = {
        ...data,
        // Backend expects these field names exactly as they are
        // problemCreatedBy will need to be added by backend from auth token
      };

      console.log("Payload:", payload);

      await axiosClient.post('/problem/create', payload);
      alert('Problem published to production successfully!');
      navigate('/admin_panel');
    } catch (error) {
      console.error(error.response?.data || error.message);
      alert(`Failed to create problem: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const nextTab = async () => {
    let fieldsToValidate = [];
    if (activeTab === NavTab.GENERAL) {
      fieldsToValidate = ['title', 'description', 'difficulty', 'tags'];
    } else if (activeTab === NavTab.TESTCASES) {
      fieldsToValidate = ['visibleTestCases', 'invisibleTestCases'];
    }

    const isValid = await trigger(fieldsToValidate);
    if (isValid) {
      if (activeTab === NavTab.GENERAL) setActiveTab(NavTab.TESTCASES);
      else if (activeTab === NavTab.TESTCASES) setActiveTab(NavTab.TEMPLATES);
    }
  };

  return (
    <div className="flex-1 max-w-7xl mx-auto w-full p-4 lg:p-12 animate-in fade-in duration-700">
      {/* Dynamic Header */}
      <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-indigo-200">
              <Plus size={28} strokeWidth={3} />
            </div>
            <h1 className="text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight">Create Challenge</h1>
          </div>
          <p className="text-slate-500 font-medium">Step-by-step problem architecting for the platform.</p>
        </div>

        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => navigate('/admin_panel')}
            className="px-6 py-3 text-slate-500 hover:text-slate-900 font-bold transition-all flex items-center gap-2"
          >
            <ArrowLeft size={20} /> Cancel
          </button>
          <button
            onClick={handleSubmit(onSubmit)}
            disabled={loading}
            className={`px-8 py-3 bg-indigo-600 text-white rounded-2xl font-black shadow-lg shadow-indigo-100 hover:shadow-indigo-300 hover:-translate-y-0.5 transition-all flex items-center gap-3 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {loading ? 'PUBLISHING...' : 'PUBLISH'}
            <Send size={20} strokeWidth={3} />
          </button>
        </div>
      </div>

      {/* Modern Tabs */}
      <div className="flex gap-2 p-1.5 bg-slate-100/80 backdrop-blur rounded-3xl mb-12 max-w-fit overflow-x-auto">
        {Object.values(NavTab).map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={`px-8 py-3.5 rounded-[18px] text-sm font-bold transition-all flex items-center gap-3 ${activeTab === tab
              ? 'bg-white text-indigo-600 shadow-sm ring-1 ring-slate-200'
              : 'text-slate-500 hover:bg-white/50'
              }`}
          >
            {tab === NavTab.GENERAL && <FileText size={18} />}
            {tab === NavTab.TESTCASES && <Beaker size={18} />}
            {tab === NavTab.TEMPLATES && <Code2 size={18} />}
            {tab}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-12">
        {/* --- SECTION: GENERAL --- */}
        {activeTab === NavTab.GENERAL && (
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-10 animate-in slide-in-from-bottom-4 duration-500">
            <div className="xl:col-span-8 space-y-8">
              <div className="bg-white rounded-4xl p-10 border border-slate-100 shadow-sm space-y-8">
                <div className="space-y-3">
                  <label className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 block ml-1">Problem Title</label>
                  <input
                    {...register('title')}
                    placeholder="e.g. Detect Cycle in Directed Graph"
                    className={`w-full px-6 py-4 rounded-2xl border-2 ${errors.title ? 'border-red-200 bg-red-50/30' : 'border-slate-50 bg-slate-50/50 focus:bg-white focus:border-indigo-100 focus:ring-4 focus:ring-indigo-50/30'} transition-all outline-none font-semibold text-slate-800 text-lg`}
                  />
                  {errors.title && <p className="text-xs font-bold text-red-500 flex items-center gap-1.5 ml-1"><AlertCircle size={14} /> {errors.title.message}</p>}
                </div>

                <div className="space-y-3">
                  <label className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 block ml-1">Problem Description</label>
                  <textarea
                    {...register('description')}
                    rows={12}
                    placeholder="Provide constraints, input/output formats, and problem details..."
                    className={`w-full px-6 py-5 rounded-3xl border-2 ${errors.description ? 'border-red-200 bg-red-50/30' : 'border-slate-50 bg-slate-50/50 focus:bg-white focus:border-indigo-100 focus:ring-4 focus:ring-indigo-50/30'} transition-all outline-none font-medium text-slate-700 resize-none leading-relaxed`}
                  />
                  {errors.description && <p className="text-xs font-bold text-red-500 flex items-center gap-1.5 ml-1"><AlertCircle size={14} /> {errors.description.message}</p>}
                </div>
              </div>
            </div>

            <div className="xl:col-span-4 space-y-8">
              <div className="bg-white rounded-4xl p-8 border border-slate-100 shadow-sm space-y-8">
                <h3 className="text-lg font-black text-slate-800 tracking-tight">Configuration</h3>

                <div className="space-y-6">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block ml-1">Difficulty</label>
                    <select {...register('difficulty')} className="w-full px-5 py-4 rounded-2xl border-2 border-slate-50 bg-slate-50/50 focus:bg-white outline-none font-bold text-slate-700 appearance-none cursor-pointer">
                      <option value="Easy">Easy</option>
                      <option value="Medium">Medium</option>
                      <option value="Hard">Hard</option>
                    </select>
                  </div>

                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block ml-1">Tags (Select Multiple)</label>
                    <div className="flex flex-wrap gap-2 p-4 bg-slate-50/50 rounded-2xl border-2 border-slate-50">
                      {availableTags.map((tag) => (
                        <button
                          key={tag}
                          type="button"
                          onClick={() => toggleTag(tag)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${selectedTags.includes(tag)
                            ? 'bg-indigo-600 text-white shadow-sm'
                            : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                            }`}
                        >
                          {tag}
                          {selectedTags.includes(tag) && <X size={12} className="inline ml-1" />}
                        </button>
                      ))}
                    </div>
                    {errors.tags && <p className="text-xs font-bold text-red-500 flex items-center gap-1.5 ml-1"><AlertCircle size={14} /> {errors.tags.message}</p>}
                  </div>
                </div>

                <div className="pt-6 border-t border-slate-50">
                  <button type="button" onClick={nextTab} className="w-full group flex items-center justify-between px-6 py-4 bg-slate-900 text-white rounded-2xl font-black text-sm hover:bg-slate-800 transition-all shadow-xl shadow-slate-200">
                    CONTINUE TO TEST CASES
                    <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* --- SECTION: TEST CASES --- */}
        {activeTab === NavTab.TESTCASES && (
          <div className="space-y-12 animate-in slide-in-from-bottom-4 duration-500">
            {/* Visible */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
                    <Beaker size={20} />
                  </div>
                  <h2 className="text-xl font-black text-slate-800 tracking-tight">Public Examples</h2>
                </div>
                <button type="button" onClick={() => appendVisible({ input: '', output: '', explanation: '' })} className="text-xs font-black text-indigo-600 hover:text-indigo-800 transition-colors uppercase tracking-widest flex items-center gap-2">
                  <Plus size={16} strokeWidth={3} /> Add Case
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {visibleFields.map((field, index) => (
                  <div key={field.id} className="bg-white p-8 rounded-4xl border border-slate-100 shadow-sm relative group">
                    <button type="button" onClick={() => removeVisible(index)} className="absolute top-6 right-6 p-2 text-slate-200 hover:text-red-500 transition-colors">
                      <Trash2 size={18} />
                    </button>
                    <div className="space-y-5">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Input</label>
                          <textarea {...register(`visibleTestCases.${index}.input`)} className="w-full p-3 rounded-xl bg-slate-50 border-none font-mono text-xs focus:ring-2 focus:ring-indigo-100 outline-none text-black" rows={3} />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Output</label>
                          <textarea {...register(`visibleTestCases.${index}.output`)} className="w-full p-3 rounded-xl bg-slate-50 border-none font-mono text-xs focus:ring-2 focus:ring-indigo-100 outline-none text-black" rows={3} />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Explanation</label>
                        <input {...register(`visibleTestCases.${index}.explanation`)} className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border-none text-xs focus:ring-2 focus:ring-indigo-100 outline-none text-black" placeholder="Explain logic..." />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              {errors.visibleTestCases && <p className="text-xs font-bold text-red-500 flex items-center gap-1.5 ml-1"><AlertCircle size={14} /> {errors.visibleTestCases.message}</p>}
            </div>

            {/* Hidden - FIXED field name */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center">
                    <Info size={20} />
                  </div>
                  <h2 className="text-xl font-black text-slate-800 tracking-tight">Hidden Evaluation Cases</h2>
                </div>
                <button type="button" onClick={() => appendHidden({ input: '', output: '' })} className="text-xs font-black text-indigo-600 hover:text-indigo-800 transition-colors uppercase tracking-widest flex items-center gap-2">
                  <Plus size={16} strokeWidth={3} /> Add Evaluation
                </button>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {hiddenFields.map((field, index) => (
                  <div key={field.id} className="bg-white p-6 rounded-2xl border-2 border-dashed border-slate-200 group relative hover:border-indigo-200 transition-all">
                    <button type="button" onClick={() => removeHidden(index)} className="absolute top-2 right-2 text-slate-300 hover:text-red-500 transition-colors">
                      <Trash2 size={14} />
                    </button>
                    <div className="space-y-4">
                      <div className="space-y-1">
                        <span className="text-[9px] font-bold text-slate-300 uppercase">Input</span>
                        <input {...register(`invisibleTestCases.${index}.input`)} className="w-full bg-slate-50 border-none rounded p-1.5 text-[11px] font-mono outline-none text-gray-600" />
                      </div>
                      <div className="space-y-1">
                        <span className="text-[9px] font-bold text-slate-300 uppercase">Expected</span>
                        <input {...register(`invisibleTestCases.${index}.output`)} className="w-full bg-slate-50 border-none rounded p-1.5 text-[11px] font-mono outline-none text-gray-600" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              {errors.invisibleTestCases && <p className="text-xs font-bold text-red-500 flex items-center gap-1.5 ml-1"><AlertCircle size={14} /> {errors.invisibleTestCases.message}</p>}
            </div>

            <div className="pt-6 border-t border-slate-50">
              <button type="button" onClick={nextTab} className="group flex items-center justify-between px-6 py-4 bg-slate-900 text-white rounded-2xl font-black text-sm hover:bg-slate-800 transition-all shadow-xl shadow-slate-200">
                CONTINUE TO CODE TEMPLATES
                <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        )}

        {/* --- SECTION: TEMPLATES --- */}
        {activeTab === NavTab.TEMPLATES && (
          <div className="space-y-12 animate-in slide-in-from-bottom-4 duration-500">
            {[0, 1, 2].map((idx) => {
              const lang = idx === 0 ? 'C++' : idx === 1 ? 'Java' : 'JavaScript';
              return (
                <div key={idx} className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden">
                  <div className="px-10 py-6 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-2 h-8 bg-indigo-600 rounded-full"></div>
                      <h3 className="text-xl font-black text-slate-800">{lang} Infrastructure</h3>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Environment Ready</span>
                      <CheckCircle2 size={16} className="text-emerald-500" />
                    </div>
                  </div>

                  <div className="p-10 grid grid-cols-1 lg:grid-cols-2 gap-10">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between px-2">
                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Start Template</label>
                        <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-bold">Read-Only Head</span>
                      </div>
                      <textarea
                        {...register(`startCode.${idx}.initialCode`)}
                        className="w-full bg-slate-900 text-indigo-100 font-mono text-sm p-8 rounded-3xl min-h-75 border-none outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all leading-relaxed shadow-inner"
                      />
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between px-2">
                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Master Solution</label>
                        <span className="text-[10px] bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded font-bold">Verification Logic</span>
                      </div>
                      <textarea
                        {...register(`referenceSolution.${idx}.completeCode`)}
                        className="w-full bg-slate-900 text-emerald-400/90 font-mono text-sm p-8 rounded-3xl min-h-75 border-none outline-none focus:ring-4 focus:ring-emerald-500/10 transition-all leading-relaxed shadow-inner"
                        placeholder={`// Implementation for ${lang} solution...`}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </form>
    </div>
  );
};

// Dashboard Home Component
const DashboardHome = () => (
  <div className="p-8 lg:p-16 max-w-7xl mx-auto w-full space-y-16 animate-in fade-in duration-1000">
    <div className="space-y-4">
      <h1 className="text-4xl lg:text-6xl font-black text-slate-900 tracking-tighter leading-none">Command Center</h1>
      <p className="text-slate-500 font-medium text-lg lg:text-xl">Manage challenges, monitor algorithms, and deploy content.</p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      <StatCard label="Challenges" value="1,248" icon={Database} color="text-indigo-600" bg="bg-indigo-50" />
      <StatCard label="Architects" value="45.2K" icon={Users} color="text-emerald-600" bg="bg-emerald-50" />
      <StatCard label="Accuracy" value="89.4%" icon={LayoutGrid} color="text-orange-600" bg="bg-orange-50" />
    </div>

    <div className="bg-slate-900 rounded-[48px] p-12 lg:p-20 relative overflow-hidden group">
      <div className="relative z-10 space-y-8 max-w-2xl">
        <h2 className="text-3xl lg:text-5xl font-black text-white leading-tight">Ready to deploy a new<br /><span className="text-indigo-400">algorithmic feat?</span></h2>
        <p className="text-slate-400 text-lg lg:text-xl font-medium">Create complex multi-language challenges with integrated test case validation in minutes.</p>
        <div className='flex flex-col gap-8'>
          <Link to="create-problem" className="inline-flex items-center gap-3 bg-white text-slate-900 px-10 py-5 rounded-3xl font-black hover:bg-indigo-50 transition-all hover:scale-105 shadow-2xl  w-[50%]">
            <Plus size={24} strokeWidth={3} />
            START ARCHITECTING
          </Link>
          <Link to="update&delete" className="inline-flex items-center gap-3 bg-white text-slate-900 px-10 py-5 rounded-3xl font-black hover:bg-indigo-50 transition-all hover:scale-105 shadow-2xl w-[50%] ">
            <Pencil size={24} strokeWidth={3} />
            Refractor and Decommission Architecture
          </Link>
          <Link to="upload&delete" className="inline-flex items-center gap-3 bg-white text-slate-900 px-10 py-5 rounded-3xl font-black hover:bg-indigo-50 transition-all hover:scale-105 shadow-2xl w-[50%] ">
            <Video size={24} strokeWidth={3} />
            Editorial Handling
          </Link>
        </div>
      </div>

      <div className="absolute top-0 right-0 w-125 h-125 bg-indigo-500/10 rounded-full blur-3xl -mr-32 -mt-32 transition-transform group-hover:scale-110"></div>
      <div className="hidden lg:block absolute bottom-12 right-12 opacity-10 transform -rotate-12 transition-transform group-hover:rotate-0">
        <Code size={300} strokeWidth={1} className="text-white" />
      </div>
    </div>
  </div>
);

// Main App
const AdminPanel = () => {
  return (
    <div className="flex min-h-screen bg-[#fafbfc]">
      <aside className="w-24 bg-white border-r border-slate-100 hidden lg:flex flex-col items-center py-10 sticky top-0 h-screen gap-12 shadow-sm">

        <nav className="flex-1 flex flex-col gap-6">
          <NavLink to="/admin_panel" className='w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center text-white shadow-xl'>
            <Home size={24} strokeWidth={3} />
          </NavLink>
          <NavLink to="/admin_panel/create-problem" className={({ isActive }) =>
            `
      p-4 rounded-2xl transition-all
      ${isActive
              ? "bg-slate-50 text-indigo-600"
              : "text-slate-400 hover:bg-slate-50 hover:text-indigo-600"
            }
    `
          }
            title="New Problem">
            <PlusCircle size={24} />
          </NavLink>
          <NavLink to="/admin_panel/update&delete" className={({ isActive }) =>
            `
      p-4 rounded-2xl transition-all
      ${isActive
              ? "bg-slate-50 text-indigo-600"
              : "text-slate-400 hover:bg-slate-50 hover:text-indigo-600"
            }
    `
          }
            title="Dashboard">
            <LayoutGrid size={24} />
          </NavLink>
          <NavLink to="/admin_panel/upload&delete" className={({ isActive }) =>
            `
      p-4 rounded-2xl transition-all
      ${isActive
              ? "bg-slate-50 text-indigo-600"
              : "text-slate-400 hover:bg-slate-50 hover:text-indigo-600"
            }
    `
          }
            title="Dashboard">
            <Video size={24} />
          </NavLink>

        </nav>

        <div className="p-4 text-slate-400 hover:text-slate-600 cursor-pointer">
          <NavLink to='/problems'>
            <Puzzle size={24} />
          </NavLink>

        </div>
      </aside >

      <main className="flex-1 flex flex-col min-w-0">
        <header className="h-20 lg:hidden bg-white/80 backdrop-blur-md sticky top-0 z-50 px-6 flex items-center justify-between border-b border-slate-100">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-white">
              <Layout size={20} strokeWidth={3} />
            </div>
            <span className="font-black text-xl tracking-tighter text-black">CodeForge</span>
          </Link>
          <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200"></div>
        </header>

        <Routes>
          <Route index element={<DashboardHome />} />
          <Route path="create-problem" element={<Panel />} />
          <Route path='update&delete' element={<AdminUpdateDelete />} />
          <Route path='update/:problemId' element={<UpdatePanel />} />
          <Route path='upload&delete' element={<AdminVideo />} />
          <Route path='upload/:problemId' element={<UploadVideoPanel />} />
        </Routes>
      </main>
    </div >
  );
};

export default AdminPanel;