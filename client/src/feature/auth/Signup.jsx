import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { createUser } from '../../api/auth';
import Container from '../../components/Container';
import CustomLink from '../../components/CustomLink';
import FormContainer from '../../components/form/FormContainer';
import InputFiled from '../../components/form/InputFiled';
import Submit from '../../components/form/Submit';
import Title from '../../components/form/Title';
import { useNotification } from '../../hooks';
import { commonModalClasses } from '../../utils/theme';

function removeAscent (str) {
  if (str === null || str === undefined) return str;
  str = str.toLowerCase();
  str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
  str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
  str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
  str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
  str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
  str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
  str = str.replace(/đ/g, "d");
  return str;
}

function isValid (string) {
  var re = /^[a-z A-Z]+$/
  return re.test(removeAscent(string));
}

const validateUserInfo = ({name,email,password}) =>{
  const regexEmail = /^\w+([\.+-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
  
  if(!name.trim()) return {ok:false,error:'Name is missing!'}

  if(!isValid(name)) return {ok:false,error:"Invalid name!"}
  if(!email.trim()) {
    return {ok:false,error:"Email is missing!"};
  }

  if(!regexEmail.test(email)) return {ok:false, error: "Invalid email!"}

  if(!password.trim()) return {ok:false, error:"Password is missing!"}

  if(password.length < 8) return {ok:false, error:"Password must be 8 characters long!"}

  return {ok:true}
}



function Singup() {
  const [value,setValue] = useState({
    name:'',
    email:'',
    password:''
  })
  const {name,password,email} = value;
  const {updateNotification} = useNotification();
  const [loadding,setLoading] = useState(false)
  const navigate = useNavigate();
  const user = useSelector((state) => state.user)
  const handleChange = ({target}) =>{
    setValue(pre =>({
      ...pre,
      [target.name]: target.value
    }
    ))
  }
  const handleSubmit = async (e) =>{
    try{
      e.preventDefault()
      const {ok ,error} = validateUserInfo(value)
      if(!ok) return updateNotification('error',error)
      setLoading(true)
      const response = await createUser(value);
      localStorage.setItem('firstLogin',true)
      setLoading(false)
      navigate('/auth/verification',{state:{user:response.user.id,replace:true}})
   
    }
    catch(error){
      setLoading(false)
      updateNotification('error',error?.toString().replace("Error:",'').trim())
    }
  }
  useEffect(()=>{
    if(user.isLogin) navigate('/')
  },[user.isLogin,navigate])
  return (
    <FormContainer >
      <Container>
        <form onSubmit={handleSubmit} action="" className={commonModalClasses+" w-72"}>
          <Title>Sign up</Title>
          <InputFiled
            name="name"
            type="text"
            placeholder="Minh Tân"
            label="Name"
            value={name}
            onChange={handleChange}
          />
          <InputFiled
            name="email"
            type="text"
            placeholder="mtdev@gmail.com"
            label="Email"
            value={email}
            onChange={handleChange}
          />
          <InputFiled
            name="password"
            label="Password"
            placeholder="Enter your password"
            type="password"
            value={password}
            onChange={handleChange}
          />
          <Submit value="Sign up" loadding={loadding}/>
          <div className="flex justify-between">
            <CustomLink to="/auth/forget-password">Forget password</CustomLink>
            <CustomLink to="/auth/signin">Sign in</CustomLink>
          </div>
        </form>
      </Container>
    </FormContainer>
  );
}

export default Singup;
