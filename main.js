//全局配置
var _EPS = 3;//领域半径
var _MinPts = 2;//最小领域集合数

var _CORE = 1; //核心点
var _NOISE = 2;//噪声点
var _BORDER = 3;//边界点
var _NOISE_BORDER = 4;//噪声或边界点

var point_set = [];//点集
var sets = [];//簇集

/**
*   创建一个点，并加入到点集中
*/
var CreatePoint = function(x, y) {
    //点的结构
    var point = {
        x: x,
        y: y,
        type:_NOISE,
        N_EPS: [],
        IN_SET: false
    }
    point_set.push(point);//加入点集
    return point;
}

/**
*   创建一个簇，并加入到簇集中
*/
var CreateSet = function(name) {
    //簇的结构
    var set = {
        name: name,
        points: []
    }
    sets.push(set);
    return set;
}

/**
*   更新点的属性
*/
var UpdatePoint = function(point, attr, value) {
    if(attr != 'N_EPS') {
        point.attr = value;
    } else {
        point.N_EPS.push(value);
    }

}

/**
*   添加一个点到簇中
*/
var AddPoint = function(point, set) {
    set.points.push(point);
}

/**
*   计算一个点的领域点，
*/
var CalNEPS = function(point) {

    for(var i = 0, n = point_set.length; i < n; i++) {
        var p = point_set[i];
        var dist = CalDistance(point, p);
        if( dist <= _EPS ) {
            // console.log(p);
            UpdatePoint(point, "N_EPS", p);
        }
    }
    return point;
}

/**
*   计算两点之间的距离
*/
var CalDistance = function(point1, point2) {
    x1 = point1.x;
    y1 = point1.y;
    x2 = point2.x;
    y2 = point2.y;

    return Math.sqrt( Math.pow(x1-x2, 2) + Math.pow(y1-y2, 2) );
}

/**
*   打印点的坐标
*/
var PrintPoint = function(point) {
    if(point instanceof Array) {
        for(var i = 0, n = point.length; i < n; i++) {
            p = point[i];
            console.log("x: " + p.x + ", y:" + p.y + ", type:"+ p.type + ", IN_SET:" + p.IN_SET);
        }
    } else {
        console.log("x: " + point.x + ", y:" + point.y + ", type:"+ p.type + ", IN_SET:" + p.IN_SET);
    }
}

/**
*   算法入口
*/
var DBSCAN = function() {
    //遍历整个点集
    for (var i = 0, n = point_set.length; i < n; i++) {
        var p = point_set[i];
        if(p.IN_SET == true) continue;//该点已经在簇中
        //计算该点的NEPS
        CalNEPS(p);
        //核心点
        if(p.N_EPS.length >= _MinPts) {
            // console.log("N_EPS.length:"+p.N_EPS.length);
            // console.log(p.N_EPS);
            // console.log(p.x+ " " +p.y);
            var name = Date.now();//用时间戳来定义簇名
            var new_set = CreateSet(name);//新建个簇
            UpdatePoint(p, "type", _CORE);//设置该点为核心对象
            AddPoint(p, new_set);//把核心点加入簇中
            UpdatePoint(p, "IN_SET", true);
            for (var j = p.N_EPS.length - 1; j >= 0; j--) {
                var N_P = p.N_EPS[j];
                CalNEPS(N_P);
                if(N_P.N_EPS.length >= _MinPts) {//领域中的点也是核心对象，则并入到这个簇中
                    UpdatePoint(N_P, "type", _CORE);//设置该点为核心对象
                    AddPoint(N_P, new_set);//把核心点加入簇中
                    UpdatePoint(N_P, "IN_SET", true);
                } else {
                    UpdatePoint(N_P, "type", _BORDER);//设置该点为边界对象
                }
            };
        } else {
            p.N_EPS = [];
            UpdatePoint(N_P, "type", _NOISE_BORDER);//设置该点为边界对象
        }
    }
}

CreatePoint(1,2);
CreatePoint(2,2);
CreatePoint(2,1);

// CreatePoint(5,6);
// CreatePoint(5,5);
// CreatePoint(5,7);


DBSCAN();
PrintPoint(point_set);
console.log(sets);