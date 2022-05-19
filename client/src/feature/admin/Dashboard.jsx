import React from 'react';
import {useDispatch} from 'react-redux';
import { handleSearch } from '../../redux/searchSlice';
import {debounce} from '../../utils/debounce'
export default function Dashboard() {
  const dispatch = useDispatch();
  const debounceSearch = debounce(dispatch,500)

  const handleChange = ({target}) =>{
    debounceSearch(handleSearch(target.value))
  }

  return (
    <div className="p-14">
      <input onChange={handleChange} type="text" className="border border-gray-500 " />
    </div>
  )
}
