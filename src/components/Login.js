import { useRef, useState, useEffect } from "react";
import useAuth from "../hooks/useAuth";
import { Link, useNavigate } from "react-router-dom";
import useInput from "../hooks/useInput";
import useToggle from "../hooks/useToggle";

import axios from "../api/axios";
const LOGIN_URL = "/auth";

const Login = () => {
    const { setAuth } = useAuth();

    const navigate = useNavigate();

    const userRef = useRef();
    const errRef = useRef();

    const [user, resetUser, userAttributes] =  useInput("user", "");
    const [pwd, setPwd] = useState("");
    const [errMsg, setErrMsg] = useState("");

    const [check, toggleCheck] = useToggle("persist", false);

    if (user === "DEFAULT_VALUE") {
        resetUser();
    }

    useEffect(() => {
        userRef.current.focus();
    }, [])

    useEffect(() => {
        setErrMsg("");
    }, [user, pwd])

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post(LOGIN_URL,
                JSON.stringify({ player: user, pwd }),
                {
                    headers: { "Content-Type": "application/json" },
                    withCredentials: true
                }
            );

            const accessToken = response?.data?.accessToken;
            
            setAuth({ user, accessToken });
            resetUser();
            setPwd("");

            navigate("/");

            window.location.reload(true);
        } catch (err) {

            if (err?.response?.status === 0) {
                setErrMsg("No server response");
            } else if (err.response?.status === 400) {
                setErrMsg("Missing Username or Password");
            } else if (err.response?.status === 401) {
                setErrMsg("Incorrect Username or Password");
            } else {
                setErrMsg("Login failed");
            }
            errRef.current.focus();
        }
    }
    
    return (
        <section id="specialFormContainer">
            <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>
            <h1>Sign In</h1>
            <form onSubmit={handleSubmit} className="inputForm">
                <label htmlFor="username">Username:</label>
                <input
                    type="text"
                    id="username"
                    ref={userRef}
                    autoComplete="off"
                    {...userAttributes}
                    required
                />

                <label htmlFor="password">Password:</label>
                <input
                    type="password"
                    id="password"
                    onChange={(e) => setPwd(e.target.value)}
                    value={pwd}
                    required
                />

                <button>Sign In</button>
                <div className="persistCheck">
                    <input
                        type="checkbox"
                        id="persist"
                        onChange={toggleCheck}
                        checked={check}
                    />
                    <label htmlFor="persist">Remember Me</label>
                </div>
            </form>
            <p>
                Need an Account?<br />
                <span className="line">
                    <Link to="/register">Sign Up</Link>
                </span>
            </p>
        </section>
    )
}

export default Login;