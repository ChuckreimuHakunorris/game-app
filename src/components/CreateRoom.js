import useAxiosPrivate from "../hooks/useAxiosPrivate";

const CreateRoom = () => {
    const axiosPrivate = useAxiosPrivate();

    const createRoom = async(e) => {
        e.preventDefault();

        try {
            const room = { roomname: "testing", hostname: "WilliamDell", hostID: "gsegi23o4gn34iogh34ni" };

            // eslint-disable-next-line no-unused-vars
            const response = await axiosPrivate.post("/rooms", room);
        } catch (err) {
            console.log(err);
        }
    }

    return (
        <section>
            <form onSubmit={createRoom}>
                <h1>Create New Room</h1>
                <br />
                Room name:&nbsp;&nbsp;<input type="text" placeholder="Room name..."></input>
                <br />
                <button>Create Room</button>
            </form>
        </section>
    )
}

export default CreateRoom;