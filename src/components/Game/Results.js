function Results(props) {
    let hostTiles = props.getTiles(props.grid, "host");
    let opponentTiles = props.getTiles(props.grid, "opponent");

    let hostName = "undefined";
    let opponentName = "undefined";

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

    return (<div className="resultsContainer">
        Game Finished!<br/><br/>
        Winner<br/>
        <span className={winnerColor}>{winner}</span><br/><br/>
        <span className="gameLog_usernameHost">{hostName}</span>: 
        <span className="gameLog_moveHost"> {hostTiles}</span> - 
        <span className="gameLog_usernameOpponent"> {opponentName}</span>: 
        <span className="gameLog_moveOpponent"> {opponentTiles}</span>
    </div>)
}

export default Results;