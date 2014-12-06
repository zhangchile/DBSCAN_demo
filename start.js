var _BodyX = 0;
var _BodyY = 0;  
var Body = document.querySelector("body");
var _DRAWCIRCLE = true;

var InfoBox = document.getElementById("InfoBox");
var Eps = document.getElementById("Eps");
var MinPts = document.getElementById("MinPts");
var drawcircle = document.getElementById("drawcircle");
var Canvas = document.getElementById('myCanvas');
var CTX = Canvas.getContext('2d');
var FLAT = new FlatSystem( CTX, 930,500 );    

drawcircle.onchange = function() {
    _DRAWCIRCLE = this.checked;
    RePaint(false);
}

Eps.onchange = function() {
    _EPS = this.value;
}

MinPts.onchange = function() {
    _MinPts = this.value;
}

Body.onmousemove = function(e) {
    _BodyX = e.offsetX;
    _BodyY = e.offsetY;
}

/**
*    构建坐标系
*/
function Start() {
    //构建坐标系
    FLAT.setProportion(0.02);
    FLAT.setCalibration(50);
    FLAT.onlyQuadrant(1);
    FLAT.init();
    FLAT.build();
}
/**
* 注册鼠标事件
*/
Canvas.onclick = function(e) {
    rx = FLAT.getFlatX(e.offsetX);
    ry = FLAT.getFlatY(e.offsetY);
    FLAT.printPoint(rx,ry,5,5);
    var p0 = CreatePoint(rx,ry);
    FLAT.fillText(p0.name, FLAT.getFlatX(e.offsetX+10), FLAT.getFlatY(e.offsetY-10));
    if(_DRAWCIRCLE) {
        CTX.beginPath();
        CTX.arc(e.offsetX,e.offsetY,FLAT.getx(_EPS-1),0,Math.PI*2,1);
        CTX.closePath();
        CTX.strokeStyle = '#ccc';
        CTX.lineWidth = 1;
        CTX.stroke(); 
    }
    ClearSet();
    DBSCAN();
    PrintSets(sets);
    ShowResult(sets);
    RePaint(false);
}

/**
*    重绘
*/
function RePaint(hit) {
    FLAT.clear();
    Start();
    for (var i = point_set.length - 1; i >= 0; i--) {
        var p = point_set[i];
        var showcircle = false;
        if (hit != false)
        if ( p.x == hit.x && p.y == hit.y) {
            showcircle = true;
        }
        if (p.type == 1) {//核心点
            FLAT.setFillColor("red");//设置
            FLAT.printPoint(p.x,p.y,5,5);
            FLAT.fillText(p.name, FLAT.getFlatX(FLAT.getx(p.x)+10), FLAT.getFlatY(FLAT.gety(p.y)-10));
            FLAT.setFillColor("#000");//恢复黑色
            if(_DRAWCIRCLE || showcircle) {
                CTX.beginPath();
                CTX.arc(FLAT.getx(p.x), FLAT.gety(p.y),FLAT.getx(_EPS-1),0,Math.PI*2,1);
                CTX.closePath();
                CTX.strokeStyle = '#ccc';
                CTX.lineWidth = 1;
                CTX.stroke(); 
            }        
        } else if (p.type == 3){//边界点
            FLAT.setFillColor("blue");//设为蓝色
            FLAT.printPoint(p.x,p.y,5,5);
            FLAT.fillText(p.name, FLAT.getFlatX(FLAT.getx(p.x)+10), FLAT.getFlatY(FLAT.gety(p.y)-10));
            if(_DRAWCIRCLE || showcircle) {
                CTX.beginPath();
                CTX.arc(FLAT.getx(p.x), FLAT.gety(p.y),FLAT.getx(_EPS-1),0,Math.PI*2,1);
                CTX.closePath();
                CTX.strokeStyle = '#ccc';
                CTX.lineWidth = 1;
                CTX.stroke(); 
            }        
        } else {
            FLAT.setFillColor("#000");//恢复黑色
            FLAT.printPoint(p.x,p.y,5,5);
            FLAT.fillText(p.name, FLAT.getFlatX(FLAT.getx(p.x)+10), FLAT.getFlatY(FLAT.gety(p.y)-10));
            if (_DRAWCIRCLE || showcircle) {
                CTX.beginPath();
                CTX.arc(FLAT.getx(p.x), FLAT.gety(p.y),FLAT.getx(_EPS-1),0,Math.PI*2,1);
                CTX.closePath();
                CTX.strokeStyle = '#ccc';
                CTX.lineWidth = 1;
                CTX.stroke(); 
            }        
        }
    };
   
}


Canvas.onmousemove = function(e) {
    rx = FLAT.getFlatX(e.offsetX);
    ry = FLAT.getFlatY(e.offsetY);
    document.getElementById("xy").innerHTML = "X:"+rx+", Y:"+ry;
    var hit = InPointSet(rx,ry);
    if(hit) {

        var hitx = hit.x;
        var hity = hit.y;
        InfoBox.style.top = _BodyY;
        InfoBox.style.left = _BodyX;
        InfoBox.style.display="block";
        InfoBox.innerHTML = "x="+hitx+", y="+hity;
        RePaint(hit);
    } else {
        InfoBox.style.display = "none";
        RePaint(false);
    }
}

/**
*    判断坐标是否在点集
*/
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

/**
*    打印结果
*/
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

Start();
// var cal = document.getElementById("cal");
// cal.onclick = function() {
//     ClearSet();
//     DBSCAN();
//     PrintSets(sets);
//     ShowResult(sets);
//     RePaint(false);
// }