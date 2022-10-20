//import { Link } from "react-router-dom";
import CreateRoom from "./CreateRoom";
import Rooms from "./Rooms";

const RoomList = () => {
    return (
        <>
            <CreateRoom />
            <section>
                <h1>Room List</h1>
                <br />
                <Rooms />
                <br />
            </section>
        </>
    )
}

export default RoomList