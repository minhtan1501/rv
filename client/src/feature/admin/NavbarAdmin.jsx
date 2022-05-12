import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { AiOutlineHome } from 'react-icons/ai';
import { BiMoviePlay } from 'react-icons/bi';
import { FaUserNinja } from 'react-icons/fa';
import { FiLogOut } from 'react-icons/fi';
import { useDispatch } from 'react-redux';
import { userLogout } from '../../redux/userSlide';
function NavbarAdmin() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const handleLogout =  async() => {
        try {
          await  dispatch(userLogout())
            navigate('/')
    
        }catch (err) {
          console.log(err)
        }
       
      }
  return (
    <nav
      className="w-48 min-h-screen bg-secondary
    border-r border-gray-300"
    >
      <div className="flex flex-col justify-between h-screen pl-5 sticky top-0">
        <ul>
          <li className="mb-8">
            <Link to="/">
              <img src="logo.png" alt="logo" className="h-14 p-2" />
            </Link>
          </li>
          <li>
            <NavItem to="/">
              <AiOutlineHome />
              <span>Home</span>
            </NavItem>
          </li>
          <li>
            <NavItem to="/movies">
              <BiMoviePlay />
              <span>Movies</span>
            </NavItem>
          </li>
          <li>
            <NavItem to="/actors">
              <FaUserNinja />
              <span>Actors</span>
            </NavItem>
          </li>
        </ul>
        <div className="flex flex-col items-start text-white p-5">
          <span className="font-semibold text-white text-xl">Admin</span>
          <button onClick={handleLogout} className="flex items-center text-dark-subtle text-sm hover:text-white transition space-x-1">
            <FiLogOut />
            <span>Log out</span>
          </button>
        </div>
      </div>
    </nav>
  );
}

export default NavbarAdmin;

function NavItem({ children, to }) {
  const commonClass =
    ' flex items-center text-lg space-x-2 p-2 hover:opacity-80';
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        (isActive ? 'text-white space-x-4' : 'text-gray-400') + commonClass
      }
    >
      {children}
    </NavLink>
  );
}
