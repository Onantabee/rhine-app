import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Layout from "./components/Layout";
import RegistrationForm from "./components/RegistrationForm";
import VerifyEmail from "./pages/VerifyEmail";
import Home from "./pages/Home";
import Task from "./pages/Task";
import Profile from "./components/Profile";
import ProtectedRoute from "./components/ProtectedRoute";
import CreateProject from "./pages/CreateProject";
import ProjectSettings from "./pages/ProjectSettings";
import TeamMembers from "./pages/TeamMembers";
import AcceptInvite from "./pages/AcceptInvite";
import RequireProjectAdmin from './components/RequireProjectAdmin';
import NotFound from './pages/NotFound';
import WorkspaceLayout from "./components/WorkspaceLayout";
import { SnackbarProvider } from "./context/SnackbarContext";
import { login, logout, setSessionChecked } from "./store/slices/authSlice";
import { setActiveProject } from "./store/slices/projectSlice";
import { useLazyGetCurrentUserQuery } from "./store/api/authApi";

function App() {
  const [isSignup, setIsSignup] = useState(false);
  const dispatch = useDispatch();
  const { sessionChecked, isLoggedIn, hasProjects, lastProjectId, isVerified } = useSelector(
    (state) => state.auth
  );
  const activeProject = useSelector((state) => state.project.activeProject);
  const [triggerGetCurrentUser] = useLazyGetCurrentUserQuery();

  useEffect(() => {
    if (!sessionChecked) {
      triggerGetCurrentUser()
        .unwrap()
        .then((userData) => {
          dispatch(
            login({
              email: userData.email,
              name: userData.name,
              hasProjects: userData.hasProjects,
              lastProjectId: userData.lastProjectId,
              isVerified: userData.isVerified,
            })
          );
        })
        .catch(() => {
          dispatch(logout());
          dispatch(setSessionChecked());
        });
    }
  }, []);

  const getDefaultRedirect = () => {
    if (activeProject) return `/project/${activeProject.id}`;
    if (lastProjectId) return `/project/${lastProjectId}`;
    return "/create-project";
  };

  return (
    <SnackbarProvider>
      <Router>
        <Layout setIsSignup={setIsSignup}>
          <Routes>
            <Route path="/accept-invite" element={<AcceptInvite />} />
            <Route path="/verify-email" element={<VerifyEmail />} />
            <Route
              path="/"
              element={
                isLoggedIn ? (
                  !isVerified ? (
                    <Navigate to="/verify-email" replace />
                  ) : (
                    <Navigate to={getDefaultRedirect()} replace />
                  )
                ) : (
                  <RegistrationForm isSignup={isSignup} />
                )
              }
            />

            <Route
              path="/create-project"
              element={
                <ProtectedRoute>
                  {isVerified && !hasProjects ? <CreateProject /> : <NotFound />}
                </ProtectedRoute>
              }
            />

            <Route
              path="/project/:projectId"
              element={
                <ProtectedRoute>
                  {isVerified ? <WorkspaceLayout /> : <Navigate to="/verify-email" replace />}
                </ProtectedRoute>
              }
            >
              <Route index element={<Home />} />
              <Route path="task/:taskId" element={<Task />} />
              <Route element={<RequireProjectAdmin />}>
                <Route path="team" element={<TeamMembers />} />
                <Route path="settings" element={<ProjectSettings />} />
              </Route>
              <Route path="*" element={<NotFound />} />
            </Route>
            <Route element={<WorkspaceLayout />}>
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    {isVerified ? <Profile /> : <Navigate to="/verify-email" replace />}
                  </ProtectedRoute>
                }
              />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
      </Router>
    </SnackbarProvider >
  );
}

export default App;
