import { useState, useEffect } from "react";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { useNavigate } from "react-router-dom";
import useLocalStorage from "../hooks/useLocalStorage";

function Room(props) {
    const [user] = useLocalStorage("user");

    const navigate = useNavigate();
    const axiosPrivate = useAxiosPrivate();

    function joinRoom() {
        const editRoom = async () => {
            try {
                const response = await axiosPrivate.put("/rooms", {
                    id: props.room._id,
                    opponent_name: user
                });

                const room = response.data;

                console.log(room);
            } catch (err) {
                console.error(err);
            }
        }

        if (props.room.hostname !== user)
            editRoom();
        
        navigate(`/rooms/${props.room._id}`);
    }

    return (
        <div className="roomDiv">
            <b>{props.room.roomname}</b><button onClick={joinRoom}
                id="joinRoomButton">Join Room</button><br />
            Host: {props.room.hostname}
        </div>
    )
}

const Rooms = () => {
    const [rooms, setRooms] = useState();
    const axiosPrivate = useAxiosPrivate();
    //const navigate = useNavigate();
    //const location = useLocation();

    useEffect(() => {
        let isMounted = true;
        const controller = new AbortController();

        const getRooms = async () => {
            try {
                const response = await axiosPrivate.get("/rooms", {
                    signal: controller.signal
                });

                const rooms = response.data.map(room => room);

                isMounted && setRooms(rooms);
            } catch (err) {
                console.error(err);
                //navigate("/login", { state: { from: location }, replace: true});
            }
        }

        getRooms();

        return () => {
            isMounted = false;
            controller.abort();
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <article>
            {rooms?.length
                ? (
                    <ul style={{ listStyle: "none" }}>
                        {rooms.map((room, i) => <li key={i}>
                            <Room room={room} />

                        </li>)}
                    </ul>
                ) : <p>No rooms to display.</p>
            }
        </article>
    )
}

export default Rooms;