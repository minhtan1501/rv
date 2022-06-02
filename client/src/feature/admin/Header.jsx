import React, { useEffect, useRef, useState } from 'react';
import { AiOutlinePlus } from 'react-icons/ai';
import { BsFillSunFill } from 'react-icons/bs';
import { useDispatch, useSelector } from 'react-redux';
import AppSearchForm from '../../components/form/AppSearchForm';
import themeSlice from '../../redux/themeSlice';
import {useNavigate} from 'react-router-dom'
function Header({onAddMoviesClick,onAddActorsClick}) {
  const options = [
    {
      title:"Add Movies",
      onClick: onAddMoviesClick
    },
    {
      title:"Add Actors",
      onClick: onAddActorsClick
    }
]
  //toggle options
  const [showOption, setShowOption] = useState(false);
  // change theme
  const dispatch = useDispatch();
  const { status } = useSelector((state) => state.theme);
  const [oldTheme, setOldTheme] = React.useState(status);
  const nagative = useNavigate();

  const handleToggleChangeTheme = (theme) => {
    dispatch(themeSlice.actions.toggleTheme(theme));
  };
  React.useEffect(() => {
    document.documentElement.classList.remove(oldTheme);
    setOldTheme(status);
    document.documentElement.classList.add(status);
  }, [oldTheme, status]);


  const handleSearchSubmit = (query) =>{
   if(!query.trim()) return;

    nagative('/search?title='+query)
  }

  return (
    <div className="flex items-center justify-between relative p-5">
     <AppSearchForm onSubmit={handleSearchSubmit} placeholder="Search Movie..."/>
      <div className="flex space-x-3 items-center">
        <button
          onClick={() => handleToggleChangeTheme(status)}
          className="dark:text-white text-light-subtle"
        >
          <BsFillSunFill size={24} />
        </button>

        <button
          onClick={() => setShowOption(true)}
          className="flex items-center space-x-2 border-light-subtle dark:border-dark-subtle
          dark:text-dark-subtle text-light-subtle hover:opacity-80 transition
        font-semibold border-2 rounded text-lg px-3 py-1"
        >
          <span>Create</span>
          <AiOutlinePlus />
        </button>
        <CreateOptions
          visible={showOption}
          onClose={() => setShowOption(false)}
          options={options}
        />
      </div>
    </div>
  );
}

export default Header;

function CreateOptions({ options,visible, onClose }) {
  const container = useRef();
  const containerId = 'option-container';
  useEffect(() => {
    const handleClose = (e) => {
      if (!visible) return;
      const { parentElement, id } = e.target;

      if (parentElement.id === containerId || id === containerId) return;

      if (!container.current.classList.contains('animate-scale')) {
        container.current.classList.add('animate-scale-reverse');
      }
    };

    document.addEventListener('click', handleClose);

    return () => {
      document.removeEventListener('click', handleClose);
    };
  }, [visible]);

  const handleAnimationEnd = (e) => {
    if (e.target.classList.contains('animate-scale-reverse')) onClose();
    e.target.classList.remove('animate-scale');
  };

  const handleClick = (fn) =>{
    fn()
    onClose();
    
  }

  if (!visible) return null;
  return (
    <div
      ref={container}
      id={containerId}
      
      className="
      absolute right-0 top-16 
      flex flex-col space-y-3 p-5
      dark:bg-secondary bg-white 
      drop-shadow-lg animate-scale
      z-10"
      onAnimationEnd={handleAnimationEnd}
    >
      {options.map(({title,onClick},index)=>{
        return (<Option key={index} onClick={()=>handleClick(onClick)}>{title}</Option>)
      })}
    </div>
  );
}

function Option({ children, onClick }) {
  return (
    <button
      onClick={onClick}
      className="dark:text-white text-secondary hover:opacity-80 transition"
    >
      {children}
    </button>
  );
}
