import React, { useState } from 'react';
import { useNotification } from '../../hooks';
import { commonInputClass } from '../../utils/theme';
import LiveSearch from '../user/LiveSearch';

const defaultCastInfo = {
  profile: {},
  roleAs: '',
  leadActor: false,
};
const results = [
  {
    name: 'Tan',
    avatar:
      'https://res.cloudinary.com/dtvwgsmrq/image/upload/v1651746615/baocao/obpd9zdoq6ctn4gep8kz.jpg',
    id: 1,
  },
  {
    name: 'Tannn',
    avatar:
      'https://res.cloudinary.com/dtvwgsmrq/image/upload/v1651746615/baocao/obpd9zdoq6ctn4gep8kz.jpg',
    id: 2,
  },
  {
    name: 'Tannnnn',
    avatar:
      'https://res.cloudinary.com/dtvwgsmrq/image/upload/v1651746615/baocao/obpd9zdoq6ctn4gep8kz.jpg',
    id: 3,
  },
  {
    name: 'Tannnnnn',
    avatar:
      'https://res.cloudinary.com/dtvwgsmrq/image/upload/v1651746615/baocao/obpd9zdoq6ctn4gep8kz.jpg',
    id: 4,
  },
];
const renderItem = (result) => {
  return (
    <div className="flex space-x-2 rounded overflow-hidden">
      <img
        className="w-16 h-16 object-cover"
        src={result.avatar}
        alt={result.name}
      />
      <p className="dark:text-white font-semibold">{result.name}</p>
    </div>
  );
};
export default function CastForm({ onSubmit }) {
  const [castInfo, setCastInfo] = useState({ ...defaultCastInfo });
  const { leadActor, profile, roleAs } = castInfo;
  const { updateNotification } = useNotification();
  const handleOnChange = ({ target }) => {
    const { checked, name, value } = target;
    if (name === 'leadActor')
      return setCastInfo({ ...castInfo, leadActor: checked });
    setCastInfo({ ...castInfo, [name]: value });
  };
  const handleProfileSelect = (profile) => {
    setCastInfo({ ...castInfo, profile: profile });
  };

  const handleSubmitCast = (e) => {
    const { profile, roleAs } = castInfo;
    if (!profile.name)
      return updateNotification('error', 'Cast profile is missing!');
    if (!roleAs.trim())
      return updateNotification('error', 'Cast role is missing!');
    if (!onSubmit) return;
    onSubmit(castInfo);
    setCastInfo({ ...defaultCastInfo });
  };

  return (
    <div className="flex items-center space-x-2">
      <input
        type="checkbox"
        name="leadActor"
        className="w-4 h-4"
        checked={leadActor}
        onChange={handleOnChange}
        title="Set Lead Actor"
      />
      <LiveSearch
        placeholder="Search profile"
        value={profile.name}
        checked={leadActor}
        results={results}
        renderItem={renderItem}
        onSelect={handleProfileSelect}
        name="profile"
        onChange={handleOnChange}
       
      />
      <span
        className="
      dark:text-dark-subtle font-semoblod
      text-light-subtle"
      >
        as
      </span>
      <div className="">
        <input
          placeholder="Role as"
          type="text"
          className={commonInputClass + ' rounded p-1 text-lg border-2'}
          value={roleAs}
          onChange={handleOnChange}
          name="roleAs"
        />
      </div>
      <button
        onClick={handleSubmitCast}
        className="
        bg-secondary dark:text-primary dark:bg-white 
         px-1 rounded text-white font-semibold"
        type="button"
      >
        Add
      </button>
    </div>
  );
}
