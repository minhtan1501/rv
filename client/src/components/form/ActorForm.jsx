import React, { useEffect, useState } from 'react';
import { ImSpinner3 } from 'react-icons/im';
import { useNotification } from '../../hooks';
import { genderOptions } from '../../utils/options';
import { commonInputClass } from '../../utils/theme';
import Selector from '../formFiled/Selector';
import PosterSelector from '../poster/PosterSelector';

const defaultActorInfo = {
  name: '',
  about: '',
  avatar: null,
  gender: '',
};

const validateActor = ({ name, about, avatar, gender }) => {
  if (!name.trim()) return { error: 'Actor name is missing!' };
  if (!about.trim()) return { error: 'Actor about is empty!' };
  if (!gender.trim()) return { error: 'Gender section is missing!' };
  if (!avatar) return { error: 'Invalid image / avatar file!' };

  return { error: null };
};

export default function ActorForm({
  title,
  btnTitle,
  onSubmit,
  initialState,
  loading,
}) {
  const [actorInfo, setActorInfo] = useState({ ...defaultActorInfo });
  const [selectedAvatarForUI, setSelectedAvatarForUI] = useState('');
  const { updateNotification } = useNotification();

  const handleUpdateAvatar = (file) => {
    if (!file?.type?.startsWith('image') && file) {
      updateNotification('error', 'Support only image!');
    }
    const url = URL.createObjectURL(file);
    setSelectedAvatarForUI(url);
  };

  const handleChange = ({ target }) => {
    const { value, files, name } = target;
    if (name === 'avatar') {
      const avatar = files[0];
      handleUpdateAvatar(avatar);
      return setActorInfo({ ...actorInfo, avatar });
    }
    setActorInfo({ ...actorInfo, [name]: value });
  };

  const { about, name, gender } = actorInfo;

  const handleSubmit = (e) => {
    e.preventDefault();
    const { error } = validateActor(actorInfo);
    if (error) return updateNotification('error', error);

    // submit form
    const formData = new FormData();
    for (let key in actorInfo) {
      if (key) formData.append(key, actorInfo[key]);
    }
    if (onSubmit) onSubmit(formData);
  };

  useEffect(() => {
    if(initialState){
      setActorInfo({...initialState, avatar:null})
      setSelectedAvatarForUI(initialState.avatar)
    }
  },[initialState])

  return (
    <form
      onSubmit={handleSubmit}
      className="dark:bg-primary bg-white w-[35rem] p-3"
    >
      <div className="flex justify-between items-center mb-3">
        <h1 className="font-semibold text-xl dark:text-white text-primary">
          {title}
        </h1>
        <button
          className="
            h-8 w-24 bg-primary text-white 
            dark:bg-white dark:text-primary
            hover:opacity-80 transition rounded
            flex justify-center items-center
            "
          disabled={loading}
        >
          {loading ? <ImSpinner3 className="animate-spin" /> : btnTitle}
        </button>
      </div>
      <div className="flex space-x-2">
        <PosterSelector
          className="w-36 h-36 aspect-square object-cover"
          selectedPoster={selectedAvatarForUI}
          onChange={handleChange}
          name="avatar"
          label="Select avatar"
          accept="image/jpg, image/png, image/jpeg"
        />
        <div className="flex-grow flex flex-col space-y-2">
          <input
            placeholder="Enter name"
            type="text"
            className={commonInputClass + ' border-b-2'}
            name="name"
            onChange={handleChange}
            value={name}
          />
          <textarea
            className={commonInputClass + ' border-2 resize-none h-full'}
            placeholder="About"
            name="about"
            onChange={handleChange}
            value={about}
          ></textarea>
        </div>
      </div>
      <div className="mt-3">
        <Selector
          name="gender"
          options={genderOptions}
          label="Gender"
          value={gender}
          onChange={handleChange}
        />
      </div>
    </form>
  );
}
