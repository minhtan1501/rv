import React from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import Container from '../../components/Container'

function NotVerified() {
    const user = useSelector((state) => state.user)
    const nagative = useNavigate()
    const nagativeToVerification = () =>{
      nagative('/auth/verification',{state:{user:user.user._id,replace:true}})
    }
  
    return (
     <Container>
       {user.isLogin && !user.user.isVerified ? 
       <p className="text-lg text-center bg-blue-50 p-2">
         It looks like you haven't verifed your account{" "}
         <button onClick={nagativeToVerification} className='text-blue-500 font-semibold hover:underline'>click here to verify your account.</button>
       </p>
      : null
    }
     </Container>
    )
}

export default NotVerified