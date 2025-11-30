import React, { useState, useEffect } from 'react';
import '../css/navbar.css';
import { useNavigate } from 'react-router-dom';
import { db, auth } from '../config/firebase.js';
import { doc, getDoc } from 'firebase/firestore';
import { signOut } from 'firebase/auth';


function Navbar({ currentUser }) {

    const navigate = useNavigate();
    const [userProfile, setUserProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUserProfile = async () => {
            if (currentUser && currentUser.uid) {
                try {
                    const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
                    if (userDoc.exists()) {
                        setUserProfile(userDoc.data());
                    }
                } catch (error) {
                    console.error('Error fetching user profile:', error);
                } finally {
                    setLoading(false);
                }
            } else {
                setLoading(false);
            }
        };

        fetchUserProfile();
    }, [currentUser]);

    const goToHome = () => {
        navigate('/');
    };
    const goToRegister = () => {
        navigate('/register');
    };
    const goToLogin = () => {
        navigate('/login');
    };
    const goToProfile = () => {
        navigate('/profile');
    };

    const goToAddCourse = () => {
        navigate('/addCourse');
    };



    const handleLogout = async () => {
        try {
            await signOut(auth);
            navigate('/login');
        } catch (error) {
            console.error("Error signing out: ", error);
        }
    };

    const displayName = userProfile
        ? `${userProfile.name || ''} ${userProfile.surname || ''}`.trim()
        : 'AD SOYAD BİLGİSİ';

    const displayUni = userProfile?.uni || 'ÜNİ BİLGİSİ';
    const displayDep = userProfile?.dep || 'CSE';
    const profileImage = userProfile?.profilePictureUrl || 'https://picsum.photos/50/50';

    return (
        <nav className="navbar navbar-expand-lg sticky-top custom-navbar">
            <div className="container">
                <div className="navbar-brand fw-bold d-flex align-items-center" onClick={goToHome} style={{ cursor: 'pointer' }}>
                    <span style={{ color: '#f9423a', fontSize: '1.5rem' }}>st</span>
                    <span style={{ color: '#333', fontSize: '1.5rem' }}>Akademi</span>
                </div>



                <div className="d-flex align-items-center">
                    
                    {currentUser ? (
                    
                    
                    <div className="d-flex align-items-center gap-3">

                 <div className="btn btn-danger">
                    <a onClick={goToAddCourse} className="nav-link-custom text-white flex-end">Ders Ver</a>

                    </div>

                            <div className="d-flex align-items-center gap-3 profile-section" onClick={goToProfile} style={{ cursor: 'pointer' }}>
                                  <div className="imgWithBadge d-flex flex-column">

                                    <img
                                    src={profileImage}
                                    alt="Profile"
                                    className="rounded-circle border border-2 border-white shadow-sm"
                                    style={{ width: '45px', height: '45px', objectFit: 'cover' }}
                                />
                                <badge className="badge bg-warning text-black fw-bold py-1 px-2" style={{ borderRadius:50 }}>{userProfile?.point || 0}</badge>

                                  </div>

                                <div className="text-start d-none d-sm-block lh-1">
                                    <div className="fw-bold text-dark " style={{ fontSize: '0.9rem' }}>{displayName}</div>
                                    
                                    <div className="text-muted mt-2" style={{ fontSize: '0.75rem' }}>{displayUni}</div>
                                    <div className="text-muted" style={{ fontSize: '0.75rem' }}>{displayDep}</div>
                                </div>

                            </div>
                            <button
                                onClick={handleLogout}
                                className="btn btn-link text-danger p-0 ms-2"
                                style={{ textDecoration: 'none', fontSize: '1.5rem' }}
                                title="Çıkış Yap"
                            >
                                <i className="bi bi-box-arrow-right"></i>

                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-box-arrow-right" viewBox="0 0 16 16">
                                    <path fillRule="evenodd" d="M10 12.5a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v2a.5.5 0 0 0 1 0v-2A1.5 1.5 0 0 0 9.5 2h-8A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-2a.5.5 0 0 0-1 0v2z" />
                                    <path fillRule="evenodd" d="M15.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 0 0-.708.708L14.293 7.5H5.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3z" />
                                </svg>
                            </button>
                        </div>
                    ) : (
                        <div className="d-flex gap-2">
                            <button onClick={goToLogin} className="btn btn-outline-danger rounded-pill px-4 btn-sm fw-semibold">Giriş Yap</button>
                            <button onClick={goToRegister} className="btn btn-danger rounded-pill px-4 btn-sm fw-semibold">Kayıt Ol</button>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
}

export default Navbar;
