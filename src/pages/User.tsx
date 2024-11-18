import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/AuthContext';
import {
  updateUserInfo,
  updateUserEmail,
  sendEmailVerificationToUser,
  deleteUserAccount,
} from '../helpers/auth';
import { jobTitles, countries } from '../data'; // Importamos las listas
import '../styles/user.css';

const UserPage: React.FC = () => {
  const { userData, loading, firebaseUser, refreshUserData } = useAuth(); // Incluye refreshUserData
  const [editable, setEditable] = useState(false);
  const [userInfo, setUserInfo] = useState(userData);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (userData) {
      setUserInfo(userData);
    }
  }, [userData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    if (userInfo) {
      const { name, value } = e.target;
      setUserInfo({ ...userInfo, [name]: value });
    }
  };

  const toggleEdit = () => {
    setEditable((prev) => !prev);
    if (editable && userData) {
      setUserInfo(userData); // Restablece los datos originales si se cancela la edición
    }
    setSuccess(null);
    setError(null);
  };

  const saveChanges = async () => {
    if (!userInfo || !firebaseUser) return;

    try {
      const { name, lastName, company, email, jobTitle, country } = userInfo;

      if (!name || !lastName || !company || !jobTitle || !country) {
        throw new Error('All fields must be filled.');
      }

      await updateUserInfo(firebaseUser.uid, {
        name,
        lastName,
        company,
        jobTitle,
        country,
      });

      if (email && email !== firebaseUser.email) {
        await updateUserEmail(email);
        setSuccess(
          'Verification email sent to the new address. Please verify it. You will be logged out upon verification.'
        );
      } else {
        setSuccess('Information updated successfully.');
      }

      // Refrescar los datos del usuario en el contexto
      await refreshUserData();

      setEditable(false);
    } catch (err: any) {
      setError(err.message || 'Error updating information.');
    }
  };
  const handleDeleteAccount = async () => {
    const confirmAccountDeletion = window.confirm(
      'Are you sure you want to delete your account? This action cannot be undone.'
    );
  
    if (!confirmAccountDeletion) {
      return; // Detener si el usuario cancela la primera confirmación
    }
  
    const confirmProjectAndCollaborationDeletion = window.confirm(
      'Deleting your account will also remove all your projects and collaborations. Do you wish to continue?'
    );
  
    if (!confirmProjectAndCollaborationDeletion) {
      return; // Detener si el usuario cancela la segunda confirmación
    }
  
    try {
      await deleteUserAccount();
      alert('Your account and all associated data have been successfully deleted.');
    } catch (err: any) {
      setError(err.message || 'An error occurred while deleting the account.');
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
              value={userInfo.name || ""}
              onChange={handleInputChange}
              disabled={!editable}
            />
          </div>
          <div>
            <label>Last Name:</label>
            <input
              type="text"
              name="lastName"
              value={userInfo.lastName || ""}
              onChange={handleInputChange}
              disabled={!editable}
            />
          </div>
          <div>
            <label>Company:</label>
            <input
              type="text"
              name="company"
              value={userInfo.company || ""}
              onChange={handleInputChange}
              disabled={!editable}
            />
          </div>
          <div>
            <label>Job Title: </label>
            <select
              name="jobTitle"
              value={userInfo.jobTitle || ""}
              onChange={handleInputChange}
              disabled={!editable}
            >
              <option value="">Select Job Title</option>
              {jobTitles.map((title) => (
                <option key={title} value={title}>
                  {title}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label>Country: </label>
            <select
              name="country"
              value={userInfo.country || ""}
              onChange={handleInputChange}
              disabled={!editable}
            >
              <option value="">Select Country</option>
              {countries.map((country) => (
                <option key={country} value={country}>
                  {country}
                </option>
              ))}
            </select>
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
              <>
                <button onClick={saveChanges} className="btn btn-success">
                  Save Changes
                </button>
                <button onClick={toggleEdit} className="btn btn-secondary">
                  Cancel
                </button>
              </>
            )}
            <button onClick={handleDeleteAccount} className="btn btn-danger">
              Delete Account
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserPage;