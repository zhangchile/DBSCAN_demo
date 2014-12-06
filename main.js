//全局配置
var _EPS = 1;//领域半径
var _MinPts = 4;//最小领域集合数

var _CORE = 1; //核心点
var _NOISE = 2;//噪声点
var _BORDER = 3;//边界点
var _NOISE_BORDER = 4;//噪声或边界点

var _CHARCODE = 65;

var point_set = [];//点集
var sets = [];//簇集
var _newset;

/**
*   创建一个点，并加入到点集中
*/
var CreatePoint = function(x, y) {
    //点的结构
    var point = {
        x: x,
        y: y,
        name:String.fromCharCode(_CHARCODE%65 + 65),
        type:_NOISE,
        N_EPS: [],
        IN_SET: false,
        SETNAME: false
    }
    point_set.push(point);//加入点集
    _CHARCODE++;
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
*   恢复所有族和点的状态
*/
var ClearSet = function() {
    sets = [];
    for(var i = 0, n = point_set.length; i < n; i++) {
        point_set[i].IN_SET = false;
        point_set[i].SETNAME = false;
        point_set[i].N_EPS = [];
    }
}

/**
*   重置点的属性
*/
var UpdatePoint = function(point, attr, value) {
    // console.log(point);
    if(attr == 'type') {
        point.type = value;
    } else if(attr == 'N_EPS'){
        point.N_EPS.push(value);
    } else if(attr == 'IN_SET') {
        point.IN_SET = value;
    } else if(attr == "SETNAME") {
        point.SETNAME = value;
    }

}

/**
*   添加一个点到簇中
*/
var AddPoint = function(point, set) {
    if(set instanceof Object) {
        set.points.push(point);
    } else {
        console.log(point.name);
        for (var i = sets.length - 1; i >= 0; i--) {
            var s = sets[i];
            if(s.name == set) {
                s.points.push(point);
            }
        };
    }
}

/**
*   计算一个点的领域点，
*/
var CalNEPS = function(point) {

    for(var i = 0, n = point_set.length; i < n; i++) {
        var p = point_set[i];
        if(p.x == point.x && p.y == point.y) continue;
        var dist = CalDistance(point, p);
        if( dist <= _EPS ) {
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
            console.log("name:"+p.name+",x: " + p.x + ", y:" + p.y + ", type:"+ p.type + ", SETNAME:" + p.SETNAME);
        }
    } else {
        console.log("name:"+p.name+",x: " + point.x + ", y:" + point.y + ", type:"+ p.type + ", SETNAME:" + p.SETNAME);
    }
}

/**
*   打点的坐标
*/
var PrintSets = function(set) {
    if(set instanceof Array) {
        for(var i = 0, n = set.length; i < n; i++) {
            s = set[i];
            console.log("name: " + s.name + ", points:" + s.points.length);
            PrintPoint(s.points);
        }
    } else {
        console.log("name: " + set.name + ", points:" + set.points.length);
        PrintPoint(set.points);
    }
}

/**
*   随机名字
*/
var getName = function() {
    var str = String.fromCharCode(Math.floor( 65 + Math.random() * (25 + 1)))
            + String.fromCharCode(Math.floor( 65 + Math.random() * (25 + 1)))
            + String.fromCharCode(Math.floor( 65 + Math.random() * (25 + 1)))
            + String.fromCharCode(Math.floor( 65 + Math.random() * (25 + 1)));
    return str;
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
        p = CalNEPS(p);

        if(p.N_EPS.length >= _MinPts - 1) {
            var name = getName();//用时间戳来定义簇名
            var new_set = CreateSet(name);//新建个簇

            // UpdatePoint(p, "type", _CORE);//设置该点为核心对象
            AddPoint(p, new_set);//把核心点加入簇中
            UpdatePoint(p, "IN_SET", true);
            UpdatePoint(p,"SETNAME",name);
            for (var j = p.N_EPS.length - 1; j >= 0; j--) {//遍历改该点的领域集
                var N_P = p.N_EPS[j];
                if(N_P.IN_SET == true) {
                    continue;
                }
                N_P = CalNEPS(N_P);

                if(N_P.N_EPS.length >= _MinPts - 1) {//领域中的点也是核心对象，则并入到这个簇中
                    // UpdatePoint(N_P, "type", _CORE);//设置该点为核心对象
                    AddPoint(N_P, new_set);//把核心点加入簇中
                    UpdatePoint(N_P, "IN_SET", true);
                    UpdatePoint(N_P,"SETNAME",name);
                    for (var k = N_P.N_EPS.length - 1; k >= 0; k--) {
                        var N_N_P = N_P.N_EPS[k];
                        if(N_N_P.IN_SET == true) continue;//该点已经在簇中
                        UpdatePoint(N_N_P, "type", _BORDER);//设置该点为边界
                        AddPoint(N_N_P, new_set);//把该点加入簇中
                        UpdatePoint(N_N_P, "IN_SET", true);
                        UpdatePoint(N_N_P,"SETNAME",name);
                    };
                } else {
                    UpdatePoint(N_P, "type", _BORDER);//设置该点为边界对象
                    AddPoint(N_P, new_set);//把点加入簇中
                    UpdatePoint(N_P, "IN_SET", true);
                    UpdatePoint(N_P,"SETNAME", name);
                }
            };
        } else {
            p.N_EPS = [];
            UpdatePoint(p, "type", _NOISE_BORDER);//设置该点为边界或噪声对象
        }
    }
    //更新所有点的属性
    for (var i = point_set.length - 1; i >= 0; i--) {
        var p = point_set[i];
        var num = 0;
        for (var j = 0, n = point_set.length; j < n; j++) {
            var point = point_set[j];
            if(p.x == point.x && p.y == point.y) continue;
            var dist = CalDistance(point, p);
            if( dist <= _EPS ) {
               num++;
            }
        }
        if (num >= _MinPts - 1) {
            p.type = _CORE;//核心点
        } else {
            if (p.type == _NOISE_BORDER) {
                p.type = _NOISE;
            };
        }
    };
}
