import { useEffect } from "react";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { useNavigate } from "react-router-dom";

function Results(props) {
    const axiosPrivate = useAxiosPrivate();

    const navigate = useNavigate();

    let hostTiles = props.getTiles(props.grid, "host");
    let opponentTiles = props.getTiles(props.grid, "opponent");

    let hostName = "undefined";
    let opponentName = "undefined";

    let username = props.username;

    let id = props.id;

    switch (props.role) {
        case "host":
            hostName = props.username;
            opponentName = props.challengerName;
            break;
        case "opponent":
            hostName = props.challengerName;
            opponentName = props.username;
            break;
        default:
            break;
    }

    let winner = "undefined";
    let winnerColor = "undefined";

    let result = hostTiles - opponentTiles;

    if (result > 0) {
        winner = hostName;
        winnerColor = "gameLog_usernameHost";
    } else if (result === 0) {
        winner = "Draw";
        winnerColor = "gameLog_message";
    } else if (result < 0) {
        winner = opponentName;
        winnerColor = "gameLog_usernameOpponent";
    }

    function exitGame() {
        props.socket.disconnect();

        const deleteRoom = async () => {
            try {
                const response = await axiosPrivate.delete("/rooms", {
                    data: { id }
                });

                console.log(response);

                navigate("/rooms");
            } catch (err) {
                console.error(err);
            }
        }

        deleteRoom();
    }

    useEffect(() => {
        const editPlayer = async (games_played, wins, draws, losses) => {
            try {
                const response = await axiosPrivate.put("/players", {
                    username,
                    games_played,
                    wins,
                    draws,
                    losses
                });

                const player = response.data;

                console.log(player);
            } catch (err) {
                console.error(err);
            }
        }

        const getPlayer = async () => {
            try {
                const response = await axiosPrivate.get(`players/${username}`);

                let games_played = response.data.games_played;
                let wins = response.data.wins;
                let draws = response.data.draws;
                let losses = response.data.losses;

                games_played += 1;

                if (winner === "Draw") {
                    draws += 1;
                } else if (winner === username) {
                    wins += 1;
                } else {
                    losses += 1;
                }

                editPlayer(games_played, wins, draws, losses);
            } catch (err) {
                console.error(err);
            }
        }

        getPlayer();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (<div className="resultsContainer">
        Game Finished!<br /><br />
        Winner<br />
        <span className={winnerColor}>{winner}</span><br /><br />
        <span className="gameLog_usernameHost">{hostName} </span>:
        <span className="gameLog_moveHost"> {hostTiles} </span> -
        <span className="gameLog_usernameOpponent"> {opponentName} </span>:
        <span className="gameLog_moveOpponent"> {opponentTiles} </span>
        <br />
        <button onClick={exitGame}>&emsp;&emsp;OK&emsp;&emsp;</button>
    </div>)
}

export default Results;