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

function armPoint(square, n, i) {
	var theta = 90 * i / n;
	var alpha = 135 - theta;
	var p = new Point();
	p.length = sqrt(2) / 2 * square.width / sin(alpha);
	p.angle = theta;
	return square.topLeft + p;
}

function drawSquare(sideLength, pos0, vel0, spin0, numSections, angle) {
	var s = new Rectangle();
	s.size = [sideLength, sideLength];
	s.center = pos0;

	var square = new Path();
	for(var i = 0; i < numSections; i += 2) {
		square.add(s.topLeft);
		square.add(armPoint(s, numSections, i));
		square.add(s.bottomRight);
		square.add(armPoint(s, numSections, i+1));
		square.closed = true;
	}
	square.fillColor = 'black';
	square.rotate(angle);
	square.velocity = vel0;
	square.spin = spin0;
	return square;
}

function evolve(square) {
	square.position = square.position + square.velocity;
	square.rotate(square.spin);
	var x = square.position.x;
	var y = square.position.y;
	if (x < 0 || x > width) {
		square.velocity.x *= -1;
		square.spin = randomSpin();
	}
	if (y < 0 || y > height) {
		square.velocity.y *= -1;
		square.spin = randomSpin();
	}
}

function randomPoint() {
	return Point.random() * view.size;
}

function randomVelocity() {
	return new Point(2, 2) + Point.random() * 2;
}

function randomSpin() {
	return 0.1 + Math.random() * 0.3;
}

// function forEachPair(group, iterator) {
// 	for(var i = 0; i < group.children.length; i++) {
// 		for(var j = i+1; j < group.children.length; j++) {
// 			iterator(group.children[i], group.children[j], i, j, group);
// 		}
// 	}
// }

// function mergeMembers(intersections) {
// 	var merged = {};
// 	intersections.forEach(function (int) {
// 		Object.keys(int.members).forEach(function(m) {
// 			merged[m] = true;
// 		});
// 	});
// 	return merged;
// }

// function generateLayers(squares) {
// 	var layers = [];
// 	for(var layerIdx = 0; layerIdx < squares.length; layerIdx++) {
// 		var layer = new Layer();
// 		if (!layerIdx) {
// 			squares.forEach(function(square, i) {
// 				square.members = {};
// 				square.members[i] = true;
// 				layer.addChild(square);
// 			});

// 		} else {
// 			var prevLayer = layers[layerIdx - 1];
// 			if (layerIdx === 1) {
// 				forEachPair(squares, function(s1, s2) {
// 					if(s1.bounds.intersects(s2.bounds)) {
// 						var intPath = s1.intersect(s2);
// 						if (!intPath.area) return;
// 						intPath.members = mergeMembers([s1, s2]);
						
// 						layer.addChild(intPath);
// 					}
// 				})
// 			} else {

// 			}
// 			layer.moveAbove(prevLayer);
// 		}
// 		layer.fillColor = layerIdx % 2 ? 'white' : 'black';
// 	}
// }

var bigSquare = drawSquare(450, randomPoint(), randomVelocity(), randomSpin(), 9, 30);
var smallSquare = drawSquare(350, randomPoint(), randomVelocity(), randomSpin(), 7, 100);

var squares = [bigSquare, smallSquare];

var intersection = new Path();

var color = {
	gradient: {
		stops: ['blue', 'yellow', 'red']
	},
	origin: new Point(0, 0),
	destination: new Point(1, 1) * view.size
}

function onFrame(e) {
	if (e.count % 2) return;
	squares.forEach(evolve);
	intersection.remove();
	intersection = bigSquare.intersect(smallSquare);
	intersection.fillColor = 'white';
}
