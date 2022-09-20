import { useNavigate, Link } from "react-router-dom";
import useLogout from "../hooks/useLogout";
import useLocalStorage from "../hooks/useLocalStorage";

const Home = () => {
    const navigate = useNavigate();
    const logout = useLogout();

    const value = useLocalStorage("user");

    const signOut = async () => {
        await logout();
        navigate('/linkpage');
    }

    return (
        <section>
            <h1>Home</h1>
            <br />
            <p>You are logged in as {value}</p>
            <br />
            <Link to="/admin">Go to the Admin page</Link>
            <br />
            <Link to="/linkpage">Go to the link page</Link>
            <div className="flexGrow">
                <button onClick={signOut}>Sign Out</button>
            </div>
        </section>
    )
}

export default Home;