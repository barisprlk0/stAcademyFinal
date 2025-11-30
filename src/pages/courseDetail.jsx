import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { db } from '../config/firebase.js';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import Navbar from '../components/Navbar.jsx';
import CourseDetailInfoCard from '../components/courseDetailInfoCard.jsx';
import ChatWidget from '../components/ChatWidget.jsx';

const CourseDetailPage = ({ currentUser }) => {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [instructor, setInstructor] = useState(null);
  const [loading, setLoading] = useState(true); 

  useEffect(() => {
    const fetchCourseData = async () => {
      if (!id) return;
      try {
        const courseDoc = await getDoc(doc(db, "courses", id));
        if (courseDoc.exists()) {
          const courseData = courseDoc.data();
          setCourse(courseData);

          if (courseData.instructorUid) {
            const instructorDoc = await getDoc(doc(db, "users", courseData.instructorUid));
            if (instructorDoc.exists()) {
              setInstructor(instructorDoc.data());
            }
          }
        } else {
          console.log("------");
        }
      } catch (error) {
        console.error("Kurs detayları gelmedi seebep: : ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourseData();
  }, [id]);

  const onClickEnroll = async () => {
    if (!currentUser) {
      alert("Kursa katılmak için giriş yapmanız gerekiyor.");
      return;
    }

    if (!course || !id) {
      alert("Kurs bilgisi bulunamadı.");
      return;
    }

    try {
      const courseRef = doc(db, 'courses', id);
      const courseDoc = await getDoc(courseRef);

      if (!courseDoc.exists()) {
        alert("Kurs bulunamadı.");
        return;
      }

      const courseData = courseDoc.data();
      const courseParticipants = courseData.courseParticipants || [];
      const enrollSize = courseData.enrollSize || 0;

      if (courseParticipants.includes(currentUser.uid)) {
        alert("Bu kursa zaten kayıtlısınız.");
        return;
      }
      if (courseParticipants.length >= enrollSize) {
        alert("Bu kursun kontenjanı dolmuş.");
        return;
      }

      if (courseData.instructorUid === currentUser.uid) {
        alert("Kendi kursunuza katılamazsınız.");
        return;
      }

      const updatedParticipants = [...courseParticipants, currentUser.uid];
      await updateDoc(courseRef, {
        courseParticipants: updatedParticipants,
        enrollSize: enrollSize - 1
      });
      const instructorUid = courseData.instructorUid;
      const instructorRef = doc(db, 'users', instructorUid);
      const instructorSnap = await getDoc(instructorRef);
if (instructorSnap.exists()) {
              const instructorData = instructorSnap.data();
              const currentInstPoint = instructorData.point || 0;

              await updateDoc(instructorRef, {
                  point: currentInstPoint + 200,
              });
          }





      const userRef = doc(db, 'users', currentUser.uid);
      const userDoc = await getDoc(userRef);
      const data=userDoc.data();
      const point=data.point||0;
      await updateDoc(userRef, {
          point: point+50,
      });
      


      alert("Kursa başarıyla katıldınız.");


      window.location.reload();
    } catch (error) {
      console.error("Kursa katılma hatası:", error);
      alert("Kursa katılırken bir hata oluştu: " + error.message);
    }
  };

  if (loading) {
    return <div className="d-flex justify-content-center align-items-center min-vh-100">Yükleniyor...</div>;
  }

  if (!course) {
    return <div className="d-flex justify-content-center align-items-center min-vh-100">404</div>;
  }

  return (
    <div className="bg-light min-vh-100 pb-5">
      <Navbar currentUser={currentUser} />

      <div
        style={{
          height: '350px',
          width: '100%',
          backgroundImage: `url("${course.courseImage || 'https://img.freepik.com/free-vector/gradient-background-futuristic-technology-concept_23-2149122394.jpg'}")`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          position: 'relative'
        }}
      >
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.4)' }}></div>
      </div>

      <div className="container">
        <div style={{ marginTop: '-120px', position: 'relative', zIndex: 10 }}>
          <CourseDetailInfoCard
            courseName={course.courseName}
            description={course.courseIntroduction}
            instructorName={instructor ? `${instructor.name} ${instructor.surname}` : "Eğitmen Bilgisi Yok"}
            instructorImage={instructor?.profileImage}
            onEnroll={onClickEnroll}
            instructorUid={course.instructorUid}
            currentUser={currentUser}
          />
        </div>

        <div className="row g-4 mt-2">

          <div className="col-lg-8">
            <div className="card shadow-sm border-0 rounded-4 p-4 h-100">
              <h4 className="fw-bold mb-3">Kurs Açıklaması</h4>
              <div className="text-muted">
                <p>
                  {course.courseDescription || "Bu kurs için henüz bir açıklama girilmemiş."}
                </p>
              </div>
            </div>
          </div>

          <div className="col-lg-4">
            <div className="card shadow-sm border-0 rounded-4 p-4 mb-4 text-center">
              <div className="d-flex justify-content-center mb-3">
                <img
                  src={instructor?.profilePictureUrl || "https://picsum.photos/200/200"}
                  alt="Instructor"
                  className="rounded-circle"
                  style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                />
              </div>
              <h4 className="fw-bold mb-1">{instructor ? `${instructor.name} ${instructor.surname}` : "Eğitmen"}</h4>
              <p className="text-muted small mb-3">
                {instructor?.uni ? `${instructor?.uni} - ${instructor.dep}` : "Eğitmen bilgileri yükleniyor..."}
              </p>
            </div>
          </div>

        </div>
      </div>
            <ChatWidget currentUser={currentUser} />

    </div>
  );
};

export default CourseDetailPage;