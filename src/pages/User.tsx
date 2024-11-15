import { Component } from 'react';
import { getAuth, User, onAuthStateChanged } from 'firebase/auth'; // onAuthStateChanged para escuchar cambios
import { doc, getDoc } from 'firebase/firestore';
import { firestoreDb } from '../firebase/index'; // Firestore DB
import { updateUserInfo, updateUserEmail, sendEmailVerificationToUser, syncFirestoreEmail } from '../helpers/auth';
import '../styles/user.css';

interface UserInfo {
  email: string;
  name: string;
  lastName: string;
  company: string;
}

interface UserState {
  userInfo: UserInfo | null;
  loading: boolean;
  error: string | null;
  success: string | null;
  editable: boolean;
  emailVerified: boolean;
}

export default class UserPage extends Component<{}, UserState> {
  state: UserState = {
    userInfo: null,
    loading: true,
    error: null,
    success: null,
    editable: false,
    emailVerified: false,
  };

  private auth = getAuth();

  // Obtiene el usuario actual
  // Verifica si el usuario esta cargado
  // Si el usuario cambia de correp y esta verificado
  componentDidMount() {
    const currentUser = this.auth.currentUser;
    if (currentUser) {
      this.setState({ emailVerified: currentUser.emailVerified });
      this.fetchUserInfo(currentUser);
    } else {
      this.setState({ loading: false, error: "No user is currently logged in." });
    }

    // Escuchar cambios en el usuario autenticado
    onAuthStateChanged(this.auth, (user) => {
      if (user && user.emailVerified && this.state.userInfo?.email !== user.email) {
        syncFirestoreEmail(user.uid)
          .then(() => {
            this.setState((prevState) => ({
              userInfo: { ...prevState.userInfo, email: user.email } as UserInfo,
              success: "Email updated and synced with Firestore.",
            }));
          })
          .catch((error) => {
            this.setState({ error: "Error syncing email with Firestore." });
          });
      }
    });
  }

  //Carga información del usuario de firebase y la almacena en el estado userInfo
  async fetchUserInfo(user: User) {
    try {
      const userDocRef = doc(firestoreDb, 'Users', user.uid);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        this.setState({
          userInfo: userDoc.data() as UserInfo,
          loading: false,
        });
      } else {
        this.setState({ loading: false, error: "User information not found." });
      }
    } catch (error) {
      this.setState({ loading: false, error: "Error fetching user information." });
    }
  }

  handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (this.state.userInfo) {
      const { name, value } = e.target;
      this.setState({
        userInfo: { ...this.state.userInfo, [name]: value },
      });
    }
  };

  toggleEdit = () => {
    this.setState((prevState) => ({ editable: !prevState.editable, success: null, error: null }));
  };

  saveChanges = async () => {
    const { userInfo } = this.state;
    const currentUser = this.auth.currentUser;

    if (userInfo && currentUser) {
      try {
        // Actualiza la información adicional
        await updateUserInfo(currentUser.uid, {
          name: userInfo.name,
          lastName: userInfo.lastName,
          company: userInfo.company,
        });

        // Si el email cambió, envía un correo de verificación
        if (currentUser.email !== userInfo.email) {
          await updateUserEmail(userInfo.email);
          this.setState({ success: "Verification email sent to the new address. Please verify it." });
        } else {
          this.setState({ success: "Information updated successfully.", editable: false });
        }
      } catch (error: any) {
        this.setState({ error: error.message });
      }
    }
  };

  verifyEmail = async () => {
    try {
      await sendEmailVerificationToUser();
      this.setState({ success: "Verification email sent. Please check your inbox." });
    } catch (error: any) {
      this.setState({ error: error.message });
    }
  };

  render() {
    const { userInfo, loading, error, success, editable, emailVerified } = this.state;

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
                value={userInfo.email}
                onChange={this.handleInputChange}
                disabled={!editable}
              />
            </div>
            <div>
              <label>First Name:</label>
              <input
                type="text"
                name="name"
                value={userInfo.name}
                onChange={this.handleInputChange}
                disabled={!editable}
              />
            </div>
            <div>
              <label>Last Name:</label>
              <input
                type="text"
                name="lastName"
                value={userInfo.lastName}
                onChange={this.handleInputChange}
                disabled={!editable}
              />
            </div>
            <div>
              <label>Company:</label>
              <input
                type="text"
                name="company"
                value={userInfo.company}
                onChange={this.handleInputChange}
                disabled={!editable}
              />
            </div>
            <div>
              <p>Email Verified: {emailVerified ? "Yes" : "No"}</p>
              {!emailVerified && (
                <button onClick={this.verifyEmail} className="btn btn-warning">
                  Verify Email
                </button>
              )}
            </div>
            {!editable ? (
              <button onClick={this.toggleEdit} className="btn btn-primary">
                Edit
              </button>
            ) : (
              <button onClick={this.saveChanges} className="btn btn-success">
                Save Changes
              </button>
            )}
          </div>
        )}
      </div>
    );
  }
}
