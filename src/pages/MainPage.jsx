import React, { useState, useEffect } from 'react';
import '../css/mainPage.css';
import MainCardComponent from '../components/MainCardComponent.jsx';
import Navbar from '../components/Navbar.jsx';
import { IoMdSearch, IoMdCodeWorking } from "react-icons/io";
import { LuPenTool } from "react-icons/lu";
import { BiMath } from "react-icons/bi";
import { FaPaintBrush, FaGuitar } from "react-icons/fa";
import { db } from '../config/firebase.js';
import { collection, getDocs, query, orderBy, limit, doc, getDoc } from 'firebase/firestore';
import ChatWidget from '../components/ChatWidget.jsx';

function MainPage({ currentUser }) {
  const [courses, setCourses] = useState([]);
  const [coursesWithInstructors, setCoursesWithInstructors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [userInterests, setUserInterests] = useState([]);
  const [profileComplete, setProfileComplete] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (currentUser && currentUser.uid) {
        try {
          const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            if (userData.interests && Array.isArray(userData.interests)) {
              setUserInterests(userData.interests);
            }
            if (userData.profileComplete) {
              setProfileComplete(true);
            }
          }
        } catch (error) {
          console.error('Error fetching user profile:', error);
        }
      }
    };

    fetchUserProfile();
  }, [currentUser]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const coursesRef = collection(db, 'courses');
        const q = query(coursesRef, orderBy('createdAt', 'desc'), limit(12));
        const querySnapshot = await getDocs(q);

        const coursesData = [];
        querySnapshot.forEach((doc) => {
          coursesData.push({ id: doc.id, ...doc.data() });
        });

        setCourses(coursesData);

        const coursesWithInstructorData = await Promise.all(
          coursesData.map(async (course) => {
            try {
              if (course.instructorUid) {
                const instructorDoc = await getDoc(doc(db, 'users', course.instructorUid));
                if (instructorDoc.exists()) {
                  const instructorData = instructorDoc.data();
                  return {
                    ...course,
                    instructorName: `${instructorData.name || ''} ${instructorData.surname || ''}`.trim(),
                    instructorImage: instructorData.profilePictureUrl || null
                  };
                }
              }
              return {
                ...course,
                instructorName: null,
                instructorImage: null
              };
            } catch (error) {
              console.error(`Error fetching instructor for course ${course.id}:`, error);
              return {
                ...course,
                instructorName: null,
                instructorImage: null
              };
            }
          })
        );

        setCoursesWithInstructors(coursesWithInstructorData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching courses:', error);
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const handleCategoryClick = (category) => {
    if (selectedCategory === category) {
      setSelectedCategory(null);
    } else {
      setSelectedCategory(category);
    }
  };

  const courseMatchesInterests = (course) => {
    if (!profileComplete || !userInterests || userInterests.length === 0) {
      return true;
    }

    if (course.tags && Array.isArray(course.tags)) {
      for (let i = 0; i < course.tags.length; i++) {
        if (userInterests.includes(course.tags[i])) {
          return true;
        }
      }
      return false;
    }

    const courseText = `${course.courseName || ''} ${course.courseDescription || ''} ${course.courseCategory || ''}`.toLowerCase();
    for (let i = 0; i < userInterests.length; i++) {
      const interestLower = userInterests[i].toLowerCase();
      if (courseText.includes(interestLower)) {
        return true;
      }
    }
    return false;
  };

  const filterCoursesBySearch = (courses) => {
    if (!searchQuery.trim()) {
      return courses;
    }

    const query = searchQuery.toLowerCase().trim();
    return courses.filter(course => {
      const courseName = (course.courseName || '').toLowerCase();
      const courseDescription = (course.courseDescription || '').toLowerCase();
      const courseCategory = (course.courseCategory || '').toLowerCase();
      const instructorName = (course.instructorName || '').toLowerCase();
      const tags = course.tags && Array.isArray(course.tags)
        ? course.tags.map(tag => tag.toLowerCase()).join(' ')
        : '';

      return courseName.includes(query) ||
        courseDescription.includes(query) ||
        courseCategory.includes(query) ||
        instructorName.includes(query) ||
        tags.includes(query);
    });
  };

  let recommendedCourses = coursesWithInstructors;
  if (profileComplete && userInterests.length > 0) {
    recommendedCourses = recommendedCourses.filter(courseMatchesInterests);
  }

  if (selectedCategory) {
    recommendedCourses = recommendedCourses.filter(course => course.courseCategory === selectedCategory);
  }
  recommendedCourses = filterCoursesBySearch(recommendedCourses);

  let recentlyAddedCourses = coursesWithInstructors;
  if (selectedCategory) {
    recentlyAddedCourses = recentlyAddedCourses.filter(course => course.courseCategory === selectedCategory);
  }
  recentlyAddedCourses = filterCoursesBySearch(recentlyAddedCourses);

  return (
    <div className="mainPage">
      <Navbar currentUser={currentUser} />
      <div className="search-container">
        <div className="search-box">
          <input
            type="text"
            placeholder="Ne öğrenmek istersin?"
            className="search-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <span className="search-icon"> <IoMdSearch size={25} /> </span>
        </div>
        <div className="filter-buttons">
          <button
            className={`filter-btn ${selectedCategory === 'Kodlama' ? 'active' : ''}`}
            onClick={() => handleCategoryClick('Kodlama')}
          >
            <IoMdCodeWorking size={25} /> Kodlama
          </button>
          <button
            className={`filter-btn ${selectedCategory === 'Tasarım' ? 'active' : ''}`}
            onClick={() => handleCategoryClick('Tasarım')}
          >
            <LuPenTool size={25} /> Tasarım
          </button>
          <button
            className={`filter-btn ${selectedCategory === 'Matematik' ? 'active' : ''}`}
            onClick={() => handleCategoryClick('Matematik')}
          >
            <BiMath size={25} />Matematik
          </button>
          <button
            className={`filter-btn ${selectedCategory === 'Resim' ? 'active' : ''}`}
            onClick={() => handleCategoryClick('Resim')}
          >
            <FaPaintBrush size={25} /> Resim
          </button>
          <button
            className={`filter-btn ${selectedCategory === 'Enstürman' ? 'active' : ''}`}
            onClick={() => handleCategoryClick('Enstürman')}
          >
            <FaGuitar size={25} />Enstrüman
          </button>
        </div>
      </div>

      {profileComplete && userInterests.length > 0 && recommendedCourses.length > 0 && (
        <>
          <div className="title-section">
            <h2 className="lastAdds">Sizin İçin Önerilenler</h2>
            <hr />
          </div>

          <div className="row mt-3">
            <div className="col-9">
              <div className="row">
                {loading ? (
                  <div className="col-12 text-center">
                    <p>Yükleniyor...</p>
                  </div>
                ) : (
                  recommendedCourses.map((course) => (
                    <div key={course.id} className="col-4 mb-3">
                      <MainCardComponent
                        course={course}
                        instructorName={course.instructorName}
                        instructorImage={course.instructorImage}
                        currentUser={currentUser}
                      />
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </>
      )}

      <div className="title-section" style={{ marginTop: profileComplete && userInterests.length > 0 && recommendedCourses.length > 0 ? '40px' : '20px' }}>
        <h2 className="lastAdds">Son Eklenenler</h2>
        <hr />
      </div>

      <div className="row mt-3">
        <div className="col-9">
          <div className="row">
            {loading ? (
              <div className="col-12 text-center">
                <p>Yükleniyor...</p>
              </div>
            ) : (
              recentlyAddedCourses.map((course) => (
                <div key={course.id} className="col-4 mb-3">
                  <MainCardComponent
                    course={course}
                    instructorName={course.instructorName}
                    instructorImage={course.instructorImage}
                    currentUser={currentUser}
                  />
                </div>
              ))
            )}
          </div>
        </div>
      </div>
      <ChatWidget currentUser={currentUser} />
    </div>
  );
}

export default MainPage;