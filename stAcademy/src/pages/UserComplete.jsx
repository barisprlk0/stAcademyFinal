import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar.jsx';
import '../css/authPage.css';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../config/firebase.js';
import { doc, updateDoc } from 'firebase/firestore';
import CustomButton from '../components/CustomButton.jsx';

const subjectTags = [
    "Matematik", "Fizik", "Kimya", "Biyoloji", "Tarih",
    "Coğrafya", "Felsefe", "Psikoloji", "Sosyoloji", "Ekonomi",
    "İşletme", "Muhasebe", "Finans", "Pazarlama", "İnsan Kaynakları",
    "Bilgisayar Bilimi", "Yazılım Mühendisliği", "Veri Bilimi", "Yapay Zeka", "Siber Güvenlik",
    "Web Geliştirme", "Mobil Uygulama", "Veritabanı", "Ağ Teknolojileri", "Bulut Bilişim",
    "Makine Mühendisliği", "Elektrik Mühendisliği", "Elektronik", "Endüstri Mühendisliği", "İnşaat Mühendisliği",
    "Mimarlık", "İç Mimarlık", "Peyzaj Mimarlığı", "Şehir Planlama", "Tasarım",
    "Grafik Tasarım", "Görsel İletişim", "Dijital Sanat", "Animasyon", "Video Prodüksiyon",
    "Fotoğrafçılık", "Sinema", "Televizyon", "Radyo", "Gazetecilik",
    "Halkla İlişkiler", "Reklamcılık", "İletişim", "Medya", "Sosyal Medya",
    "Edebiyat", "Türk Dili", "İngilizce", "Almanca", "Fransızca",
    "Çeviri", "Dilbilim", "Kültürel Çalışmalar", "Sanat Tarihi", "Müzik",
    "Tiyatro", "Dans", "Gastronomi", "Turizm", "Otelcilik",
    "Hukuk", "Siyaset Bilimi", "Uluslararası İlişkiler", "Kamu Yönetimi", "Kriminoloji",
    "Tıp", "Hemşirelik", "Eczacılık", "Diş Hekimliği", "Veterinerlik",
    "Fizyoterapi", "Beslenme", "Spor Bilimleri", "Antrenörlük", "Sağlık Yönetimi",
    "Eğitim Bilimleri", "Öğretmenlik", "Rehberlik", "Özel Eğitim", "Okul Öncesi",
    "Çocuk Gelişimi", "Sosyal Hizmet", "Çevre Bilimleri", "Sürdürülebilirlik", "Enerji",
    "Tarım", "Ziraat", "Gıda Bilimi", "Biyoteknoloji", "Genetik",
    "Nanoteknoloji", "Malzeme Bilimi", "Jeoloji", "Astronomi", "Uzay Bilimleri",
    "Denizcilik", "Havacılık", "Lojistik", "Ulaştırma", "Girişimcilik",
    "İnovasyon", "Proje Yönetimi", "Kalite Yönetimi", "İş Analizi", "Strateji"
];

function UserComplete({ currentUser }) {
    const [selectedTags, setSelectedTags] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        if (!currentUser) {
            navigate('/');
        }
    }, [currentUser, navigate]);

    const toggleTag = (tag) => {
        if (selectedTags.includes(tag)) {
            setSelectedTags(selectedTags.filter(t => t !== tag));
        } else {
            if (selectedTags.length <=10) {
                setSelectedTags([...selectedTags, tag]);
            } 

            else {
                alert("En fazla 10 ilgi alanı seçebilirsiniz.");
            }
        }
    };

    const handleComplete = async () => {
        if (!currentUser) {
            alert("Kullanıcı bilgisi bulunamadı.");
            navigate('/login');
            return;
        }

        try {
            if (selectedTags.length <= 3) {
                alert("En az 3 ilgi alanı seçmelisiniz.");
                return;
            }  
            const userDocRef = doc(db, "users", currentUser.uid);
            await updateDoc(userDocRef, {
                interests: selectedTags,
                profileComplete: true
            });

            alert("Profil tamamlandı!");
            navigate("/");
        } catch (error) {
            alert("İlgi alanları kaydedilirken bir hata oluştu.");
        }
    };

    const filteredTags = subjectTags.filter(tag =>
        tag.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="registerPage">
            <Navbar currentUser={currentUser} />
            <div className="row mt-5">
                <div className="col-8 mx-auto">
                    <div className="authContainer">
                        <h2 className="authTitle">Profilinizi Tamamlayın</h2>
                        <p className="text-center mb-4">
                            İlginizi çeken en az 3 en fazla 10 konu seçiniz.
                        </p>
                        
                        <div className="mb-4">
                            <div className="d-flex flex-column align-items-start">
                                <h5 className="m-0 mx-2 mb-2">İlgi Alanlarınızı Arayın</h5>
                                <input
                                    type="text"
                                    placeholder="Ara..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="authInput form-control w-100 mb-3"
                                />
                            </div>
                        </div>

                        <div className="mb-3">
                            <p className="text-center">
                                <strong>Seçilen: {selectedTags.length} / 10</strong>
                            </p>
                        </div>

                        <div className="tags-container mb-4" style={{
                            maxHeight: '400px',
                            overflowY: 'auto',
                            border: '1px solid #ddd',
                            borderRadius: '8px',
                            padding: '15px',
                            backgroundColor: '#f9f9f9'
                        }}>
                            <div className="d-flex flex-wrap gap-2">
                                {filteredTags.map((tag, index) => {
                                    const isSelected = selectedTags.includes(tag);
                                    return (
                                        <button
                                            key={index}
                                            onClick={() => toggleTag(tag)}
                                            className={`btn ${isSelected ? 'btn-primary' : 'btn-outline-primary'}`}
                                            style={{
                                                fontSize: '14px',
                                                padding: '8px 16px',
                                                borderRadius: '20px',
                                                border: isSelected ? '2px solid #0d6efd' : '1px solid #0d6efd',
                                                backgroundColor: isSelected ? '#0d6efd' : 'transparent',
                                                color: isSelected ? 'white' : '#0d6efd',
                                                cursor: 'pointer',
                                                transition: 'all 0.2s'
                                            }}
                                            disabled={!isSelected && selectedTags.length >= 10}
                                        >
                                            {tag}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {selectedTags.length > 0 && (
                            <div className="mb-4">
                                <h5 className="mb-2">Seçilen İlgi Alanları:</h5>
                                <div className="d-flex flex-wrap gap-2">
                                    {selectedTags.map((tag, index) => (
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
                            </div>
                        )}

                        <div className="d-flex justify-content-center mt-4">
                            <CustomButton myMethod={handleComplete} text="Tamamla" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default UserComplete;

