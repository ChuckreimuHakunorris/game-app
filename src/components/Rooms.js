import { useState, useEffect } from "react";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
//import { useNavigate, useLocation } from "react-router-dom";

const Rooms = () => {
    const [ rooms, setRooms] = useState();
    const axiosPrivate = useAxiosPrivate();
    //const navigate = useNavigate();
    //const location = useLocation();

    useEffect(() => {
        let isMounted = true;
        const controller = new AbortController();

        const getRooms = async() => {
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
                            {room._id + " - " + room.roomname + " - " + room.hostname }
                        </li>)}
                    </ul>
                ) : <p>No rooms to display.</p>
            }
        </article>
    )
}

export default Rooms;