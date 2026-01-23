

import { useState, useEffect } from 'react';
import axiosClient from '../../utils/axiosClient';



const SubmissionHistory = ({ problemId = "demo-problem" }) => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSubmission, setSelectedSubmission] = useState(null);

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        setLoading(true);
        const response = await axiosClient.get(`/problem/submittedProblem/${problemId}`);
        console.log(response)
       
        setSubmissions(response.data);
        setError(null);
      } catch (err) {
        setError('Failed to fetch submission history');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchSubmissions();
  }, [problemId]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'accepted': return 'bg-green-100 text-green-800 border-green-300';
      case 'wrong': return 'bg-red-100 text-red-800 border-red-300';
      case 'error': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'pending': return 'bg-blue-100 text-blue-800 border-blue-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const formatMemory = (memory) => {
    if (memory < 1024) return `${memory} kB`;
    return `${(memory / 1024).toFixed(2)} MB`;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
          <p className="text-gray-600">Loading submissions...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto my-8 p-4 bg-red-50 border border-red-200 rounded-lg">
        <div className="flex items-start gap-3">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-600 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <h3 className="font-semibold text-red-800">Error</h3>
            <p className="text-red-700">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 max-w-7xl">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">Submission History</h2>
      
      {submissions==='No Submission is present'? (
        <div className="flex flex-col items-center justify-center">
          <div className="bg-white rounded-lg shadow-lg p-8 w-full text-center border border-gray-200">
            {/* Icon */}
            <div className="mb-6 flex justify-center">
              <div className="bg-blue-50 rounded-full p-4">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-16 w-16 text-blue-500" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth="2" 
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" 
                  />
                </svg>
              </div>
            </div>
            
            {/* Message */}
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              No Submissions Yet
            </h3>
            <p className="text-gray-600 mb-6">
              You haven't submitted any solutions for this problem yet. Start coding and submit your first solution!
            </p>

          </div>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto bg-white rounded-lg shadow border border-gray-200">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">#</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Language</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Runtime</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Memory</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Test Cases</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Submitted</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {submissions.map((sub, index) => (
                  <tr key={sub._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 text-sm text-gray-700">{index + 1}</td>
                    <td className="px-4 py-3 text-sm font-mono text-gray-700">{sub.language}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${getStatusColor(sub.status)}`}>
                        {sub.status.charAt(0).toUpperCase() + sub.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm font-mono text-gray-700">{sub.runtime}s</td>
                    <td className="px-4 py-3 text-sm font-mono text-gray-700">{formatMemory(sub.memory)}</td>
                    <td className="px-4 py-3 text-sm font-mono text-gray-700">{sub.testCasesPassed}/{sub.testCasesTotal}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{formatDate(sub.createdAt)}</td>
                    <td className="px-4 py-3">
                      <button 
                        className="px-3 py-1.5 text-sm font-medium text-blue-600 hover:text-blue-800 hover:bg-blue-50 border border-blue-300 rounded-md transition-colors"
                        onClick={() => setSelectedSubmission(sub)}
                      >
                        View Code
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="mt-4 text-sm text-gray-500">
            Showing {submissions.length} submission{submissions.length !== 1 ? 's' : ''}
          </p>
        </>
      )}

      {/* Code View Modal */}
      {selectedSubmission && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-xl font-bold text-gray-800">
                Submission Details: {selectedSubmission.language}
              </h3>
            </div>
            
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex flex-wrap gap-2">
                <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full border ${getStatusColor(selectedSubmission.status)}`}>
                  {selectedSubmission.status}
                </span>
                <span className="inline-flex px-3 py-1 text-sm font-medium bg-gray-100 text-gray-700 rounded-full border border-gray-300">
                  Runtime: {selectedSubmission.runtime}s
                </span>
                <span className="inline-flex px-3 py-1 text-sm font-medium bg-gray-100 text-gray-700 rounded-full border border-gray-300">
                  Memory: {formatMemory(selectedSubmission.memory)}
                </span>
                <span className="inline-flex px-3 py-1 text-sm font-medium bg-gray-100 text-gray-700 rounded-full border border-gray-300">
                  Passed: {selectedSubmission.testCasesPassed}/{selectedSubmission.testCasesTotal}
                </span>
              </div>
              
              {selectedSubmission.errorMessage && (
                <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-700">{selectedSubmission.errorMessage}</p>
                </div>
              )}
            </div>
            
            <div className="flex-1 overflow-auto p-6">
              <pre className="p-4 bg-gray-900 text-gray-100 rounded-lg overflow-x-auto">
                <code>{selectedSubmission.code}</code>
              </pre>
            </div>
            
            <div className="px-6 py-4 border-t border-gray-200 flex justify-end">
              <button 
                className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white font-medium rounded-lg transition-colors"
                onClick={() => setSelectedSubmission(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubmissionHistory;