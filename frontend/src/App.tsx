import React from "react";
import SignIn from "../src/pages/signIn";
import { Route, Routes } from "react-router-dom";
import SignUp from "../src/pages/SignUp";
import Dashboard from "./pages/Dashboard";


function App() {
  return (
    <div className="">
      <Routes>
        <Route path={"/"} element={<Dashboard />} />
        <Route path={"/sign-in"} element={<SignIn />} />

        <Route path={"/sign-up"} element={<SignUp />} />
        <Route path={"/dashboard"} element={<Dashboard />} />
      </Routes>
    </div>
  );
}

export default App;
