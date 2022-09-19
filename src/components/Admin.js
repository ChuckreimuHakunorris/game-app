import { Link } from "react-router-dom";
import Players from "./Players";

const Admin = () => {
    return (
        <section>
            <h1>Admins Page</h1>
            <br />
            <Players />
            <br />
            <div className="flexGrow">
                <Link to="/">Home</Link>
            </div>
        </section>
    )
}

export default Admin