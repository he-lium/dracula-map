var canvas = <HTMLCanvasElement> document.getElementById('map');
var canvasLeft = canvas.offsetLeft;
var canvasTop = canvas.offsetTop;
var context = canvas.getContext('2d');
var coordPanel = document.getElementById("panel");
var num : number = 0;

function drawPoint(x : number, y : number) {
    x = Math.floor(x);
    y = Math.floor(y);
    context.fillStyle = "black";
    context.fillRect(x - 10, y - 10, 20, 20);
    context.font = "14px serif";
    context.fillText("#" + num, x - 15, y - 15);
    let newCoord = document.createElement("p");
    let coordText = document.createTextNode("#" + num.toString() + ": " + x.toString() + ", " + y.toString());
    newCoord.appendChild(coordText);
    coordPanel.appendChild(newCoord);
    num++;
}

function getCanvasMousePos(canvas : HTMLCanvasElement, event : MouseEvent) {
    let rect = canvas.getBoundingClientRect();
    return {
        x : (event.clientX - rect.left)/(rect.right-rect.left)*canvas.width,
        y : (event.clientY - rect.top)/(rect.bottom-rect.top)*canvas.height
    };
}

// canvas.addEventListener('click', function (ev : MouseEvent) {
//     let mouse = getCanvasMousePos(canvas, ev);
//     drawPoint(mouse.x, mouse.y);
// });
