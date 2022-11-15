let stages = [];

const stage1 = {
    name: "Plains",
    grid: [
        [{ status: "unselectable", content: "empty", groundHealth: 3 },
        { status: "unselectable", content: "empty", groundHealth: 3 },
        { status: "selectable", content: "empty", groundHealth: 3 },
        { status: "unselectable", content: "empty", groundHealth: 3 },
        { status: "unselectable", content: "empty", groundHealth: 3 }],
        [{ status: "selectable", content: "empty", groundHealth: 3 },
        { status: "unselectable", content: "empty", groundHealth: 3 },
        { status: "unselectable", content: "empty", groundHealth: 3 },
        { status: "unselectable", content: "empty", groundHealth: 3 },
        { status: "selectable", content: "empty", groundHealth: 3 }],
        [{ status: "unselectable", content: "empty", groundHealth: 3 },
        { status: "unselectable", content: "empty", groundHealth: 3 },
        { status: "unselectable", content: "empty", groundHealth: 3 },
        { status: "unselectable", content: "empty", groundHealth: 3 },
        { status: "unselectable", content: "empty", groundHealth: 3 }],
        [{ status: "selectable", content: "empty", groundHealth: 3 },
        { status: "unselectable", content: "empty", groundHealth: 3 },
        { status: "unselectable", content: "empty", groundHealth: 3 },
        { status: "unselectable", content: "empty", groundHealth: 3 },
        { status: "selectable", content: "empty", groundHealth: 3 }],
        [{ status: "unselectable", content: "empty", groundHealth: 3 },
        { status: "unselectable", content: "empty", groundHealth: 3 },
        { status: "selectable", content: "empty", groundHealth: 3 },
        { status: "unselectable", content: "empty", groundHealth: 3 },
        { status: "unselectable", content: "empty", groundHealth: 3 }]
    ]
}

stages.push(stage1);

const stage2 = {
    name: "Rocks",
    grid: [
        [{ status: "unselectable", content: "solid", groundHealth: 3 },
        { status: "unselectable", content: "empty", groundHealth: 3 },
        { status: "selectable", content: "empty", groundHealth: 3 },
        { status: "unselectable", content: "empty", groundHealth: 3 },
        { status: "unselectable", content: "solid", groundHealth: 3 }],
        [{ status: "selectable", content: "empty", groundHealth: 3 },
        { status: "unselectable", content: "solid", groundHealth: 3 },
        { status: "unselectable", content: "empty", groundHealth: 3 },
        { status: "unselectable", content: "solid", groundHealth: 3 },
        { status: "selectable", content: "empty", groundHealth: 3 }],
        [{ status: "unselectable", content: "empty", groundHealth: 3 },
        { status: "unselectable", content: "empty", groundHealth: 3 },
        { status: "unselectable", content: "solid", groundHealth: 3 },
        { status: "unselectable", content: "empty", groundHealth: 3 },
        { status: "unselectable", content: "empty", groundHealth: 3 }],
        [{ status: "selectable", content: "empty", groundHealth: 3 },
        { status: "unselectable", content: "solid", groundHealth: 3 },
        { status: "unselectable", content: "empty", groundHealth: 3 },
        { status: "unselectable", content: "solid", groundHealth: 3 },
        { status: "selectable", content: "empty", groundHealth: 3 }],
        [{ status: "unselectable", content: "solid", groundHealth: 3 },
        { status: "unselectable", content: "empty", groundHealth: 3 },
        { status: "selectable", content: "empty", groundHealth: 3 },
        { status: "unselectable", content: "empty", groundHealth: 3 },
        { status: "unselectable", content: "solid", groundHealth: 3 }]
    ]
}

stages.push(stage2);

const stage3 = {
    name: "Test 1",
    grid: [
        [{ status: "unselectable", content: "empty", groundHealth: 3 },
        { status: "unselectable", content: "empty", groundHealth: 3 },
        { status: "unselectable", content: "empty", groundHealth: 3 },
        { status: "unselectable", content: "empty", groundHealth: 3 },
        { status: "unselectable", content: "empty", groundHealth: 3 }],
        [{ status: "unselectable", content: "empty", groundHealth: 3 },
        { status: "unselectable", content: "empty", groundHealth: 3 },
        { status: "unselectable", content: "empty", groundHealth: 3 },
        { status: "unselectable", content: "empty", groundHealth: 3 },
        { status: "unselectable", content: "empty", groundHealth: 3 }],
        [{ status: "selectable", content: "empty", groundHealth: 3 },
        { status: "unselectable", content: "empty", groundHealth: 3 },
        { status: "unselectable", content: "empty", groundHealth: 3 },
        { status: "unselectable", content: "empty", groundHealth: 3 },
        { status: "selectable", content: "empty", groundHealth: 3 }],
        [{ status: "unselectable", content: "empty", groundHealth: 3 },
        { status: "unselectable", content: "empty", groundHealth: 3 },
        { status: "unselectable", content: "empty", groundHealth: 3 },
        { status: "unselectable", content: "empty", groundHealth: 3 },
        { status: "unselectable", content: "empty", groundHealth: 3 }],
        [{ status: "unselectable", content: "empty", groundHealth: 3 },
        { status: "unselectable", content: "empty", groundHealth: 3 },
        { status: "unselectable", content: "empty", groundHealth: 3 },
        { status: "unselectable", content: "empty", groundHealth: 3 },
        { status: "unselectable", content: "empty", groundHealth: 3 }]
    ]
}

stages.push(stage3);

const stage4 = {
    name: "Test 2",
    grid: [
        [{ status: "unselectable", content: "solid", groundHealth: 3 },
        { status: "unselectable", content: "solid", groundHealth: 3 },
        { status: "unselectable", content: "solid", groundHealth: 3 },
        { status: "unselectable", content: "solid", groundHealth: 3 },
        { status: "unselectable", content: "solid", groundHealth: 3 }],
        [{ status: "unselectable", content: "solid", groundHealth: 3 },
        { status: "unselectable", content: "solid", groundHealth: 3 },
        { status: "unselectable", content: "solid", groundHealth: 3 },
        { status: "unselectable", content: "solid", groundHealth: 3 },
        { status: "unselectable", content: "solid", groundHealth: 3 }],
        [{ status: "selectable", content: "empty", groundHealth: 3 },
        { status: "unselectable", content: "empty", groundHealth: 3 },
        { status: "unselectable", content: "empty", groundHealth: 3 },
        { status: "unselectable", content: "empty", groundHealth: 3 },
        { status: "selectable", content: "empty", groundHealth: 3 }],
        [{ status: "unselectable", content: "solid", groundHealth: 3 },
        { status: "unselectable", content: "solid", groundHealth: 3 },
        { status: "unselectable", content: "solid", groundHealth: 3 },
        { status: "unselectable", content: "solid", groundHealth: 3 },
        { status: "unselectable", content: "solid", groundHealth: 3 }],
        [{ status: "unselectable", content: "solid", groundHealth: 3 },
        { status: "unselectable", content: "solid", groundHealth: 3 },
        { status: "unselectable", content: "solid", groundHealth: 3 },
        { status: "unselectable", content: "solid", groundHealth: 3 },
        { status: "unselectable", content: "solid", groundHealth: 3 }]
    ]
}

stages.push(stage4);

export default stages;