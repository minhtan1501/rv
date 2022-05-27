import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { searchActor } from '../../api/actor';
import LiveSearch from '../../feature/user/LiveSearch';
import { useSearch } from '../../hooks';
import searchSlice from '../../redux/searchSlice';
import { getToken } from '../../redux/selector';
import { renderItem } from '../../utils/helper';

export default function WriterSelector({ onSelect }) {
  const [value, setValue] = useState('');
  const [profiles, setProfiles] = useState([]);
  const dispatch = useDispatch();
  const token = useSelector(getToken);
  const debounceSearch = useSearch();

  const handleOnChange = ({ target }) => {
    const { value } = target;
    setValue(value);
    debounceSearch({
      query: value,
      token,
      search: searchActor,
      updaterFuc: setProfiles,
    });
  };

  const handleOnSelect = (profile) => {
    setValue('');
    onSelect(profile);
    setProfiles([]);
    dispatch(searchSlice.actions.resetSearch());
  };
  return (
    <LiveSearch
      name="writers"
      results={profiles}
      renderItem={renderItem}
      placeholder="Search profile"
      onSelect={handleOnSelect}
      onChange={handleOnChange}
      value={value}
    />
  );
}
