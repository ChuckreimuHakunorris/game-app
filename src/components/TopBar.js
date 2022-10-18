import { Link } from "react-router-dom"

const TopBar = () => {
    return (
        <div className="topnav">
            <Link to="/" id="title">Castrum Tactics</Link>
            <Link to="/game">Game</Link>
            <Link to="/admin">Admin</Link>
        </div>
    )
}

export default TopBar;