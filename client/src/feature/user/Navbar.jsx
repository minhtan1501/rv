import React from 'react';
import { BsFillSunFill } from 'react-icons/bs';
import Container from '../../components/Container';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import themeSlice from '../../redux/themeSlice';
import { userLogout } from '../../redux/userSlide';
import AppSearchForm from '../../components/form/AppSearchForm';
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
  const handleLogout = async () => {
    try {
      await dispatch(userLogout());
      navigate('/');
    } catch (err) {
      console.log(err);
    }
  };

  const handleSearchSubmit = (query) =>{
    navigate('/movie/search?title='+query);
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
            <img src="logo.png" alt="" className="sm:h-10 h-8" />
          </Link>
          <ul className="flex sm:space-x-4 space-x-2 items-center">
            <li>
              <button className=" dark:bg-white bg-dark-subtle p-1 rounded sm:text-lg">
                <BsFillSunFill
                  onClick={() => handleToggleChangeTheme(status)}
                  className="text-secondary"
                  size={24}
                />
              </button>
            </li>
            <li>
              <AppSearchForm
                placeholder="Search"
                inputClassName="border-dark-subtle text-white focus:border-white sm:w-auto w-40"
                onSubmit={handleSearchSubmit}
              />
            </li>
            <li className="text-white font-semibold text-lg">
              {user.isLogin ? (
                <button
                  onClick={handleLogout}
                  className="text-white font-semibold text-lg"
                >
                  Logout
                </button>
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
