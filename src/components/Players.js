import { useState, useRef, useEffect } from "react";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { useNavigate, useLocation } from "react-router-dom";

function Player(props) {
    const infoRef = useRef();

    function toggleShow() {
        const wrapper = infoRef.current;
        wrapper.classList.toggle("is-open");
    }

    return (
        <div ref={infoRef} className="playerDiv" onClick={toggleShow}>
            <b>{props.player.username}</b>
            <div>
                <br />
                <p>Games Played: {props.player.games_played}</p>
                <br />
                <p>Wins: {props.player.wins}</p>
                <p>Draws: {props.player.draws}</p>
                <p>Losses: {props.player.losses}</p>
            </div>
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