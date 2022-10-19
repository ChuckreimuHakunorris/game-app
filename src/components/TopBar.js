import { useNavigate, Link } from "react-router-dom";
import useLocalStorage from "../hooks/useLocalStorage";
import useLogout from "../hooks/useLogout";
import useAuth from "../hooks/useAuth";
import jwtDecode from "jwt-decode";

const TopBar = () => {
    const navigate = useNavigate();
    const [user] = useLocalStorage("user");
    const { auth } = useAuth();
    const logout = useLogout();

    const decoded = auth?.accessToken
        ? jwtDecode(auth.accessToken)
        : undefined;

    const signOut = async () => {
        await logout();
        navigate('/login');
    }

    return (
        <div className="topnav">
            <Link to="/" id="title">Castrum Tactics</Link>
            <Link to="/game">Game</Link>
            <Link to="/admin">Admin</Link>
            {decoded
                ? (<>
                    <Link id="barRight" onClick={signOut}>Logout</Link>
                    <div id="barUsername">{user}</div></>)
                : (<Link id="barRight" to="/login">Login</Link>)}
        </div>
    )
}

export default TopBar;