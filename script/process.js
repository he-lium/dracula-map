var Player;
var PLAYER_ROLE = null;
var CURRENT_TURN = 0;
var GAME_MSG = "";

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
    //alert(currentMove);
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

function startGame(seletedRole){
    //alert("s");
    PLAYER_ROLE = seletedRole;
    processGame();
}
function processGame()
{
    switch(PLAYER_ROLE){
        case '0':{ //吸血鬼    
            if(CURRENT_TURN == Player.Dracula){
                
                //获取玩家输入的地点
                let locShortName = txtMoves.value;
                let gameMsg = generateGameMsg(CURRENT_TURN,locShortName);
                //alert("吸血鬼地点= ",gameMsg);
                GAME_MSG += gameMsg;
            }else{ //轮到吸血鬼AI
                //因为没有AI代码所以直接获取游戏信息= =
                GAME_MSG += txtMoves.value;
                //GAME_MSG+=
            }
        
            break;
        }
        case '1':{
        
            if(CURRENT_TURN < Player.Dracula) { //轮到猎人
                
                let locShortName = txtMoves.value;
                let gameMsg = generateGameMsg(CURRENT_TURN,locShortName);
                alert("吸血鬼的生成的游戏讯息:"+gameMsg);
            }
            else { //猎人部分AI
                //因为没有AI代码所以直接获取游戏信息= =
                GAME_MSG += txtMoves.value;
            }
            break;
        }
        //递增Turn
        CURRENT_TURN++;
        if(CURRENT_TURN == Player.Dracula){
            alert("回合结束");
            CURRENT_TURN = 0;
            return;
        }
    }
}
//检测要去的地点短名
function isMoveMsgVaild(locationShortName){
    let moveLocation = locationShortName;
    //判断如果用户屁也不输入的情况下
    if(moveLocation == null || moveLocation.trim() == "") {
        alert("我是猜不到你想要去哪里的，哼哼～");
        modal.style.display = 'block';
        txtMoves.focus();
        return;
    } 
    let cityFullName = getCityNameFromGameMSG(locationShortName);
    if(!cityFullName){
        alert("哎，怎么找都找不到你输入的地点名称诶，在查查看好吗 =w= ");
        modal.style.display = 'block';
        txtMoves.focus();
    }
    return true;
}
//生成游戏讯息片段
function generateGameMsg(currentTurn,locationShortName){
    
    /*
        猎人:
            [第一个字母是玩家名字缩写][后面两位代表地点缩写][后面三位，如果出现T,扣1点血，如果出现V，不扣血，如果出现D,猎人扣4点血，并且吸血鬼扣10点血]
        吸血鬼:
            [第一个字母玩家缩写][后面两位代表地点缩写][这两位字符不用管][如果出现V,全局扣13分]
    */
    //获取玩家首字母
    let firstCharactor = getPlayerCharacterNameByTurn(currentTurn);
    if(!firstCharactor) return alert("貌似你输入了一个奇怪的游戏轮数,我给你看看~ \n"+currentTurn);
    //获取玩家操作的角色要去的地方
    if(!isMoveMsgVaild(locationShortName)) return;
    let wishedToMove = locationShortName;

    let gameMsg = firstCharactor  + wishedToMove + ".....";
    //Debug代码
    alert("生成的游戏讯息是:"+gameMsg);
}
//根据现在的游戏轮数生成游戏讯息的第一个首字母
function getPlayerCharacterNameByTurn(currentTurn){
    switch(currentTurn){
        case Player.Godalming: return "G";
        case Player.Seward: return "S";
        case Player.VanHelsing: return "H";
        case Player.MinaHarker: return "M";
        case Player.Dracula: return "D";
        default: return null;
    }
}
function getCityNameFromGameMSG(shortName){
    let city = cities.find((city) => city.abbrev == shortName);
    if(!city) return null;
    return cities[city.id].name;
}
function processMoves(raw) {
    //更新游戏讯息绘制:
    labelGameMsg.innerHTML = "目前游戏信息: " + raw;
    
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
                id = playHistory[p][ playHistory[p].length - parseInt(location[1]) ];
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
            //一次全部给我画完
            nextMove();
            
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