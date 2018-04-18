/*

*/

var width = 960,
    height = 380,
    mid = height/2;

var svgSt = d3.select("#lensesSVG"),
    lens = {x: width/2, h: mid - 10},
    obj = {x: 100, h: 50},
    focus = {x: 100},
    img = {x: 0, h: 0};

var lensDom,
    objDom,
    imgDom,
    focusDom,
    invFocDom;

var dataRays = [[{x: 0, y: 0},{x: 0, y: 0},{x: 0, y: 0}],
                [{x: 0, y: 0},{x: 0, y: 0},{x: 0, y: 0}],
                [{x: 0, y: 0},{x: 0, y: 0},{x: 0, y: 0}]],
    ray1, ray2, ray3,
    getPath = d3.line()
        .x(d => d.x)
        .y(d => d.y)
        .curve(d3.curveLinear);
    

function init() {
    svgSt.attr("width", width);
    svgSt.attr("height", height);
    setDom();
}

function setDom() {
    ////
    ////
    
    ray1 = svgSt.append("path")
            .attr("stroke", "rgba(255, 255, 0, 0.5)")
            .attr("fill", "none")
            .attr("stroke-linecap","round")
            .attr("stroke-width", 5);
    
    ray2 = svgSt.append("path")
            .attr("stroke", "rgba(255, 255, 0, 0.5)")
            .attr("stroke-linecap","round")
            .attr("fill", "none")
            .attr("stroke-width", 5);
    
    ray3 = svgSt.append("path")
            .attr("stroke", "rgba(255, 255, 0, 0.5)")
            .attr("stroke-linecap","round")
            .attr("fill", "none")
            .attr("stroke-width", 5);
    
    ray1.append("svg:title").text("Rayo de Luz");
    ray2.append("svg:title").text("Rayo de Luz");
    ray3.append("svg:title").text("Rayo de Luz");
    
    ////
    ////
    
    svgSt.append("line")
        .attr("stroke", "gray")
        .attr("stroke-width", 2)
        .attr("x1", 0)
        .attr("y1", mid)
        .attr("x2", width)
        .attr("y2", mid);
    
    objDom = svgSt.append("line").classed("moveable", true)
        .attr("stroke", "#3e3939")
        .attr("stroke-width", 10)
        .attr("x1", obj.x)
        .attr("y1", mid)
        .attr("x2", obj.x)
        .attr("y2", mid - obj.h)
        .call(d3.drag()
            .on("drag", function() {
                obj.x = d3.event.x;
                obj.h = mid - d3.event.y;
                getImg(obj);
                d3.select(this).attr("x1", obj.x).attr("x2", obj.x).attr("y2", mid - obj.h);
            })
        );
    
    imgDom = svgSt.append("line")
        .attr("stroke", "rgba(128, 128, 128, 0.3)")
        .attr("stroke-width", 10)
        .attr("x1", img.x)
        .attr("y1", mid)
        .attr("x2", img.x)
        .attr("y2", mid - img.h);
    
    lensDom = svgSt.append("line").classed("moveable", true)
        .attr("stroke-linecap","round")
        .attr("stroke", "rgba(173, 216, 230, 0.7)")
        .attr("stroke-width", 15)
        .attr("x1", lens.x)
        .attr("y1", mid - lens.h)
        .attr("x2", lens.x)
        .attr("y2", mid + lens.h)
        .call(d3.drag()
            .on("drag", function() {
                lens.x = d3.event.x;
                getImg(lens);
                d3.select(this).attr("x1", lens.x).attr("x2", lens.x);
            })
        );
    
    focusDom = svgSt.append("circle").classed("moveable", true)
        .attr("fill", "rgba(173, 216, 230, 0.7)")
        .attr("r", 7)
        .attr("cx", focus.x)
        .attr("cy", mid)
        .call(d3.drag()
            .on("drag", function() {
                focus.x = d3.event.x;
                getImg(focus);
                d3.select(this).attr("cx", focus.x);
            })     
        );
    
    invFocDom = svgSt.append("circle")
        .attr("fill", "rgba(104, 101, 186, 0.7)")
        .attr("r", 7)
        .attr("cx", 2 * lens.x - focus.x)
        .attr("cy", mid);
    
    imgDom.append("title").text("Imagen");
    invFocDom.append("svg:title").text("Foco imagen");
    objDom.append("svg:title").text("Objeto");
    lensDom.append("svg:title").text("Lente");
    focusDom.append("svg:title").text("Foco objeto");
}

function getImg(item) {
    if(item.x < 0) {
        item.x = 0;
    } else if(item.x > width) {
        item.x = width;
    }
    
    let s = obj.x - lens.x;
    // -1/f = 1/s' - 1/s
    // 1/s' = 1/s - 1/f
    // s' = 1/(1/s - 1/f), s' = img.x - lens.x
    // img.x = 1/(1/s - 1/f) + lens.x
    // Al = y'/y = s'/s
    // y' = (img.x - lens.x) * (mid - obj.h) / (obj.x - lens.x)
    img.x = 1/(1/s - 1/(focus.x - lens.x)) + lens.x;
    img.h = obj.h * (img.x - lens.x) / s;
    
    imgDom.attr("x1", img.x)
        .attr("x2", img.x)
        .attr("y2", mid - img.h);
    
    invFocDom.attr("cx", 2 * lens.x - focus.x);
    ////
    getRays();
}

function getRays() {
    dataRays[0][0].x = obj.x;
    dataRays[0][0].y = mid - obj.h;
    dataRays[1][0].x = obj.x;
    dataRays[1][0].y = mid - obj.h;
    dataRays[2][0].x = obj.x;
    dataRays[2][0].y = mid - obj.h;
    
    dataRays[0][1].x = lens.x;  // Direct -> lens center
    dataRays[0][1].y = mid;
    dataRays[1][1].x = lens.x;  // First Parallel -> F' (invFocus)
    dataRays[1][1].y = mid - obj.h;
    dataRays[2][1].x = lens.x;  // F (Focus) -> Then Parallel
    dataRays[2][1].y = mid - img.h;
    
    dataRays[0][2].x = contX(obj.x, mid - obj.h, lens.x, mid, getY());
    dataRays[0][2].y = getY();
    dataRays[1][2].x = contX(lens.x, mid - obj.h, 2 * lens.x - focus.x, mid, getY());
    dataRays[1][2].y = getY();
    dataRays[2][2].x = getX();
    dataRays[2][2].y = mid - img.h;
    
    ray1.attr("d", getPath(dataRays[0]));
    ray2.attr("d", getPath(dataRays[1]));
    ray3.attr("d", getPath(dataRays[2]));
}
    
function getY() {
    if(img.h < 0) {
        return height;
    } else {
        return 0;
    }
}

function getX() {
    if(img.x - lens.x > 0) {
        return width;
    } else {
        return 0;
    }
}

function contX(p1x, p1y, p2x, p2y, p3y) {
    // v = (p2x - p1x, p2y - p2x)
    // w = q * v
    // wx = q * vx
    // wy = q * vy = p3y - p1y
    // q = (p3y - p1y)/ vy
    let v = {x: p2x - p1x, y: p2y - p1y},
        q = (p3y - p1y) / v.y,
        w = {x: q * v.x, y: p3y - p1y};
    
    return p1x + w.x;
}












