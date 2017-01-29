/*
  Utility
*/

var PI = Math.PI;
function cos(degree) {
  return Math.cos(degree * PI / 180);
}
function sin(degree) {
  return Math.sin(degree * PI / 180);
}
var sqrt = Math.sqrt.bind(Math);

var height = view.size.height;
var width = view.size.width;

/*
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
*/

function weightedMidpoint(points, a) {
  return new Point(
    points[0].x + a * (points[1].x - points[0].x),
    points[0].y + a * (points[1].y - points[0].y)
  );
}

function nestedPolygon(vertices, a) {
  return vertices.map(function(point, i) {
    var nextPoint = vertices[(i + 1) % vertices.length];
    return weightedMidpoint([point, nextPoint], a);
  });
}

function drawWhirl(points, color) {
  var poly = new Path();
  points.forEach(function(point) {
    poly.add(point);
  });
  poly.closed = true;
  poly.strokeColor = color;
  return poly;
}

function makePolygon(radius, numSides) {
  var center = view.center;
  var polygon = [];
  for(var i = 0; i < numSides; i++) {
    var angled = new Point();
    angled.length = radius;
    angled.angle = i * 360 / numSides;
    polygon.push(center + angled);
  }
  return polygon;
}

// var sideLength = 400;
// var topLeft = new Point(100, 100);

// var square = [
//   topLeft,
//   topLeft + new Point(sideLength, 0),
//   topLeft + new Point(sideLength, sideLength),
//   topLeft + new Point(0, sideLength)
// ];

function main(a, polygon) {
  var numPolys = 50;
  for(var i = 0; i < numPolys; i++) {
    var color = new Color({
      // hue: 360 * i / numPolys,
      // saturation: 0.8,
      // brightness: 0.75
      hue: 240,
      saturation: 1 - 0.7 * i / numPolys,
      brightness: 0.8
    });
    drawWhirl(polygon, color);
    polygon = nestedPolygon(polygon, a);
  }
}

function getA(count) {
  var period = 800;
  return 0.05 * sin(360 / period * count) + 0.07;
  // return 0.3;
}

var shape = makePolygon(300, 5);

function onFrame(e) {
  if (e.count % 3) return;
  project.clear();
  main(getA(e.count), shape);
  
}






