import React, { useState, useEffect } from "react";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import useLocalStorage from "../hooks/useLocalStorage";
import { useNavigate } from "react-router-dom";

const CreateRoom = (props) => {
    const [roomName, setRoomName] = useState("");
    const [stage, setStage] = useState("Plains");
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
            const room = { roomname: roomName, hostname: user, stage };

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
                <label htmlFor="room-name">Room name:&nbsp;&nbsp;</label>
                <input type="text" name="room-name" placeholder="Room name..."
                    onChange={(e) => setRoomName(e.target.value)} required
                    defaultValue={`${user}'s Room`}></input>
                <br />
                <br />
                <label htmlFor="stage-select">Select stage:&nbsp;&nbsp;</label>
                <select name="stage-select" id="stage-select" onChange={(e) => setStage(e.target.value)}>
                    <option value="Plains">Plains</option>
                    <option value="Rocks">Rocks</option>
                    <option value="Test 1">Test 1</option>
                    <option value="Test 2">Test 2</option>
                </select>
                <br />
                <br />
                <br />
                <br />
                <br />
                <br />
                <div id="create-room-button-container">
                    <button id="create-room-button">Create Room</button>
                </div>
            </form>
        </section>
    )
}

export default CreateRoom;