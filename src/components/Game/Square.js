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

export default Square;