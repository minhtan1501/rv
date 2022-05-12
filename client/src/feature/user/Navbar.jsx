import React from 'react';
import { BsFillSunFill } from 'react-icons/bs';
import Container from '../../components/Container';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import themeSlice from '../../redux/themeSlice';
import { userLogout } from '../../redux/userSlide';
function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { status } = useSelector((state) => state.theme);
  const user = useSelector((state) => state.user);
  const [oldTheme, setOldTheme] = React.useState(status);
  // toggle theme
  const handleToggleChangeTheme = (theme) => {
    dispatch(themeSlice.actions.toggleTheme(theme));
  };

  //handle logout
  const handleLogout =  async() => {
    try {
      await  dispatch(userLogout())
        navigate('/')

    }catch (err) {
      console.log(err)
    }
   
  }
  React.useEffect(() => {
    document.documentElement.classList.remove(oldTheme);
    setOldTheme(status);
    document.documentElement.classList.add(status);
  }, [oldTheme, status]);
  return (
    <div className="bg-secondary drop-shadow-sm shadow-gray-500">
      <Container className="p-2">
        <div className="flex justify-between items-center">
          <Link to="/">
            <img src="logo.png" alt="" className="h-10" />
          </Link>
          <ul className="flex space-x-4 items-center">
            <li>
              <button className=" dark:bg-white bg-dark-subtle p-1 rounded">
                <BsFillSunFill
                  onClick={() => handleToggleChangeTheme(status)}
                  className="text-secondary"
                  size={24}
                />
              </button>
            </li>
            <li>
              <input
                type="text"
                className="border-2 
                border-dark-subtle 
                p-1 
                rounded
                text-xl
                bg-transparent
                outline-none
                focus:border-white
                transition
                text-white
                "
                placeholder="search...."
              />
            </li>
            <li className="text-white font-semibold text-lg">
              {user.isLogin ? (
                <button onClick={handleLogout} className="text-white font-semibold text-lg">Logout</button>
              ) : (
                <Link to="/auth/signin">Login</Link>
              )}
            </li>
          </ul>
        </div>
      </Container>
    </div>
  );
}

export default Navbar;
