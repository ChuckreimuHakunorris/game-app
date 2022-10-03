import useLocalStorage from "../hooks/useLocalStorage";
import { useEffect, useState, useRef } from "react";
import gameGrid from "./Game/Grid";

import io from "socket.io-client";

var socket;

function Log(props) {
    const listItems = props.messages.map((message, index) => {
        let nameColor = "gameLog_usernameOpponent";
        if (message.role === "host") {
            nameColor = "gameLog_usernameHost";
        }

        let moveColor = "gameLog_moveOpponent";
        if (message.role === "host") {
            moveColor = "gameLog_moveHost";
        }

        switch (message.type) {
            case "chat_message":
                return (
                    <p key={index}>
                        <span className={nameColor}>{message.username} </span>
                        <span className="gameLog_socketId">[{message.socketId}] </span>
                        <span className="gameLog_message">{message.message}</span>
                    </p>)
            case "connection_confirmation":
                return (
                    <p key={index}>
                        <span className={nameColor}>{message.username} </span>
                        <span className="gameLog_socketId">[{message.socketId}] </span>
                        {message.message}
                    </p>)
            case "send_move":
                return (
                    <p key={index}>
                        <span className={moveColor}>{message.message}</span>
                    </p>)
            case "receive_moves":
                return (
                    <p key={index}>
                        {message.message}
                        <span className="gameLog_moveHost"> {message.hostData} </span>
                        <span className="gameLog_moveOpponent">{message.opponentData}</span>
                    </p>)
            default:
                break;
        }
        return (<p>Something went wrong!</p>);
    });
    return (
        <>{listItems}</>
    );
}

function Square(props) {
    function clickSquare() {
        if (props.data.status === "selectable") {
            props.setGridSelected(props.X, props.Y);
        }
    }

    return (
        <div key={`${props.X}-${props.Y}`} id={`square_${props.data.status}`}
             className={`gridSquare ground_${props.data.groundHealth}`} onClick={clickSquare}>
                 .
            <img src={`/game/${props.data.content}.png`} className="squareSprite" alt="missing"/>
        </div>
    )
}

function GameGrid(props) {
    let grid = props.grid;

    return (
        <div className="gameGrid">
            {grid.map((rows, index) => {
                return (
                    rows.map((rowItems, sIndex) => {
                        return <Square key={`${index}-${sIndex}`} X={sIndex} Y={index}
                            setGridSelected={props.setGridSelected}
                            data={rowItems} />
                    })
                );
            })}
        </div>
    );
}

const Game = () => {
    const [username] = useLocalStorage("user");

    const [gameState, setGameState] = useState("opening");

    const [role, setRole] = useState("host");

    const [selectedX, setSelectedX] = useState(-1);
    const [selectedY, setSelectedY] = useState(-1);

    const room = 1;

    const [message, setMessage] = useState("");

    const [log, setLog] = useState([]);

    const messagesEndRef = useRef(null);

    let [grid, setGrid] = useState(gameGrid);

    function setGridSelected(x, y) {
        setSelectedX(x);
        setSelectedY(y);
        let tempGrid = grid;
        tempGrid[y][x].status = "selected";
        tempGrid = setOthersNotSelected(x, y, tempGrid);
        setGrid(tempGrid);
    }

    function setOthersNotSelected(selectedX, selectedY, grid) {
        for (var y = 0; y < grid.length; y++) {
            for (var x = 0; x < grid[y].length; x++) {
                if (x !== selectedX || y !== selectedY) {
                    if (grid[y][x].status === "selected") {
                        grid[y][x].status = "selectable";
                    }
                }
            }
        }
        return grid;
    }

    function resolveMoves(hostMove, opponentMove) {
        let tempGrid = grid;

        tempGrid[hostMove.y][hostMove.x].content = "hostKnight";
        tempGrid[opponentMove.y][opponentMove.x].content = "opponentKnight";

        if (hostMove.x === opponentMove.x && hostMove.y === opponentMove.y) {
            tempGrid[hostMove.y][hostMove.x].content = "grave";
        }

        setSelectable(tempGrid);

        setGrid(tempGrid);
    }

    function setSelectable(grid) {
        switch (gameState) {
            case "opening":
                for (var y = 0; y < grid.length; y++) {
                    for (var x = 0; x < grid[y].length; x++) {
                        if (grid[y][x].status === "selected") {
                            grid[y][x].status = "selectable";
                            setSelectedX(-1);
                            setSelectedY(-1);
                        }

                        if (grid[y][x].status === "selectable" && grid[y][x].content !== "empty") {
                            grid[y][x].status = "unselectable";
                        }
                    }
                }
                return grid;
            default:
                return grid;
        }
    }

    const joinRoom = () => {
        //socket = io.connect("https://castrum-tactics.onrender.com");

        if (username === "WilliamDell") {
            setRole("host");
        } else {
            setRole("opponent");
        }

        socket = io.connect("http://localhost:3500");
        socket.emit("join_room", { room, username, role });
    }

    const sendMessage = () => {
        socket.emit("send_message", { message, room, username, role });
    }

    const sendMove = () => {
        const x = selectedX;
        const y = selectedY;

        if (x >= 0 && y >= 0) {
            let logData = {
                type: "send_move",
                message: `Sending move [${x}, ${y}] to the server =>`,
                role
            }
            setLog(current => [...current, logData]);

            socket.emit("send_move", x, y, room, username, role, message => {
                let logData = {
                    type: "send_move",
                    message: message,
                    role
                }
                setLog(current => [...current, logData]);
            });
        }
    }

    useEffect(() => {
        setSelectedX(-1);
        setSelectedY(-1);
        setGameState("opening");
        joinRoom();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        socket.on("receive_message", (data) => {
            data.type = "chat_message";
            setLog(current => [...current, data]);
        })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        socket.on("receive_moves", (hostMove, opponentMove) => {
            resolveMoves(hostMove, opponentMove);

            let data = {
                type: "receive_moves",
                hostData: `Host: [${hostMove.x}, ${hostMove.y}]`,
                opponentData: `Opponent: [${opponentMove.x}, ${opponentMove.y}]`,
                message: "Received move data from server: "
            }
            setLog(current => [...current, data]);
        })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        socket.on("confirm_connection", (data) => {
            data.type = "connection_confirmation";
            data.message = " connected to the room.";
            console.log(data);
            setLog(current => [...current, data]);
        })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        scrollToBottom();
    }, [log])

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }

    return (
        <div className="gameContainer">
            <h1>Game</h1>
            <br />
            <p>You are logged in as {username}</p>
            <br />
            <div className="gameAreaContainer">
                <div className="gridContainer">
                    <button className="gameButton">Reconnect</button>
                    <GameGrid grid={grid} setGridSelected={setGridSelected} />
                    <button className="gameButton" onClick={sendMove}>Send Move</button>
                </div>
            </div>
            <p>X: {selectedX} Y: {selectedY}</p>
            <div className="gameLog">
                <Log messages={log} username={username} role={role} />
                <div ref={messagesEndRef} />
            </div>
            <input type="text" placeholder="Message..." onChange={(event) => {
                setMessage(event.target.value)
            }} />
            <button onClick={sendMessage}>Send Message</button>

        </div>
    )
}

export default Game;