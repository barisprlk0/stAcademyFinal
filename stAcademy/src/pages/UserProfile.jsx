import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar.jsx';
import { db } from '../config/firebase.js';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import '../css/mainPage.css';
import MainCardComponent from '../components/MainCardComponent.jsx';

function UserProfile({ currentUser }) {
    const [userProfile, setUserProfile] = useState(null);
    const [userCourses, setUserCourses] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUserProfileAndCourses = async () => {
            if (currentUser && currentUser.uid) {
                try {
                    const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
                    if (userDoc.exists()) {
                        setUserProfile(userDoc.data());
                    }

                    const coursesQuery = query(collection(db, 'courses'), where('instructorUid', '==', currentUser.uid));
                    const querySnapshot = await getDocs(coursesQuery);
                    const courses = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                    setUserCourses(courses);

                } catch (error) {
                    console.error('Error fetching user data:', error);
                } finally {
                    setLoading(false);
                }
            } else {
                setLoading(false);
            }
        };

        fetchUserProfileAndCourses();
    }, [currentUser]);

    if (loading) {
        return (
            <div className="mainPage">
                <Navbar currentUser={currentUser} />
                <div className="container mt-5 text-center">
                    <div className="spinner-border text-danger" role="status">
                        <span className="visually-hidden">Yükleniyor...</span>
                    </div>
                </div>
            </div>
        );
    }

    if (!currentUser) {
        return (
            <div className="mainPage">
                <Navbar currentUser={currentUser} />
                <div className="container mt-5 text-center">
                    <div className="alert alert-warning" role="alert">
                        Lütfen profilinizi görüntülemek için giriş yapın.
                    </div>
                </div>
            </div>
        );
    }

    const displayName = userProfile
        ? `${userProfile.name || ''} ${userProfile.surname || ''}`.trim()
        : 'Kullanıcı Bilgisi Bulunamadı';

    const displayUni = userProfile?.uni || 'Üniversite Bilgisi Yok';
    const displayDep = userProfile?.dep || 'Bölüm Bilgisi Yok';
    const profileImage = userProfile?.profilePictureUrl || 'https://picsum.photos/150/150';
    const email = userProfile?.email || currentUser.email;
    const interests = userProfile?.interests || [];


    return (
        <div className="mainPage" >
            <Navbar currentUser={currentUser} />

            <div className="container mt-5 pb-5">
                <div className="card shadow-sm border-0 rounded-4 p-4" style={{ backgroundColor: '#fff' }}>
                    <div className="row g-4 align-items-center">
                        <div className="col-md-4 text-center border-end">
                            <img
                                src={profileImage}
                                alt="Profile"
                                className="rounded-circle mb-3 shadow-sm"
                                style={{ width: '150px', height: '150px', objectFit: 'cover' }}
                            />
                            <h3 className="fw-bold mb-1 text-dark">{displayName}</h3>
                            <p className="text-muted mb-3">{email}</p>
                            <span className="badge bg-warning fw-bold text-black rounded-pill px-3 py-2"> {userProfile?.point || 0} </span>
                        </div>

                        <div className="col-md-8">
                            <h4 className="fw-bold mb-4 text-dark border-bottom pb-2">Profil Detayları</h4>

                            <div className="row g-3">
                                <div className="col-md-6">
                                    <div className="p-3 rounded-3" style={{ backgroundColor: '#f8f9fa' }}>
                                        <small className="text-muted d-block mb-1">Üniversite</small>
                                        <span className="fw-semibold text-dark">{displayUni}</span>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="p-3 rounded-3" style={{ backgroundColor: '#f8f9fa' }}>
                                        <small className="text-muted d-block mb-1">Bölüm</small>
                                        <span className="fw-semibold text-dark">{displayDep}</span>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="p-3 rounded-3" style={{ backgroundColor: '#f8f9fa' }}>
                                        <small className="text-muted d-block mb-1">Üyelik Tarihi</small>
                                        <span className="fw-semibold text-dark">
                                            {currentUser.metadata.creationTime ? new Date(currentUser.metadata.creationTime).toLocaleDateString('tr-TR') : '-'}
                                        </span>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="p-3 rounded-3" style={{ backgroundColor: '#f8f9fa' }}>
                                        <small className="text-muted d-block mb-2"> Etiketler </small>
                                        {interests && interests.length > 0 ? (
                                            <div className="d-flex flex-wrap gap-2">
                                                {interests.map((tag, index) => (
                                                    <span
                                                        key={index}
                                                        className="badge bg-primary"
                                                        style={{
                                                            fontSize: '14px',
                                                            padding: '8px 12px',
                                                            borderRadius: '20px'
                                                        }}
                                                    >
                                                        {tag}
                                                    </span>
                                                ))}
                                            </div>
                                        ) : (
                                            <span className="text-muted">Etiket bulunmuyor</span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="mt-4 text-end">

                            </div>
                        </div>
                    </div>
                </div>

                {userCourses.length > 0 && (
                    <div className="mt-5">
                        <h4 className="fw-bold mb-4 text-dark">Verdiği Dersler</h4>
                        <div id="courseCarousel" className="carousel slide" data-bs-ride="carousel">
                            <div className="carousel-inner">
                                {userCourses.length <= 3 ? (
                                    <div className="carousel-item active">
                                        <div className="row g-4">
                                            {userCourses.map(course => (
                                                <div key={course.id} className="col-md-4">
                                                    <MainCardComponent
                                                        course={course}
                                                        instructorName={displayName}
                                                        instructorImage={profileImage}
                                                        currentUser={currentUser}
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ) : (
                                    userCourses.map((_, index) => {
                                        const currentWindow = [
                                            userCourses[index],
                                            userCourses[(index + 1) % userCourses.length],
                                            userCourses[(index + 2) % userCourses.length]
                                        ];

                                        return (
                                            <div key={index} className={`carousel-item ${index === 0 ? 'active' : ''}`}>
                                                <div className="row g-4">
                                                    {currentWindow.map((course, i) => (
                                                        <div key={`${index}-${i}`} className="col-md-4">
                                                            <MainCardComponent
                                                                course={course}
                                                                instructorName={displayName}
                                                                instructorImage={profileImage}
                                                                currentUser={currentUser}
                                                            />
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        );
                                    })
                                )}
                            </div>
                            {userCourses.length > 3 && (
                                <>
                                    <button className="carousel-control-prev" type="button" data-bs-target="#courseCarousel" data-bs-slide="prev" style={{ width: '5%' }}>
                                        <span className="carousel-control-prev-icon bg-dark rounded-circle p-3" aria-hidden="true"></span>
                                        <span className="visually-hidden">Önceki</span>
                                    </button>
                                    <button className="carousel-control-next" type="button" data-bs-target="#courseCarousel" data-bs-slide="next" style={{ width: '5%' }}>
                                        <span className="carousel-control-next-icon bg-dark rounded-circle p-3" aria-hidden="true"></span>
                                        <span className="visually-hidden">Sonraki</span>
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default UserProfile;