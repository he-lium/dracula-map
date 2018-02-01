var modal = document.getElementById('popup');
var btnLoadMoves = document.getElementById('change');
var spanClose = document.getElementById('close');
var txtMoves = document.getElementById('input-moves');
var btnSubmitMoves = document.getElementById('submit-moves');
var btnNextMove = document.getElementById('next-move');
var btnPrevMove = document.getElementById('prev-move');

var btnPrevTurn = document.getElementById('prev-turn');
var btnNextTurn = document.getElementById('next-turn');

//新增
var radioPlayerSelection = document.getElementsByName('player');
var labelCurrent = document.getElementById('lb-currentPlayer');
var labelGameMsg = document.getElementById('lb-gameMsg'); 
var labelInputTitle = document.getElementById('tb_title'); 
var btnStart = document.getElementById('btn-gameStart');
var inputArea = document.getElementById('gameinfoEnter');
var btnComfimMove = document.getElementById('comfim-move');

var changed = false;
var stats = {
    div: document.getElementById('stats'),
    roundCounter: document.getElementById('round-move'),
    moveEvent: document.getElementById('move-event'),
    rawMoveDisplay: document.getElementById('raw-move'),
    update: function () {
        stats.roundCounter.innerText = "Move " + currentMove.toString() + '/' + (totalMoves - 1).toString() + ', Round ' + Math.floor(currentMove / 5).toString() + '/' + (Math.floor(totalMoves / 5));
        stats.moveEvent.innerText = playEvents[currentMove];
        stats.rawMoveDisplay.innerText = rawMoves[currentMove];
    }
};

function getRadioBtnVar(radios)
{
    for (var i = 0, length = radios.length; i < length; i++) {
        if (radios[i].checked) {
            return radios[i].value;
        }
    }
}
function showStats() {
    stats.div.style.display = 'block';
}
function showModal(){
    modal.style.display = 'block';
    txtMoves.focus();
    
    
}
function hideModal(){
    modal.style.display = 'none';
}
function showInputMove(){
    inputArea.style.display = 'block';
}
//当角色选择玩后，开始
btnStart.onclick = function() {
    hideModal();
    //获取玩家是谁?
    var seletedRole = getRadioBtnVar(radioPlayerSelection);
    console.log("Debug 选择的角色= " + seletedRole);
    //获取手动输入的游戏信息
    //var playerGameMsg = txtMoves.value;
    startGame(seletedRole);
};
//没一轮确认MOVE的讯息
btnComfimMove.onclick = function (){
 
    processGame();
    txtMoves.value = ""; //清掉文本框的字...
};
btnLoadMoves.onclick = function () {
  
    modal.style.display = 'block';
    txtMoves.focus();
    changed = false;
};
spanClose.onclick = function () {
    modal.style.display = 'none';
};
window.onclick = function (event) {
    if (event.target == modal) {
        modal.style.display = 'none';
    }
};
//当按钮Load按下
btnSubmitMoves.onclick = function () {
    //alert("当Load按下")
    modal.style.display = 'none';
    //获取玩家是谁?
    var seletedRole = getRadioBtnVar(radioPlayerSelection);
    console.log("Debug 选择的角色= " + seletedRole);
    //获取手动输入的游戏信息
    //var playerGameMsg = txtMoves.value;
    startGame(seletedRole);
    //显示游戏讯息游戏信息
    //processMoves(txtMoves.value);
};
txtMoves.onkeyup = function (event) {
    // console.log(event.keyCode);
    
    event.preventDefault();
    if (event.keyCode == 13 && changed)
        //btnSubmitMoves.click(); 修改为我自己定义的确认
        btnComfimMove.click();
    else if (event.keyCode == 27)
        modal.style.display = 'none';
    else
        changed = true;
};
document.body.onkeydown = function (e) {
    if (document.activeElement == txtMoves)
        return;
    if (e.keyCode == 37) {
        btnPrevMove.focus();
        prevMove();
    }
    else if (e.keyCode == 39) {
        btnNextMove.focus();
        nextMove();
    }
    else if (e.keyCode == 36) {
        firstMove();
    }
    else if (e.keyCode == 35) {
        lastMove();
    }
};
btnNextMove.onclick = nextMove;
btnPrevMove.onclick = prevMove;
window.onload = function () {
    let query = window.location.search;
    if (query.substr(0, 6) == "?path=") {
        let path = query.substr(6);
        path = path.replace(new RegExp('%20', 'g'), ' ');
        txtMoves.value = path;
    }
    else {
        modal.style.display = 'block';
        txtMoves.focus();
        changed = false;
    }
    loadJSONs();
};
//# sourceMappingURL=ui.js.map