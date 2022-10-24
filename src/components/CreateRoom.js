import React, { useState, useEffect } from "react";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import useLocalStorage from "../hooks/useLocalStorage";
import { useNavigate } from "react-router-dom";

const CreateRoom = (props) => {
    const [roomName, setRoomName] = useState("");
    const [user] = useLocalStorage("user");

    const axiosPrivate = useAxiosPrivate();
    const navigate = useNavigate();

    const createRoom = async (e) => {
        e.preventDefault();

        if (roomName === "") {
            setRoomName(`${user}'s Room`);
            console.log(roomName);
        }

        try {
            const room = { roomname: roomName, hostname: user, hostID: "gsegi23o4gn34iogh34ni" };

            const response = await axiosPrivate.post("/rooms", room);

            navigate(`/rooms/${response.data._id}`);

        } catch (err) {
            console.log(err);
        }
    }

    useEffect(() => {
        setRoomName(`${user}'s Room`);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <section>
            <form onSubmit={createRoom}>
                <h1>Create New Room</h1>
                <br />
                Room name:&nbsp;&nbsp;<input type="text" placeholder="Room name..."
                    onChange={(e) => setRoomName(e.target.value)} required
                    defaultValue={`${user}'s Room`}></input>
                <br />
                <button>Create Room</button>
            </form>
        </section>
    )
}

export default CreateRoom;