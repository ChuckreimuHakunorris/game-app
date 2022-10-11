function isValid(grid, x, y, role) {
    let otherRole = "default";

    switch (role) {
        case "host":
            otherRole = "opponent";
            break;
        case "opponent":
            otherRole = "host";
            break;
        default:
    }

    if (grid[y][x].content === "grave"
        || grid[y][x].content === `${otherRole}Castle`
        || grid[y][x].content === "solid")
        return false;
    else
        return true;
}

function getCon(prevCon, role) {
    if (prevCon === "undefined" || prevCon === role) {
        return role;
    } else {
        return "both";
    }
}

function checkGrid(grid, role) {
    for (var y = 0; y < grid.length; y++) {
        for (var x = 0; x < grid[y].length; x++) {
            if (grid[y][x].content === `${role}Knight`
                || grid[y][x].content === `${role}Castle`
                || grid[y][x].con === role
                || grid[y][x].con === "both") {

                grid[y][x].con = getCon(grid[y][x].con, role);

                if (x > 0 && y > 0) {
                    if (isValid(grid, x - 1, y - 1, role)) {
                        grid[y - 1][x - 1].con = getCon(grid[y - 1][x - 1].con, role);
                    }
                }

                if (y > 0) {
                    if (isValid(grid, x, y - 1, role)) {
                        grid[y - 1][x].con = getCon(grid[y - 1][x].con, role);
                    }
                }

                if (x < 4 && y > 0) {
                    if (isValid(grid, x + 1, y - 1, role)) {
                        grid[y - 1][x + 1].con = getCon(grid[y - 1][x + 1].con, role);
                    }
                }

                if (x > 0) {
                    if (isValid(grid, x - 1, y, role)) {
                        grid[y][x - 1].con = getCon(grid[y][x - 1].con, role);
                    }
                }

                if (x < 4) {
                    if (isValid(grid, x + 1, y, role)) {
                        grid[y][x + 1].con = getCon(grid[y][x + 1].con, role);
                    }
                }

                if (x > 0 && y < 4) {
                    if (isValid(grid, x - 1, y + 1, role)) {
                        grid[y + 1][x - 1].con = getCon(grid[y + 1][x - 1].con, role);
                    }
                }

                if (y < 4) {
                    if (isValid(grid, x, y + 1, role)) {
                        grid[y + 1][x].con = getCon(grid[y + 1][x].con, role);
                    }
                }

                if (x < 4 && y < 4) {
                    if (isValid(grid, x + 1, y + 1, role)) {
                        grid[y + 1][x + 1].con = getCon(grid[y + 1][x + 1].con, role);
                    }
                }
            }
        }
    }

    return grid;
}

function getTileConnections(grid) {
    for (var y = 0; y < grid.length; y++) {
        for (var x = 0; x < grid[y].length; x++) {
            grid[y][x].con = "undefined";

            if (grid[y][x].content === "grave"
                || grid[y][x].content === "solid") {
                grid[y][x].con = "solid";
            }
        }
    }

    let loopCount = 0;

    while (loopCount <= 1000) {
        grid = checkGrid(grid, "host");
        grid = checkGrid(grid, "opponent");

        loopCount++;
    }

    for (y = 0; y < grid.length; y++) {
        for (x = 0; x < grid[y].length; x++) {
            if (grid[y][x].con === "host") {
                grid[y][x].groundHealth = 4;
            } else if (grid[y][x].con === "opponent") {
                grid[y][x].groundHealth = 5;
            }
        }
    }

    return grid;
}

export default getTileConnections;