import Square from "./Square";

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

export default GameGrid;