import React, { useEffect, useState } from 'react'
import { ImSpinner3 } from 'react-icons/im'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { resetPassword, verifyPasswordResetToken } from '../../api/auth'
import Container from '../../components/Container'
import FormContainer from '../../components/form/FormContainer'
import InputFiled from '../../components/form/InputFiled'
import Submit from '../../components/form/Submit'
import Title from '../../components/form/Title'
import { useNotification } from '../../hooks'
import { commonModalClasses } from '../../utils/theme'
function ConfirmPassword() {
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')
  const id = searchParams.get('id');
  const [isVerifying, setIsVerifying] = useState(true);
  const [isValid, setIsValid] = useState(false);
  const {updateNotification} = useNotification()
  const [loadding,setLoadding] = useState(false)
  const [password,setPassword] = useState({
    passwordOne: '',
    passwordTwo: '',
  })
  const nagative = useNavigate()


  const handleChangePassword = (e) =>{
    setPassword(pre =>({
      ...pre,
      [e.target.name]: e.target.value
    }))
  }
  const handleSubmit = async(e) => {
    try {
      e.preventDefault()

      if(password.passwordOne.trim().length < 8) return updateNotification('error','Password must be 8 characters long!')
      if(password.passwordOne !== password.passwordTwo) return updateNotification('error',"Password do not match!")
      setLoadding(true);
      const res = await resetPassword({newPassword:password.passwordOne,userId:id,token:token});
      updateNotification('success',res.message);
      setLoadding(false);
      nagative('/auth/signin',{replace:true})
      
    }
    catch(err) {
      setLoadding(false);
      updateNotification('error',err?.toString().replace("Error:",'').trim())
    }

  }

  const isValidToken = async () => {
    try {
      if(token && id ){
        const res = await  verifyPasswordResetToken(token,id);
        setIsVerifying(false)
        if(!res.valid){
          setIsValid(false)
        } 
        setIsValid(true)
      }
      
    }
    catch (err) {
      nagative('/auth/reset-password',{replace:true})
      updateNotification('error',err?.toString().replace("Error:",'').trim())
    }
  }

  useEffect(()=>{
    isValidToken()
  },[token,id])

  if(!isValid) {
    return (
      <FormContainer>
        <Container>
          <div className="flex flex-col space-y-4 items-center">
            <h1 className="text-4xl font-semibold dark:text-white text-primary ">
              Sorry the token is invalid
            </h1>
           
          </div>
        </Container>
      </FormContainer>
    )
  }

  if(isVerifying) {
    return (
      <FormContainer>
        <Container>
          <div className="flex flex-col space-y-4 items-center">
            <h1 className="text-4xl font-semibold dark:text-white text-primary ">
              Please wait we are verifying your token!
            </h1>
            <ImSpinner3 className="text-primary dark:text-white animate-spin text-4xl"/>
          </div>
        </Container>
      </FormContainer>
    )
  }
  return (
    <FormContainer>
    <Container>
      <form onSubmit={handleSubmit} action="" className={commonModalClasses+" w-96"}>
        <Title>Enter New Password</Title>
        <InputFiled
          name="passwordOne"
          type="password"
          onChange={handleChangePassword}
          placeholder="Password"
          label="New Password"
          value={password.passwordOne}
        />
          <InputFiled
          value={password.passwordTwo}
          name="passwordTwo"
          type="password"
          onChange={handleChangePassword}
          placeholder="Confirm Password"
          label="Confirm Password"
        />
        <Submit value="Send Link" loadding={loadding}/>

      </form>
    </Container>
  </FormContainer>
  )
}

export default ConfirmPassword