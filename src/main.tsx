import React from 'react'
import ReactDOM from 'react-dom/client'
import { NextUIProvider } from '@nextui-org/react'
import { HashRouter, Outlet, Route, Routes, useNavigate } from "react-router-dom";

import './index.css'
import 'react-spring-bottom-sheet/dist/style.css'

import AppLayout from './layouts/AppLayout.tsx';
import LandingPage from './pages/Landing.tsx'
import LoginPage from './pages/Login.tsx';
import SignupPage from './pages/Signup.tsx';
import SignupFormPage from './pages/SignupForm.tsx';

import PublicMiddleware from './components/middlewares/PublicMiddleware.tsx';
import AuthMiddleware from './components/middlewares/AuthMiddleware.tsx';
import UserProvider from './contexts/UserContext.tsx'
import ProfilePage from './pages/Profile.tsx';
import GradeForm from './pages/GradeForm.tsx';
import SubjectRankingPage from './pages/SubjectRanking.tsx';
import ProfileEditPage from './pages/ProfileEdit.tsx';
import TestRankingPage from './pages/TestRanking.tsx';

function App() {
  const navigate = useNavigate();

  return (
    <NextUIProvider navigate={navigate}>
      <UserProvider>
        <Routes>
          
          <Route path="/" element={
            <PublicMiddleware>
              <LandingPage />
            </PublicMiddleware>
          } />
          <Route path="/login" element={
            <PublicMiddleware>
              <LoginPage />
            </PublicMiddleware>
          } />
          <Route path="/signup" element={
            <PublicMiddleware>
              <SignupPage />
            </PublicMiddleware>
          } />

          <Route path="/signup-form" element={
            <AuthMiddleware>
              <SignupFormPage />
            </AuthMiddleware>
          } />

          <Route path="/app"
            element={
              <AuthMiddleware>
                <AppLayout>
                  <Outlet />
                </AppLayout>
              </AuthMiddleware>
            }
          >
            <Route index element={<SubjectRankingPage />} />
            <Route path='test-ranking' element={<TestRankingPage />} />
            <Route path='profile' element={<ProfilePage />} />
            <Route path='profile-edit' element={<ProfileEditPage />} />
            <Route path='grade-form' element={<GradeForm />} />
          </Route>

        </Routes>
      </UserProvider>
    </NextUIProvider>
  )
}


ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <HashRouter>
      <App />
    </HashRouter>
  </React.StrictMode>
)
