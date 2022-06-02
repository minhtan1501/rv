import React from 'react';
import AppInfoBox from '../../components/AppInfoBox';
import LatestUploads from '../../components/LatestUploads';
export default function Dashboard() {
  return (
    <div className="grid grid-cols-3 gap-5 p-5">
      <AppInfoBox title="Total Uploads" subTitle="100" />
      <AppInfoBox title="Total Reviews" subTitle="100" />
      <AppInfoBox title="Total Users" subTitle="100" />

      <LatestUploads/>
    </div>
  );
}
