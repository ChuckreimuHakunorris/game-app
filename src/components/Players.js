import { useState, useEffect } from "react";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { useNavigate, useLocation } from "react-router-dom";

const Players = () => {
    const [ players, setPlayers] = useState();
    const axiosPrivate = useAxiosPrivate();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        let isMounted = true;
        const controller = new AbortController();

        const getPlayers = async() => {
            try {
                const response = await axiosPrivate.get("/players", {
                    signal: controller.signal
                });
                console.log(response.data);

                isMounted && setPlayers(response.data);
            } catch (err) {
                console.error(err);
                navigate("/login", { state: { from: location }, replace: true});
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