import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { getAppInfo } from '../../api/admin';
import AppInfoBox from '../../components/AppInfoBox';
import LatestUploads from '../../components/LatestUploads';
import MostRatedMovies from '../../components/MostRatedMovies';
import { useNotification } from '../../hooks';
import { getToken } from '../../redux/selector';
import { parseError } from '../../utils/helper';
export default function Dashboard() {
  const token = useSelector(getToken);
  const [appInfo,setAppInfo] = useState({
    movieCount:0,
    reviewCount:0,
    userCount: 0
  })

  const {updateNotification} = useNotification()

  const fetchAppInfo = async () =>{
    try {
      
      const res =  await getAppInfo(token)
      setAppInfo({...res})
    } catch (error) {
      updateNotification('error', parseError(error))
    }
  }

  useEffect(() => {
    fetchAppInfo()
  },[])

  return (
    <div className="grid grid-cols-3 gap-5 p-5">
      <AppInfoBox title="Total Uploads" subTitle={appInfo.movieCount.toLocaleString()} />
      <AppInfoBox title="Total Reviews" subTitle={appInfo.reviewCount.toLocaleString()} />
      <AppInfoBox title="Total Users" subTitle={appInfo.userCount.toLocaleString()} />

      <LatestUploads/>
      <MostRatedMovies />
    </div>
  );
}
