import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Layout from "./components/Layout";
import RegistrationForm from "./components/RegistrationForm";
import ChooseRole from "./components/ChooseRole";
import Home from "./pages/Home";
import Task from "./pages/Task";
import Profile from "./components/Profile";
import ProtectedRoute from "./components/ProtectedRoute";
import { SnackbarProvider } from "./context/SnackbarContext";
import { login, logout, setSessionChecked } from "./store/slices/authSlice";
import { useLazyGetCurrentUserQuery } from "./store/api/authApi";

function App() {
  const [isSignup, setIsSignup] = useState(false);
  const dispatch = useDispatch();
  const { sessionChecked } = useSelector((state) => state.auth);
  const [triggerGetCurrentUser] = useLazyGetCurrentUserQuery();

  // Validate server session on app mount
  useEffect(() => {
    if (!sessionChecked) {
      triggerGetCurrentUser()
        .unwrap()
        .then((userData) => {
          dispatch(login(userData));
        })
        .catch(() => {
          dispatch(logout());
          dispatch(setSessionChecked());
        });
    }
  }, []);

  return (
    <SnackbarProvider>
      <Router>
        <Layout setIsSignup={setIsSignup}>
          <Routes>
            <Route
              path="/"
              element={<RegistrationForm isSignup={isSignup} />}
            />
            <Route
              path="/choose-role"
              element={
                <ProtectedRoute>
                  <ChooseRole />
                </ProtectedRoute>
              }
            />
            <Route
              path="/home"
              element={
                <ProtectedRoute>
                  <Home />
                </ProtectedRoute>
              }
            />
            <Route
              path="/task/:taskId"
              element={
                <ProtectedRoute>
                  <Task />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
          </Routes>
        </Layout>
      </Router>
    </SnackbarProvider>
  );
}

export default App;
