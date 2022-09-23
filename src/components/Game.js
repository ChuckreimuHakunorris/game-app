import useLocalStorage from "../hooks/useLocalStorage";
import { useEffect, useState } from "react";

import io from "socket.io-client";

var socket;

function Log(props) {
    const messages = props.messages;
    const listItems = messages.map((message, index) =>
        <p key={index}>
            {message}
        </p>
    );
    return (
        <>{listItems}</>
    );
}

const Game = () => {
    const [username] = useLocalStorage("user");

    const room = 1;

    const [message, setMessage] = useState("");

    const [log, setLog] = useState([]);

    const joinRoom = () => {
        //if (room !== "") {
        //socket = io.connect("http://localhost:3500");
        socket = io.connect("https://castrum-tactics.onrender.com");

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
            let msg = `${data.username}: ${data.message}`
            setLog(current => [...current, msg]);
        })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        socket.on("confirm_connection", (data) => {
            setLog(current => [...current, `${data.username} (${socket.id}) 
            connected to the room.`]);
        })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <div className="gameContainer">
            <h1>Game</h1>
            <br />
            <p>You are logged in as {username}</p>
            <div className="gameLog">
                <Log messages={log}/>
            </div>
            <input type="text" placeholder="Message..." onChange={(event) => {
                setMessage(event.target.value)
            }} />
            <button onClick={sendMessage}>Send Message</button>
        </div>
    )
}

export default Game;