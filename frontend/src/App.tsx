import React from "react";
import SignIn from "../src/pages/signIn";
import { Route, Routes } from "react-router-dom";
import SignUp from "../src/pages/SignUp";
import Dashboard from "./pages/Dashboard";
import Home from "./pages/Home";
import ShowUsers from "./pages/ShowUsers";
import Profile from "./pages/Profile"


function App() {
  return (
    <div className="">
      <Routes>
        <Route path={"/"} element={<Home />} />
        <Route path={"/Profile"} element={<Profile />} />
        <Route path={"/showUsers"} element={<ShowUsers />} />
        <Route path={"/sign-in"} element={<SignIn />} />
        <Route path={"/Dashboard"} element={<Dashboard/>} />
        <Route path={"/sign-up"} element={<SignUp />} />
        <Route path={"/dashboard"} element={<Dashboard />} />
      </Routes>
    </div>
  );
}

export default App;
