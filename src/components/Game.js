import useLocalStorage from "../hooks/useLocalStorage";
import { useEffect, useState } from "react";

import io from "socket.io-client";

var socket;

const Game = () => {
    const [value] = useLocalStorage("user");

    const [room, setRoom] = useState("");

    const [message, setMessage] = useState("");
    const [messageReceived, setMessageReceived] = useState("");

    const joinRoom = () => {
        if (room !== "") {
            //socket = io.connect("http://localhost:3500");
            socket = io.connect("https://castrum-tactics.onrender.com/");
            socket.emit("join_room", room);
        }
    }

    const sendMessage = () => {
        socket?.emit("send_message", { message, room });
    }

    useEffect(() =>{
        socket?.on("receive_message", (data) => {
            setMessageReceived(data.message);
        })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [socket])

    return (
        <section>
            <h1>Home</h1>
            <br />
            <p>You are logged in as { value }</p>
            <br />
            <input type="text" placeholder="Room Number..." onChange={(event) => {
                setRoom(event.target.value)
            }}/>
            <button onClick={joinRoom}>Join Room</button>
            <br />
            <input type="text" placeholder="Message..." onChange={(event) => {
                setMessage(event.target.value)
            }}/>
            <button onClick={sendMessage}>Send Message</button>
            <p>Message: { messageReceived }</p>
        </section>
    )
}

export default Game;