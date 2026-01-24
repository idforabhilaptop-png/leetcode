/* eslint-disable no-unused-vars */
// import { useParams } from 'react-router'
// import React, { useState } from 'react';
// import { useForm } from 'react-hook-form';
// import axios from 'axios';
// import axiosClient from '../../utils/axiosClient';

// function UploadVideoPanel(){
    
//     const {problemId}  = useParams();
    
//     const [uploading, setUploading] = useState(false);
//     const [uploadProgress, setUploadProgress] = useState(0);
//     const [uploadedVideo, setUploadedVideo] = useState(null);
    
//       const {
//         register,
//         handleSubmit,
//         watch,
//         formState: { errors },
//         reset,
//         setError,
//         clearErrors
//       } = useForm();
    
//       const selectedFile = watch('videoFile')?.[0];
    
//       // Upload video to Cloudinary
//       const onSubmit = async (data) => {
//         const file = data.videoFile[0];
        
//         setUploading(true);
//         setUploadProgress(0);
//         clearErrors();
    
//         try {
//           // Step 1: Get upload signature from backend
//           const signatureResponse = await axiosClient.get(`/video/create/${problemId}`);
//           // eslint-disable-next-line no-unused-vars
//           const { signature, timestamp, public_id, api_key, cloud_name, upload_url } = signatureResponse.data;
    
//           // Step 2: Create FormData for Cloudinary upload
//           const formData = new FormData();
//           formData.append('file', file);
//           formData.append('signature', signature);
//           formData.append('timestamp', timestamp);
//           formData.append('public_id', public_id);
//           formData.append('api_key', api_key);
    
//           // Step 3: Upload directly to Cloudinary
//           const uploadResponse = await axios.post(upload_url, formData, {
//             headers: {
//               'Content-Type': 'multipart/form-data',
//             },
//             onUploadProgress: (progressEvent) => {
//               const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
//               setUploadProgress(progress);
//             },
//           });
    
//           const cloudinaryResult = uploadResponse.data;
    
//           // Step 4: Save video metadata to backend
//           const metadataResponse = await axiosClient.post('/video/save', {
//             problemId:problemId,
//             cloudinaryPublicId: cloudinaryResult.public_id,
//             secureUrl: cloudinaryResult.secure_url,
//             duration: cloudinaryResult.duration,
//           });
    
//           setUploadedVideo(metadataResponse.data.videoSolution);
//           reset(); // Reset form after successful upload
          
//         } catch (err) {
//           console.error('Upload error:', err);
//           setError('root', {
//             type: 'manual',
//             message: err.response?.data?.message || 'Upload failed. Please try again.'
//           });
//         } finally {
//           setUploading(false);
//           setUploadProgress(0);
//         }
//       };
    
//       // Format file size
//       const formatFileSize = (bytes) => {
//         if (bytes === 0) return '0 Bytes';
//         const k = 1024;
//         const sizes = ['Bytes', 'KB', 'MB', 'GB'];
//         const i = Math.floor(Math.log(bytes) / Math.log(k));
//         return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
//       };
    
//       // Format duration
//       const formatDuration = (seconds) => {
//         const mins = Math.floor(seconds / 60);
//         const secs = Math.floor(seconds % 60);
//         return `${mins}:${secs.toString().padStart(2, '0')}`;
//       };
    
//       return (
//         <div className="max-w-md mx-auto p-6">
//           <div className="card bg-base-100 shadow-xl">
//             <div className="card-body">
//               <h2 className="card-title">Upload Video</h2>
              
//               <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
//                 {/* File Input */}
//                 <div className="form-control w-full">
//                   <label className="label">
//                     <span className="label-text">Choose video file</span>
//                   </label>
//                   <input
//                     type="file"
//                     accept="video/*"
//                     {...register('videoFile', {
//                       required: 'Please select a video file',
//                       validate: {
//                         isVideo: (files) => {
//                           if (!files || !files[0]) return 'Please select a video file';
//                           const file = files[0];
//                           return file.type.startsWith('video/') || 'Please select a valid video file';
//                         },
//                         fileSize: (files) => {
//                           if (!files || !files[0]) return true;
//                           const file = files[0];
//                           const maxSize = 100 * 1024 * 1024; // 100MB
//                           return file.size <= maxSize || 'File size must be less than 100MB';
//                         }
//                       }
//                     })}
//                     className={`file-input file-input-bordered w-full ${errors.videoFile ? 'file-input-error' : ''}`}
//                     disabled={uploading}
//                   />
//                   {errors.videoFile && (
//                     <label className="label">
//                       <span className="label-text-alt text-error">{errors.videoFile.message}</span>
//                     </label>
//                   )}
//                 </div>
    
//                 {/* Selected File Info */}
//                 {selectedFile && (
//                   <div className="alert alert-info">
//                     <div>
//                       <h3 className="font-bold">Selected File:</h3>
//                       <p className="text-sm">{selectedFile.name}</p>
//                       <p className="text-sm">Size: {formatFileSize(selectedFile.size)}</p>
//                     </div>
//                   </div>
//                 )}
    
//                 {/* Upload Progress */}
//                 {uploading && (
//                   <div className="space-y-2">
//                     <div className="flex justify-between text-sm">
//                       <span>Uploading...</span>
//                       <span>{uploadProgress}%</span>
//                     </div>
//                     <progress 
//                       className="progress progress-primary w-full" 
//                       value={uploadProgress} 
//                       max="100"
//                     ></progress>
//                   </div>
//                 )}
    
//                 {/* Error Message */}
//                 {errors.root && (
//                   <div className="alert alert-error">
//                     <span>{errors.root.message}</span>
//                   </div>
//                 )}
    
//                 {/* Success Message */}
//                 {uploadedVideo && (
//                   <div className="alert alert-success">
//                     <div>
//                       <h3 className="font-bold">Upload Successful!</h3>
//                       <p className="text-sm">Duration: {formatDuration(uploadedVideo.duration)}</p>
//                       <p className="text-sm">Uploaded: {new Date(uploadedVideo.uploadedAt).toLocaleString()}</p>
//                     </div>
//                   </div>
//                 )}
    
//                 {/* Upload Button */}
//                 <div className="card-actions justify-end">
//                   <button
//                     type="submit"
//                     disabled={uploading}
//                     className={`btn btn-primary ${uploading ? 'loading' : ''}`}
//                   >
//                     {uploading ? 'Uploading...' : 'Upload Video'}
//                   </button>
//                 </div>
//               </form>
            
//             </div>
//           </div>
//         </div>
//     );
// }


// export default UploadVideoPanel;
import React, { useState, useCallback, useRef } from 'react';
import { useParams } from 'react-router';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { 
  Upload, 
  FileVideo, 
  CheckCircle2, 
  XCircle, 
  Loader2, 
  Play, 
  ShieldCheck,
  CloudLightning,
  Clock,
  HardDrive
} from 'lucide-react';
import { motion , AnimatePresence } from 'framer-motion';
import axiosClient from '../../utils/axiosClient';

const UploadVideoPanel = () => {
  const { problemId } = useParams();
  
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedVideo, setUploadedVideo] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  
  const fileInputRef = useRef(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
    setError,
    clearErrors,
    setValue
  } = useForm();

  const selectedFile = watch('videoFile')?.[0];

  const handleFileChange = useCallback((files) => {
    if (files && files.length > 0) {
      setValue('videoFile', files, { shouldValidate: true });
    }
  }, [setValue]);

  const onDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const onDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files);
    }
  }, [handleFileChange]);

  const onSubmit = async (data) => {
    const file = data.videoFile[0];
    
    setUploading(true);
    setUploadProgress(0);
    clearErrors();

    try {
      // Step 1: Get upload signature from backend
      const signatureResponse = await axiosClient.get(`/video/create/${problemId}`);
      const { 
        signature, 
        timestamp, 
        public_id, 
        api_key, 
        upload_url 
      } = signatureResponse.data;

      // Step 2: Create FormData for Cloudinary upload
      const formData = new FormData();
      formData.append('file', file);
      formData.append('signature', signature);
      formData.append('timestamp', timestamp);
      formData.append('public_id', public_id);
      formData.append('api_key', api_key);

      // Step 3: Upload directly to Cloudinary
      const uploadResponse = await axios.post(upload_url, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setUploadProgress(progress);
          }
        },
      });

      const cloudinaryResult = uploadResponse.data;

      // Step 4: Save video metadata to backend
      const metadataResponse = await axiosClient.post('/video/save', {
        problemId: problemId,
        cloudinaryPublicId: cloudinaryResult.public_id,
        secureUrl: cloudinaryResult.secure_url,
        duration: cloudinaryResult.duration,
      });

      setUploadedVideo(metadataResponse.data.videoSolution);
      reset(); 
      
    } catch (err) {
      console.error('Upload error:', err);
      setError('root', {
        type: 'manual',
        message: err.response?.data?.message || 'Upload failed. Please ensure your backend endpoints are correctly configured.'
      });
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-2xl glass-card rounded-3xl p-8 shadow-xl overflow-hidden relative border border-white/50"
      >
        {/* Decorative Background Elements */}
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-blue-400/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-purple-400/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-10">
            <div className="w-14 h-14 rounded-2xl bg-linear-to-tr from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
              <Upload className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
                Upload Solution
              </h1>
              <p className="text-slate-500 font-medium">Provide a high-quality video walkthrough</p>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <input
              type="file"
              accept="video/*"
              {...register('videoFile', {
                required: 'Please select a video file',
                validate: {
                  isVideo: (files) => {
                    if (!files || !files[0]) return 'Please select a video file';
                    return files[0].type.startsWith('video/') || 'Invalid file type';
                  },
                  fileSize: (files) => {
                    if (!files || !files[0]) return true;
                    return files[0].size <= 100 * 1024 * 1024 || 'File exceeds 100MB limit';
                  }
                }
              })}
              className="hidden"
              id="video-upload-input"
              ref={(e) => {
                register('videoFile').ref(e);
                fileInputRef.current = e;
              }}
              disabled={uploading}
            />

            {/* Drop Zone */}
            <motion.label
              htmlFor="video-upload-input"
              whileHover={{ scale: 0.995, translateY: -2 }}
              whileTap={{ scale: 0.98 }}
              onDragEnter={onDrag}
              onDragLeave={onDrag}
              onDragOver={onDrag}
              onDrop={onDrop}
              className={`
                relative cursor-pointer group block
                border-2 border-dashed rounded-3xl transition-all duration-300
                ${dragActive ? 'border-blue-500 bg-blue-50/50' : 'border-slate-200 hover:border-blue-400 bg-white shadow-sm'}
                ${errors.videoFile ? 'border-red-300 bg-red-50' : ''}
              `}
            >
              <div className="py-14 px-6 text-center flex flex-col items-center">
                <AnimatePresence mode="wait">
                  {selectedFile ? (
                    <motion.div 
                      key="selected"
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="flex flex-col items-center"
                    >
                      <div className="w-20 h-20 rounded-2xl bg-blue-50 flex items-center justify-center mb-5 shadow-inner">
                        <FileVideo className="w-10 h-10 text-blue-600" />
                      </div>
                      <p className="text-slate-900 font-semibold truncate max-w-xs text-lg">{selectedFile.name}</p>
                      <p className="text-slate-500 font-medium mt-1">{formatFileSize(selectedFile.size)}</p>
                    </motion.div>
                  ) : (
                    <motion.div 
                      key="empty"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex flex-col items-center"
                    >
                      <div className="w-20 h-20 rounded-2xl bg-slate-50 flex items-center justify-center mb-5 group-hover:bg-blue-50 transition-colors shadow-inner">
                        <Upload className="w-10 h-10 text-slate-400 group-hover:text-blue-500 transition-colors" />
                      </div>
                      <p className="text-slate-700 font-bold text-lg">Click or drag to upload</p>
                      <p className="text-slate-400 font-medium mt-1">MP4, MOV, or WEBM (Max 100MB)</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.label>

            {/* Error Message */}
            <AnimatePresence>
              {errors.videoFile && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="flex items-center gap-2 text-red-500 font-medium text-sm px-2"
                >
                  <XCircle className="w-4 h-4" />
                  <span>{errors.videoFile.message}</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Upload Progress */}
            {uploading && (
              <div className="space-y-4 bg-blue-50/50 p-6 rounded-3xl border border-blue-100 shadow-sm">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
                    <span className="text-sm font-bold text-slate-700">Optimizing & Uploading...</span>
                  </div>
                  <span className="text-sm font-black text-blue-600">{uploadProgress}%</span>
                </div>
                <div className="h-2.5 w-full bg-slate-200 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${uploadProgress}%` }}
                    className="h-full bg-linear-to-r from-blue-600 to-indigo-500 rounded-full"
                  />
                </div>
              </div>
            )}

            {/* Feedback: Success */}
            {uploadedVideo && !uploading && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-emerald-50 border border-emerald-100 rounded-3xl p-6 shadow-sm"
              >
                <div className="flex items-start gap-5">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-7 h-7 text-emerald-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-emerald-800 font-extrabold text-lg">Upload Successful</h3>
                    <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="flex items-center gap-2.5 text-sm font-semibold text-slate-600">
                        <Clock className="w-4 h-4 text-emerald-500" />
                        <span>{formatDuration(uploadedVideo.duration)} duration</span>
                      </div>
                      <div className="flex items-center gap-2.5 text-sm font-semibold text-slate-600">
                        <HardDrive className="w-4 h-4 text-emerald-500" />
                        <span>Published at {new Date(uploadedVideo.uploadedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                    </div>
                    <button 
                      type="button"
                      onClick={() => setUploadedVideo(null)}
                      className="mt-5 text-sm font-bold text-blue-600 hover:text-blue-700 hover:underline transition-all"
                    >
                      Upload another video
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Feedback: Root Error */}
            {errors.root && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-50 border border-red-100 rounded-2xl p-4 flex items-center gap-3"
              >
                <XCircle className="w-5 h-5 text-red-500" />
                <p className="text-sm font-semibold text-red-600">{errors.root.message}</p>
              </motion.div>
            )}

            {/* Actions */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={uploading || !selectedFile}
                className={`
                  w-full py-5 px-8 rounded-2xl font-black text-lg flex items-center justify-center gap-3 transition-all
                  ${uploading || !selectedFile 
                    ? 'bg-slate-100 text-slate-400 cursor-not-allowed shadow-none' 
                    : 'bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-xl shadow-blue-500/25 active:scale-95'
                  }
                `}
              >
                {uploading ? (
                  <>
                    <Loader2 className="w-6 h-6 animate-spin" />
                    <span>Processing Media...</span>
                  </>
                ) : (
                  <>
                    <CloudLightning className="w-6 h-6" />
                    <span>Submit Solution</span>
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Footer Features */}
          <div className="mt-10 pt-8 border-t border-slate-100 flex flex-wrap justify-center gap-8">
            <div className="flex items-center gap-2.5 text-xs font-bold text-slate-400">
              <ShieldCheck className="w-4 h-4 text-blue-500" />
              <span>AES-256 SECURED</span>
            </div>
            <div className="flex items-center gap-2.5 text-xs font-bold text-slate-400">
              <Play className="w-4 h-4 text-indigo-500" />
              <span>MULTI-FORMAT READY</span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default UploadVideoPanel;