import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/AuthContext';
import {
  updateUserInfo,
  updateUserEmail,
  sendEmailVerificationToUser,
} from '../helpers/auth';
import '../styles/user.css';

const UserPage: React.FC = () => {
  const { userData, loading, firebaseUser } = useAuth();
  const [editable, setEditable] = useState(false);
  const [userInfo, setUserInfo] = useState(userData);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (userData) {
      setUserInfo(userData);
    }
  }, [userData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (userInfo) {
      const { name, value } = e.target;
      setUserInfo({ ...userInfo, [name]: value });
    }
  };

  const toggleEdit = () => {
    setEditable((prev) => !prev);
    setSuccess(null);
    setError(null);
  };

  const saveChanges = async () => {
    if (!userInfo || !firebaseUser) return;
  
    try {
      const { name, lastName, company, email } = userInfo;
  
      if (!name || !lastName || !company) {
        throw new Error('All fields must be filled.');
      }
  
      await updateUserInfo(firebaseUser.uid, {
        name: name, // Ahora sabemos que `name` es string
        lastName: lastName,
        company: company,
      });
  
      if (email && email !== firebaseUser.email) {
        await updateUserEmail(email); // Aquí email se garantiza que es string
        setSuccess('Verification email sent to the new address. Please verify it.');
      } else {
        setSuccess('Information updated successfully.');
      }
  
      setEditable(false);
    } catch (err: any) {
      setError(err.message || 'Error updating information.');
    }
  };

  const verifyEmail = async () => {
    try {
      await sendEmailVerificationToUser();
      setSuccess('Verification email sent. Please check your inbox.');
    } catch (err: any) {
      setError(err.message || 'Error sending verification email.');
    }
  };

  if (loading) {
    return <div>Loading user information...</div>;
  }

  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  return (
    <div className="user-container">
      <h1>User Information</h1>
      {success && <div className="alert alert-success">{success}</div>}
      {userInfo && (
        <div className="user-info">
          <div>
            <label>Email:</label>
            <input
              type="email"
              name="email"
              value={userInfo.email || ""}
              onChange={handleInputChange}
              disabled={!editable}
            />
          </div>
          <div>
            <label>First Name:</label>
            <input
              type="text"
              name="name"
              value={userInfo.name}
              onChange={handleInputChange}
              disabled={!editable}
            />
          </div>
          <div>
            <label>Last Name:</label>
            <input
              type="text"
              name="lastName"
              value={userInfo.lastName}
              onChange={handleInputChange}
              disabled={!editable}
            />
          </div>
          <div>
            <label>Company:</label>
            <input
              type="text"
              name="company"
              value={userInfo.company}
              onChange={handleInputChange}
              disabled={!editable}
            />
          </div>
          <div className="button-group">
            {!firebaseUser?.emailVerified && (
              <button onClick={verifyEmail} className="btn btn-warning">
                Verify Email
              </button>
            )}
            {!editable ? (
              <button onClick={toggleEdit} className="btn btn-primary">
                Edit
              </button>
            ) : (
              <button onClick={saveChanges} className="btn btn-success">
                Save Changes
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default UserPage;