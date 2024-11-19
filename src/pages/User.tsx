import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/AuthContext';
import {
  updateUserInfo,
  updateUserEmail,
  sendEmailVerificationToUser,
  deleteUserAccount,
} from '../helpers/auth';
import { jobTitles, countries } from '../data';
import 'bootstrap/dist/css/bootstrap.min.css';

const UserPage: React.FC = () => {
  const { userData, loading, firebaseUser, refreshUserData } = useAuth();
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
      setUserInfo(userData);
    }
    setSuccess(null);
    setError(null);
  };

  const saveChanges = async () => {
    if (!userInfo || !firebaseUser) return;

    try {
      const { name, lastName, company, email, jobTitle, country } = userInfo;

      if (!name || !lastName || !company || !jobTitle || !country) {
        throw new Error('Todos los campos deben ser completados.');
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
          'Correo de verificación enviado a la nueva dirección. Por favor, verifícalo. Se cerrará la sesión al verificar.'
        );
      } else {
        setSuccess('Información actualizada exitosamente.');
      }

      await refreshUserData();
      setEditable(false);
    } catch (err: any) {
      setError(err.message || 'Error al actualizar la información.');
    }
  };

  const handleDeleteAccount = async () => {
    const confirmAccountDeletion = window.confirm(
      '¿Estás seguro de que deseas eliminar tu cuenta? Esta acción no se puede deshacer.'
    );

    if (!confirmAccountDeletion) {
      return;
    }

    const confirmProjectAndCollaborationDeletion = window.confirm(
      'Eliminar tu cuenta también eliminará todos tus proyectos y colaboraciones. ¿Deseas continuar?'
    );

    if (!confirmProjectAndCollaborationDeletion) {
      return;
    }

    try {
      await deleteUserAccount();
      alert('Tu cuenta y todos los datos asociados han sido eliminados exitosamente.');
    } catch (err: any) {
      setError(err.message || 'Ocurrió un error al eliminar la cuenta.');
    }
  };

  const verifyEmail = async () => {
    try {
      await sendEmailVerificationToUser();
      setSuccess('Correo de verificación enviado. Por favor, revisa tu bandeja de entrada.');
    } catch (err: any) {
      setError(err.message || 'Error al enviar el correo de verificación.');
    }
  };

  if (loading) {
    return <div>Cargando información del usuario...</div>;
  }

  return (
    <div className="container mt-5">
      <h1 className="mb-4">Información del Usuario</h1>
      {success && <div className="alert alert-success">{success}</div>}
      {error && <div className="alert alert-danger">{error}</div>}
      {userInfo && (
        <div className="card">
          <div className="card-body">
            <form>
              <div className="mb-3">
                <label className="form-label">Correo Electrónico:</label>
                <input
                  type="email"
                  name="email"
                  className="form-control"
                  value={userInfo.email || ''}
                  onChange={handleInputChange}
                  disabled={!editable}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Nombre:</label>
                <input
                  type="text"
                  name="name"
                  className="form-control"
                  value={userInfo.name || ''}
                  onChange={handleInputChange}
                  disabled={!editable}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Apellido:</label>
                <input
                  type="text"
                  name="lastName"
                  className="form-control"
                  value={userInfo.lastName || ''}
                  onChange={handleInputChange}
                  disabled={!editable}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Compañía:</label>
                <input
                  type="text"
                  name="company"
                  className="form-control"
                  value={userInfo.company || ''}
                  onChange={handleInputChange}
                  disabled={!editable}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Título Profesional:</label>
                <select
                  name="jobTitle"
                  className="form-select"
                  value={userInfo.jobTitle || ''}
                  onChange={handleInputChange}
                  disabled={!editable}
                >
                  <option value="">Selecciona un Título Profesional</option>
                  {jobTitles.map((title) => (
                    <option key={title} value={title}>
                      {title}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-3">
                <label className="form-label">País:</label>
                <select
                  name="country"
                  className="form-select"
                  value={userInfo.country || ''}
                  onChange={handleInputChange}
                  disabled={!editable}
                >
                  <option value="">Selecciona un País</option>
                  {countries.map((country) => (
                    <option key={country} value={country}>
                      {country}
                    </option>
                  ))}
                </select>
              </div>
              <div className="d-flex justify-content-between mt-4">
                {!firebaseUser?.emailVerified && (
                  <button onClick={verifyEmail} type="button" className="btn btn-warning">
                    Verificar Correo
                  </button>
                )}
                {!editable ? (
                  <button onClick={toggleEdit} type="button" className="btn btn-primary">
                    Editar Información
                  </button>
                ) : (
                  <>
                    <button onClick={saveChanges} type="button" className="btn btn-success">
                      Guardar Cambios
                    </button>
                    <button onClick={toggleEdit} type="button" className="btn btn-secondary">
                      Cancelar
                    </button>
                  </>
                )}
                <button onClick={handleDeleteAccount} type="button" className="btn btn-danger">
                  Eliminar Cuenta
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserPage;