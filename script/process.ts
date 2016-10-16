enum Player {Godalming, Seward, VanHelsing, MinaHarker, Dracula}
var playerSpans : Array<HTMLElement> = [
    document.getElementById('g-loc'),
    document.getElementById('s-loc'),
    document.getElementById('h-loc'),
    document.getElementById('m-loc'),
    document.getElementById('d-loc')
]

function drawPlayer(player : Player, cityID : number, ghostTrail ?: number) {
    if (cities[cityID].id >= 71) return; // don't draw unknown locations
    let x = cities[cityID].x;
    let y = cities[cityID].y;
    let color : string;
    switch (player) {
        case Player.Godalming: 
            y -= 15;
            color = 'green';
            break;
        case Player.Seward:
            x += 15;
            color = 'blue';
            break;
        case Player.VanHelsing:
            y += 15;
            color = 'aqua';
            break;
        case Player.MinaHarker:
            x -= 15;
            color = 'teal';
            break;
        default:
            x += 15;
            y += 15;
            color = 'darkred';
            break;
    }
    context.fillStyle = color;
    context.strokeStyle = color;
    context.beginPath();
    context.arc(x, y, 13, 0, 2 * Math.PI, false);
    if (ghostTrail) {
        context.lineWidth = 2;
        context.stroke();
        context.font = "20px serif";
        context.fillText(ghostTrail.toString(), x - 5, y + 5);
    } else {
        context.fill();
    }
}

var totalMoves : number = 0;
var playHistory : Array<Array<number>> = [[], [], [], [], []];
var playEvents : Array<string> = [];
var currentMove = 0;
var rawMoves : Array<string>;
var hiddenInfoMode : boolean;

function drawMove() {
    let index : number;

    drawMap();
    stats.update();
    for (let i = 0; i < 5; i++) {
        if (currentMove >= i) {
            let idIndex = Math.floor((currentMove - i) / 5);
            // console.log(i, idIndex);
            let id = playHistory[i][idIndex];
            drawPlayer(i, id);
            playerSpans[i].innerText = cities[id].abbrev + " " + cities[id].name;
        } else {
            playerSpans[i].innerText = "undefined";
        }
    }
    // Draw Dracula's trail
    if (currentMove > 4) {
        if (hiddenInfoMode) {
            let id : number;
            index = Math.floor(currentMove / 5) - 1;
            for (let i = 1; i < 6; i++) {
                index--;
                if (index < 0) break;
                drawPlayer(Player.Dracula, playHistory[4][index], i);
            }
        } else {
            index = Math.floor(currentMove / 5) - 1;
            context.beginPath();
            context.strokeStyle = 'white';
            let id : number = playHistory[4][index];
            context.moveTo(cities[id].x, cities[id].y);
            for (let i = 1; i < 6; i++) {
                index--;
                if (index < 0) break;
                id = playHistory[4][index];
                context.lineTo(cities[id].x, cities[id].y);
            }
            context.lineWidth = 7;
            context.setLineDash([3, 10])
            context.stroke();
            context.setLineDash([0]);
        }
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
    if (currentMove < totalMoves - 1) currentMove++;
    drawMove();
}

function prevMove() {
    if (currentMove > 0) currentMove--;
    drawMove();
}

function processMoves(raw : string) {
    playHistory = [[], [], [], [], []];
    playEvents = [];
    totalMoves = 0;
    currentMove = 0;
    hiddenInfoMode = false;
    let move : string;
    let p : Player;
    let location;
    rawMoves = raw.trim().split(" ");
    if (rawMoves.length == 1 && rawMoves[0] == "") return;
    let id;
    let eventStr = "";
    try {
        rawMoves.forEach(function (move : string, index : number) {
            switch(move[0]) {
                case "G": p = Player.Godalming; break;
                case "S": p = Player.Seward; break;
                case "H": p = Player.VanHelsing; break;
                case "M": p = Player.MinaHarker; break;
                case "D": p = Player.Dracula; break;
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
            } else if (location == 'HI') {
                id = playHistory[p][playHistory[p].length - 1];
                eventStr += " hid in " + cities[id].name;
            } else {
                let currCity : City = cities.find((city) => city.abbrev == location);
                if (!currCity) throw new Error("Invalid location abbreviation " + location);
                id = currCity.id;
                eventStr += " moved to " + cities[id].name;
                if (index > 4) eventStr += " from " + cities[playHistory[p][playHistory[p].length - 1]].name;
                if (id >= 71) hiddenInfoMode = true;
            }
            playHistory[p].push(id);
            // console.log(eventStr);
            playEvents.push(eventStr);
            totalMoves++;
        });
        showStats();
        drawMove();
        document.getElementById('error-msg').innerHTML = "";
    } catch (e) {
        document.getElementById('error-msg').innerHTML = "Error occured: invalid play path";
    }
}