var _BodyX = 0;
var _BodyY = 0;  
var Body = document.querySelector("body");
var _DRAWCIRCLE = true;

var InfoBox = document.getElementById("InfoBox");
var Eps = document.getElementById("Eps");
var MinPts = document.getElementById("MinPts");
var drawcircle = document.getElementById("drawcircle");
var showcircle = document.getElementById("showcircle");

drawcircle.onchange = function() {
    _DRAWCIRCLE = this.checked;
}

Eps.onchange = function() {
    _EPS = this.value;
}

MinPts.onchange = function() {
    _MinPts = this.value;
}

Body.onmousemove = function(e) {
    // console.log("x:"+e.offsetX+" y:"+e.offsetY);
    _BodyX = e.offsetX;
    _BodyY = e.offsetY;
}

var canvas = document.getElementById('myCanvas');
var ctx = canvas.getContext('2d');
var flat = new FlatSystem( ctx, 930,500 );    
flat.setProportion(0.02);
flat.setCalibration(50);
flat.onlyQuadrant(1);
flat.init();
flat.build();

canvas.onclick = function(e) {
    rx = flat.getFlatX(e.offsetX);
    ry = flat.getFlatY(e.offsetY);

    flat.printPoint(rx,ry,5,5);
    var p0 = CreatePoint(rx,ry);
    flat.fillText(p0.name, flat.getFlatX(e.offsetX+10), flat.getFlatY(e.offsetY-10));
    if(_DRAWCIRCLE) {
        ctx.beginPath();
        ctx.arc(e.offsetX,e.offsetY,flat.getx(_EPS-1),0,Math.PI*2,1);
        ctx.closePath();
        ctx.strokeStyle = '#ccc';
        ctx.lineWidth = 1;
        ctx.stroke(); 
    }
    DBSCAN();
    PrintSets(sets);
    ShowResult(sets);
    ClearSet();
}

canvas.onmousemove = function(e) {
    rx = flat.getFlatX(e.offsetX);
    ry = flat.getFlatY(e.offsetY);
    // console.log("x:"+rx+" y:"+ry);
    document.getElementById("xy").innerHTML = "X:"+rx+", Y:"+ry;
    var hit = InPointSet(rx,ry);
    if(hit) {

        var hitx = hit.x;
        var hity = hit.y;
        InfoBox.style.top = _BodyY;
        InfoBox.style.left = _BodyX;
        InfoBox.style.display="block";
        InfoBox.innerHTML = "x="+hitx+", y="+hity;

        // var R = flat.getx(_EPS);
        // showcircle.style.width = R;
        // showcircle.style.height = R;
        // showcircle.style.top = _BodyY + 16*_EPS;
        // showcircle.style.left = _BodyX - R/2 +8*_EPS;
        // showcircle.style.display = "block";
    } else {
        InfoBox.style.display = "none";
        // showcircle.style.display = "none";
    }
}

function InPointSet(x,y) {
    var hit = '';
    for (var i = 0, n = point_set.length; i < n; i++) {
        var p = point_set[i];
        if(Math.abs(p.x - x) < 0.05 && Math.abs(p.y - y) < 0.05) {
            hit = p;
            break;
        }
    }
    return hit;
}

function ShowResult(set) {
    var rs = document.getElementById("result");
    var str = "";
    if(set instanceof Array) {
        for(var i = 0, n = set.length; i < n; i++) {
            s = set[i];
            str += "<p>簇"+i+":";
            if(s.points instanceof Array) {
                for(var j = 0, m = s.points.length; j < m; j++) {
                    str += s.points[j].name+",";
                }
                str += "</p>";                
            }
        }
    } else {

    }
    rs.innerHTML = str;
}

// var cal = document.getElementById("cal");
// cal.onclick = function() {
//     DBSCAN();
//     PrintSets(sets);
//     ShowResult(sets);
//     ClearSet();
// }