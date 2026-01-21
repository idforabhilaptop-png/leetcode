import { Routes, Route, Navigate } from "react-router";

import { checkAuth } from "./authSlice";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import HomePage from "./components/Pages/HomePage";
import Login from "./components/Pages/Login";
import Signup from "./components/Pages/Signup";
import AfterLogin from "./components/Pages/AfterLogin";

const App = () => {

  const dispatch = useDispatch();
  const { isAuthenticated, loading } = useSelector((state) => state.auth);

  // check initial authentication
  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  if (loading) {
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
      <Route path="/signup" element={isAuthenticated ? <Navigate to="/problems" replace /> : <Signup />}/>

      {/* Private */}
      <Route path="/problems" element={ isAuthenticated ? <AfterLogin /> : <Navigate to="/login" replace />}/>
    </Routes>
  );
};

export default App;

