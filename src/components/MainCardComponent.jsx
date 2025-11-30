import '../css/mainPage.css';
import { useNavigate } from 'react-router-dom';

function MainCardComponent({ course, instructorName, instructorImage, currentUser }) {
  const navigate = useNavigate();

  const formatName = (name) => {
    if (!name) return 'İsimsiz';
    const parts = name.trim().split(' ');
    if (parts.length === 1) return parts[0];
    return `${parts[0]} ${parts[parts.length - 1].charAt(0)}.`;
  };


  const displayName = formatName(instructorName);
  const profileImageUrl = instructorImage || 'https://picsum.photos/50/50';
  const courseImageUrl = course?.courseImage || 'https://picsum.photos/350/220';
  const courseName = course?.courseName || 'Kurs Adı';
  const enrollSize = course?.enrollSize || 0;
  const courseLevel = course?.courseLevel || "(Belirtilmedi)";

  const startChat = async () => {
    if (!currentUser) return alert("Mesaj atmak için giriş yapmalısınız.");


    await addDoc(collection(db, 'chats'), {
      participants: [currentUser.uid, course.instructorUid],
      createdAt: serverTimestamp()
    });

    alert("Sohbet başlatıldı! Sağ alttaki kutudan konuşabilirsiniz.");
  };

  return (
    <div className="card m-0 p-0 customCard pb-3 " onClick={() => navigate(`/courseDetail/${course?.id}`)}>
      <img src={courseImageUrl} className="card-img-top customImage p-0 m-0 " style={{ height: '200px' }} alt={courseName}></img>
      <h4 className="text-start ms-2 mt-1 mb-0">{courseName}</h4>
      <div className="d-flex flex-row">

        <span className="badge py-2 px-2 ms-2 mt-0 customBadge" alt="asdsa"> {enrollSize} Çırak </span>
        <span className="badge py-2 px-2 ms-2 mt-0 customBadge bg-success" alt="asdsa"> {courseLevel} </span>
      </div>

      <div className="profileWithButton mt-2">
        <div className="profile">
          <img src={profileImageUrl} className="profileImage" alt="profile"></img>
          <div className="profileInfo ms-2">
            <span className="profileName d-block">{displayName}</span>

          </div>
        </div>
        <button onClick={() => navigate(`/courseDetail/${course?.id}`)} className="btn customButton py-1"><span className="customButtonText fw-bold">İncele</span></button>
      </div>

    </div>
  );
}
export default MainCardComponent;