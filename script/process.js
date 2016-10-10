var Player;
(function (Player) {
    Player[Player["Goldamine"] = 0] = "Goldamine";
    Player[Player["Seward"] = 1] = "Seward";
    Player[Player["VanHelsing"] = 2] = "VanHelsing";
    Player[Player["MinaHarker"] = 3] = "MinaHarker";
    Player[Player["Dracula"] = 4] = "Dracula";
})(Player || (Player = {}));
var playerSpans = [
    document.getElementById('g-loc'),
    document.getElementById('s-loc'),
    document.getElementById('h-loc'),
    document.getElementById('m-loc'),
    document.getElementById('d-loc')
];
function drawPlayer(player, cityID) {
    let x = cities[cityID].x;
    let y = cities[cityID].y;
    switch (player) {
        case Player.Goldamine:
            y -= 15;
            context.fillStyle = 'green';
            break;
        case Player.Seward:
            x += 15;
            context.fillStyle = 'blue';
            break;
        case Player.VanHelsing:
            y += 15;
            context.fillStyle = 'aqua';
            break;
        case Player.MinaHarker:
            x -= 15;
            context.fillStyle = 'teal';
            break;
        default:
            x += 15;
            y += 15;
            context.fillStyle = 'darkred';
            break;
    }
    context.beginPath();
    context.arc(x, y, 13, 0, 2 * Math.PI, false);
    context.fill();
}
var totalMoves = 0;
var playHistory = [[], [], [], [], []];
var playEvents = [];
var currentMove = 0;
var rawMoves;
function drawMove() {
    drawMap();
    stats.update();
    for (let i = 0; i < 5; i++) {
        if (currentMove >= i) {
            let idIndex = Math.floor((currentMove - i) / 5);
            // console.log(i, idIndex);
            let id = playHistory[i][idIndex];
            drawPlayer(i, id);
            playerSpans[i].innerText = cities[id].abbrev + " " + cities[id].name;
        }
        else {
            playerSpans[i].innerText = "undefined";
        }
    }
    // Draw Dracula's trail
    if (currentMove > 4) {
        let index = Math.floor(currentMove / 5) - 1;
        context.beginPath();
        context.strokeStyle = 'white';
        let id = playHistory[4][index];
        context.moveTo(cities[id].x, cities[id].y);
        for (let i = 1; i < 6; i++) {
            index--;
            if (index < 0)
                break;
            id = playHistory[4][index];
            context.lineTo(cities[id].x, cities[id].y);
        }
        context.lineWidth = 7;
        context.setLineDash([3, 10]);
        context.stroke();
        context.setLineDash([0]);
    }
}
function firstMove() {
    currentMove = 0;
    drawMove();
}
function lastMove() {
    currentMove = totalMoves - 1;
    drawMove();
}
function nextMove() {
    if (currentMove < totalMoves - 1)
        currentMove++;
    drawMove();
}
function prevMove() {
    if (currentMove > 0)
        currentMove--;
    drawMove();
}
function processMoves(raw) {
    playHistory = [[], [], [], [], []];
    playEvents = [];
    totalMoves = 0;
    currentMove = 0;
    let move;
    let p;
    let location;
    rawMoves = raw.split(" ");
    let id;
    let eventStr = "";
    rawMoves.forEach(function (move, index) {
        switch (move[0]) {
            case "G":
                p = Player.Goldamine;
                break;
            case "S":
                p = Player.Seward;
                break;
            case "H":
                p = Player.VanHelsing;
                break;
            case "M":
                p = Player.MinaHarker;
                break;
            case "D":
                p = Player.Dracula;
                break;
            default: break;
        }
        eventStr = move[0];
        location = move.substr(1, 2);
        // console.log(location);
        if (location == 'TP') {
            id = location = 'CD';
            eventStr += " teleported and";
        }
        if (location[0] == 'D' && parseInt(location[1])) {
            id = playHistory[p][playHistory[p].length - parseInt(location[1])];
            eventStr += " double tracked by " + location[1] + " to " + cities[id].name;
        }
        else if (location == 'HI') {
            id = playHistory[p][playHistory[p].length - 1];
            eventStr += " hid in " + cities[id].name;
        }
        else {
            id = cities.find((city) => city.abbrev == location).id;
            eventStr += " moved to " + cities[id].name;
            if (index > 4)
                eventStr += " from " + cities[playHistory[p][playHistory[p].length - 1]].name;
        }
        playHistory[p].push(id);
        // console.log(eventStr);
        playEvents.push(eventStr);
        totalMoves++;
    });
    showStats();
    drawMove();
}
//# sourceMappingURL=process.js.map