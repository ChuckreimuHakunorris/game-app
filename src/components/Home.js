import { useNavigate, Link } from "react-router-dom";
import useLogout from "../hooks/useLogout";
import useLocalStorage from "../hooks/useLocalStorage";
import { useEffect, useState } from "react";

import io from "socket.io-client";
const socket = io.connect("http://localhost:3500");

const Home = () => {
    const navigate = useNavigate();
    const logout = useLogout();

    const [value] = useLocalStorage("user");

    const [room, setRoom] = useState("");

    const [message, setMessage] = useState("");
    const [messageReceived, setMessageReceived] = useState("");

    const joinRoom = () => {
        if (room !== "") {
            socket.emit("join_room", room);
        }
    }

    const sendMessage = () => {
        socket.emit("send_message", { message, room });
    }

    useEffect(() =>{
        socket.on("receive_message", (data) => {
            setMessageReceived(data.message);
        })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [socket])

    const signOut = async () => {
        await logout();
        navigate('/linkpage');
    }

    return (
        <section>
            <h1>Home</h1>
            <br />
            <p>You are logged in as { value }</p>
            <br />
            <Link to="/admin">Go to the Admin page</Link>
            <br />
            <Link to="/linkpage">Go to the link page</Link>
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
            <div className="flexGrow">
                <button onClick={signOut}>Sign Out</button>
            </div>
        </section>
    )
}

export default Home;