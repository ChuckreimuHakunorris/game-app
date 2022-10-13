function Log(props) {
    const listItems = props.messages.map((message, index) => {
        let nameColor = "gameLog_usernameOpponent";
        if (message.role === "host") {
            nameColor = "gameLog_usernameHost";
        }

        let moveColor = "gameLog_moveOpponent";
        if (message.role === "host") {
            moveColor = "gameLog_moveHost";
        }

        switch (message.type) {
            case "chat_message":
                return (
                    <p key={index}>
                        <span className={nameColor}>{message.username} </span>
                        {/*<span className="gameLog_socketId">[{message.socketId}] </span>*/}
                        <span className="gameLog_message">{message.message}</span>
                    </p>)
            case "info":
                return (
                    <p key={index}>
                        {message.message}
                    </p>)
            case "connection_confirmation":
                return (
                    <p key={index}>
                        <span className={nameColor}>{message.username} </span>
                        {/*<span className="gameLog_socketId">[{message.socketId}] </span>*/}
                        {message.message}
                    </p>)
            case "send_move":
                return (
                    <p key={index}>
                        <span className={moveColor}>{message.message}</span>
                    </p>)
            case "receive_moves":
                return (
                    <p key={index}>
                        {message.message}
                        <span className="gameLog_moveHost"> {message.hostData} </span>
                        <span className="gameLog_moveOpponent">{message.opponentData}</span>
                    </p>)
            default:
                break;
        }
        return (<p>Something went wrong!</p>);
    });
    return (
        <>{listItems}</>
    );
}

export default Log;