import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { searchActor } from '../../api/actor';
import LiveSearch from '../../feature/user/LiveSearch';
import { useNotification, useSearch } from '../../hooks';
import searchSlice from '../../redux/searchSlice';
import { getToken } from '../../redux/selector';
import { renderItem } from '../../utils/helper';
import { commonInputClass } from '../../utils/theme';

const defaultCastInfo = {
  profile: {},
  roleAs: '',
  leadActor: false,
};

export default function CastForm({ onSubmit }) {
  const [castInfo, setCastInfo] = useState({ ...defaultCastInfo });
  const { leadActor, profile, roleAs } = castInfo;
  const [profiles, setProfiles] = useState([]);

  const { updateNotification } = useNotification();
  const dispatch = useDispatch();
  const token = useSelector(getToken);
  const debounceSearch = useSearch();

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
    setCastInfo({ ...defaultCastInfo, profile: { name: '' } });
    dispatch(searchSlice.actions.resetSearch());
    setProfiles([]);
  };

  const handleProfileChange = ({ target }) => {
    const { value } = target;
    const { profile } = castInfo;
    profile.name = value;
    setCastInfo({ ...castInfo, ...profile });
    debounceSearch({
      query: value,
      token,
      search: searchActor,
      updaterFuc: setProfiles,
    });
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
        results={profiles}
        renderItem={renderItem}
        onSelect={handleProfileSelect}
        name="profile"
        onChange={handleProfileChange}
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
