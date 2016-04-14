//creation buttons
var fullHeight = view.size.height;
var fullWidth = view.size.width;
var satR = 8;
var mode = 'planet';
var speedModulo = 1;

var planetRect = new Rectangle();
var satRect = new Rectangle();
planetRect.size = satRect.size = new Size(100, 100);
satRect.bottomRight = new Point(fullWidth - 30, fullHeight - 30);
planetRect.bottomRight = new Point(fullWidth - 30, fullHeight - 160);
var planetButton = new Path.Rectangle(planetRect, 8);
planetButton.strokeColor = 'green';
var satButton = new Path.Rectangle(satRect, 8);
satButton.strokeColor = 'red';
var fakePlanet = new Path.Circle({
    center: planetRect.center,
    radius: 40,
    strokeColor: 'orange'
});
var fakeSatellite = new Path.Circle({
    center: satRect.center,
    radius: satR,
    strokeColor: 'white'
});

//speed selector
var speedSelectors = [];
var numSpeeds = 10;
speedSelectors.chosen = numSpeeds - 1;
var biggest = 100;
var smallest = 10;

for(var i = 1; i <= numSpeeds; i++) {
    var speedRect = new Rectangle();
    var n = numSpeeds;
    speedRect.size = new Size(smallest + (biggest-smallest)*(i-1)*(i-1)/((n-1)*(n-1)), 12);
    var width = fullWidth - 80;
    var height = 30 + (numSpeeds - i)*12;
    speedRect.topCenter = new Point(width, height);
    speedButton = new Path.Rectangle(speedRect);
    speedButton.fillColor = new Color({
        hue: 180 + i/numSpeeds*180,
        saturation: 0.8,
        brightness: 0.8
    })
    if(i===numSpeeds) speedButton.selected = true;
    speedSelectors.push(speedButton);
}

//helpers

var satellites = [];
var planets = [];
var G = .05;

function placePlanet(position, radius) {
    var planet = new Path.Circle({
        center: position,
        radius: radius,
        strokeColor: 'orange'
    })
    planet.mass = Math.pow(radius, 3);
    planet.radius = radius;
    planets.push(planet);
    return planet;
}

function placeSatellite(position, velocity) {
    var satellite = new Path.Circle({
        center: position,
        radius: 8,
        strokeColor: 'white'
    });
    satellite.velocity = velocity;
    satellites.push(satellite);
    return satellite;
}

function acceleration(satellite, planet) {
    var r = planet.position - satellite.position;
    var magR = r.length;
    if(magR > planet.radius) return r * G * planet.mass / Math.pow(magR, 3);
    else return r * G * planet.mass / Math.pow(planet.radius, 3);
}

//interaction

var pos;
var vel;
var arrow;
var dummy;
var scale = .05;
var continueCreation;
var continueMove = false;
var indexToMove = null;

function onMouseDown(event) {
    for(var i = 0; i < speedSelectors.length; i++) {
        var button = speedSelectors[i];
        if (button.contains(event.point)) {
            speedSelectors[speedSelectors.chosen].selected = false;
            speedSelectors.chosen = i;
            button.selected = true;
            speedModulo = (i+1)/numSpeeds;
            continueCreation = false;
            return;
        }
    }

    if(mode === 'planet') {
        for(var i = 0; i < planets.length; i++) {
            if(planets[i].contains(event.point)) {
                continueCreation = false;
                continueMove = true;
                indexToMove = i;
                return;
            }
        }
    }

    if(planetRect.contains(event.point)) {
        mode = 'planet';
        planetButton.strokeColor = 'green';
        satButton.strokeColor = 'red';
        continueCreation = false;
    } else if (satRect.contains(event.point)) {
        mode = 'satellite';
        satButton.strokeColor = 'green';
        planetButton.strokeColor = 'red';
        continueCreation = false;
    } else {
        pos = event.point;
        if (mode === 'satellite') {
            arrow = new Path(pos);
            arrow.strokeColor = 'blue';
        } else if (mode === 'planet') {
            dummy = new Path.Circle({
                center: pos,
                radius: 0,
                strokeColor: 'orange'
            })
        }
        continueCreation = true;
    }
}

function onMouseDrag(event) {
    if(continueCreation) {
        if(mode === 'satellite') {
            arrow.removeSegment(1);
            arrow.addSegment(event.point);
        } else if (mode === 'planet') {
            newRadius = (event.point - pos).length;
            dummy.remove();
            dummy = new Path.Circle({
                center: pos,
                radius: newRadius,
                strokeColor: 'orange'
            })
        }
    } else if(continueMove) {
        planets[indexToMove].position += event.delta;
    }
}

function onMouseUp(event) {
    if(continueCreation) {
        if(mode === 'satellite') {
            vel = (event.point - pos)*scale;
            if (vel.length) placeSatellite(pos, vel);
            arrow.remove();
        } else if (mode === 'planet') {
            planetR = (event.point - pos).length;
            if (planetR) placePlanet(pos, planetR)
            dummy.remove();
        }
    } else if (continueMove) {
        continueMove = false;
        indexToMove = null;
    }
}

function onKeyDown(event) {
    if (event.character === ' ') {
        if(mode === 'planet') {
            mode = 'satellite';
            planetButton.strokeColor = 'red';
            satButton.strokeColor = 'green';
        } else if (mode === 'satellite') {
            mode = 'planet';
            planetButton.strokeColor = 'green';
            satButton.strokeColor = 'red';
        }
    }
    if (event.key === 's') {
        toggleStars();
    }
}

function onFrame(event) {
    satellites.forEach(function(satellite) {
        satellite.position += satellite.velocity*speedModulo;
        planets.forEach(function(planet) {
            satellite.velocity += acceleration(satellite, planet)*speedModulo;
        })
    })

}
