import useLocalStorage from "../hooks/useLocalStorage";
import { useEffect, useState, useRef } from "react";

import io from "socket.io-client";

var socket;

function Log(props) {
    const listItems = props.messages.map((message, index) => {
        let nameColor = "gameLog_usernameOpponent";
        if (message.username === props.username) {
            nameColor = "gameLog_usernameOwn";
        }

        switch (message.type) {
            case "chat_message":
                return (
                    <p key={index}>
                        <span className={nameColor}>{message.username} </span>
                        <span className="gameLog_socketId">[{message.socketId}] </span>
                        <span className="gameLog_message">{message.message}</span>
                    </p>)
            case "connection_confirmation":
                return (
                    <p key={index}>
                        <span className={nameColor}>{message.username} </span>
                        <span className="gameLog_socketId">[{message.socketId}] </span>
                        {message.message}
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

function GameGrid(props) {
    let grid = props.grid;

    return (
        <div className="gameGrid">
            {grid.map((rows, index) => {
                return (
                    rows.map((rowItems, sIndex) => {
                        return <div className="gridSquare"> {rowItems} </div>
                    })
                );
            })}
        </div>
    );
}

const Game = () => {
    const [username] = useLocalStorage("user");

    const room = 1;

    const [message, setMessage] = useState("");

    const [log, setLog] = useState([]);

    const messagesEndRef = useRef(null);

    let grid = [
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0]
    ];

    const joinRoom = () => {
        socket = io.connect("http://localhost:3500");
        //socket = io.connect("https://castrum-tactics.onrender.com");

        socket.emit("join_room", { room, username });
    }

    const sendMessage = () => {
        socket.emit("send_message", { message, room, username });
    }

    useEffect(() => {
        joinRoom();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        socket.on("receive_message", (data) => {
            data.type = "chat_message";
            setLog(current => [...current, data]);
        })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        socket.on("confirm_connection", (data) => {
            data.type = "connection_confirmation";
            data.message = " connected to the room.";
            setLog(current => [...current, data]);
        })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        scrollToBottom();
    }, [log])

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }

    return (
        <div className="gameContainer">
            <h1>Game</h1>
            <br />
            <p>You are logged in as {username}</p>
            <br />
            <div className="gridContainer">
                <GameGrid grid={grid} />
            </div>
            <div className="gameLog">
                <Log messages={log} username={username} />
                <div ref={messagesEndRef} />
            </div>
            <input type="text" placeholder="Message..." onChange={(event) => {
                setMessage(event.target.value)
            }} />
            <button onClick={sendMessage}>Send Message</button>
        </div>
    )
}

export default Game;