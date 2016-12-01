var sin = Math.sin;
var cos = Math.cos;
var tan = Math.tan;
var sinh = Math.sinh;
var cosh = Math.cosh;
var pi = Math.PI;

function VectorSph(r, theta, phi) {
  var x = r*cos(phi)*sin(theta);
  var y = r*sin(phi)*sin(theta);
  var z = r*cos(theta);
  return new THREE.Vector3(x,y,z);
}

function pixelAt(x, y, imageData) {
  var start = 4 * (y * imageData.width + x)
  return {
    r: imageData.data[start],
    g: imageData.data[start + 1],
    b: imageData.data[start + 2],
    a: imageData.data[start + 3]
  }
}

function average(pixels) {
  var total = pixels.reduce(function(t, pixel) {
    t.r += pixel.r;
    t.g += pixel.g;
    t.b += pixel.b;
    t.a += pixel.a;
    return t;
  }, {r: 0, g: 0, b: 0, a: 0})
  return {
    r: Math.round(total.r / pixels.length),
    g: Math.round(total.g / pixels.length),
    b: Math.round(total.b / pixels.length),
    a: Math.round(total.a / pixels.length)
  }
}

function reduceImage(imageData, targetPixels) {
  var numPixels = imageData.width * imageData.height
  var pixelsPerSquare = numPixels / targetPixels
  var s = Math.round(Math.sqrt(pixelsPerSquare))
  var result = []
  for(var y = 0; y < imageData.height - s; y += s) {
    var row = []
    for(var x = 0; x < imageData.width - s; x += s) {
      var square = []
      for(var i = 0; i < s; i++) {
        for(var j = 0; j < s; j++) {
          var pixel = pixelAt(x + i, y + j, imageData)
          square.push(pixel)
        }
      }
      var averaged = average(square)
      // console.log(x, y, averaged)
      row.push(averaged)
    }
    result.push(row)
  }
  return result
}

// function draw(ctx, reducedImage) {
//   var rows = reducedImage.length
//   var cols = reducedImage[0].length
//   var width, height
//   ctx.canvas.width = width = window.innerWidth
//   ctx.canvas.height = height = window.innerHeight
//   var spacing
//   if(width / height > cols / rows) {
//     spacing = height / rows
//   } else spacing = width / cols
//   reducedImage.forEach(function(row, i) {
//     row.forEach(function(pixel, j) {
//       ctx.fillStyle = `rgba(${pixel.r},${pixel.g},${pixel.b},${pixel.a})`
//       ctx.beginPath()
//       ctx.arc(spacing*j, spacing*i, 0.4*spacing, 0, 2*Math.PI)
//       ctx.fill()
//     })
//   })
// }

function draw3D(reducedImage) {
  var imageHeight = reducedImage.length
  var imageWidth = reducedImage[0].length
  console.log(imageHeight, imageWidth)

  var scene = new THREE.Scene()
  var renderer = new THREE.WebGLRenderer({ alpha: true });
  renderer.setSize( window.innerWidth, window.innerHeight );
  $(renderer.domElement).addClass('imageCanvas');
  $('#main')[0].appendChild( renderer.domElement );

  var aspectRatio = window.innerWidth / window.innerHeight
  var viewSize = 1.5*Math.max(imageHeight, imageWidth)
  var camera = new THREE.OrthographicCamera( 
    -aspectRatio*viewSize / 2, aspectRatio*viewSize / 2,
    viewSize / 2, -viewSize / 2,
    1, viewSize 
  );

  var numPixels = imageHeight * imageWidth
  var positions = new Float32Array(numPixels * 3)
  var colors = new Float32Array(numPixels * 3)

  var pointSize = 1.5
  var spacing = 1
  var counter = 0
  var scale = 0.7
  var xLength = imageWidth * spacing
  var yLength = imageHeight * spacing
  var xOffset = Math.round(xLength / 2)
  var yOffset = Math.round(yLength / 2)
  reducedImage.forEach(function(row, yPos) {
    row.forEach(function(pixel, xPos) {
      var z = scale*((pixel.r + pixel.g + pixel.b) / 3 / 255 - 0.5) * viewSize
      // var z = 0
      var x = spacing * xPos - xOffset
      var y = spacing * yPos - yOffset
      var position = new THREE.Vector3(x, y, z)
      position.toArray(positions, counter * 3)
      var color = new THREE.Color()
      color.setRGB(pixel.r / 255, pixel.g / 255, pixel.b / 255)
      color.toArray(colors, counter * 3)
      counter++
    })
  })

  var geometry = new THREE.BufferGeometry()
  geometry.addAttribute('position', new THREE.BufferAttribute(positions, 3))
  geometry.vertexColors = colors
  geometry.addAttribute('color', new THREE.BufferAttribute(colors, 3))

  var material = new THREE.PointsMaterial({
    vertexColors: THREE.VertexColors,
    size: pointSize,
    sizeAttenuation: false
  })

  var particles = new THREE.Points(geometry, material)
  scene.add(particles)

  var cameraR = -viewSize / 2
  var thetaOffset = pi / 6
  var phiOffset = pi / 8
  // camera.position.copy(VectorSph(cameraR, thetaOffset, phiOffset))
  camera.position.copy(new THREE.Vector3(0, 0, -viewSize / 2))
  camera.lookAt(new THREE.Vector3(0, 0, 0))
  camera.up = new THREE.Vector3(0, -1, 0)

  var controls = new THREE.OrbitControls( camera, renderer.domElement );
  var clock = new THREE.Clock(true)

  function easing(amplitude, period, time) {
    return amplitude * (1 + cos(2*pi / period * time)) / 2
  }

  // function rippleDisplacement(x, y, xCenter, yCenter, timeElapsed, params) {
  //   var r = Math.sqrt((x - xCenter)*(x - xCenter) + (y - yCenter)*(y - yCenter))
  //   var phase = params.k*r - params.omega*timeElapsed

  //   // var sine = sin(phase)
  //   // return phase < 0 ? params.A * sine*sine / (phase*phase) : 0
  //   return params.A * cos(phase) / (Math.pow(params.k * r, 2) + 1 + params.omega * timeElapsed)
  // }


  // var count = 0
  var time

  // $(document).on('keypress', function() {
  //   waves.push({
  //     start: clock.getElapsedTime(),
  //     center: {
  //       x: (Math.random() - 0.5) * xLength,
  //       y: (Math.random() - 0.5) * yLength
  //     }
  //   })
  // })

  // var waveParams = {
  //   A: 200,
  //   k: 2*pi / 100,
  //   omega: 2*pi / 2
  // }

  var waves = []

  function animate() {
    requestAnimationFrame( animate );
    // time = clock.getElapsedTime()
    // if(waves.length) {
    //   var newPositions = positions.map((coord, i) => {
    //     if (i % 3 === 2) {
    //       var x = positions[i-2]
    //       var y = positions[i-1]
    //       return waves.reduce((displacement, wave) => {
    //         return displacement + rippleDisplacement(x, y, wave.center.x, wave.center.y, time - wave.start, waveParams)
    //       }, coord)
    //     } else return coord
    //   })
    //   geometry.addAttribute('position', new THREE.BufferAttribute(newPositions, 3))
    // }
    // var newPositions = positions.map((coord, i) => {
    //   if(i % 3 === 2) {
    //     var x = positions[i-2]
    //     var y = positions[i-1]
    //     // return coord + 10*(Math.random() - 0.5)
    //     return (coord + 0.5*viewSize) * (1 + 0.3*cos(time * 2 * pi / 5) ) / 2 - 0.5*viewSize
    //   } else return coord
    // })
    // geometry.addAttribute('position', new THREE.BufferAttribute(newPositions, 3))

    // var theta = easing(thetaOffset, 10, time)
    // var phi = easing(phiOffset, 10, time)
    // camera.position.copy(VectorSph(cameraR, theta, pi/10))
    controls.update();
    render();
    // count++;
  }

  function render() {
    renderer.render( scene, camera );
  }

  animate();
}

$(document).ready(function() {
  var hiddenCanvas = document.createElement('canvas')
  var hiddenCtx = hiddenCanvas.getContext('2d')
  // var canvas = document.getElementById('imageCanvas')
  // var ctx = canvas.getContext('2d')

  var img = new Image()
  img.onload = function() {
    hiddenCtx.canvas.width = this.width
    hiddenCtx.canvas.height = this.height
    hiddenCtx.drawImage(img, 0, 0)
    var imageData = hiddenCtx.getImageData(0, 0, this.width, this.height)
    var reducedImage = reduceImage(imageData, 100000)
    draw3D(reducedImage)
  }

  img.src = "/deenas_painting.jpg"

})