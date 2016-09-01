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

function draw(ctx, reducedImage) {
  var rows = reducedImage.length
  var cols = reducedImage[0].length
  var width, height
  ctx.canvas.width = width = window.innerWidth
  ctx.canvas.height = height = window.innerHeight
  var spacing
  if(width / height > cols / rows) {
    spacing = height / rows
  } else spacing = width / cols
  reducedImage.forEach(function(row, i) {
    row.forEach(function(pixel, j) {
      ctx.fillStyle = `rgba(${pixel.r},${pixel.g},${pixel.b},${pixel.a})`
      ctx.beginPath()
      ctx.arc(spacing*j, spacing*i, 0.4*spacing, 0, 2*Math.PI)
      ctx.fill()
    })
  })
}

function draw3D(reducedImage, width, height) {
  var scene = new THREE.Scene()
  // var camera = new THREE.PerspectiveCamera( 20, window.innerWidth / window.innerHeight, 0.1, 1000 );
  var width = window.innerWidth
  var height = window.innerHeight
  var camera = new THREE.OrthographicCamera( 2*width / - 2, 2*width / 2, 2*height / 2, 2*height / - 2, 1, 4000 );

  var renderer = new THREE.WebGLRenderer({ alpha: true });
  renderer.setSize( window.innerWidth, window.innerHeight );
  $(renderer.domElement).addClass('imageCanvas');
  $('#main')[0].appendChild( renderer.domElement );
  
  var numPixels = reducedImage.length * reducedImage[0].length
  var positions = new Float32Array(numPixels * 3)
  var colors = new Float32Array(numPixels * 3)

  var pointSize = 3
  var spacing = 1
  var counter = 0
  var xOffset = reducedImage[0].length * spacing / 2
  var yOffset = reducedImage.length * spacing / 2
  reducedImage.forEach(function(row, y) {
    row.forEach(function(pixel, x) {
      var z = 2*(pixel.r + pixel.g + pixel.b)
      var position = new THREE.Vector3(spacing * x - xOffset, spacing * y - yOffset, z)
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
    size: pointSize
  })

  var particles = new THREE.Points(geometry, material)
  scene.add(particles)

  camera.position.copy(new THREE.Vector3(0, 0, -1000))
  camera.lookAt(new THREE.Vector3(0, 0, 0))
  camera.up = new THREE.Vector3(0, -1, 0)

  var controls = new THREE.OrbitControls( camera, renderer.domElement );

  function animate() {
    requestAnimationFrame( animate );
    controls.update();
    render();
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
    var reducedImage = reduceImage(imageData, 1500*1500)
    draw3D(reducedImage)
  }

  img.src = "/innerspeaker.jpg"

})