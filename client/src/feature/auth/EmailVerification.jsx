import React, { useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Container from '../../components/Container';
import FormContainer from '../../components/form/FormContainer';
import Submit from '../../components/Submit';
import { commonModalClasses } from '../../utils/theme';
import { useNavigate } from 'react-router-dom';
import { resendEmailVerificationToken, verifyEmail } from '../../api/auth';
import { useNotification } from '../../hooks';
import { useDispatch, useSelector } from 'react-redux';
import userSlide from '../../redux/userSlide';
import Title from '../../components/Title';
import { parseError } from '../../utils/helper';

const isValidOTP = (otp) => {
  let valid = false;
  for (let item of otp) {
    valid = !isNaN(parseInt(item));
    if (!valid) break;
  }
  return valid;
};

function EmailVerification() {
  const [otp, setOtp] = useState(new Array(6).fill(''));
  const [activeOtpIndex, setActiveOtpIndex] = useState('');
  const inputRef = useRef();
  const dispatch = useDispatch();
  const { state } = useLocation();
  const [loading,setLoading] = useState(false)
  const navigate = useNavigate();
  // get state from singup
  const stateUser = state?.user;
  const { isLogin, profile } = useSelector((state) => state.user);
  // notification
  const { updateNotification } = useNotification();
  const focusNextInputField = (index) => {
    setActiveOtpIndex(index + 1);
  };
  const focusPreInputField = (index) => {
    let nextIndex;
    const diff = index - 1;
    nextIndex = diff !== 0 ? diff : 0;

    setActiveOtpIndex(nextIndex);
  };

  const handleOtpChange = ({ target }, index) => {
    console.log('1');
    const { value } = target;
    const newOTP = [...otp];
    if(!value) {
      newOTP[index] = ''
      return setOtp(newOTP)
    }
    newOTP[index] = value.substring(value.length - 1, value.length);
    if (!value) focusPreInputField(index);
    else focusNextInputField(index);
    setOtp(newOTP);
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && e.target.value === '') {
      focusPreInputField(index);
    }
  };

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      setLoading(true)
      if (!isValidOTP(otp)){
        setLoading(false)
        return updateNotification('error', 'Invalid OTP');
      } 
      
      const res = await verifyEmail({
        OTP: otp.join(''),
        userId: stateUser,
      });
      dispatch(userSlide.actions.setToken(res.accessToken));
      updateNotification('success', res.message);
      setLoading(false)
      if (isLogin) navigate('/');
    } catch (error) {
      setLoading(false)
      updateNotification(
        'error',
        error?.toString().replace('Error:', '').trim()
      );
    }
  };

  const handleOTPResend = async() =>{
    try {
      setLoading(true)
      const res = await resendEmailVerificationToken({userId:stateUser})
      updateNotification('success', res.message);
      setLoading(false)

    }
    catch (error) {
      setLoading(false)
      updateNotification(
        'error',
       parseError(error)
      );
    }
  }

  React.useEffect(() => {
    inputRef.current?.focus();
  }, [activeOtpIndex]);

  // check user
  React.useEffect(() => {
    if (!stateUser) navigate('/not-found');
    if (isLogin && profile?.isVerified) navigate('/');
  }, [stateUser, navigate, isLogin,profile.isVerified]);

  return (
    <FormContainer>
      <Container>
        <form onSubmit={handleSubmit} action="" className={commonModalClasses}>
          <Title>Please enter the OTP to verify your account</Title>
          <p className="text-center text-primary  dark:text-dark-subtle">
            OTP has been sent to your email
          </p>
          <div className="flex justify-center items-center space-x-4">
            {otp.map((_, index) => {
              return (
                <input
                  ref={activeOtpIndex === index ? inputRef : null}
                  key={index}
                  type="number"
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  value={otp[index] || ''}
                  onChange={(e) => handleOtpChange(e, index)}
                  className="text-center focus:border-primary text-primary font-semibold text-xl dark:text-white w-12 h-12 border-2 border-light-subtle dark:border-dark-subtle dark:focus:border-white rounded bg-transparent outline-none"
                />
              );
            })}
          </div>
          <div>
            <Submit value="Verify Account" loading={loading}/>
            <button
              type="button"
              onClick={handleOTPResend}
              className="dark:text-white font-semibold mt-2  hover:underline text-blue-500 "
            >
              I don't have OTP
            </button>
          </div>
        </form>
      </Container>
    </FormContainer>
  );
}

export default EmailVerification;
