/*

*/

var width = 960,
    height = 150,
    radius = 10,
    svgSt = d3.select("#svg_module"),
    points = [{x: 100, y:100}, {x:50, y:50}],
    line = svgSt.append("line"),
    pointsG = svgSt.append("g"),
    dist, p1, p2;

function init() {
    dist = d3.select("#dist");
    p1 = d3.select("#p1");
    p2 = d3.select("#p2");
    setElements();
}

function setElements() {
    svgSt.attr("width", width)
        .attr("height", height);
    
    line.attr("stroke", "dimgray")
        .attr("stroke-width", 5)
        .attr("x1", points[0].x)
        .attr("y1", points[0].y)
        .attr("x2", points[1].x)
        .attr("y2", points[1].y);
    
    pointsG.selectAll("circle")
        .data(points)
        .enter()
        .append("circle")
            .attr("stroke", "dimgray")
            .attr("stroke-width", 5)
            .attr("fill", "white")
            .attr("cx", d => d.x)
            .attr("cy", d => d.y)
            .attr("r", radius)
            .call(d3.drag()
                .on("drag", dragmove)
            );
    
    function dragmove(e) {
        d3.select(this)
            .attr("cx", function(d) {
                if(d3.event.x < radius) {d.x = radius;}
                else if(d3.event.x > width - radius) {d.x = width - radius;}
                else {d.x = d3.event.x;}
                return d.x;
            })
            .attr("cy", function(d) {
                if(d3.event.y < radius) {d.y = radius;}
                else if(d3.event.y > height - radius) {d.y = height - radius;}
                else {d.y = d3.event.y;}
                return d.y;
            });
        
        line.attr("x1", points[0].x)
            .attr("y1", points[0].y)
            .attr("x2", points[1].x)
            .attr("y2", points[1].y);
        
        dist.html("Distancia: " + Math.sqrt((points[0].x - points[1].x)**2 + (points[0].y - points[1].y)**2));
        p1.html("X1: " + Math.round(points[0].x) + " Y1: " + Math.round(points[0].y));
        p2.html("X2: " + Math.round(points[1].x) + " Y2: " + Math.round(points[1].y));
    }
}


