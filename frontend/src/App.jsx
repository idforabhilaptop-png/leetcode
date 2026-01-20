import {  Routes, Route } from "react-router";
import HomePage from "./components/HomePage";
import Login from "./components/Login";
import Signup from "./components/Signup";
const App = () => {
  return (
    <div>
      
      <Routes>
         <Route path="/" element={<HomePage />}></Route>
         <Route path="/login" element={<Login />}></Route>
         <Route path="/signup" element={<Signup/>}></Route>
      </Routes>
    </div>

  )
}

export default App

