import useLocalStorage from "../hooks/useLocalStorage";
import { useEffect, useState, useRef } from "react";
import gameGrid from "./Game/Grid";
import Log from "./Game/Log";
import GameGrid from "./Game/GameGrid";
import Results from "./Game/Results";
import getTileConnections from "./Game/GetTileConnections";

import io from "socket.io-client";

var socket;

const Game = () => {
    const [username] = useLocalStorage("user");

    const challengerName = useRef("undefined");

    let gState = useRef("default");

    let role = useRef("host");

    const [selectedX, setSelectedX] = useState(-1);
    const [selectedY, setSelectedY] = useState(-1);

    const room = 1;

    const [message, setMessage] = useState("");

    const [log, setLog] = useState([]);

    const messagesEndRef = useRef(null);

    const messageInput = useRef(null);

    const [showResults, setShowResults] = useState(false);

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

        let hX = hostMove.x;
        let hY = hostMove.y;

        let oX = opponentMove.x;
        let oY = opponentMove.y;

        if (tempGrid[hY][hX].content === "hostKnight") {
            tempGrid[hY][hX].content = "hostCastle";
        } else if (tempGrid[hY][hX].content === "opponentKnight") {
            tempGrid[hY][hX].content = "hostKnight";
            tempGrid[hY][hX].groundHealth--;
            groundHealthLowered = true;

            if (tempGrid[hY][hX].groundHealth <= 0) {
                tempGrid[hY][hX].content = "grave";
            }
        } else {
            tempGrid[hY][hX].content = "hostKnight";
        }

        if (tempGrid[oY][oX].content === "opponentKnight") {
            tempGrid[oY][oX].content = "opponentCastle";
        } else if (tempGrid[oY][oX].content === "hostKnight") {
            tempGrid[oY][oX].content = "opponentKnight";

            if (hX === oX && hY === oY) { } else
                tempGrid[oY][oX].groundHealth--;

            if (tempGrid[oY][oX].groundHealth <= 0) {
                tempGrid[oY][oX].content = "grave";
            }
        } else {
            tempGrid[oY][oX].content = "opponentKnight";
        }

        if (hX === oX && hY === oY) {
            tempGrid[hY][hX].content = "grave";
            if (!groundHealthLowered)
                tempGrid[hY][hX].groundHealth--;
        }

        if (gState.current === "main") {
            tempGrid = getTileConnections(tempGrid);
        }

        setSelectable(tempGrid);

        if (gState.current === "opening" && getSelectableCount(tempGrid) <= 0) {
            gState.current = "main";
            setSelectable(tempGrid);
        }

        grid.current = tempGrid;

        if (gState.current === "main" && getSelectableCount(tempGrid) <= 0) {
            gState.current = "end";
            sendGameEnd();
        }
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
                            || grid[y][x].content === "solid"
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

    function getTiles(grid, role) {
        let amount = 0;

        for (var y = 0; y < grid.length; y++) {
            for (var x = 0; x < grid[y].length; x++) {
                if (grid[y][x].con === role)
                    amount++;
            }
        }
        
        return amount;
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

    const sendMessage = (e) => {
        e.preventDefault();

        const r = role.current;

        socket.emit("send_message", { message, room, username, role: r });

        setMessage("");
        messageInput.current.value = "";
        messageInput.current.focus();
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

    const sendGameEnd = () => {
        socket.emit("send_game_end", { room, username, role: role.current });
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
        socket.on("receive_game_end", (data) => {
            data.type = "info";
            data.message = "No more available moves. Game finished!";
            setLog(current => [...current, data]);
            setShowResults(true);
        })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        socket.on("both_connected", (data) => {
            data.type = "info";
            data.message = "Both players have connected. Let the game begin!";
            setLog(current => [...current, data]);

            switch (role.current) {
                case "host":
                    challengerName.current = data.opponentName;
                    break;
                case "opponent":
                    challengerName.current = data.hostName;
                    break;
                default:
                    break;
            }
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
            {showResults ? <Results getTiles={getTiles} grid={grid.current} 
                                    role={role.current} username={username} challengerName={challengerName.current} /> : null}
            <div className="gameLog">
                <Log messages={log} username={username} role={role.current} />
                <div ref={messagesEndRef} />
            </div>
            <form onSubmit={sendMessage} className="chatInputForm">
                <input ref={messageInput} type="text" placeholder="Message..." onChange={(event) => {
                    setMessage(event.target.value)
                }} />
                <button onClick={sendMessage}>Send Message</button>
            </form>
        </div>
    )
}

export default Game;