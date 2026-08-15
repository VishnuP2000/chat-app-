import React from "react";
import SignIn from "../src/pages/signIn";
import { Route, Routes } from "react-router-dom";
import SignUp from "../src/pages/SignUp";
import Dashboard from "./pages/Dashboard";
import Home from "./pages/Home";
import ShowUsers from "./pages/ShowUsers";
import Profile from "./pages/Profile"
import ProtectedRoute from "./components/protectedRoute/protectedRoute";


function App() {
  return (
    <div className="">
      <Routes>
        <Route path={"/"} element={<Home />} />
        <Route path={"/Profile"} element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path={"/showUsers"} element={<ProtectedRoute><ShowUsers /></ProtectedRoute>} />
        {/* <Route path={"/Dashboard"} element={<ProtectedRoute><Dashboard/></ProtectedRoute>} /> */}
        <Route path={"/sign-in"} element={<SignIn />} />
        <Route path={"/sign-up"} element={<SignUp />} />
        <Route path={"/Dashboard"} element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      </Routes>
    </div>
  );
}

export default App;
