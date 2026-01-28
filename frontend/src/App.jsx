import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import RegistrationForm from "./components/RegistrationForm";
import ChooseRole from "./components/ChooseRole";
import Home from "./pages/Home";
import Task from "./pages/Task";
import Profile from "./components/Profile";

function App() {
  const [isSignup, setIsSignup] = useState(false);

  return (
    <Router>
      <Layout setIsSignup={setIsSignup}>
        <Routes>
          <Route
            path="/"
            element={<RegistrationForm isSignup={isSignup} />}
          />
          <Route path="/choose-role" element={<ChooseRole />} />
          <Route path="/home" element={<Home />} />
          <Route path="/task/:taskId" element={<Task />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
