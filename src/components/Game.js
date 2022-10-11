import useLocalStorage from "../hooks/useLocalStorage";
import { useEffect, useState, useRef } from "react";
import gameGrid from "./Game/Grid";
import getTileConnections from "./Game/GetTileConnections";

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
                        {/*<span className="gameLog_socketId">[{message.socketId}] </span>*/}
                        <span className="gameLog_message">{message.message}</span>
                    </p>)
            case "connection_confirmation":
                return (
                    <p key={index}>
                        <span className={nameColor}>{message.username} </span>
                        {/*<span className="gameLog_socketId">[{message.socketId}] </span>*/}
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
            className={`gridSquare`} onClick={clickSquare}>
            <img src={`/game/ground_${props.data.groundHealth}.png`} className="squareSprite" alt="missing" />
            .
            <img src={`/game/${props.data.content}.png`} className="squareSprite" alt="missing" />
            <img src={`/game/${props.data.status}.png`} className="squareSprite" alt="missing" />
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

    let gState = useRef("default");

    let role = useRef("host");

    const [selectedX, setSelectedX] = useState(-1);
    const [selectedY, setSelectedY] = useState(-1);

    const room = 1;

    const [message, setMessage] = useState("");

    const [log, setLog] = useState([]);

    const messagesEndRef = useRef(null);

    let grid = useRef(gameGrid);

    function setGridSelected(x, y) {
        setSelectedX(x);
        setSelectedY(y);
        let tempGrid = grid.current;
        tempGrid[y][x].status = "selected";
        tempGrid = setOthersNotSelected(x, y, tempGrid);
        grid.current = tempGrid;
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
        let groundHealthLowered = false;
        let tempGrid = grid.current;

        if (tempGrid[hostMove.y][hostMove.x].content === "hostKnight") {
            tempGrid[hostMove.y][hostMove.x].content = "hostCastle";
        } else if (tempGrid[hostMove.y][hostMove.x].content === "opponentKnight") {
            tempGrid[hostMove.y][hostMove.x].content = "hostKnight";
            tempGrid[hostMove.y][hostMove.x].groundHealth--;
            groundHealthLowered = true;

            if (tempGrid[hostMove.y][hostMove.x].groundHealth <= 0) {
                tempGrid[hostMove.y][hostMove.x].content = "grave";
            }
        } else {
            tempGrid[hostMove.y][hostMove.x].content = "hostKnight";
        }

        if (tempGrid[opponentMove.y][opponentMove.x].content === "opponentKnight") {
            tempGrid[opponentMove.y][opponentMove.x].content = "opponentCastle";
        } else if (tempGrid[opponentMove.y][opponentMove.x].content === "hostKnight") {
            tempGrid[opponentMove.y][opponentMove.x].content = "opponentKnight";

            if (hostMove.x === opponentMove.x && hostMove.y === opponentMove.y) { } else
                tempGrid[opponentMove.y][opponentMove.x].groundHealth--;

            if (tempGrid[opponentMove.y][opponentMove.x].groundHealth <= 0) {
                tempGrid[opponentMove.y][opponentMove.x].content = "grave";
            }
        } else {
            tempGrid[opponentMove.y][opponentMove.x].content = "opponentKnight";
        }

        if (hostMove.x === opponentMove.x && hostMove.y === opponentMove.y) {
            tempGrid[hostMove.y][hostMove.x].content = "grave";
            if (!groundHealthLowered)
                tempGrid[hostMove.y][hostMove.x].groundHealth--;
        }
        
        if (gState.current === "main") {
            tempGrid = getTileConnections(tempGrid);

            for (var y = 0; y < tempGrid.length; y++) {
                for (var x = 0; x < tempGrid[y].length; x++) {
                    console.log("[" + x + ", " + y + "] con value: "
                     + tempGrid[y][x].con);
                }
            }
        }

        setSelectable(tempGrid);

        if (gState.current === "opening" && getSelectableCount(tempGrid) <= 0) {
            gState.current = "main";
            setSelectable(tempGrid);
        }

        grid.current = tempGrid;
    }

    function setSelectable(grid) {
        switch (gState.current) {
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
            case "main":
                for (y = 0; y < grid.length; y++) {
                    for (x = 0; x < grid[y].length; x++) {
                        grid[y][x].status = "unselectable";
                    }
                }
                for (y = 0; y < grid.length; y++) {
                    for (x = 0; x < grid[y].length; x++) {
                        if (grid[y][x].content === `${role.current}Knight`
                            || grid[y][x].content === `${role.current}Castle`) {
                            grid[y][x].status = "selectable";
                            if (x > 0 && y > 0)
                                grid[y - 1][x - 1].status = "selectable";
                            if (y > 0)
                                grid[y - 1][x].status = "selectable";
                            if (x < 4 && y > 0)
                                grid[y - 1][x + 1].status = "selectable";
                            if (x > 0)
                                grid[y][x - 1].status = "selectable";
                            if (x < 4) {
                                grid[y][x + 1].status = "selectable";
                            }
                            if (x > 0 && y < 4)
                                grid[y + 1][x - 1].status = "selectable";
                            if (y < 4)
                                grid[y + 1][x].status = "selectable";
                            if (x < 4 && y < 4)
                                grid[y + 1][x + 1].status = "selectable";
                        }
                    }
                }
                for (y = 0; y < grid.length; y++) {
                    for (x = 0; x < grid[y].length; x++) {
                        if (grid[y][x].content === "grave"
                            || grid[y][x].content === "hostCastle"
                            || grid[y][x].content === "opponentCastle"
                            || grid[y][x].groundHealth > 3)
                            grid[y][x].status = "unselectable";
                    }
                }

                setSelectedX(-1);
                setSelectedY(-1);
                return grid;
            default:
                return grid;
        }
    }

    function getSelectableCount(grid) {
        let selectableCount = 0;

        for (var y = 0; y < grid.length; y++) {
            for (var x = 0; x < grid[y].length; x++) {
                if (grid[y][x].status === "selectable")
                    selectableCount++;
            }
        }

        return selectableCount;
    }

    function manualDisconnectAndReconnect() {
        joinRoom();
    }

    const joinRoom = () => {
        if (username === "WilliamDell") {
            role.current = "host";
        } else {
            role.current = "opponent";
        }
        //socket = io.connect("https://castrum-tactics.onrender.com");
        socket = io.connect("http://localhost:3500");
        let r = role.current;
        socket.emit("join_room", { room, username, role: r });
    }

    const sendMessage = () => {
        const r = role.current;

        socket.emit("send_message", { message, room, username, role: r });
    }

    const sendMove = () => {
        const x = selectedX;
        const y = selectedY;
        const r = role.current;

        if (x >= 0 && y >= 0) {
            let logData = {
                type: "send_move",
                message: `Sending move [${x}, ${y}] to the server =>`,
                role: r
            }
            setLog(current => [...current, logData]);

            socket.emit("send_move", x, y, room, username, r, message => {
                let logData = {
                    type: "send_move",
                    message: message,
                    role: r
                }
                setLog(current => [...current, logData]);
            });
        }
    }

    useEffect(() => {
        setSelectedX(-1);
        setSelectedY(-1);
        //setGameState("opening");
        gState.current = "opening";
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
                    <button className="gameButton" onClick={manualDisconnectAndReconnect}>Reconnect</button>
                    <GameGrid grid={grid.current} setGridSelected={setGridSelected} />
                    <button className="gameButton" onClick={sendMove}>Send Move</button>
                </div>
            </div>
            <div className="gameLog">
                <Log messages={log} username={username} role={role.current} />
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