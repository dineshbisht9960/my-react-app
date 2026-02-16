import { useState, useEffect } from "react";
import axios from "axios";
// import "./FormHandle.css";
import { useDispatch, useSelector } from "react-redux";
import {
  logout,
} from "../../redux/formSlice";

export default function FormHandle() {
  const dispatch = useDispatch();

  // Redux persisted token
  const token = useSelector((state) => state.form.token);

  // UI States
  const [showLogin, setShowLogin] = useState(false);
  const [forgotStep, setForgotStep] = useState(0);

  // Signup
  const [signupData, setSignupData] = useState({
    fullName: "",
    email: "",
    password: "",
    phone: "",
    countryCode: "",
    gender: "",
  });

  // Login
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  // Schedule Time
  const [scheduleTime, setScheduleTime] = useState({
    date: "",
    time: "",
    message: "",
  });

  // Forgot Password
  const [forgotData, setForgotData] = useState({
    email: "",
    confirmPassword: "",
    otp: "",
    token: null,
  });

  // ====================== AXIOS INTERCEPTOR ======================
  useEffect(() => {
    const interceptor = axios.interceptors.request.use(
      (config) => {
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    return () => axios.interceptors.request.eject(interceptor);
  }, [token]);

  // ====================== SIGNUP ======================
  const handleSignUp = (e) => {
    e.preventDefault();

    axios
      .post("https://onboarding-upd.onrender.com/api/user/signup", signupData)
      .then((res) => {
        console.log("Signup Success:", res.data);
        // dispatch(saveSignup(signupData));
        let token = res.data.token;
        localStorage.setItem("token", token);
        console.log(token);
        setShowLogin(true);
      })
      .catch((err) => console.error("Signup Error:", err));
  };

  // ====================== LOGIN ======================
  const handleLogin = (e) => {
    e.preventDefault();

    axios
      .post("https://onboarding-upd.onrender.com/api/user/login", loginData)
      .then((res) => {
        // dispatch(saveLogin({ ...loginData, token: res.data.token }));
        let token = res.data.token;
        localStorage.setItem("token", token);
        alert("Login successful");
      })
      .catch((err) => console.error("Login Error:", err));
  };

  // ====================== LOGOUT ======================
  const handleLogout = () => {
    dispatch(logout());
    alert("Logged out successfully");
  };

  // ====================== FORGOT FLOW ======================
  const sendForgotEmail = () => {
    axios
      .post("https://onboarding-upd.onrender.com/api/user/forgot", {
        email: forgotData.email,
      })
      .then((res) => {
        setForgotData({ ...forgotData, token: res.data.token });
        setForgotStep(2);
      })
      .catch((err) => console.error(err));
  };

  const verifyOtp = () => {
    axios
      .post("https://onboarding-upd.onrender.com/api/user/verifyOtp", {
        email: forgotData.email,
        otp: forgotData.otp,
        token: forgotData.token,
      })
      .then(() => setForgotStep(3))
      .catch((err) => console.error(err));
  };

  const resetPassword = () => {
    axios
      .post("https://onboarding-upd.onrender.com/api/user/reset-password", {
        email: forgotData.email,
        password: forgotData.password,
        confirmPassword: forgotData.confirmPassword,
        token: forgotData.token,
      })
      .then(() => {
        alert("Password reset successfully");
        setForgotStep(0);
      })
      .catch((err) => console.error(err));
  };

  // ====================== TIME SCHEDULER ======================
  const handleTimeSchedule = () => {
    const { date, time, message } = scheduleTime;

    if (!date || !time) {
      alert("Please select date, time & message");
      return;
    }

    // Combine into ISO format
    const finalDate = `${date}T${time}:00`;

    axios
      .post("https://onboarding-upd.onrender.com/api/user/schedule", {
        date: finalDate,
        message: message,
      })
      .then((res) => {
        let token = res.data.token;
        localStorage.setItem("token", token);
        alert("Schedule Sent Successfully")
      })
      .catch((err) => console.log(err));
  };

  // ============================= JSX =============================
  return (
    <div className="container">
      <div className="left-panel">
        <div className="avatar"></div>
        <h2>Let's get you set up</h2>

        <div className="login-btn">
          <button className="cancel" onClick={() => setShowLogin(true)}>
            Login
          </button>
        </div>

        <div className="login-btn">
          <button className="cancel" onClick={handleLogout} style={{ marginTop: 20 }}>
            Logout
          </button>
        </div>
      </div>

      <div className="right-panel">
        {/* ================= SIGNUP ================= */}
        {!showLogin && forgotStep === 0 && (
          <form onSubmit={handleSignUp}>
            <h2>Sign Up</h2>

            <div className="form-group">
              <label>Name</label>
              <input
                className="input"
                type="text"
                placeholder="Enter Your Full Name"
                onChange={(e) =>
                  setSignupData({ ...signupData, fullName: e.target.value })
                }
              />
            </div>

            <div className="form-group">
              <label>Email</label>
              <input
                className="input"
                type="email"
                placeholder="example@gmail.com"
                onChange={(e) =>
                  setSignupData({ ...signupData, email: e.target.value })
                }
              />
            </div>

            <div className="form-group">
              <label>Password</label>
              <input
                className="input"
                type="password"
                placeholder="Enter Your Password"
                onChange={(e) =>
                  setSignupData({ ...signupData, password: e.target.value })
                }
              />
            </div>

            <div className="form-group">
              <label>Phone Number</label>
              <div className="phone-row">
                <select
                  onChange={(e) =>
                    setSignupData({ ...signupData, countryCode: e.target.value })
                  }
                >
                  <option value=""></option>
                  <option value="+91">+91</option>
                  <option value="+93">+93</option>
                  <option value="+94">+94</option>
                  <option value="+95">+95</option>
                </select>

                <input
                  type="text"
                  placeholder="Enter Your Number"
                  onChange={(e) =>
                    setSignupData({ ...signupData, phone: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="radio-group">
              <label>Select Your Gender:</label>
              {["Male", "Female", "Other"].map((g, i) => (
                <label key={i}>
                  <input
                    type="radio"
                    name="gender"
                    value={i + 1}
                    onChange={(e) =>
                      setSignupData({ ...signupData, gender: e.target.value })
                    }
                  />
                  {g}
                </label>
              ))}
            </div>

            <div className="actions">
              <button type="submit" className="save">
                Submit
              </button>
            </div>
          </form>
        )}

        {/* ================= LOGIN ================= */}
        {showLogin && forgotStep === 0 && (
          <form onSubmit={handleLogin}>
            <svg
              onClick={() => setShowLogin(false)}
              style={{ margin: "5px -5px", cursor: "pointer" }}
              width="40"
              height="24"
              viewBox="0 0 40 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <path d="M12 6l-6 6 6 6" />
              <line x1="6" y1="12" x2="38" y2="12" />
            </svg>

            <div className="form-group">
              <label>Email</label>
              <input
                className="input"
                type="email"
                placeholder="Enter Your Email"
                onChange={(e) =>
                  setLoginData({ ...loginData, email: e.target.value })
                }
              />
            </div>

            <div className="form-group">
              <label>Password</label>
              <input
                className="input"
                type="password"
                placeholder="Enter Your Password"
                onChange={(e) =>
                  setLoginData({ ...loginData, password: e.target.value })
                }
              />
            </div>

            <div className="actions">
              <button type="submit" className="save">
                Submit
              </button>

              <a className="forgot" onClick={() => setForgotStep(1)}>
                Forgot Password?
              </a>
            </div>

            {/* ================= TIME SCHEDULER ================= */}
            <div className="time-row">
              <input
                type="date"
                onChange={(e) =>
                  setScheduleTime({ ...scheduleTime, date: e.target.value })
                }
              />

              <input
                type="time"
                onChange={(e) =>
                  setScheduleTime({ ...scheduleTime, time: e.target.value })
                }
              />

              <textarea
                className="input"
                placeholder="Enter Message"
                onChange={(e) =>
                  setScheduleTime({
                    ...scheduleTime,
                    message: e.target.value,
                  })
                }
              />

              <button type="button" onClick={handleTimeSchedule}>
                Send Message
              </button>
            </div>
          </form>
        )}

        {/* ====================== FORGOT STEP 1 ====================== */}
        {forgotStep === 1 && (
          <form className="forgot-form">
            <svg
              onClick={() => setForgotStep(0)}
              style={{ margin: "0px -5px", cursor: "pointer" }}
              width="40"
              height="24"
              viewBox="0 0 40 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <path d="M12 6l-6 6 6 6" />
              <line x1="6" y1="12" x2="38" y2="12" />
            </svg>

            <h3>Forgot Password</h3>

            <div className="form-group">
              <label>Email</label>
              <input
                className="input"
                type="email"
                placeholder="Enter Your Email"
                onChange={(e) =>
                  setForgotData({ ...forgotData, email: e.target.value })
                }
              />
            </div>

            <button type="button" className="save" onClick={sendForgotEmail}>
              Continue
            </button>
          </form>
        )}

        {/* ====================== FORGOT STEP 2 (OTP) ====================== */}
        {forgotStep === 2 && (
          <form className="forgot-form">
            <svg
              onClick={() => setForgotStep(1)}
              width="40"
              height="24"
              viewBox="0 0 40 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              style={{ cursor: "pointer" }}
            >
              <path d="M12 6l-6 6 6 6" />
              <line x1="6" y1="12" x2="38" y2="12" />
            </svg>

            <h3>Enter OTP</h3>

            <div className="otp-row">
              {[1, 2, 3, 4].map((_, i) => (
                <input
                  key={i}
                  maxLength="1"
                  onChange={(e) =>
                    setForgotData({
                      ...forgotData,
                      otp: forgotData.otp + e.target.value,
                    })
                  }
                />
              ))}
            </div>

            <button type="button" className="save" onClick={verifyOtp}>
              Verify
            </button>
          </form>
        )}

        {/* ====================== FORGOT STEP 3 (RESET) ====================== */}
        {forgotStep === 3 && (
          <form className="forgot-form">
            <svg
              onClick={() => setForgotStep(2)}
              width="40"
              height="24"
              viewBox="0 0 40 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              style={{ cursor: "pointer" }}
            >
              <path d="M12 6l-6 6 6 6" />
              <line x1="6" y1="12" x2="38" y2="12" />
            </svg>

            <h3>Reset Password</h3>

            <input
              className="input"
              type="password"
              placeholder="New Password"
              onChange={(e) =>
                setForgotData({ ...forgotData, password: e.target.value })
              }
            />

            <input
              className="input"
              type="password"
              placeholder="Confirm Password"
              onChange={(e) =>
                setForgotData({
                  ...forgotData,
                  confirmPassword: e.target.value,
                })
              }
            />

            <button type="button" className="save" onClick={resetPassword}>
              Save
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
