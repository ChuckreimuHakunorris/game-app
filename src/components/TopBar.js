import { Link } from "react-router-dom";
import useLocalStorage from "../hooks/useLocalStorage";
import useAuth from "../hooks/useAuth";
import jwtDecode from "jwt-decode";

const TopBar = () => {
    const [user] = useLocalStorage("user");
    const { auth } = useAuth();

    const decoded = auth?.accessToken
        ? jwtDecode(auth.accessToken)
        : undefined;

    return (
        <div className="topnav">
            <Link to="/" id="title">Castrum Tactics</Link>
            <Link to="/game">Game</Link>
            <Link to="/admin">Admin</Link>
            {decoded
                ? (<div id="barUsername">{user}</div>)
                : (<Link id="barUsername" to="/login">Login</Link>)}
        </div>
    )
}

export default TopBar;