/*


*/

var width = 960,
    height = 380,
    midW = width/2,
    midH = height/2;

var values = [{name: "Índice de Refracción 1", value: 1}, {name: "Índice de Refracción 2", value: 1.5}],
    angles = [0, 0, 0];

var svgSt = d3.select("#refrSVG"),
    slideGr = d3.select("#slides"),
    objGr = svgSt.append("g"),
    slides = slideGr.selectAll("div").data(values),
    texts,
    line1, line2, line3;

function init() {
    svgSt.attr("width", width);
    svgSt.attr("height", height);
    
    objGr.append("line")
        .attr("x1", 0)
        .attr("y1", midH)
        .attr("x2", width)
        .attr("y2", midH)
        .attr("stroke", "lightgray")
        .attr("stroke-width", 5);
    
    slides.enter().append("div")
        .append("span")
        .html(d => d.name)
            .append("input")
            .attr("type", "range")
            .attr("min", 0.1)
            .attr("max", 2.3)
            .attr("step", 0.05)
            .attr("value", d => "" + d.value)
            .on("change", function(d) {
                d.value = +this.value;
                texts.html(function(d, i) {return values[i].value;});
                getAngles();
            });
    
    line3 = objGr.append("line")
        .attr("stroke-linecap","round")
        .attr("x1", midW)
        .attr("y1", midH)
        .attr("x2", width)
        .attr("y2", 0)
        .attr("stroke", "rgba(255, 0, 0, 0.3)")
        .attr("stroke-width", 7);
    
    line1 = objGr.append("line").classed("moveable", true)
        .attr("stroke-linecap","round")
        .attr("stroke", "rgba(255, 0, 0, 0.6)")
        .attr("stroke-width", 7)
        .attr("x1", 0)
        .attr("y1", 0)
        .attr("x2", midW)
        .attr("y2", midH)
        .call(d3.drag()
            .on("drag", function() {
                let x = d3.event.x - midW,
                    y = d3.event.y - midH,
                    ang =  Math.atan2(x, y);
        
                angles[0] = (Math.atan2(x, y) + Math.PI);
                if(angles[0] > Math.PI) {angles[0] = 0;}
                if(angles[0] > Math.PI/2) {angles[0] = Math.PI/2;}
        
                d3.select(this)
                    .attr("x1", midW - midH * Math.tan(angles[0]));
        
                getAngles();
            })
        );
    
    line2 = objGr.append("line")
        .attr("stroke-linecap","round")
        .attr("x1", midW)
        .attr("y1", midH)
        .attr("x2", width)
        .attr("y2", height)
        .attr("stroke", "rgba(255, 0, 100, 0.3)")
        .attr("stroke-width", 7);
    
    texts = slideGr.selectAll("div").append("span").html(function(d, i) {return values[i].value;});
    
    line1.append("svg:title").text("Rayo Incidente");
    line2.append("svg:title").text("Rayo Refractado");
    line2.append("svg:title").text("Rayo Reflejado");
    
}

function getAngles() {
    angles[1] = (values[0].value / values[1].value) * angles[0];
    angles[2] = angles[0];

    if(angles[1] > Math.PI/2) {angles[1] = Math.PI/2;}

    line2.attr("x2", midW + midH * Math.tan(angles[1]));

    line3.attr("x2", midW + midH * Math.tan(angles[2]));
}







