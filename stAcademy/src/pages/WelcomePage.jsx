

import Navbar from '../components/Navbar.jsx';

import { FaBookOpen } from "react-icons/fa";
import { GiTeacher } from "react-icons/gi";
import { FaUsers } from "react-icons/fa";
import image from "../assets/collabration.jpg";
function WelcomePage() {
  return (
    <div>
      <Navbar />
      <div className="container my-4">

        <img
          src={image}
          alt="Ekip Çalışması"
          className="img-fluid rounded"
          style={{ maxHeight: '300px', width: '100%', objectFit: 'cover' }}
        />

        <div className="d-flex flex-column align-items-start ">

          <h2 className="mt-3 mb-3 fw-bold">Nasıl Çalışır?</h2>
          <hr className="my-0" style={{ width: '300px', borderTop: '3px solid #000000ff' }} />
        </div>

      </div>


      <div className="container mb-5">
        <div className="row">

          <div md={4} className="col mb-4">
            <div className='card shadow-sm h-100 border-0 bg-light'>
              <div className="card-body">
                <div className='card-title fw-bold fs-5 mb-3'>
                  <FaBookOpen size={30} className="me-2" /> Ders Al
                </div>
                <div className="card-text">
                  Explore a wide range of courses and programs available to you. Browse through different subjects, discover what interests you the most, and enroll in courses taught by confident students who are experienced in their field. Choose the ones that best suit your goals and preferences                </div>
              </div>
            </div>
          </div>

          <div md={4} className="col mb-4">
            <div className='card shadow-sm h-100 border-0'>
              <div className="card-body">
                <div className='card-title fw-bold fs-5 mb-3'>
                  <GiTeacher size={30} className="me-2" /> Ders Ver
                </div>
                <div className="card-text">
                  Share your knowledge by offering courses to others. Create lessons in subjects you are confident in and help fellow students learn and grow. Choose the topics you are passionate about and guide others with your expertise                  </div>
              </div>
            </div>
          </div>

          <div md={4} className="col mb-4">
            <div className='card shadow-sm h-100 border-0'>
              <div className="card-body">
                <div className='card-title fw-bold fs-5 mb-3'>
                  <FaUsers size={30} className="me-2" /> Topluluklara Katıl
                </div>
                <div className="card-text">
                  Join communities that match your interests and connect with like-minded students. Share ideas, collaborate on projects, and learn together in a supportive and engaging environment                  </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

  )
}

export default WelcomePage;