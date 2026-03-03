import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Layout from './core/layout/Layout';
import AuthForm from './features/auth/components/AuthForm';
import VerifyEmail from './features/auth/pages/VerifyEmail';
import Home from './features/project/pages/Home';
import Task from './features/task/pages/TaskPage';
import Profile from './features/user/components/Profile';
import ProtectedRoute from './features/auth/components/ProtectedRoute';
import CreateProject from './features/project/pages/CreateProject';
import ProjectSettings from './features/project/pages/ProjectSettings';
import TeamMembers from './features/project/pages/TeamMembers';
import AcceptInvite from './features/auth/pages/AcceptInvite';
import RequireProjectAdmin from './features/auth/components/RequireProjectAdmin';
import NotFound from './core/pages/NotFound';
import WorkspaceLayout from './core/layout/WorkspaceLayout';
import { SnackbarProvider } from "./core/context/SnackbarContext";
import { login, logout, setSessionChecked } from './features/auth/store/authSlice';
import { setActiveProject } from './features/project/store/projectSlice';
import { useLazyGetCurrentUserQuery } from './features/auth/api/authApi';
import { LoadingSpinner } from "./core/ui";

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

  if (!sessionChecked) {
    return (
      <div className="flex justify-center items-center h-[100dvh] w-full bg-white dark:bg-[#1a1a1a]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <SnackbarProvider>
      <Router>
        <Layout setIsSignup={setIsSignup}>
          <Routes>
            <Route path="/accept-invite" element={<AcceptInvite />} />
            <Route
              path="/verify-email"
              element={
                <ProtectedRoute>
                  {!isVerified ? <VerifyEmail /> : <NotFound />}
                </ProtectedRoute>
              }
            />
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
                  <AuthForm isSignup={isSignup} />
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
                path="/project/:projectId/your-profile"
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
