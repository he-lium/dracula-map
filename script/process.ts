enum Player {Goldamine, Seward, VanHelsing, MinaHarker, Dracula}

function drawPlayer(player : Player, cityID : number) {
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

var totalMoves : number = 0;
var playHistory : Array<Array<number>> = [[], [], [], [], []];
var currentMove = 0;

function drawMove() {
    drawMap();
    stats.update();
    for (let i = 0; i < 5; i++) {
        if (currentMove >= i) {
            let idIndex = Math.floor((currentMove - i) / 5);
            // console.log(i, idIndex);
            let id = playHistory[i][idIndex];
            drawPlayer(i, id);
        }
    }
}

function nextMove() {
    if (currentMove < totalMoves - 1) currentMove++;
    drawMove();
}

function prevMove() {
    if (currentMove > 0) currentMove--;
    drawMove();
}

function processMoves(raw : string) {
    playHistory = [[], [], [], [], []];
    totalMoves = 0;
    currentMove = 0;
    let move : string;
    let p : Player;
    let location;
    let movesArray : Array<string> = raw.split(" ");
    let id;
    movesArray.forEach(function (move : string, index : number) {
        switch(move[0]) {
            case "G": p = Player.Goldamine; break;
            case "S": p = Player.Seward; break;
            case "H": p = Player.VanHelsing; break;
            case "M": p = Player.MinaHarker; break;
            case "D": p = Player.Dracula; break;
            default: break;
        }
        location = move.substr(1, 2);
        console.log(location);
        if (location == 'TP') id = location = 'CD';
        if (location[0] == 'D' && parseInt(location[1])) {
            id = playHistory[p][playHistory[p].length - parseInt(location[1])];
        } else if (location == 'HI') {
            id = playHistory[p][playHistory[p].length - 1];
        } else {
            id = cities.find((city) => city.abbrev == location).id;
        }
        playHistory[p].push(id);
        totalMoves++;
    });
    showStats();
    drawMove();
}