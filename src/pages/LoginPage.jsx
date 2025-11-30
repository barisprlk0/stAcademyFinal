import React from 'react';
import Navbar from '../components/Navbar.jsx';
import '../css/authPage.css';
import CustomButton from '../components/CustomButton.jsx';
import {useNavigate} from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../config/firebase.js';
import { useState } from 'react';
import LoginImage from '../assets/loginPagePhoto.png';
function LoginPage({ currentUser }) {
    const [email,setEmail] = useState("");
    const [password,setPassword] = useState("");
    const navigate = useNavigate();
    const goToRegister = () => {
        navigate('/register');
    };
    const handleLogin = async() =>  {
        if(email=="" || password==""){
          alert("Lütfen tüm alanları doldurunuz.");
          return;
        }
        try{
          await signInWithEmailAndPassword(auth,email,password);
          alert("Giriş Başarılı");
          navigate("/");
        }catch(error){
          if(error instanceof Error){
            alert(error.message);
          } else{
            alert("Giriş sırasında bir hata oluştu.");
          }
        }
      }

    return (
        <div className="loginPage">
            <Navbar currentUser={currentUser} />
                <div className="row mt-5">
        <div className="col-4 ">
            <div className="authContainer ">
                <h2 className="authTitle">Giriş Yap</h2>
                <div className="form-group">


                    <div className="d-flex flex-column align-items-start">
                    <h5 className="m-0 mx-2">E-Posta </h5> 
                    <input id="email" value={email} onChange={(e)=>setEmail(e.target.value)} type="email" placeholder="kaanbese@gmail.com" className="authInput form-control w-100 mb-3" />
                    </div>

                    <div className="d-flex flex-column align-items-start">
                    <h5 className="m-0 mx-2">Şifre </h5> 
                    <input id="password" value={password} onChange={(e)=>setPassword(e.target.value)} type="password" placeholder="•••••••••••" className="authInput form-control w-100 mb-3" />
                    </div>

                    



                </div>

            </div>

            <div className="d-flex justify-content-between align-items-start mt-3" >
                <p className='btn btn-link' onClick={goToRegister} > Hesabınız yok mu, kayıt olun. </p>
                <CustomButton myMethod={handleLogin} text="Giriş Yap" />
                </div>            



            
            </div>
            
            <div className="col-8">
                <img src = {LoginImage} style={{width:800,}} alt="Register" className=" authImage " />
            </div>

            </div>
        </div>
    )
}

export default LoginPage;