var Player;
var PLAYER_DERACULAR = 0;
var PLAYER_HUNTER = 1;
(function (Player) {
    Player[Player["Godalming"] = 0] = "Godalming";
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
function drawPlayer(player, cityID, ghostTrail) {
    if (cities[cityID].id >= 71)
        return; // don't draw unknown locations
    let x = cities[cityID].x;
    let y = cities[cityID].y;
    let color;
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
        context.fillStyle = 'white';
        context.fill();
        context.fillStyle = color;
        context.lineWidth = 2;
        context.stroke();
        context.font = "20px serif";
        context.fillText(ghostTrail.toString(), x - 5, y + 5);
    }
    else {
        context.fill();
    }
}
var totalMoves = 0;
var playHistory = [[], [], [], [], []];
var playEvents = [];
var currentMove = 0;
var rawMoves;
var hiddenInfoMode;
function drawMove() {
    let index;
    drawMap();
    stats.update();
    // Draw Dracula's trail
    if (currentMove > 4) {
        if (hiddenInfoMode) {
            let id;
            index = Math.floor(currentMove / 5) - 7;
            for (let i = 1; i < 6; i++) {
                index++;
                if (index >= 0) {
                    drawPlayer(Player.Dracula, playHistory[4][index], 6 - i);
                }
            }
        }
        else {
            index = Math.floor(currentMove / 5) - 1;
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
    for (let i = 0; i < 5; i++) {
        if (currentMove >= i) {
            let idIndex = Math.floor((currentMove - i) / 5);
            // console.log(i, idIndex);
            let id = playHistory[i][idIndex];
            drawPlayer(i, id);
            playerSpans[i].innerText = cities[id].abbrev + " " + cities[id].name;
            if (i == 4) {
                if (id >= 71) {
                    document.getElementById("drac-loc").className = "d_unknown";
                }
                else {
                    document.getElementById("drac-loc").className = "d";
                }
            }
        }
        else {
            playerSpans[i].innerText = "undefined";
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
    if (currentMove < totalMoves - 1)
        currentMove++;
    drawMove();
}
function prevMove() {
    if (currentMove > 0)
        currentMove--;
    drawMove();
}

function processGame(seletedRole,gameMsg){
    //判断如果用户屁也不输入的情况下
    if(gameMsg == null || gameMsg.trim() == "") {
        alert("我是猜不到你想要去哪里的，哼哼～");
        modal.style.display = 'block';
        txtMoves.focus();
        return;
    } 
    switch(seletedRole){
        case '0':{
            //获取玩家输入的地点
            let cityFullName = getCityNameFromGameMSG(gameMsg);
            alert("你选择了玩吸血鬼,你手动输入的游戏信息: "+gameMsg+"去的地点是:"+cityFullName +"耶～");
            /*
                猎人的AI代码...
            */
            break;
        }
        case '1':{
            let cityFullName = getCityNameFromGameMSG(gameMsg);
            alert("你选择了玩吸血鬼,你手动输入的游戏信息: "+gameMsg+"去的地点是:"+cityFullName+"耶～");
            //玩家手动输入的信息 -> gameMsg
            /*

            */

            break;
        }
    }
}

function getCityNameFromGameMSG(shortName){
    let city = cities.find((city) => city.abbrev == shortName);
    if (!city) {
        alert("哎，怎么找都找不到你输入的地点名称诶，在查查看好吗 =w= ");
        modal.style.display = 'block';
        txtMoves.focus();
    }
    return cities[city.id].name;
}
function processMoves(raw) {
    
    playHistory = [[], [], [], [], []];
    playEvents = [];
    totalMoves = 0;
    currentMove = 0;
    hiddenInfoMode = false;
    let move;
    let p;
    let location;
    rawMoves = raw.trim().split(" ");
    if (rawMoves.length == 1 && rawMoves[0] == "")
        return;
    let id;
    let eventStr = "";
    try {
        rawMoves.forEach(function (move, index) {
            switch (move[0]) {
                case "G":
                    p = Player.Godalming;
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
                let currCity = cities.find((city) => city.abbrev == location);
                if (!currCity)
                    throw new Error("Invalid location abbreviation " + location);
                id = currCity.id;
                eventStr += " moved to " + cities[id].name;
                if (index > 4)
                    eventStr += " from " + cities[playHistory[p][playHistory[p].length - 1]].name;
                if (id >= 71)
                    hiddenInfoMode = true;
            }
            playHistory[p].push(id);
            // console.log(eventStr);
            playEvents.push(eventStr);
            totalMoves++;
        });
        showStats();
        drawMove();
        document.getElementById('error-msg').innerHTML = "";
    }
    catch (e) {
        document.getElementById('error-msg').innerHTML = "Error occured: invalid play path";
    }
}

//# sourceMappingURL=process.js.map