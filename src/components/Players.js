import { useState, useEffect } from "react";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { useNavigate, useLocation } from "react-router-dom";

function Player(props) {
    return (
        <div className="roomDiv">
            <b>{props.player.username}</b>
        </div>
    )
}

const Players = () => {
    const [players, setPlayers] = useState();
    const axiosPrivate = useAxiosPrivate();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        let isMounted = true;
        const controller = new AbortController();

        const getPlayers = async () => {
            try {
                const response = await axiosPrivate.get("/players", {
                    signal: controller.signal
                });

                const players = response.data.map(player => player);

                console.log(response.data);

                isMounted && setPlayers(players);
            } catch (err) {
                console.error(err);
                navigate("/login", { state: { from: location }, replace: true });
            }
        }

        getPlayers();

        return () => {
            isMounted = false;
            controller.abort();
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <section>
            <h2>Players List</h2>
            <br />
            {players?.length
                ? (
                    <ul style={{ listStyle: "none" }}>
                        {players.map((player, i) => <li key={i}>
                            <Player player={player} />
                        </li>)}
                    </ul>
                ) : <p>No players to display.</p>
            }
        </section>
    )
}

export default Players;