import React, { useState } from 'react';
import '../styles/dashboard.css';

// Import admin dashboard components
import Sidebar from './Sidebar';
import DashboardContent from '../dashboard/dist/DashboardContent';
import AddLocation from '../dashboard/dist/location/AddLocation';
import AttendanceRecords from '../dashboard/dist/usersRecord/attendanceRecords';
import DashboardHeader from './dist/home/DashboardHeader';
import AttendanceHistory from './dist/attendanceHistory/AttendanceHistory';
import Settings from './dist/settings/Settings';
import Location from './dist/location/Location';
import ViewAllLocaction from './dist/location/ViewAllLocation';

const Dashboard = () => {
  const [screen, setScreen] = useState('dashboard'); 
  
  // Function to render content based on the screen state
  const renderContent = () => {
    switch (screen) {
      case 'dashboard':
        return <DashboardContent updateScreen={setScreen} />;
      case 'userReports':
        return <AttendanceRecords />;
      case 'adminAccess':
        return <Location />;
      case 'create-location':
        return <AddLocation />;
        case 'attendanceHistory':
          return <AttendanceHistory />
          case 'settings':
            return <Settings />
      default:
        return <DashboardContent updateScreen={setScreen} />; // Default to dashboard content
    }
  };

  return (
    <div className='dashboard flex'>
      <Sidebar updateScreen={setScreen} />
      <div className="dashboard-content flex-1 p-6 bg-gray-90">
        <DashboardHeader />
        {/* Render the content based on the current screen */}

        {renderContent()}
      </div>
    </div>
  );
};

export default Dashboard;
