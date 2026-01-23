import { Routes, Route, Navigate } from "react-router";

import { checkAuth } from "./authSlice";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import HomePage from "./components/Pages/HomePage";
import Login from "./components/Pages/Login";
import Signup from "./components/Pages/Signup";
import ProblemPage from "./components/Pages/ProblemPage";
import AdminPanel from "./components/Pages/AdminPanel";
import CompilerPage from "./components/Pages/CompilerPage";

const App = () => {

  const dispatch = useDispatch();
  const { isAuthenticated, user , authChecked } = useSelector((state) => state.auth);

  // check initial authentication
  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  if (!authChecked) {
    return <div className="min-h-screen flex items-center justify-center">
      <span className="loading loading-spinner loading-lg"></span>
    </div>;
  }

  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<HomePage />} />

      {/* Auth pages */}
      <Route path="/login" element={isAuthenticated ? <Navigate to="/problems" replace /> : <Login />} />
      <Route path="/signup" element={isAuthenticated ? <Navigate to="/problems" replace /> : <Signup />} />

      {/* Private */}
      <Route path="/problems" element={isAuthenticated ? <ProblemPage /> : <Navigate to="/login" replace />} />
      <Route path='/admin_panel/*' element={isAuthenticated && user?.role==='admin' ? <AdminPanel /> : <Navigate to='/login' replace />} />
      <Route path='problem/:problemId' element={<CompilerPage />} />
    </Routes>
  );
};

export default App;

