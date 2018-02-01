var Player;
var PLAYER_ROLE = null;
var PLAYER_ROLE_DRACULAR = 0;
var PLAYER_ROLE_HUNER = 1;

var CURRENT_TURN = 0;
var GAME_MSG = "";

var PlayerInfo = {
    "hp" : []
};

(function (Player) {
    Player[Player["Godalming"] = 0] = "Godalming";
    Player[Player["Seward"] = 1] = "Seward";
    Player[Player["VanHelsing"] = 2] = "VanHelsing";
    Player[Player["MinaHarker"] = 3] = "MinaHarker";
    Player[Player["Dracula"] = 4] = "Dracula";
   
    //猎人的HP初始值
    for(i =0; i < 4; i++) PlayerInfo.hp[i] = 9;
    PlayerInfo.hp[Player["Dracula"]] = 40;
 
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
            color = '#28a745';
            break;
        case Player.Seward:
            x += 15;
            color = '#6c757d';
            break;
        case Player.VanHelsing:
            y += 15;
            color = '#ffc107';
            break;
        case Player.MinaHarker:
            x -= 15;
            color = '#17a2b8';
            break;
        default:
            x += 15;
            y += 15;
            color = '#dc3545';
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
                    document.getElementById("drac-loc").className = "badge badge-danger";
                }
               
                
            }
            playerSpans[i].innerHTML += "<br/> HP: " + PlayerInfo.hp[i] ;
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
    //禁用掉开始按钮
    btnStart.disabled = true;
    PLAYER_ROLE = seletedRole;
    CURRENT_TURN = 0;
    labelCurrent.innerText = disPlayTurnInfo(CURRENT_TURN,PLAYER_ROLE);
    showInputMove();
    showModal();
    

    //processGame()
}
function disPlayTurnInfo(currentTurn,playerRole){
    console.log("Display turn= "  + currentTurn);
    switch(currentTurn){
        case Player.Godalming:
            return (playerRole == PLAYER_ROLE_HUNER ? "现在轮到你玩了哦~ - " : "现在轮到AI玩了哦~ - ") + " Player.Godalming (猎人1)";
        case Player.Seward:
            return (playerRole == PLAYER_ROLE_HUNER ? "现在轮到你玩了哦~ - " : "现在轮到AI玩了哦~ - ") + " Player.Seward (猎人2)";
        case Player.VanHelsing:
            return (playerRole == PLAYER_ROLE_HUNER ? "现在轮到你玩了哦~ - " : "现在轮到AI玩了哦~ - ") + " Player.VanHelsing (猎人3)";
        case Player.MinaHarker:
            return (playerRole == PLAYER_ROLE_HUNER ? "现在轮到你玩了哦~ - " : "现在轮到AI玩了哦~ - ") + " Player.MinaHarker (猎人4)";
        case Player.Dracula:
            return (playerRole == PLAYER_ROLE_DRACULAR ? "现在轮到你玩了哦~ - " : "现在轮到AI玩了哦~ - ") + " Player.Dracula (吸血鬼)";
        default:
            return "我不知道现在是谁玩啦~都是因为你输入了一个奇怪的数字...(Execpetion on currentTurn = " + currentTurn + ")";
    }
}
function processGame()
{

    console.log("processGame exec");
    //UI轮数讯息显示:

    //如果玩吸血鬼
    if(PLAYER_ROLE == PLAYER_ROLE_DRACULAR){
        switch(CURRENT_TURN){
            //轮到猎人玩的时候 ...
            //下面case应该执行AI代码
            case Player.Godalming:{
                //应该改成 += AI生成的代码
                GAME_MSG += txtMoves.value.toUpperCase() + " ";

                break;
            }
            case Player.Seward:{
                //应该改成 += AI生成的代码
                GAME_MSG += txtMoves.value.toUpperCase() + " ";
                break;
            }
            case Player.VanHelsing:{
                //应该改成 += AI生成的代码
                GAME_MSG += txtMoves.value.toUpperCase() + " ";
                break;
            }
            case Player.MinaHarker:{
                //应该改成 += AI生成的代码
                GAME_MSG += txtMoves.value.toUpperCase() + " ";
                break;
            }
            case Player.Dracula:{

                //根据玩家输入的地点生成游戏信息
                if(!isMoveMsgVaild(txtMoves.value.toUpperCase())) {
                    showModal();
                    return;
                }
                let gameMsg = generateGameMsg(CURRENT_TURN,txtMoves.value.toUpperCase());
                GAME_MSG += gameMsg;
                break;
            }
        }
        
    }
    //如果是玩猎人
    else if(PLAYER_ROLE == PLAYER_ROLE_HUNER){
        switch(CURRENT_TURN){
            case Player.Dracula:{
                //应该 += AI生成的代码 ...
                GAME_MSG += txtMoves.value.toUpperCase();
                break;
            }
            case Player.Godalming:{

                //根据玩家输入的地点生成游戏信息
                if(!isMoveMsgVaild(txtMoves.value.toUpperCase())) {
                    showModal();
                    return;
                }
                let gameMsg = generateGameMsg(CURRENT_TURN,txtMoves.value.toUpperCase());
                GAME_MSG += gameMsg + " ";

                break;
            }
            case Player.Seward:{
                //根据玩家输入的地点生成游戏信息
                if(!isMoveMsgVaild(txtMoves.value.toUpperCase())) {
                    showModal();
                    return;
                }
                let gameMsg = generateGameMsg(CURRENT_TURN,txtMoves.value.toUpperCase());
                GAME_MSG += gameMsg + " ";
                break;
            }
            case Player.VanHelsing:{
                //根据玩家输入的地点生成游戏信息
                if(!isMoveMsgVaild(txtMoves.value.toUpperCase())) {
                    showModal();
                    return;
                }
                let gameMsg = generateGameMsg(CURRENT_TURN,txtMoves.value.toUpperCase());
                GAME_MSG += gameMsg + " ";
                break;
            }
            case Player.MinaHarker:{
                //根据玩家输入的地点生成游戏信息
                if(!isMoveMsgVaild(txtMoves.value.toUpperCase())) {
                    showModal();
                    return;
                }
                let gameMsg = generateGameMsg(CURRENT_TURN,txtMoves.value.toUpperCase());
                GAME_MSG += gameMsg + " ";
                break;
            }
        }
    }

    
    //更新地图绘制
    processMoves(GAME_MSG);

    console.log("GAMEMSG = " +GAME_MSG);
    if(CURRENT_TURN >= Player.Dracula){
        alert("回合结束");
        hideModal();
        CURRENT_TURN = 0;
        return;
    }
    
    CURRENT_TURN++;
    console.log("TURN= " +CURRENT_TURN);
    labelCurrent.innerText = disPlayTurnInfo(CURRENT_TURN,PLAYER_ROLE);

    /*
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
        console.log("GAMEMSG = " +GAME_MSG);
        if(CURRENT_TURN == Player.Dracula){
            alert("回合结束");
            CURRENT_TURN = 0;
            return;
        }
    }
    */
}
//检测要去的地点短名
function isMoveMsgVaild(locationShortName){
    let moveLocation = locationShortName;
    //判断如果用户屁也不输入的情况下
    if(moveLocation == null || moveLocation.trim() == "") {
        alert("我是猜不到你想要去哪里的，哼哼～");

        return false;
    } 
    let cityFullName = getCityNameFromGameMSG(locationShortName);
    if(!cityFullName){
        alert("哎，怎么找都找不到你输入的地点名称诶，在查查看好吗 =w= ");

        return false;
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
    if(!firstCharactor){
        alert("貌似你输入了一个奇怪的游戏轮数,我给你看看~ \n"+currentTurn);
        return;
    }   
    //获取玩家操作的角色要去的地方
  
    let wishedToMove = locationShortName;

    let gameMsg = firstCharactor  + wishedToMove + ".....";
    //Debug代码
    console.log("生成的游戏讯息是:"+gameMsg);
    return gameMsg;
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
                    throw new Error("无效的地点名称: " + location);
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
            
            /*alert(playHistory[index]);*/
            //如果猎人和吸血鬼在一个地图了
         

        });
        //===============扣血显示==============
        //console.log("CURRENTLOC = "+ playHistory[CURRENT_TURN]);
        if(CURRENT_TURN == Player.Dracula){
            //处理吸血鬼在海上的扣血
            let currentLoc = cities.find((city) => city.abbrev == location);
            if(currentLoc.type == 1) {
                //吸血鬼应该扣2点血
                PlayerInfo.hp[Player.Dracula] = parseInt(PlayerInfo.hp[Player.Dracula]) -2;
            }
            //处理吸血鬼碰到猎人的扣血
            playHistory.forEach(function (city,index) {
                //console.log("KEY = " + city + " INDED = "+ index + " CURRENTTURN= " + CURRENT_TURN);
                if(parseInt(playHistory[CURRENT_TURN])  == parseInt(city) && CURRENT_TURN != index) {
                    //吸血鬼应该扣10点血
                    PlayerInfo.hp[Player.Dracula] = parseInt(PlayerInfo.hp[Player.Dracula]) -10;
                }
            });
            
            //处理剩下猎人碰到吸血鬼的扣血
            for(i = 0; i < 4; i++) {
                if(parseInt(playHistory[i]) == playHistory[Player.Dracula]){
                    //吸血鬼应该扣4点血
                    PlayerInfo.hp[i] = parseInt(PlayerInfo.hp[i]) -4;
                }
            }
        }
        console.log("totalMoves = " + totalMoves);
       

        showStats();
        drawMove();
        document.getElementById('error-msg').innerHTML = "";
    }
    catch (e) {
        document.getElementById('error-msg').innerHTML = "粗错啦: 遇到了奇怪的游戏讯息Orz <br/>"+ "exception on " + e.message + "<br/> >>> 建议你刷新网页重试比较好哦~ <<<";
    }
}

//# sourceMappingURL=process.js.map