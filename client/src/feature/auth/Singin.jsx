import { unwrapResult } from '@reduxjs/toolkit';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Container from '../../components/Container';
import CustomLink from '../../components/CustomLink';
import FormContainer from '../../components/form/FormContainer';
import Submit from '../../components/Submit';
import Title from '../../components/Title';
import InputFiled from '../../components/formFiled/InputFiled';
import { useNotification } from '../../hooks';
import { userLogin } from '../../redux/userSlide';
import { isValidEmail } from '../../utils/helper';
import { commonModalClasses } from '../../utils/theme';

const validateUserInfo = ({ email, password }) => {

  if (!email.trim()) {
    return { ok: false, error: 'Email is missing!' };
  }

  if (!isValidEmail(email)) return { ok: false, error: 'Invalid email!' };

  if (!password.trim()) return { ok: false, error: 'Password is missing!' };

  if (password.length < 8)
    return { ok: false, error: 'Password must be 8 characters long!' };

  return { ok: true };
};

function Singin() {
  const dispatch = useDispatch();
  const { updateNotification } = useNotification();
  const [loading, setLoading] = useState(false);
  const [userInfo, setUserInfo] = useState({
    email: '',
    password: '',
  });
  const user = useSelector((state) => state.user)
  const navigate = useNavigate();
  const handleSubmit =  async (e) => {
    try {
      e.preventDefault();
      const { ok, error } = validateUserInfo(userInfo);
      if (!ok) return updateNotification('error', error);
      setLoading(true);
      const result = await dispatch(userLogin(userInfo));
      setLoading(false);
      unwrapResult(result);
    } catch (err) {
      updateNotification('error', err.message);
      setLoading(false);
    }
  };
  const handleChangeUserInfo = (e) => {
    setUserInfo((pre) => ({
      ...pre,
      [e.target.name]: e.target.value,
    }));
  };

  useEffect(()=>{
    if(user.isLogin) navigate('/')
  },[user.isLogin,navigate])
  return (
    <FormContainer>
      <Container>
        <form
          action=""
          onSubmit={handleSubmit}
          className={commonModalClasses + ' w-72'}
        >
          <Title>Sign in</Title>
          <InputFiled
            name="email"
            type="text"
            placeholder="mtdev@gmail.com"
            label="Email"
            value={userInfo.email}
            onChange={handleChangeUserInfo}
          />
          <InputFiled
            name="password"
            label="Password"
            placeholder="Enter your password"
            type="password"
            value={userInfo.password}
            onChange={handleChangeUserInfo}
          />
          <Submit value="Sign in" loading={loading} />
          <div className="flex justify-between">
            <CustomLink to="/auth/forget-password">Forget password</CustomLink>
            <CustomLink to="/auth/signup">Sign up</CustomLink>
          </div>
        </form>
      </Container>
    </FormContainer>
  );
}

export default Singin;
