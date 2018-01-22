(function () {

    /*简单图标组件
    使用方法：
    var chart = new $J.Chart({
        id: 'chart',
        type: "line",// 包括line curve
        xAxis: {
            name: "日期",
            data: ["2:00", "3:00", "5:00", "8:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00"]
        },
        yAxis: [{
            name: "订单量",
            data: [50, 60, 80, 100, 90, 53, 64, 51, 80, 50],
        }]
    });

    TODO:
    //1、x轴小于3个值的问题
    //2、图像模糊问题
    3、字体问题
    4、换成曲线
    5、默认选中一个
    */

    //获取ratio
    function getRadio(context) {
        var devicePixelRatio = window.devicePixelRatio || 1;
        var backingStoreRatio = context.webkitBackingStorePixelRatio ||
            context.mozBackingStorePixelRatio ||
            context.msBackingStorePixelRatio ||
            context.oBackingStorePixelRatio ||
            context.backingStorePixelRatio || 1;
        var ratio = devicePixelRatio / backingStoreRatio;
        return ratio;
    }

    function log(msg) {
        if (console && console.log) {
            console.log(msg);
        }
    }

    /*
    *根据已知点获取第i个控制点的坐标
    *param ps	已知曲线将经过的坐标点
    *param i	第i个坐标点
    *param a,b	可以自定义的正数
    */
    function getCtrlPoint(ps, i, a, b) {
        if (!a || !b) {
            a = 0.25;
            b = 0.25;
        }
        //处理两种极端情形
        if (i < 1) {
            var pAx = ps[0].x + (ps[1].x - ps[0].x) * a;
            var pAy = ps[0].y + (ps[1].y - ps[0].y) * a;
        } else {
            var pAx = ps[i].x + (ps[i + 1].x - ps[i - 1].x) * a;
            var pAy = ps[i].y + (ps[i + 1].y - ps[i - 1].y) * a;
        }
        if (i > ps.length - 3) {
            var last = ps.length - 1
            var pBx = ps[last].x - (ps[last].x - ps[last - 1].x) * b;
            var pBy = ps[last].y - (ps[last].y - ps[last - 1].y) * b;
        } else {
            var pBx = ps[i + 1].x - (ps[i + 2].x - ps[i].x) * b;
            var pBy = ps[i + 1].y - (ps[i + 2].y - ps[i].y) * b;
        }
        return {
            pA: { x: pAx, y: pAy },
            pB: { x: pBx, y: pBy }
        }
    }

    var clock = new Image();
    clock.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAWCAYAAADEtGw7AAAAAXNSR0IArs4c6QAAAmlJREFUOBGdlc9LFVEUgJ1XWFFpiKYU6usHgZAkEWIpBEW0aBu0C4L6Q9pHUO3CdYi2aNEyiDBKKyiNwJUGLdQUQYOoiDd937wZuRM3NQ98c+45c+6ZO3PPuZM0bCJpmrYS0gXNeegq+kuSJEu5HVVJzEuyRvxDcBNOQguEiVewP8EwjPOQX+iNhaSd8AjmQfkKU/AWJvOxPmUBRsA3+rcQcBicVIPP8ACGoAmSnP3oQbgPc6BMQHc0Mzdc6StQDDwdDQycxPTDIriQZSgnx9EIvr4BrvhEML8Bexi+w9nQ7xjfMSgWNMrY/akLxgXwm/r6A4W/0PiegXK98IUa/ymYBVd/yXuVPMDd74Cn7PBE7gtVLTe+hc5izJwpxk/gINzSX+EJ1qklZV2OwHZljImL0EPOdlfcCdbpPEzDdsVVL0DWUDsZHACL38TRV8VfSAuruZIbO9DP+QzZHLSb+xNfEzSbOAWl0HWrfD2Umw8D92/G72Aw8LkXdnNq4jWw/3fBPoit+h7+GxC2bhX7NmTCavcy2APmWrMO22AarN/w6dmErV6YOwCW7EfoqPBtrAYPlDa4ttVEkbir+CzZGXK6iVn3XOQpHihz0Jc5/+PCnDNgg/jWl9enYtjSnlKK7Xl8/eYmA2KPgAmVx7C7NAVHFyxBDQzsLwVEDGJ64SU45w1UI2HZJzG5J5syC3fhHLjjmTgGN+oOGKN4sh0tYqKagG4YBQ8UxW//ASbhNbyH8Ccwhl39O9lGv6bzBHug9IBtakcZb50uwwz4a3pBFfxAlySaOIxgNe3Ynie2vt1pQ/kzrZcURkz+AE9aHbpB6IzSAAAAAElFTkSuQmCC";

    if (typeof Jelly === "undefined") {
        Jelly = {};
    }
    if (typeof Jelly.Chart === "undefined") {
        Jelly.Chart = {};
        $J = Jelly.Chart;
    }
    var screenWidth = document.documentElement.clientWidth;

    function isArray(obj) {
        return Object.prototype.toString.call(obj) === "[object Array]";
    }

    $J.Chart = function (opt) {
        log(opt);
        log(JSON.stringify(opt));
        if (!opt) return;
        //参数验证
        if (!opt.id || !opt.xAxis || !isArray(opt.yAxis)) return;
        if (!isArray(opt.xAxis.data)) return;
        if (opt.yAxis.length == 0) return;
        if (!isArray(opt.yAxis[0].data)) return;
        if (opt.yAxis.length == 2 && !isArray(opt.yAxis[1].data)) return;
        //上右下左
        if (!opt.marign) {
            opt.margin = [10, 15, 10, 10];
        }
        if (!opt.height || opt.height < 100) {
            //高度
            opt.height = 200;
        }
        if (opt.type !== "curve" && opt.type !== "line") {
            opt.type = "line";
        }
        //分组

        this.opt = opt;
        //决定高度 宽度 间隔xy
        var chartWidth = screenWidth - opt.margin[1] - opt.margin[3];
        //x轴起始偏移
        var xAxisStartOffset = 30;
        this.xAxisStartOffset = xAxisStartOffset;
        //x轴间距
        var xSpace = parseInt((chartWidth - xAxisStartOffset) / (opt.xAxis.data.length - 1));
        this.xSpace = xSpace;
        //y轴data最大值
        var maxData = 0;
        var minData = 0;
        var yAxis0 = opt.yAxis[0];
        //分组 用于决定y轴是几个数
        var group = {};
        for (var i = 0; i < yAxis0.data.length; i++) {
            group["key" + yAxis0.data[i]] = true;
            //找最小值
            if (i == 0) {
                minData = yAxis0.data[i];
            } else if (yAxis0.data[i] < minData) {
                minData = yAxis0.data[i];
            }
            //找最大值
            if (yAxis0.data[i] > maxData) maxData = yAxis0.data[i];
        }
        var groupCount = 0;
        for (var item in group) {
            groupCount++;
        }
        console.log("groupCount", groupCount);
        //y轴标签数 如果data是小于5的
        if (!opt.yAxisTagNum && groupCount > 4) {
            opt.yAxisTagNum = 4;
        } else {
            opt.yAxisTagNum = groupCount;
        }


        //值是否全部相等
        var allSame = maxData === minData;
        console.log("allsame", allSame);
        log("maxData", maxData, "minData", minData);

        //y轴起始偏移
        var yAxisStartOffset = 20;
        this.yAxisStartOffset = yAxisStartOffset;

        //y轴数值间距
        var ySpaceVal = parseInt((maxData - minData) / opt.yAxisTagNum);
        //y轴间距
        var ySpace = parseInt((opt.height - yAxisStartOffset) / (opt.yAxisTagNum + 1));
        //y轴划线次数
        var yCount = opt.yAxisTagNum;
        //如果y轴的值全部相等
        if (allSame) {
            yCount = 1;
            ySpaceVal = maxData;
            ySpace = parseInt((opt.height - yAxisStartOffset) / 2);
        }
        this.ySpace = ySpace;
        log(opt.height, yAxisStartOffset, opt.yAxisTagNum);

        var container = document.getElementById(opt.id);
        container.innerHTML = "";
        //必须在内部建立一个div，否则会导致 事件绑定问题
        var canvasWrap = document.createElement("div");
        container.appendChild(canvasWrap);

        var offsetTop = 0;
        var canvasBg = document.createElement("canvas");
        var ratio = getRadio(canvasBg);
        this.ratio = ratio;
        canvasBg.width = screenWidth * ratio;
        canvasBg.height = opt.height * ratio;
        //canvasBg.style.border = "1px solid red";
        //canvasWrap.appendChild(canvasBg);
        var ctxBg = canvasBg.getContext('2d');
        log("ratio", ratio);
        ctxBg.scale(ratio, ratio);
        var leftPoint = parseInt(opt.margin[3] + xAxisStartOffset);

        //处理垂直
        for (var i = 0; i < yCount; i++) {
            offsetTop += ySpace;
        }
        //加上最下面的间距
        offsetTop += ySpace;

        ctxBg.save();
        var leftOffset = leftPoint;
        ctxBg.fillStyle = "rgb(163,163,163)";
        ctxBg.font = "12px arial";
        //字体的偏移
        var fontOffset = 0;
        //画x轴数值
        for (var i = 0; i < opt.xAxis.data.length; i++) {
            fontOffset = opt.xAxis.data[i].length * 4;
            ctxBg.fillText(opt.xAxis.data[i], leftOffset - fontOffset, offsetTop + 18);
            leftOffset += xSpace;
        }
        ctxBg.restore();

        //画折线区域
        leftOffset = leftPoint;
        //顶点
        var points = [];
        this.points = points;
        for (var i = 0; i < opt.xAxis.data.length; i++) {
            var x = leftOffset;
            var y = allSame ? ySpace : getOffsetByYVal(yAxis0.data[i]);
            points.push({ x: x, y: y });
            leftOffset += xSpace;
        }
        log(points);

        function getOffsetByYVal(val) {
            return (1 - (val - minData) / (maxData - minData)) * (ySpace * opt.yAxisTagNum) + ySpace;
        }

        //1、找到y轴值数组 最多4个
        //2、根据折线算出y轴对应的高度
        ctxBg.save();
        ctxBg.beginPath();
        ctxBg.strokeStyle = "rgb(247,247,247)";
        ctxBg.fillStyle = "rgb(163,163,163)";
        ctxBg.font = "12px arial";
        var yInfo = [];
        var left = opt.margin[3];
        if (!allSame) {
            if (maxData - minData == 1) {
                yInfo = [
                    {
                        y: getOffsetByYVal(minData),
                        val: minData
                    },
                    {
                        y: getOffsetByYVal(maxData),
                        val: maxData
                    }
                ]
            } else if (maxData - minData == 2) {
                yInfo = [
                    {
                        y: getOffsetByYVal(minData),
                        val: minData
                    },
                    {
                        y: getOffsetByYVal(minData + 1),
                        val: minData + 1
                    },
                    {
                        y: getOffsetByYVal(maxData),
                        val: maxData
                    }
                ]
            } else {
                var space = (maxData - minData) / 3;
                console.log("space", space);
                yInfo = [
                    {
                        y: getOffsetByYVal(minData),
                        val: minData
                    },
                    {
                        y: getOffsetByYVal(minData + parseInt(space)),
                        val: minData + parseInt(space)
                    },
                    {
                        y: getOffsetByYVal(minData + parseInt(2 * space)),
                        val: minData + parseInt(2 * space)
                    },
                    {
                        y: getOffsetByYVal(maxData),
                        val: maxData
                    }
                ]
            }
            console.log("yInfo", yInfo);
            for (var i = 0; i < yInfo.length; i++) {
                ctxBg.fillText(yInfo[i].val + "", left, yInfo[i].y);
                ctxBg.moveTo(leftPoint - 0.5, yInfo[i].y - 0.5);
                ctxBg.lineTo(leftPoint - xAxisStartOffset + chartWidth - 0.5, yInfo[i].y - 0.5);
            }
        } else {
            ctxBg.fillText(maxData + "", left, ySpace);
        }
        ctxBg.stroke();
        ctxBg.restore();

        drawLine(ctxBg, points, allSame ? opt.height - yAxisStartOffset : offsetTop, opt.type);

        canvasWrap.addEventListener("touchstart", touchStart.call(this), false);
        canvasWrap.addEventListener("touchmove", touchMove.call(this), false);
        canvasWrap.addEventListener("touchend", touchEnd.call(this), false);

        //画pointer
        var canvasPoint = document.createElement("canvas");
        canvasPoint.width = screenWidth * ratio;
        canvasPoint.height = opt.height * ratio;
        canvasPoint.style.width = screenWidth + "px";
        canvasPoint.style.height = opt.height + "px";
        var ctxPoint = canvasPoint.getContext('2d');
        ctxPoint.drawImage(canvasBg, 0, 0);
        ctxPoint.scale(ratio, ratio);
        //canvasPoint.style.border = "1px solid red";
        canvasWrap.appendChild(canvasPoint);
        this.canvasBg = canvasBg;
        this.ctx = ctxPoint;
        return this;
    }

    //画线
    function drawLine(ctxBg, points, startY, type) {
        console.log("points", points, startY);
        //画折线区域
        ctxBg.save();
        ctxBg.beginPath();
        ctxBg.moveTo(points[0].x, startY);

        ctxBg.fillStyle = "rgba(255,58,58,.04)";
        //顶点
        this.points = points;

        ctxBg.save();
        //填充
        ctxBg.strokeStyle = "rgb(255,255,255)";
        //ctxBg.lineWidth = 2;
        for (var i = 0; i < points.length; i++) {
            if (type === "curve") {
                var ctrlP = getCtrlPoint(points, i - 1);
                ctxBg.bezierCurveTo(ctrlP.pA.x, ctrlP.pA.y, ctrlP.pB.x, ctrlP.pB.y, points[i].x, points[i].y);
            } else {
                ctxBg.lineTo(points[i].x, points[i].y);
            }
        }
        ctxBg.lineTo(points[points.length - 1].x, startY);
        ctxBg.fill();
        ctxBg.restore();

        //划线
        ctxBg.save();
        ctxBg.beginPath();
        ctxBg.strokeStyle = "rgb(255,58,58)";
        ctxBg.lineWidth = 2;
        for (var i = 0; i < points.length; i++) {
            if (type === "curve") {
                var ctrlP = getCtrlPoint(points, i - 1);
                ctxBg.bezierCurveTo(ctrlP.pA.x, ctrlP.pA.y, ctrlP.pB.x, ctrlP.pB.y, points[i].x, points[i].y);
            } else {
                ctxBg.lineTo(points[i].x, points[i].y);
            }
            console.log("xy", points[i].x, points[i].y);
        }
        ctxBg.stroke();
        ctxBg.restore();

        // ctxBg.lineTo(points[points.length - 1].x, startY);
        // ctxBg.fill();
        ctxBg.restore();
    }

    function touchStart() {
        var that = this;
        return function (e) {
            drawPointer(e.touches[0].clientX, that);
        }
    }

    function touchMove(e) {
        //每次移动
        var that = this;
        return function (e) {
            drawPointer(e.touches[0].clientX, that);
        }
    }

    function touchEnd(e) {
        var that = this;
        return function (e) {

        }
    }

    //设置标识
    function drawPointer(x, chart) {
        /*
        找到最近的x点
        如果已经画了则返回
        否则清除画布，重新画
        */
        //后一个大于前一个就算最近 xAxisStartOffset xSpace
        //最近的索引
        var selectedIndex = 0;
        var points = chart.points;
        //查找最近的x坐标
        var selectedX = points[0].x;
        var prevDiff = Math.abs(x - selectedX);
        for (var i = 1; i < points.length; i++) {
            if (Math.abs(x - points[i].x) > prevDiff) {
                break;
            } else {
                prevDiff = x - points[i].x;
                selectedX = points[i].x;
                selectedIndex++;
            }
        }
        if (chart.lastDrawIndex === selectedIndex) return;
        chart.lastDrawIndex = selectedIndex;

        log("selectedIndex", selectedIndex, selectedX);
        //竖线高度
        var selectedY = chart.opt.height - chart.yAxisStartOffset;
        var ctx = chart.ctx;
        ctx.clearRect(0, 0, screenWidth, chart.opt.height);
        //必须加上screenWidth,chart.opt.height  否则缩放有问题
        ctx.drawImage(chart.canvasBg, 0, 0, screenWidth, chart.opt.height);

        ctx.beginPath();
        ctx.save();
        ctx.strokeStyle = "rgb(255,58,58)";
        log(selectedX, selectedY);
        ctx.moveTo(selectedX + 0.5, 0);
        ctx.lineTo(selectedX + 0.5, selectedY);
        ctx.stroke();
        ctx.restore();
        //画圈
        var yVal = points[selectedIndex].y;
        ctx.save();
        ctx.beginPath();
        ctx.fillStyle = "rgb(255,58,58)";
        ctx.arc(selectedX + 0.5, yVal, 6, 0, 2 * Math.PI, true);
        ctx.fill();
        ctx.restore();

        ctx.save();
        ctx.beginPath();
        ctx.fillStyle = "rgb(255,255,255)";
        ctx.arc(selectedX + 0.5, yVal, 2.5, 0, 2 * Math.PI, true);
        ctx.fill();
        ctx.restore();

        var tipW = 80, tipH = 50, tipTop = 4, tipLeft = 0, tipOffset = 6;
        //判断画到左面还是右面
        var isLeft = true;
        if (selectedX > tipW + 20) {
            tipLeft = selectedX - tipW - tipOffset;
        } else {
            isLeft = false;
            tipLeft = selectedX + tipOffset;
        }

        ctx.save();
        ctx.beginPath();
        ctx.fillStyle = "rgb(255,58,58)";
        ctx.fillRect(tipLeft, tipTop, tipW, tipH);
        // if(isLeft){
        //     ctx.moveTo(tipLeft+tipW,tipTop+tipH);
        //     ctx.lineTo(tipLeft+tipW,tipTop+tipH+8);
        //     ctx.lineTo(tipLeft+tipW-6,tipTop+tipH);
        // }else{
        //     ctx.moveTo(tipLeft,tipTop+tipH);
        //     ctx.lineTo(tipLeft,tipTop+tipH+8);
        //     ctx.lineTo(tipLeft+6,tipTop+tipH);
        // }
        ctx.fill();
        ctx.restore();

        //写字
        var opt = chart.opt;
        var xData = opt.xAxis.data[selectedIndex];
        var yData = opt.yAxis[0].data[selectedIndex];
        var yName = opt.yAxis[0].name;
        ctx.save();
        ctx.font = "11px yahei";
        ctx.fillStyle = "rgb(255,255,255)";

        ctx.fillText(yName + ":" + yData, tipLeft + 5, tipTop + 20);
        ctx.drawImage(clock, tipLeft + 5, tipTop + 30, 11, 11);
        ctx.fillText(xData, tipLeft + 20, tipTop + 40);
        ctx.restore();
    }

    var moduleName = Jelly;
    if (typeof module !== 'undefined' && typeof exports === 'object') {
        module.exports = moduleName;
    } else if (typeof define === 'function' && (define.amd || define.cmd)) {
        define(function () { return moduleName; });
    }
})()

