import { unwrapResult } from "@reduxjs/toolkit";
import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Route, Routes } from "react-router-dom";
import NotFound from "./components/NotFound";
import ConfirmPassword from "./feature/auth/ConfirmPassword";
import EmailVerification from "./feature/auth/EmailVerification";
import ForgetPassword from "./feature/auth/ForgetPassword";
import Singup from "./feature/auth/Signup";
import Singin from "./feature/auth/Singin";
import Home from "./feature/home";
import AdminNavigator from "./feature/navigator/AdminNavigator";
import Navbar from "./feature/user/Navbar";
import { getUserInfo, refreshToken } from "./redux/userSlide";
function App() {
  const user = useSelector(state => state.user);
  const isAdmin = user.profile?.role === 'admin'
  const timeoutId = useRef();
  const dispatch  = useDispatch()
  useEffect(()=>{
    const getInfo = async() =>{
      try {
        if(user.token){
          const res =  await dispatch(getUserInfo(user.token))
          unwrapResult(res)
        }
      }
      catch(err){

      }
    }
    getInfo()
  },[user.token])
  useEffect(()=>{
    const refresh = async() =>{
      try {
        if(localStorage.getItem("firstLogin")){
          const res = await dispatch(refreshToken());
          unwrapResult(res)
        }
      }catch(err){

      }
    }
    refresh()
    timeoutId.current =  setTimeout(()=>{
      refresh()
    },10*60*1000)

    return ()=> clearTimeout(timeoutId)

  },[user.login,dispatch])

  if(isAdmin){
    return (
      <AdminNavigator />
    )
  }

  return (
    <>
    <Navbar/>
    <Routes>
    <Route path="/" element={<Home/>}/>
    <Route path="/auth/signin" element={<Singin/>}/>
    <Route path="/auth/signup" element={<Singup/>}/>
    <Route path="/auth/reset-password" element={<ConfirmPassword/>}/>
    <Route path="/auth/forget-password" element={<ForgetPassword/>}/>
    <Route path="/auth/verification" element={<EmailVerification/>}/>
    <Route path="/*" element={<NotFound/>}/>
    
    </Routes>
    </>
  );
}

export default App;
