var modal = document.getElementById('popup');
var btnLoadMoves = document.getElementById('change');
var spanClose = document.getElementById('close');
var txtMoves = document.getElementById('input-moves');
var btnSubmitMoves = document.getElementById('submit-moves');
var btnNextMove = document.getElementById('next-move');
var btnPrevMove = document.getElementById('prev-move');
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
function showStats() {
    stats.div.style.display = 'block';
}
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
btnSubmitMoves.onclick = function () {
    modal.style.display = 'none';
    processMoves(txtMoves.value);
};
txtMoves.onkeyup = function (event) {
    // console.log(event.keyCode);
    event.preventDefault();
    if (event.keyCode == 13 && changed)
        btnSubmitMoves.click();
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