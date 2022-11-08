import useLocalStorage from "../hooks/useLocalStorage";
import { useEffect, useState } from "react";
import useAxiosPrivate from "../hooks/useAxiosPrivate";

const Profile = () => {
    const axiosPrivate = useAxiosPrivate();

    const [username] = useLocalStorage("user");

    const [gamesPlayed, setGamesPlayed] = useState(0);
    const [wins, setWins] = useState(0);
    const [draws, setDraws] = useState(0);
    const [losses, setLosses] = useState(0);

    useEffect(() => {
        const getPlayer = async () => {
            try {
                const response = await axiosPrivate.get(`players/${username}`);

                setGamesPlayed(response.data.games_played);
                setWins(response.data.wins);
                setDraws(response.data.draws);
                setLosses(response.data.losses);

            } catch (err) {
                console.error(err);
            }
        }

        getPlayer();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <section>
            <h1>{username}</h1>
            <br/>
            <p>Games Played: {gamesPlayed}</p>
            <br/>
            <p>Wins: {wins}</p>
            <p>Draws: {draws}</p>
            <p>Losses: {losses}</p>
        </section>
    )
}

export default Profile;