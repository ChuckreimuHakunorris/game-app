import { useState, useEffect } from "react";
import axios from "../api/axios";

const Players = () => {
    const [ players, setPlayers] = useState();

    useEffect(() => {
        let isMounted = true;
        const controller = new AbortController();

        const getPlayers = async() => {
            try {
                const response = await axios.get("/players", {
                    signal: controller.signal
                });
                console.log(response.data);

                isMounted && setPlayers(response.data);
            } catch (err) {
                console.error(err);
            }
        }

        getPlayers();

        return () => {
            isMounted = false;
            controller.abort();
        }
    }, [])

    return (
        <article>
            <h2>Players List</h2>
            {players?.length
                ? (
                    <ul>
                        {players.map((player, i) => <li key={i}>
                            {player?.username}
                        </li>)}
                    </ul>
                ) : <p>No players to display</p>
            }
        </article>
    )
}

export default Players;