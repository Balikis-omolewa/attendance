import React from 'react'
import AddLocation from '../AddLocation'
import "../../../../styles/DashboardContent.css"
import RecentLocation from './RecentLocation'
import LocationHistory from './locationHistory'



const LocationContent = () => {
  return (
    <div className='content'>
        <AddLocation />
        {/* Add recent locations */}
        <RecentLocation />
        {/* Add location history */}
        <LocationHistory />
        {/* Add location chart */}
    </div>
  )
}

export default LocationContent