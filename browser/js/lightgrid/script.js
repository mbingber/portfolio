$(document).ready(function() {
    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000 );

    var renderer = new THREE.WebGLRenderer();
    renderer.setSize( window.innerWidth, window.innerHeight );
    $('#main')[0].appendChild( renderer.domElement);
    $(renderer.domElement).addClass('torusCanvas');

    var controls = new THREE.OrbitControls(camera, renderer.domElement);

    var sphereGeom = new THREE.SphereGeometry(0.1, 10, 10);
    var material = new THREE.MeshBasicMaterial({color: 0x0000ff});
    var L = 12;

    var lights = [];

    for(var x = -L/2; x < L/2; x++) {
        var square = [];
        for(var y = -L/2; y < L/2; y++) {
            var line = [];
            for(var z = -L/2; z < L/2; z++) {
                var sphere = new THREE.Mesh( sphereGeom.clone(), material.clone() );
                sphere.position.copy(new THREE.Vector3(x, y, z));
                scene.add(sphere);
                line.push(sphere);
            }
            square.push(line);
        }
        lights.push(square);
    }


    camera.position.copy(new THREE.Vector3(10,10,10));
    camera.lookAt(new THREE.Vector3(0,0,0));
    var wave = wavefunction(L, 8, 2);
    $(document).on('keypress', function() {
        wave = wavefunction(L, 8, 2);
    })
    var count = 0;
  function animate() {
        requestAnimationFrame( animate );
    controls.update();
    if(!(count%5)) {
        lights.forEach(function(square, i) {
            square.forEach(function(line, j) {
                line.forEach(function(light, k) {
                    light.material.color.setHSL(0.7, 1, wave(light.position, count));
                })
            })
        })
    }
        count++;
    render();
  }

  function render() {
        renderer.render( scene, camera );
  }

  animate();

});
