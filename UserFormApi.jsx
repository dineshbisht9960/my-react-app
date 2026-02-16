import axios from "axios";
import { useEffect, useState } from "react";
import "./UserFormApi.css";

export default function UserFormApi() {
  const [isLogin, setIsLogin] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showUpdateForm, setShowUpdateForm] = useState(false);

  // ================= TOKEN =================
  const [token, setToken] = useState(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
      setIsAuthenticated(true);
    }
  }, []);

  // ================= STATES =================
  const [signUp, setSignUp] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    gender: "",
  });

  const [login, setLogin] = useState({
    email: "",
    password: "",
  });

  const [update, setUpdate] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    gender: "",
  });
// console.log(update);
  // ================= AXIOS INTERCEPTOR =================
  useEffect(() => {
    const interceptor = axios.interceptors.request.use((config) => {
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    return () => axios.interceptors.request.eject(interceptor);
  }, [token]);

  // ================= SIGN UP =================
  const userSignUp = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "http://localhost:5000/api/signUp",
        signUp
      );
      alert(res.data.message || "Signup successful");
      setIsLogin(true);
    } catch (error) {
      alert(error.response?.data?.message || "Signup failed");
    }
  };

  // ================= LOGIN =================
  const loginUser = async (e) => {
    e.preventDefault();
    try {
      localStorage.removeItem("persist:root");
      const res = await axios.post(
        "http://localhost:5000/api/login",
        login
      );
      const userToken = res.data?.result?.token;

      if (userToken) {
        localStorage.setItem("token", userToken);
        setToken(userToken);
        setIsAuthenticated(true);
      }

      alert(res.data.message || "Login successful");
    } catch (error) {
      alert(error.response?.data?.message || "Login failed");
    }
  };

  // ================= UPDATE USER =================
  const updateUser = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put(
        "http://localhost:5000/api/updateUser",
        update
      );
      alert("Profile updated successfully");
      console.log(res.data);
      setShowUpdateForm(false);
    } catch (error) {
      alert(error.response?.data?.message || "Update failed");
    }
  };

  // ================= LOGOUT =================
  const logoutUser = () => {
    localStorage.removeItem("token");
    setToken(null);
    setIsAuthenticated(false);
    setShowUpdateForm(false);
    setLogin({ email: "", password: "" });
  };

  // ================= JSX =================
  return (
    <div className="auth-container">
     
      {isAuthenticated ? (
        // ================= DASHBOARD =================
        <div className="update-container">
          
          <div className="left-side-container">
            <div className="left-container-image">
              <img
                src="src/assets/profile image.png"
                alt="profile"
              />
            </div>

            <div className="container-buttons">
              <button
                className="update-btn"
                onClick={() => setShowUpdateForm(true)}
              >
                Update
              </button>

              <button
                className="logout-btn"
                onClick={logoutUser}
              >
                Logout
              </button>
            </div>
          </div>

          <div className="right-side-container">
            {!showUpdateForm ? (
              <>
              <svg onClick={() => setIsAuthenticated(false)} style={{cursor:'pointer',marginLeft:'-5px',marginTop:'5px'}} xmlns="http://www.w3.org/2000/svg" height="25px" viewBox="0 -960 960 960" width="24px" fill="#1f1f1f"><path d="m313-440 224 224-57 56-320-320 320-320 57 56-224 224h487v80H313Z"/></svg>
                <h1>Hello Users</h1>
                <p>
                  Welcome to your dashboard. You can update
                  your profile or logout from here.
                </p>
              </>
            ) : (
              <>
                <form className="update-box">
                  <svg onClick={()=>setShowUpdateForm(false)} style={{cursor:'pointer',margin:'5px'}} xmlns="http://www.w3.org/2000/svg" height="25px" viewBox="0 -960 960 960" width="24px" fill="#1f1f1f"><path d="m313-440 224 224-57 56-320-320 320-320 57 56-224 224h487v80H313Z"/></svg> 
                  <h3>Update Profile</h3><hr />

                  <input 
                    type="text"
                    placeholder="Name"
                    value={update.name}
                    onChange={(e) => {setUpdate({...update, name:e.target.value})}}
                  />

                  <input 
                    type="email"
                    placeholder="Email"
                    value={update.email}
                    onChange={(e) => {setUpdate({...update, email:e.target.value})}}
                  />

                  <input 
                    type="password"
                    placeholder="Password"
                    value={update.password}
                    onChange={(e) => {setUpdate({...update, password:e.target.value})}}
                  />

                  <input 
                    type="password"
                    placeholder="Confirm Password"
                    value={update.confirmPassword}
                    onChange={(e) => {setUpdate({...update, confirmPassword:e.target.value})}}
                  />
                  <div className="radio-input-btn">

                  <p>Gender</p>
                  <div className="input_radio">
                  <label htmlFor="101">
                   <input id="101"
                      type="radio"
                      name="gender"
                      value="male"
                      checked={update.gender === "male"}
                      onClick={() =>
                        setUpdate({
                          ...update,
                          gender: update.gender === "male" ? "" : "male",
                        })
                      }
                    /> Male
                  </label>

                  <label htmlFor="102">
                  <input id="102"
                    type="radio"
                    name="gender"
                    value="female"
                    checked={update.gender === "female"}
                    onClick={() =>
                      setUpdate({
                        ...update,
                        gender: update.gender === "female" ? "" : "female",
                      })
                    }
                  /> Female
                  </label>

                  <label htmlFor="103">
                    <input 
                    id="103"
                    type="radio" 
                    value="other" 
                    name="gender" 
                    checked={update.gender === "other"}
                    onClick={() =>
                      setUpdate({
                        ...update,
                        gender: update.gender === "other" ? "" : "other",
                      })
                    }                    
                    onChange={(e)=> {setUpdate({...update, gender:e.target.value})}}
                    />Other
                    
                  </label> 
                  </div>                
                  </div>

                  <div style={{ marginTop: "10px" }}>
                    <button type="submit"
                      className="update-btn"
                      onClick={updateUser}
                    >
                      Save
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      ) : (
        // ================= LOGIN / SIGNUP =================
        <>
          <div className="top-buttons">
            <button onClick={() => setIsLogin(true)}>
              Login
            </button>
            <button onClick={() => setIsLogin(false)}>
              Sign Up
            </button>
          </div>

          <hr />

          {isLogin ? (
            <form className="login-box" onSubmit={loginUser}>
              <h2>Login</h2>

              <input
                type="email"
                placeholder="Email"
                value={login.email}
                onChange={(e) =>
                  setLogin({
                    ...login,
                    email: e.target.value,
                  })
                }
              />

              <input
                type="password"
                placeholder="Password"
                value={login.password}
                onChange={(e) =>
                  setLogin({
                    ...login,
                    password: e.target.value,
                  })
                }
              />

              <button type="submit">Login</button>
            </form>
          ) : (
            <form className="login-box" onSubmit={userSignUp}>
              <h2>Create Account</h2>

              <input
                type="text"
                placeholder="Full Name"
                value={signUp.name}
                onChange={(e)=>{setSignUp({...signUp, name:e.target.value})}}
              />

              <input
                type="email"
                placeholder="Email"
                value={signUp.email}
                onChange={(e) => {setSignUp({...signUp, email:e.target.value})}}
              />

              <input
                type="password"
                name="password"
                placeholder="Password"
                value={signUp.password}
                onChange={(e) => {setSignUp({...signUp, password:e.target.value})}}
              />

              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm Password"
                value={signUp.confirmPassword}
                onChange={(e) =>(setSignUp({...signUp, confirmPassword:e.target.value}))}
              />
              <div className="radio-btn">
                Gender : 
                <label htmlFor="101">
                  <input
                    id="101"
                    type="radio"
                    value="male"
                    name="gender"
                    onChange={(e) =>(setSignUp({...signUp, gender:e.target.value}))}
                  />Male
                </label>
                <label htmlFor="102">
                  <input 
                  id="102" 
                  type="radio" 
                  value="female" 
                  name="gender" 
                  onChange={(e) =>(setSignUp({...signUp, gender:e.target.value}))}
                  />Female
                </label>
                <label htmlFor="103">
                  <input 
                  id="103" 
                  type="radio" 
                  value="other" 
                  name="gender" 
                  onChange={(e) =>(setSignUp({...signUp, gender:e.target.value}))}
                  />Other
                </label>
              </div>
              <button type="submit">Sign Up</button>
            </form>
          )}
        </>
      )}
    </div>
  );
}
