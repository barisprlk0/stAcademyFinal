import React, { useState } from 'react';
import { db } from '../config/firebase';
import { collection, query, where, getDocs, addDoc, serverTimestamp } from 'firebase/firestore';

function CourseDetailInfoCard({ courseName, description, instructorName, instructorImage, onEnroll, instructorUid, currentUser }) {

  const [loading, setLoading] = useState(false);

  const handleContactInstructor = async () => {


    if (!instructorUid) {
      alert("Eğitmen bilgisi bulunamadı.");
      return;
    }

    if (currentUser.uid === instructorUid) {
      alert("Kendinize mesaj atamazsınız.");
      return;
    }

    setLoading(true);

    try {
      const chatsRef = collection(db, 'chats');

      const q = query(chatsRef, where('participants', 'array-contains', currentUser.uid));
      const querySnapshot = await getDocs(q);

      let chatExists = false;

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        if (data.participants.includes(instructorUid)) {
          chatExists = true;
        }
      });

      if (chatExists) {
        alert("Bu kişiyle daha önce sohbet oluşturulmuş, sohbeti açabilirsiniz!");
      } else {
        await addDoc(chatsRef, {
          participants: [currentUser.uid, instructorUid],
          createdAt: serverTimestamp(),
          startedBy: currentUser.uid
        });
        alert("Sohbet başlatıldı. Ekranın sağ alt köşesindeki sohbet iconundan sohbete erişebilirsin.");
      }

    } catch (error) {
      console.error("Sohbet başlatma hatası:", error);
      alert("Bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card shadow-sm border-0 rounded-4 p-4 infoCard">
      <div className="row g-4 align-items-center infoCardRow">

        <div className="col-md-8 infoCardContent">
          <h2 className="fw-bold mb-3 infoCardTitle">{courseName || "Kurs Adı"}</h2>
          <p className="text-muted infoCardDescription">
            {description ? (description.length > 150 ? description.substring(0, 150) + "..." : description) : "Açıklama yok."}
          </p>
        </div>

        <div className="col-md-4 infoCardInstructor">
          <div className="d-flex flex-column align-items-center text-center infoCardInstructorContent">

            <div className="d-grid gap-2 w-75">
              <button onClick={onEnroll} className="btn btn-danger fw-semibold infoCardJoinButton">Katıl</button>

              <button
                onClick={handleContactInstructor}
                disabled={loading}
                className="btn btn-outline-warning btn-sm infoCardContactButton"
              >
                {loading ? "İşleniyor..." : "Eğitmenle İletişime Geç"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
export default CourseDetailInfoCard;