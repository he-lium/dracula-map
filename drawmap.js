var PlaceType;
(function (PlaceType) {
    PlaceType[PlaceType["Land"] = 0] = "Land";
    PlaceType[PlaceType["Sea"] = 1] = "Sea";
})(PlaceType || (PlaceType = {}));
;
var LinkType;
(function (LinkType) {
    LinkType[LinkType["Road"] = 0] = "Road";
    LinkType[LinkType["Rail"] = 1] = "Rail";
    LinkType[LinkType["Sea"] = 2] = "Sea";
})(LinkType || (LinkType = {}));
;
class City {
    constructor(name, abbrev, type) {
        this.name = name;
        this.abbrev = abbrev;
        this.type = type;
    }
    addCoords(x, y) {
        this.x = x;
        this.y = y;
    }
}
class Link {
}
var places_json;
var coords;
var cities = Array(71);
var links;
var loadStatus = 0;
function drawCity(city) {
    if (city.type == PlaceType.Sea) {
        context.fillStyle = "deepskyblue";
    }
    else {
        context.fillStyle = "black";
    }
    let x = Math.floor(city.x);
    let y = Math.floor(city.y);
    context.fillRect(x - 5, y - 5, 10, 10);
    context.font = "16px serif";
    context.fillStyle = "black";
    context.fillText(city.abbrev, x - 10, y - 10);
}
function drawLinks(type, c1, c2) {
    if (type == LinkType.Road) {
        context.lineWidth = 3;
        context.strokeStyle = 'black';
    }
    else if (type == LinkType.Rail) {
        context.lineWidth = 8;
        context.strokeStyle = 'orange';
    }
    else if (type == LinkType.Sea) {
        context.lineWidth = 10;
        context.strokeStyle = 'skyblue';
    }
    context.beginPath();
    context.moveTo(cities[c1].x, cities[c1].y);
    context.lineTo(cities[c2].x, cities[c2].y);
    context.stroke();
}
function drawMap() {
    links.filter((value) => value.type == LinkType.Sea)
        .forEach((l) => drawLinks(l.type, l.cities[0], l.cities[1]));
    links.filter((value) => value.type == LinkType.Rail)
        .forEach((l) => drawLinks(l.type, l.cities[0], l.cities[1]));
    links.filter((value) => value.type == LinkType.Road)
        .forEach((l) => drawLinks(l.type, l.cities[0], l.cities[1]));
    cities.forEach(drawCity);
}
function populateCities() {
    if (!places_json)
        return;
    console.log("populateCities");
    for (let i = 0; i < 71; i++) {
        let name = places_json.places[i].name;
        let abbrev = places_json.places[i].abbrev;
        let type_num = places_json.places[i].type;
        let place;
        if (type_num == 1) {
            place = new City(name, abbrev, PlaceType.Sea);
        }
        else {
            place = new City(name, abbrev, PlaceType.Land);
        }
        place.id = i;
        cities[i] = place;
    }
    loadStatus++;
    if (loadStatus >= 3)
        drawMap();
}
function parseCoords(e) {
    console.log("parseCoords");
    coords = JSON.parse(request1.responseText).coordinates;
    coords.forEach((element, index) => {
        cities[index].addCoords(element[0], element[1]);
    });
    loadStatus++;
    if (loadStatus >= 3)
        drawMap();
}
function parseLinks(e) {
    console.log("parseLinks");
    links = JSON.parse(link_request.responseText).links;
    loadStatus++;
    if (loadStatus >= 3)
        drawMap();
}
var request = new XMLHttpRequest();
request.open("GET", "./places.json", true);
request.onload = function (e) {
    if (request.readyState === 4) {
        if (request.status === 200) {
            places_json = JSON.parse(request.responseText);
            populateCities();
        }
        else {
            console.error(request.statusText);
        }
    }
};
request.onerror = function (e) {
    console.error(request.statusText);
};
request.send(null);
var request1 = new XMLHttpRequest();
request1.open("GET", "./coords.json", true);
request1.onload = parseCoords;
request1.onerror = function (e) { console.error(request1.statusText); };
request1.send(null);
var link_request = new XMLHttpRequest();
link_request.open("GET", "./links.json", true);
link_request.onload = parseLinks;
link_request.onerror = function (e) { console.error(request1.statusText); };
link_request.send(null);
//# sourceMappingURL=drawmap.js.map