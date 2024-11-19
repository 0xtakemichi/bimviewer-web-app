// Dashboard.tsx
import React from 'react';
import { useAuth } from '../hooks/AuthContext';

const Dashboard: React.FC = () => {
  const { userData, loading } = useAuth();


  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Dashboard</h1>
      <p>This is a protected route. You can only see this if you're authenticated.</p>
      {userData ? (
        <div>
          <h2>Welcome, {userData.name} {userData.lastName}!</h2>
          <p>Email: {userData.email}</p>
          <p>Company: {userData.company}</p>
        </div>
      ) : (
        <p>No user data available.</p>
      )}
    </div>
  );
};

export default Dashboard;