import { useState, useEffect, useRef } from 'react';
import { Link, Navigate, useParams } from 'react-router';
// import { useForm } from 'react-hook-form';
import {
    List,

    Play,
    Send,
    Sparkles,
    User,
    Settings,
    Bell,
    BookOpen,
    RefreshCw,
    Terminal,
    Bot,
    CheckCircle2,
    XCircle
} from 'lucide-react';
import Editor from '@monaco-editor/react';
import axiosClient from '../../utils/axiosClient';
import { leetcodeLogo2 } from '../../assets/images';
import { GoogleGenAI } from "@google/genai";

// --- API CLIENT CONFIG ---
// Note: Assuming the backend is relative or defined in environment. 
// For this demo, we use a generic axios instance that matches the user's snippet.

// --- CONSTANTS ---
const langMap = {
    cpp: 'C++',
    java: 'Java',
    javascript: 'JavaScript'
};

// --- SERVICES ---
class GeminiService {
    async askAI(problem, currentCode, userMessage, history) {
        const ai = new GoogleGenAI({ apiKey: 'AIzaSyC_oyX8_hTOfBOzsO6ya09c8vMOLTQqGhM' });
        const systemInstruction = `You are a world-class coding mentor.
      Problem: ${problem?.title}
      Description: ${problem?.description}
      Current Code: \`\`\`${currentCode}\`\`\`
      Help the student with hints and complexity analysis.`;

        try {
            const response = await ai.models.generateContent({
                model: 'gemini-3-pro-preview',
                contents: [
                    ...history.map(m => ({ role: m.role, parts: [{ text: m.text }] })),
                    { role: 'user', parts: [{ text: userMessage }] }
                ],
                config: { systemInstruction, temperature: 0.7 }
            });
            return response.text || "I couldn't generate a response.";
        } catch (e) {
            console.log("Error", e)
            return "AI Service Error. Please try again later.";
        }
    }
}
const geminiService = new GeminiService();

// --- SUB-COMPONENTS ---

const Editorial = ({ secureUrl, thumbnailUrl, duration }) => (
    <div className="space-y-6">
        <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">Solution Editorial</h2>
            <span className="text-xs text-gray-500 flex items-center"><BookOpen size={12} className="mr-1" /> {duration}</span>
        </div>
        <div className="aspect-video bg-[#333333] rounded-xl flex items-center justify-center overflow-hidden border border-[#3e3e3e] relative group cursor-pointer">
            {thumbnailUrl ? (
                <img src={thumbnailUrl} alt="Video Preview" className="w-full h-full object-cover opacity-30 group-hover:opacity-40 transition-opacity" />
            ) : (
                <div className="bg-linear-to-br from-gray-700 to-gray-800 w-full h-full opacity-30" />
            )}
            <Play size={48} className="absolute text-white/50 group-hover:text-white/80 transition-all" />
        </div>
        <div className="text-gray-300 leading-relaxed text-sm">
            {secureUrl ? (
                <a href={secureUrl} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">View Official Resource</a>
            ) : (
                "The detailed explanation for this problem covers the optimal approach and time complexity analysis."
            )}
        </div>
    </div>
);

const SubmissionHistory = ({ problemId }) => {
    const [submissions, setSubmissions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                // Simulating the call from user's snippet
                const response = await axiosClient.get(`/submission/history/${problemId}`);
                setSubmissions(response.data || []);
            } catch (e) {
                console.log("Error", e)
                setSubmissions([]);
            } finally {
                setLoading(false);
            }
        };
        fetchHistory();
    }, [problemId]);

    if (loading) return <div className="text-gray-500 animate-pulse text-xs">Loading history...</div>;
    if (submissions.length === 0) return <div className="text-gray-500 text-xs">No submission records found.</div>;

    return (
        <div className="space-y-2">
            {submissions.map((sub, i) => (
                <div key={i} className="flex justify-between items-center p-3 bg-[#333333] rounded border border-[#3e3e3e]">
                    <span className={sub.accepted ? 'text-emerald-500 font-bold' : 'text-red-500'}>
                        {sub.accepted ? 'Accepted' : 'Failed'}
                    </span>
                    <span className="text-xs text-gray-500">{sub.timestamp}</span>
                </div>
            ))}
        </div>
    );
};

const ChatAi = ({ problem, currentCode }) => {
    const [messages, setMessages] = useState([{ role: 'model', text: "Hello! I'm your AI coding mentor. Stuck on this problem?" }]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const scrollRef = useRef(null);

    useEffect(() => { if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight; }, [messages]);

    const handleSend = async () => {
        if (!input.trim() || loading) return;
        const userMsg = { role: 'user', text: input };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setLoading(true);
        const reply = await geminiService.askAI(problem, currentCode, input, messages);
        setMessages(prev => [...prev, { role: 'model', text: reply }]);
        setLoading(false);
    };

    return (
        <div className="flex flex-col h-125 border border-[#3e3e3e] rounded-lg bg-[#282828] overflow-hidden shadow-xl">
            <div className="flex-1 overflow-y-auto p-4 space-y-4" ref={scrollRef}>
                {messages.map((m, i) => (
                    <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[85%] p-3 rounded-2xl text-xs leading-relaxed ${m.role === 'user' ? 'bg-blue-600' : 'bg-[#333333] border border-[#444]'}`}>
                            {m.text}
                        </div>
                    </div>
                ))}
                {loading && <div className="flex items-center text-xs text-gray-500 animate-pulse"><Bot size={12} className="mr-2" /> Thinking...</div>}
            </div>
            <div className="p-3 border-t border-[#3e3e3e] flex gap-2 bg-[#2d2d2d]">
                <input
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleSend()}
                    className="flex-1 bg-[#1e1e1e] border border-[#444] rounded-lg px-3 py-2 text-xs outline-none focus:border-purple-500 transition-colors"
                    placeholder="Ask AI for a hint..."
                />
                <button onClick={handleSend} disabled={loading} className="bg-purple-600 px-3 rounded-lg hover:bg-purple-500 transition-colors disabled:opacity-50"><Send size={14} /></button>
            </div>
        </div>
    );
};

// --- MAIN PAGE COMPONENT ---

const CompilerPage = () => {
    const { problemId } = useParams();
    const [problem, setProblem] = useState(null);
    const [selectedLanguage, setSelectedLanguage] = useState('javascript');
    const [code, setCode] = useState('');
    const [loading, setLoading] = useState(true);
    const [runResult, setRunResult] = useState(null);
    const [submitResult, setSubmitResult] = useState(null);
    const [activeLeftTab, setActiveLeftTab] = useState('description');
    const [activeRightTab, setActiveRightTab] = useState('code');
    const editorRef = useRef(null);

    useEffect(() => {
        const fetchProblem = async () => {
            setLoading(true);
            try {
                const response = await axiosClient.get(`/problem/problemById/${problemId}`);
                const problemData = response.data;
                setProblem(problemData);

                // Match user's snippet logic for initial code
                const startCodeEntry = problemData.startCode.find(sc => sc.language === langMap[selectedLanguage]);
                if (startCodeEntry) {
                    setCode(startCodeEntry.initialCode);
                }
            } catch (error) {
                console.error('Error fetching problem:', error);
            } finally {
                setLoading(false);
            }
        };
        if (problemId) fetchProblem();
    }, [problemId, selectedLanguage]);

    // Sync code when language changes
    useEffect(() => {
        if (problem) {
            const startCodeEntry = problem.startCode.find(sc => sc.language === langMap[selectedLanguage]);
            if (startCodeEntry) {
                setCode(startCodeEntry.initialCode);
            }
        }
    }, [selectedLanguage, problem]);

    const handleEditorChange = (value) => setCode(value || '');
    const handleEditorDidMount = (editor) => { editorRef.current = editor; };
    const handleLanguageChange = (language) => setSelectedLanguage(language);

    const handleRun = async () => {
        setLoading(true);
        setRunResult(null);
        try {
            const response = await axiosClient.post(`/submission/run/${problemId}`, {
                code,
                language: selectedLanguage
            });
            setRunResult(response.data);
            setActiveRightTab('testcase');
        } catch (error) {
            console.error('Error running code:', error);
            setRunResult({ success: false, error: 'Internal server error' });
        } finally {
            setLoading(false);
        }
    };

    const handleSubmitCode = async () => {
        setLoading(true);
        setSubmitResult(null);
        try {
            const response = await axiosClient.post(`/submission/submit/${problemId}`, {
                code,
                language: selectedLanguage
            });
            setSubmitResult(response.data);
            setActiveRightTab('result');
        } catch (error) {
            console.error('Error submitting code:', error);
        } finally {
            setLoading(false);
        }
    };

    const getLanguageForMonaco = (lang) => {
        switch (lang) {
            case 'javascript': return 'javascript';
            case 'java': return 'java';
            case 'cpp': return 'cpp';
            default: return 'javascript';
        }
    };

    const getDifficultyColor = (difficulty) => {
        const d = (difficulty || '').toLowerCase();
        switch (d) {
            case 'easy': return 'text-emerald-500';
            case 'medium': return 'text-yellow-500';
            case 'hard': return 'text-red-500';
            default: return 'text-gray-500';
        }
    };

    if (loading && !problem) {
        return (
            <div className="h-screen bg-[#1a1a1a] flex items-center justify-center">
                <div className="flex flex-col items-center">
                    <div className="w-12 h-12 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin"></div>
                    <p className="mt-4 text-gray-400 font-medium">Fetching Problem Details...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="h-screen flex flex-col bg-[#1a1a1a] text-gray-200">
            {/* Navbar Integration */}
            <nav className="h-12 bg-[#282828] border-b border-[#3e3e3e] flex items-center justify-between px-4 shrink-0 shadow-lg z-50">
                <div className="flex items-center space-x-4">
                    <div className="flex items-center cursor-pointer">
                        <img src={leetcodeLogo2} alt="" className='w-10 h-10' />
                        <span className="ml-2 font-bold tracking-tight text-white hidden md:inline">LeetCode</span>
                    </div>
                    <div className="h-4 w-px bg-[#3e3e3e]"></div>
                    <Link
                        to="/problems"
                        className="text-sm font-medium text-gray-400 hover:text-white flex items-center transition-colors">
                        <List size={16} className="mr-1" />
                        Problems
                    </Link>
                </div>
                <div className="flex items-center space-x-3">
                    <Settings size={18} className="text-gray-400 cursor-pointer hover:text-white transition-colors" />
                    <Bell size={18} className="text-gray-400 cursor-pointer hover:text-white transition-colors" />
                    <div className="w-8 h-8 bg-[#3e3e3e] rounded-full flex items-center justify-center cursor-pointer hover:bg-[#4a4a4a] transition-colors"><User size={18} /></div>
                </div>
            </nav>

            {/* Main content area */}
            <main className="flex-1 flex overflow-hidden">
                {/* Left Panel */}
                <div className="w-1/2 flex flex-col border-r border-[#3e3e3e] bg-[#282828] shadow-inner">
                    <div className="flex items-center bg-[#333333] border-b border-[#3e3e3e] px-2 h-10 shrink-0">
                        {['description', 'editorial', 'solutions', 'submissions', 'chatAI'].map(tab => (
                            <button
                                key={tab}
                                className={`px-4 h-full text-xs font-semibold border-b-2 transition-all flex items-center uppercase tracking-tighter ${activeLeftTab === tab ? 'border-white text-white bg-[#282828]' : 'border-transparent text-gray-500 hover:text-gray-200'}`}
                                onClick={() => setActiveLeftTab(tab)}
                            >
                                {tab === 'chatAI' && <Sparkles size={12} className="mr-1.5 text-purple-400" />}
                                {tab}
                            </button>
                        ))}
                    </div>

                    <div className="flex-1 overflow-y-auto p-6 scroll-smooth">
                        {problem && (
                            <>
                                {activeLeftTab === 'description' && (
                                    <div className="animate-in fade-in duration-300">
                                        <div className="flex items-center gap-4 mb-6">
                                            <h1 className="text-2xl font-bold text-white">{problem.title}</h1>
                                            <div className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded border ${getDifficultyColor(problem.difficulty)} text-current`}>
                                                {problem.difficulty}
                                            </div>
                                            <div className="text-[10px] font-bold text-blue-400 bg-blue-400/10 px-2 py-0.5 rounded border border-blue-400/20">{problem.tags}</div>
                                        </div>
                                        <div className="prose prose-invert max-w-none text-sm leading-relaxed text-gray-300">
                                            <div className="whitespace-pre-wrap">{problem.description}</div>
                                        </div>
                                        <div className="mt-8">
                                            <h3 className="text-sm font-bold text-white mb-4 uppercase tracking-widest">Examples:</h3>
                                            <div className="space-y-4">
                                                {(problem.visibleTestCases || []).map((example, index) => (
                                                    <div key={index} className="bg-[#333333] p-4 rounded-xl border border-[#3e3e3e] shadow-sm">
                                                        <h4 className="font-bold text-xs text-gray-500 mb-2 uppercase">Example {index + 1}:</h4>
                                                        <div className="space-y-1 text-[13px] font-mono leading-tight">
                                                            <div><strong className="text-gray-400">Input:</strong> {example.input}</div>
                                                            <div><strong className="text-gray-400">Output:</strong> {example.output}</div>
                                                            {example.explanation && <div className="mt-2 text-gray-500 italic"><strong>Explanation:</strong> {example.explanation}</div>}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {activeLeftTab === 'editorial' && (
                                    <div className="animate-in slide-in-from-left-2 duration-300">
                                        <Editorial secureUrl={problem.secureUrl} thumbnailUrl={problem.thumbnailUrl} duration={problem.duration} />
                                    </div>
                                )}

                                {activeLeftTab === 'solutions' && (
                                    <div className="space-y-4 animate-in fade-in duration-300">
                                        <h2 className="text-xl font-bold text-white">Reference Solutions</h2>
                                        {problem.referenceSolution?.length > 0 ? problem.referenceSolution.map((solution, index) => (
                                            <div key={index} className="border border-[#3e3e3e] rounded-xl bg-[#333333] overflow-hidden">
                                                <div className="bg-[#3e3e3e] px-4 py-2 text-xs font-bold text-blue-400 uppercase tracking-widest">
                                                    {solution.language} Solution
                                                </div>
                                                <pre className="p-4 bg-[#1e1e1e] text-[13px] overflow-x-auto text-gray-300 font-mono">
                                                    <code>{solution.completeCode}</code>
                                                </pre>
                                            </div>
                                        )) : <p className="text-gray-500 text-sm">Solutions not available yet.</p>}
                                    </div>
                                )}

                                {activeLeftTab === 'submissions' && (
                                    <div className="animate-in fade-in duration-300">
                                        <h2 className="text-xl font-bold mb-4">Submission History</h2>
                                        <SubmissionHistory problemId={problemId} />
                                    </div>
                                )}

                                {activeLeftTab === 'chatAI' && (
                                    <div className="animate-in zoom-in-95 duration-300">
                                        <h2 className="text-xl font-bold mb-4 flex items-center"><Bot size={24} className="mr-2 text-purple-400" /> AI Coding Tutor</h2>
                                        <ChatAi problem={problem} currentCode={code} />
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>

                {/* Right Panel */}
                <div className="w-1/2 flex flex-col bg-[#1a1a1a]">
                    <div className="flex items-center bg-[#333333] border-b border-[#3e3e3e] px-2 h-10 shrink-0">
                        {['code', 'testcase', 'result'].map(tab => (
                            <button
                                key={tab}
                                className={`px-4 h-full text-xs font-semibold border-b-2 transition-all uppercase tracking-tighter ${activeRightTab === tab ? 'border-white text-white bg-[#1a1a1a]' : 'border-transparent text-gray-500 hover:text-gray-200'}`}
                                onClick={() => setActiveRightTab(tab)}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>

                    <div className="flex-1 flex flex-col overflow-hidden">
                        {activeRightTab === 'code' && (
                            <div className="flex-1 flex flex-col overflow-hidden animate-in fade-in duration-300">
                                <div className="flex justify-between items-center px-4 py-2 bg-[#282828] border-b border-[#3e3e3e]">
                                    <div className="flex gap-1">
                                        {['javascript', 'java', 'cpp'].map((lang) => (
                                            <button
                                                key={lang}
                                                className={`px-3 py-1 rounded text-[11px] font-bold uppercase transition-all ${selectedLanguage === lang ? 'bg-[#3e3e3e] text-white shadow' : 'text-gray-500 hover:text-gray-300'}`}
                                                onClick={() => handleLanguageChange(lang)}
                                            >
                                                {langMap[lang]}
                                            </button>
                                        ))}
                                    </div>
                                    <button onClick={() => { if (confirm("Reset code?")) setCode(problem.startCode.find(sc => sc.language === langMap[selectedLanguage]).initialCode); }} className="p-1 hover:bg-[#3e3e3e] rounded text-gray-500 hover:text-white transition-colors" title="Reset to template">
                                        <RefreshCw size={14} />
                                    </button>
                                </div>

                                <div className="flex-1">
                                    <Editor
                                        height="100%"
                                        theme="vs-dark"
                                        language={getLanguageForMonaco(selectedLanguage)}
                                        value={code}
                                        onChange={handleEditorChange}
                                        onMount={handleEditorDidMount}
                                        options={{
                                            fontSize: 13,
                                            minimap: { enabled: false },
                                            scrollBeyondLastLine: false,
                                            automaticLayout: true,
                                            tabSize: 2,
                                            fontFamily: "'Fira Code', monospace",
                                            padding: { top: 12 },
                                            lineNumbers: 'on',
                                            renderLineHighlight: 'all',
                                        }}
                                    />
                                </div>

                                <div className="p-3 border-t border-[#3e3e3e] bg-[#282828] flex justify-between items-center shadow-xl z-10">
                                    <button onClick={() => setActiveRightTab('testcase')} className="flex items-center text-xs font-bold text-gray-500 hover:text-white transition-colors uppercase"><Terminal size={14} className="mr-2" /> Console</button>
                                    <div className="flex gap-2">
                                        <button onClick={handleRun} disabled={loading} className="px-5 py-1.5 bg-[#3e3e3e] hover:bg-[#4a4a4a] text-white text-xs font-bold rounded-lg transition-all flex items-center disabled:opacity-50"><Play size={14} className="mr-2 fill-current" /> Run</button>
                                        <button onClick={handleSubmitCode} disabled={loading} className="px-5 py-1.5 bg-[#2cbb5d] hover:bg-[#32c668] text-white text-xs font-bold rounded-lg transition-all flex items-center shadow-lg active:scale-95 disabled:opacity-50"><Send size={14} className="mr-2" /> Submit</button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeRightTab === 'testcase' && (
                            <div className="flex-1 p-6 overflow-y-auto animate-in slide-in-from-bottom-2 duration-300">
                                <h3 className="text-sm font-bold text-white mb-4 flex items-center uppercase tracking-widest"><Terminal size={16} className="mr-2 text-gray-500" /> Run Logs</h3>
                                {runResult ? (
                                    <div className="space-y-4">
                                        <div className={`p-4 rounded-xl border flex items-center ${runResult.success ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' : 'bg-red-500/10 border-red-500/20 text-red-500'}`}>
                                            {runResult.success ? <CheckCircle2 size={24} className="mr-3" /> : <XCircle size={24} className="mr-3" />}
                                            <div className="font-bold text-lg uppercase tracking-tight">{runResult.success ? 'Success' : 'Execution Failed'}</div>
                                        </div>
                                        {runResult.success && (
                                            <div className="grid grid-cols-2 gap-4 text-[11px] font-bold uppercase text-gray-500">
                                                <div className="bg-[#282828] p-3 rounded-xl border border-[#3e3e3e]">Runtime: <span className="text-white ml-1">{runResult.runtime} s</span></div>
                                                <div className="bg-[#282828] p-3 rounded-xl border border-[#3e3e3e]">Memory: <span className="text-white ml-1">{runResult.memory} KB</span></div>
                                            </div>
                                        )}
                                        <div className="space-y-3">
                                            {(runResult.testCases || []).map((tc, i) => (
                                                <div key={i} className="bg-[#282828] p-4 rounded-xl border border-[#3e3e3e] font-mono text-[13px] shadow-sm">
                                                    <div className="font-bold text-[10px] uppercase text-gray-500 mb-3 border-b border-[#3e3e3e] pb-1 flex justify-between">Case {i + 1} <span className={tc.status_id === 3 ? 'text-emerald-500' : 'text-red-500'}>{tc.status_id === 3 ? 'PASSED' : 'FAILED'}</span></div>
                                                    <div className="space-y-1">
                                                        <div><span className="text-gray-500">Input:</span> <span className="text-white">{tc.stdin}</span></div>
                                                        <div><span className="text-gray-500">Expected:</span> <span className="text-white">{tc.expected_output}</span></div>
                                                        <div><span className="text-gray-500">Result:</span> <span className={tc.status_id === 3 ? 'text-emerald-400' : 'text-red-400'}>{tc.stdout}</span></div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center justify-center h-full text-gray-600 text-sm">
                                        {loading ? <div className="animate-spin w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full mb-4"></div> : <Terminal size={48} className="mb-4 opacity-10" />}
                                        {loading ? "Executing on judge server..." : "Click 'Run' to see output."}
                                    </div>
                                )}
                            </div>
                        )}

                        {activeRightTab === 'result' && (
                            <div className="flex-1 p-6 overflow-y-auto animate-in zoom-in-95 duration-300">
                                <h3 className="text-sm font-bold text-white mb-6 flex items-center uppercase tracking-widest"><CheckCircle2 size={16} className="mr-2 text-gray-500" /> Verdict</h3>
                                {submitResult ? (
                                    <div className="space-y-8">
                                        <div className={`flex flex-col items-center justify-center p-12 rounded-3xl border ${submitResult.accepted ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' : 'bg-red-500/10 border-red-500/20 text-red-500'} shadow-2xl`}>
                                            {submitResult.accepted ? <CheckCircle2 size={80} className="mb-4" /> : <XCircle size={80} className="mb-4" />}
                                            <h4 className="text-5xl font-black italic tracking-tighter uppercase">{submitResult.accepted ? 'Accepted' : 'Failed'}</h4>
                                            <div className="mt-4 text-sm font-bold uppercase opacity-60">Passed: {submitResult.passedTestCases}/{submitResult.totalTestCases} Testcases</div>
                                        </div>

                                        {submitResult.accepted && (
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="bg-[#282828] p-5 rounded-2xl border border-[#3e3e3e] shadow-lg">
                                                    <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Runtime</div>
                                                    <div className="text-xl font-black text-white">{submitResult.runtime} s</div>
                                                    <div className="text-[10px] text-gray-500 mt-2">Faster than 92% of users</div>
                                                </div>
                                                <div className="bg-[#282828] p-5 rounded-2xl border border-[#3e3e3e] shadow-lg">
                                                    <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Memory</div>
                                                    <div className="text-xl font-black text-white">{submitResult.memory} KB</div>
                                                    <div className="text-[10px] text-gray-500 mt-2">Less than 68% of users</div>
                                                </div>
                                            </div>
                                        )}

                                        <button onClick={() => setActiveLeftTab('submissions')} className="w-full py-4 text-xs font-bold text-blue-400 hover:text-blue-300 bg-blue-500/5 hover:bg-blue-500/10 rounded-xl border border-blue-500/20 transition-all uppercase tracking-widest">View Submission History</button>
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center justify-center h-full text-gray-600 text-sm">
                                        {loading ? <div className="animate-spin w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full mb-4"></div> : <Send size={48} className="mb-4 opacity-10" />}
                                        {loading ? "Validating submission..." : "Submit your code for evaluation."}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};
export default CompilerPage
