import io from "socket.io-client";
const socket = io.connect("http://localhost:3000");

const Game = () => {
    const sendMessage = () => {
        socket.emit("send_message", {message: "Hello"})
    }

    return (
        <section>
            <input type="text" placeholder="Message..." />
            <button onClick={sendMessage}>Send Message</button>
        </section>
    )
}

export default Game;