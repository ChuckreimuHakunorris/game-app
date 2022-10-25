import { useState, useEffect } from "react";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { useNavigate } from "react-router-dom";

function Room(props) {
    const navigate = useNavigate();

    function joinRoom() {
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