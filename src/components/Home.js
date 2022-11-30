const Home = () => {
    return (
        <section>
            <h2>Castrum Tactics</h2>
            <br />
            <h3>Introduction</h3>
            <br />
            <p>Castrum Tactics is an exciting strategy game where a good game plan and
                reading your opponents mindset are key to victory. If you're new here, this
                page will serve as a guide to get you started! Please note that an account is required
                to play the game.
            </p>
            <br />
            <h3>Overview</h3>
            <br />
            <div className="examplePicContainer">
                <img src={"/img/example3.png"} alt="missing" />
            </div>
            <br />
            <p>Castrum Tactics is played on a 5*5 grid of squares. Players place knights on the board
                one at a time, which can be further upgraded into castles, making them stronger. The object
                of the game is to control more squares on the board by the end of the game than your opponent.
            </p>
            <br />
            <h2>How to Play</h2>
            <br />
            <h3>Starting a Game</h3>
            <br />
            <p>To create a game, navigate over to the "Rooms" tab. In the "Create Room" section,
                you can write a name for your room (or go with the default), and select the stage
                you'd like to play. Create a room using the selected setting with the "Create Room"
                button.
            </p>
            <br />
            <p>Alternatively, if someone has already created a room, you will see it in the
                "Room List" section. Join a room with the "Join Room" button displayed on the right
                side of an existing room's list item.
            </p>
            <br />
            <h3>Opening Phase</h3>
            <br />
            <p>A game of Castrum Tactics consist of two distinct phases, the first of which is the
                Opening Phase. Here, you and your opponent select the starting squares for the game.
                The Opening Phase ends when all available starting squares have been selected by
                either player.
            </p>
            <br />
            <p>To select a square, first click on it. The edges of the square will turn green,
                indicating it has been selected. Then click the "Send Move" button, which will
                send your desired move to the server. After the players have made their selections,
                their effects are applied at the same time for both. The same principle applies in
                the second phase of the game.
            </p>
            <br />
            <p>Note that you may change your selection even after sending it, granted the other
                player has yet to make their move. To change your selected square, simply select a
                different one and hit "Send Move" again. This will override your previous selection.
            </p>
            <br />
            <div className="examplePicContainer">
                <img src={"/img/example1.png"} alt="missing" />
            </div>
            <br />
            <p>Here, both players have selected one square, indicated by the two knights. Host
                player (the one who created the room) is always red and the challenger (opponent)
                plays blue. Also note that for their second choise, both players happened to pick
                the lowermost square, which resulted in neither gaining the spot. When this happens,
                a grave tile is spawned and the square is rendered unusable and impassable for the
                rest of the game.
            </p>
            <br />
            <h3>Main Phase</h3>
            <br />
            <p>After all starting squares have been selected, the Main Phase starts. This is
                where the principal gameplay takes place.
            </p>
            <br />
            <div className="examplePicContainer">
                <img src={"/img/example2.png"} alt="missing" />
            </div>
            <br />
            <p>The squares around, and containing, your knights become selectable. A number of things
                can happen when playing into a square in the Main Phase, so let's look at them one by one.
            </p>
            <br />
            <div className="examplePicContainer">
                <img src={"/img/move1_1.png"} alt="missing" />
                <img src={"/img/arrow.png"} className="arrow" alt="missing" />
                <img src={"/img/move1_2.png"} alt="missing" />
            </div>
            <br />
            <p><b>Case 1:</b> When playing into an empty square, you gain a new knight in that square.</p>
            <br />
            <div className="examplePicContainer">
                <img src={"/img/move2_1.png"} alt="missing" />
                <img src={"/img/arrow.png"} className="arrow" alt="missing" />
                <img src={"/img/move2_2.png"} alt="missing" />
            </div>
            <br />
            <p><b>Case 2:</b> When playing into a square containing an enemy knight, your knight is placed in that
            square and you gain control of it. You may notice the ground of that square changed color; we'll
            get back to that later in the guide.</p>
            <br />
            <div className="examplePicContainer">
                <img src={"/img/move3_1.png"} alt="missing" />
                <img src={"/img/arrow.png"} className="arrow" alt="missing" />
                <img src={"/img/move3_2.png"} alt="missing" />
            </div>
            <br />
            <p><b>Case 3:</b> When playing into a square containing your own knight, that knight is upgraded
            into a castle. The opposing player can't conquer squares that contain your castles. Likewise, you
            can't place a knight on top of an opponent's castle.</p>
            <br />
            <h3>When Both Players Play into the Same Square</h3>
            <br />
            <p>An important special case occurs when both players choose the same square. When this
                happens, the result is always a grave, regardless of what was in the square beforehand.
                Use this to your advantage by preventing the opponent from upgrading their knights
                into castles at advantageous places.
            </p>
            <br />
            <div className="examplePicContainer">
                <img src={"/img/move4_1.png"} alt="missing" />
                <img src={"/img/arrow.png"} className="arrow" alt="missing" />
                <img src={"/img/move4_2.png"} alt="missing" />
            </div>
            <br />
            <p>Here, the red player attempted to upgrade the knight in the middle square into a castle,
                but was prevented doing so by the blue player selecting the same square.
            </p>
            <br />
            <h3>Ground Health</h3>
            <br />
            <p>Every square on the board has an initial health value of 3. Every time a square
                is conquered from the other player, it's ground health drops by one. This is indicated
                by a change in color.
            </p>
            <br />
            <div className="examplePicContainer">
                <img src={"/img/groundHealth.png"} alt="missing" />
            </div>
            <p>Here you can see the colors and the health states they represent. When a square with health
                one is conquered, instead of the attacking player gaining control of the square, a grave is
                spawned as it's health drops to zero. Tiles with ground health zero will always contain a grave.
                Therefore it is less advantageous to attack squares with health one than those of two or three,
                as you can't gain new area this way.
            </p>
            <br />
            <h3>End of the Game</h3>
            <br />
            <div className="examplePicContainer">
                <img src={"/img/example4.png"} alt="missing" />
            </div>
            <br />
            <p>When there are no more available moves for either player, the game is finished. After this,
                the final count of occupied squares is tallied up and the winner (or a draw) determined. Note that
                in the above example, one blue knight is present. This tile is completely inaccessible for the red player
                so it's determined as belonging conclusively to the blue player.
            </p>
        </section>
    )
}

export default Home;