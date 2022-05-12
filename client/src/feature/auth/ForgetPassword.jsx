import React, { useState } from 'react'
import { forgetPassword } from '../../api/auth'
import Container from '../../components/Container'
import CustomLink from '../../components/CustomLink'
import FormContainer from '../../components/form/FormContainer'
import InputFiled from '../../components/form/InputFiled'
import Submit from '../../components/form/Submit'
import Title from '../../components/form/Title'
import { useNotification } from '../../hooks'
import { isValidEmail } from '../../utils/helper'
import { commonModalClasses } from '../../utils/theme'

function ForgetPassword() {
  const [value,setValue] = useState('');
  const {updateNotification} = useNotification()
  const [loadding,setLoadding] = useState(false)
  const handleOnChange = (e) => {
    setValue(e.target.value)
  }
  const handleOnSubmit = async (e) => {
    try {
      e.preventDefault()
      setLoadding(true)
      if(!isValidEmail(value)) return updateNotification('error','Invalid Email') 
      const res =   await forgetPassword({email:value});
      console.log(res)
       updateNotification('success',res.message)
       setValue('')
       setLoadding(false)
    }
    catch (err) {
      setLoadding(false)
      updateNotification('error',err?.data?.error)
    }
    
  }

  return (
    <FormContainer>
    <Container>
      <form onSubmit={handleOnSubmit} action="" className={commonModalClasses+" w-96"}>
        <Title>Please enter your Email</Title>
        <InputFiled
          name="email"
          type="text"
          placeholder="mtdev@gmail.com"
          label="Email"
          value={value}
          onChange={handleOnChange}
        />
        <Submit value="Send Link" loadding={loadding}/>
        <div className="flex justify-between">
          <CustomLink to='/auth/forget-password'>Forget password</CustomLink>
          <CustomLink to='/auth/signin'>Sign in</CustomLink>     
        </div>
      </form>
    </Container>
  </FormContainer>
  )
}

export default ForgetPassword