import { useState } from 'react'
import MainPage from './pages/MainPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import  AddCourse from './pages/addCourse.jsx';
import WelcomePage from './pages/WelcomePage.jsx';
import UserProfile from './pages/UserProfile.jsx';
import UserComplete from './pages/UserComplete.jsx';

import { useEffect } from 'react';
import { onAuthStateChanged } from "firebase/auth";
import { auth } from '../src/config/firebase.js';

import CourseDetail from './pages/courseDetail.jsx';
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";

import './App.css'
import CourseDetailInfoCard from './components/courseDetailInfoCard'
function HomePage() {
  const navigate = useNavigate();
  <div>


  </div>
}
function App() {
  const [currentUser, setCurrentUser] = useState(null);
  useEffect(() => onAuthStateChanged(auth, (user) => {
    if (user) {
      setCurrentUser(user);
    } else {
      setCurrentUser(null);
    }
  }), [])

  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<MainPage currentUser={currentUser} />} />
          <Route path="/register" element={<RegisterPage currentUser={currentUser} />} />
          <Route path="/login" element={<LoginPage currentUser={currentUser} />} />
          <Route path="/addCourse" element={<AddCourse currentUser={currentUser} />} />
          <Route path="/courseDetail/:id" element={<CourseDetail currentUser={currentUser} />} />
          <Route path="/welcome" element={<WelcomePage />} />
          <Route path="/profile" element={<UserProfile currentUser={currentUser} />} />
          <Route path="/usercomplete" element={<UserComplete currentUser={currentUser} />} />
        </Routes>
      </Router>

    </>
  )
}

export default App
