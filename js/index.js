var scene = new THREE.Scene();
var lighterScene = new THREE.Scene()
var lighterLight = new THREE.AmbientLight(0xffffff, 0.2)
lighterScene.add(lighterLight)
scene.background = new THREE.Color('#404040');
lighterScene.background = new THREE.Color('#404040');
var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);

var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
renderer.shadowMapEnabled = true;
renderer.shadowMapType = THREE.PCFSoftShadowMap;
renderer.autoClear = false;

var backgroundMusic = new buzz.sound('media/Jingle_Bells_Jazzy', {
  formats: ['mp3'],
  loop: true
});

function playMessage() {
  document.getElementById('speechBubble').style.display = 'block';
}
addNote()
//dat.gui:
/*
var Controls = function() {
    this.roomlight = 0
	};

	var control = new Controls(),
		gui = new dat.GUI();
    
    gui.add(control, 'roomlight', 0, 100).name('Room Lighting')
*/
//Create elements here:
function deg(i) {
  return i * Math.PI / 180
}
function rotateAround(point, center, angle) {
  angle = (angle) * (Math.PI / 180); // Convert to radians
  var rotatedX = Math.cos(angle) * (point.x - center.x) - Math.sin(angle) * (point.y - center.y) + center.x;
  var rotatedY = Math.sin(angle) * (point.x - center.x) + Math.cos(angle) * (point.y - center.y) + center.y;
  return { x: rotatedX, y: rotatedY }
}
//prisim geometry
PrismGeometry = function (vertices, height) {

  var Shape = new THREE.Shape();

  (function f(ctx) {

    ctx.moveTo(vertices[0].x, vertices[0].y);
    for (var i = 1; i < vertices.length; i++) {
      ctx.lineTo(vertices[i].x, vertices[i].y);
    }
    ctx.lineTo(vertices[0].x, vertices[0].y);

  })(Shape);

  var settings = {};
  settings.amount = height;
  settings.bevelEnabled = false;
  THREE.ExtrudeGeometry.call(this, Shape, settings);

};

PrismGeometry.prototype = Object.create(THREE.ExtrudeGeometry.prototype);

var oControls = new THREE.OrbitControls(camera, renderer.domElement);
function RGB(r, g, b) {
  return 'rgb(' + r + ',' + g + ',' + b + ')'
}
function randint(min, max) {
  return Math.floor(Math.random() * max) + min
}
function rotateAround(point, center, angle) {
  angle = (angle) * (Math.PI / 180); // Convert to radians
  var rotatedX = Math.cos(angle) * (point.x - center.x) - Math.sin(angle) * (point.y - center.y) + center.x;
  var rotatedY = Math.sin(angle) * (point.x - center.x) + Math.cos(angle) * (point.y - center.y) + center.y;
  return { x: rotatedX, y: rotatedY }
}

var walls = []
var wallcolor = 'white'
function newWall(x, y, z, sx, sy, sz, sceneC) {
  gr = {}
  gr.geometry = new THREE.BoxGeometry(sx, sy, sz);
  gr.material = new THREE.MeshPhongMaterial({ color: wallcolor });
  gr.mesh = new THREE.Mesh(gr.geometry, gr.material);
  if (sceneC == 'lighter') {
    lighterScene.add(gr.mesh)
  } else {
    scene.add(gr.mesh);
  }
  gr.mesh.position.set(x, y, z)
  gr.mesh.receiveShadow = true;
  gr.mesh.castShadow = true;
  return gr
}
function newPrisim(points, height, position, sceneC) {
  gr = {}
  gr.geometry = new PrismGeometry(points, height);

  gr.material = new THREE.MeshPhongMaterial({ color: wallcolor });

  gr.mesh = new THREE.Mesh(gr.geometry, gr.material);
  gr.mesh.rotation.y = -Math.PI / 2;
  if (sceneC == 'lighter') {
    lighterScene.add(gr.mesh)
  } else {
    scene.add(gr.mesh);
  }
  gr.mesh.position.set(position.x, position.y, position.z)
  return gr
}
var roomsize = 200
var roomoffset = {}
roomoffset.x = 60
roomoffset.z = 65
walls.push(newWall(roomoffset.x, 0, roomoffset.z,
  roomsize, 1, roomsize))

walls.push(newWall(roomoffset.x, roomsize / 4, roomoffset.z + (roomsize / 2),
  roomsize, roomsize, 1))

walls.push(newWall(roomoffset.x, roomsize / 4, roomoffset.z - (roomsize / 2),
  roomsize, roomsize, 1))

walls.push(newWall(roomoffset.x + (roomsize / 2), roomsize / 4, roomoffset.z,
  1, roomsize, roomsize))
//last wall with window:
walls.push(newWall(roomoffset.x - (roomsize / 2), -10, roomoffset.z,
  1, roomsize / 2, roomsize))
walls.push(newWall(roomoffset.x - (roomsize / 2), roomsize / 2 + 10, roomoffset.z,
  1, roomsize / 2, roomsize))
walls.push(newWall(roomoffset.x - (roomsize / 2), roomsize / 4, roomoffset.z + (roomsize / 2) - 20,
  1, roomsize, roomsize))
walls.push(newWall(roomoffset.x - (roomsize / 2), roomsize / 4, roomoffset.z - (roomsize / 1.5) - 20,
  1, roomsize, roomsize))
//window panes:
walls.push(newWall(roomoffset.x - (roomsize / 2), 0, 28,
  1, 200, 1))
walls.push(newWall(roomoffset.x - (roomsize / 2), 50, 0,
  1, 1, 100))
//fireplace:
wallcolor = 'brown'
walls.push(newWall(roomoffset.x - (roomsize / 2) + 10, 0, 50,
  20, 50, 10))
walls.push(newWall(roomoffset.x - (roomsize / 2) + 10, 0, 80,
  20, 50, 10))
walls.push(newWall(roomoffset.x - (roomsize / 2) + 10, roomsize, 65,
  20, roomsize + (65 * 2), 10))
//adding prisim:
var A = new THREE.Vector2(20, -10);
var B = new THREE.Vector2(-20, -10);
var C = new THREE.Vector2(-7.5, 10);
var D = new THREE.Vector2(7.5, 10);
var position = { x: roomoffset.x - (roomsize / 2) + 20, y: 35, z: 65 }
walls.push(newPrisim([A, B, C, D], 20, position))
//lighting and fog:
var lightbulb = new THREE.SpotLight('white', 1, 200, 1.5, 0.05);
lightbulb.position.set(roomoffset.x, roomsize / 2, roomoffset.z);
scene.add(lightbulb);
lightbulb.intensity = 0
//scene.fog = new THREE.Fog(0xF4F4F6, roomsize + 100, roomsize + 200);
scene.add(new THREE.AmbientLight(0xffffff, 0.05))
var nlc = 0 //next light change
var firelight;
firelight = new THREE.PointLight(0xffff00, 1, 20);
firelight.position.set(roomoffset.x - (roomsize / 2) + 10, 10, 65)
scene.add(firelight);
var light = new THREE.SpotLight('yellow', 1, 200, 1.5, 0.05);
var spotTarget = new THREE.Object3D();
scene.add(spotTarget)
spotTarget.position.set(0, 0, 65);
light.target = spotTarget;
lightbulb.target = spotTarget
light.position.set(roomoffset.x - (roomsize / 2) + 20, 10, 65)
scene.add(light);
function lightShadow(l) {
  l.castShadow = true;
  l.shadowCameraVisible = true;

  l.shadowMapWidth = 5000;
  l.shadowMapHeight = 5000;

  var d = 500;

  l.shadowCameraLeft = -d;
  l.shadowCameraRight = d;
  l.shadowCameraTop = d;
  l.shadowCameraBottom = -d;

  l.shadowCameraFar = 10000;
  l.shadowDarkness = 1;
  return l
}
light = lightShadow(light)
lightbulb = lightShadow(lightbulb)
function newFire() {
  gr = {}
  gr.x = randint(-10, 15) + roomoffset.x - (roomsize / 2) + 10
  gr.y = 0
  gr.z = randint(-4, 9) + 65
  gr.size = 7
  //gr.geometry = new THREE.SphereGeometry( gr.size, 2, 3 );
  gr.geometry = new THREE.CircleGeometry(gr.size, 3);
  gr.material = new THREE.MeshBasicMaterial({ color: RGB(255, randint(0, 255), 0), transparent: true, opacity: 0.9 });
  gr.sphere = new THREE.Mesh(gr.geometry, gr.material);
  scene.add(gr.sphere);
  gr.sphere.position.x = gr.x
  gr.sphere.position.y = gr.y
  gr.sphere.position.z = gr.z
  gr.sphere.rotation.y = deg(90)
  gr.sphere.rotation.x = deg(90)
  gr.scaleD = -0.01
  return gr
}
var fire = []
for (var i = 0; i < 20; i++) {
  fire.push(newFire())
}

function newWood(rotation) {
  gr = {}
  gr.x = 3
  gr.y = 2
  gr.z = 0
  point = { x: gr.x, y: gr.z }
  center = { x: 0, y: 0 }
  r = rotateAround(point, center, rotation)
  gr.x = r.x
  gr.z = r.y
  gr.geometry = new THREE.CylinderGeometry(1.5, 1.5, 10, 7);
  gr.material = new THREE.MeshLambertMaterial({ color: '#651a1a' }); //or MeshBasicMaterial
  gr.cylinder = new THREE.Mesh(gr.geometry, gr.material);
  gr.cylinder.position.x = gr.x + roomoffset.x - (roomsize / 2) + 10
  gr.cylinder.position.y = gr.y
  gr.cylinder.position.z = gr.z + 65
  gr.cylinder.rotation.x = 0
  gr.cylinder.rotation.y = -deg(rotation)
  gr.cylinder.rotation.z = deg(90)
  scene.add(gr.cylinder);
  return gr
}
var wood = []
var woodCount = 10
for (var i = 0; i < woodCount; i++) {
  wood.push(newWood(i * (360 / woodCount)))
}

function newTree() {
  gr = {}
  gr.x = 0
  gr.y = 0
  gr.z = 0
  gr.size = 50
  gr.geometry = new THREE.CylinderGeometry(gr.size / 10, gr.size / 10, gr.size * 2, 6);
  gr.material = new THREE.MeshPhongMaterial({ color: 'brown' });
  gr.trunk = new THREE.Mesh(gr.geometry, gr.material);
  gr.trunk.position.x = gr.x
  //gr.trunk.position.y = gr.size / 2
  gr.trunk.position.z = gr.z

  gr.material = new THREE.MeshPhongMaterial({ color: 'green' });
  gr.leaves = []
  var size = 25
  for (var i = 0; i < 4; i++) {
    gr.geometry = new THREE.ConeGeometry(size, size * 2, 10);
    var leaf = new THREE.Mesh(gr.geometry, gr.material);
    leaf.position.x = gr.x
    leaf.position.y = 40 + (i * 10)
    leaf.position.z = gr.z
    leaf.castShadow = true;
    scene.add(leaf)
    gr.leaves.push(leaf)
    size -= 5
  }
  gr.trunk.castShadow = true;

  scene.add(gr.trunk);
  for (var i = 0; i < gr.leaves.length; i++) {
    leaf = gr.leaves[i]
    //alert(leaf.position.y)
  }
  return gr
}

var ornamentColors = ['lime', 'yellow', 'blue', 'white', 'red']
var ornaments = []
function newOrnament() {
  gr = {}
  gr.color = ornamentColors[randint(0, ornamentColors.length)]
  gr.geometry = new THREE.SphereGeometry(1, 6, 6);
  gr.material = new THREE.MeshBasicMaterial({ color: gr.color });
  gr.mesh = new THREE.Mesh(gr.geometry, gr.material);
  scene.add(gr.mesh);
  var cont = false
  var quitlength = 0
  while (cont == false) {
    quitlength += 1
    var ry = randint(0, 360)
    var y = randint(15, 60)
    var ny = 3
    gr.mesh.position.x = Math.abs((y / ny) - (25 + (10 / ny)))
    gr.mesh.position.z = 0
    point = { x: gr.mesh.position.x, y: gr.mesh.position.z }
    center = { x: 0, y: 0 }
    r = rotateAround(point, center, ry)
    gr.mesh.position.x = r.x
    gr.mesh.position.z = r.y
    gr.mesh.position.y = y
    var newCont = true
    for (var i = 0; i < ornaments.length; i++) {
      ornament = ornaments[i]
      if (ornament.mesh.position.distanceTo(gr.mesh.position) < 3) {
        newCont = false
      }
    }
    if (quitlength > 100) {
      cont = true
    } else {
      cont = newCont
    }
  }
  return gr
}
for (var i = 0; i < 500; i++) {
  ornaments.push(newOrnament())
}
var tree = newTree()

var presentColors = ['red', 'green', 'lime', 'blue', 'yellow']
var presents = []
function newPresent() {
  gr = {}
  var cont = false
  while (cont == false) {
    gr.color = presentColors[randint(0, presentColors.length)]
    gr.ribbonColor = presentColors[randint(0, presentColors.length)]
    if (gr.color != gr.ribbonColor) {
      cont = true
    }
  }
  gr.size = randint(5, 10)
  gr.mesh = new THREE.Object3D();//create an empty container
  //present box:
  gr.geometry = new THREE.BoxGeometry(gr.size, gr.size, gr.size);
  gr.material = new THREE.MeshPhongMaterial({ color: gr.color });
  gr.present = new THREE.Mesh(gr.geometry, gr.material);
  gr.present.castShadow = true
  gr.mesh.add(gr.present);
  //ribbons:
  gr.geometry = new THREE.BoxGeometry(1, gr.size + 2, gr.size + 2);
  gr.material = new THREE.MeshPhongMaterial({ color: gr.ribbonColor });
  gr.ribbon1 = new THREE.Mesh(gr.geometry, gr.material);
  gr.ribbon1.castShadow = true
  gr.mesh.add(gr.ribbon1);
  gr.geometry = new THREE.BoxGeometry(gr.size + 2, gr.size + 2, 1);
  gr.material = new THREE.MeshPhongMaterial({ color: gr.ribbonColor });
  gr.ribbon2 = new THREE.Mesh(gr.geometry, gr.material);
  gr.ribbon2.castShadow = true
  gr.mesh.add(gr.ribbon2);
  scene.add(gr.mesh)

  var cont = false
  var quitlength = 0
  while (cont == false) {
    quitlength += 1
    var x = randint(-30, 100)
    var z = randint(-30, 60)
    var y = gr.size / 2
    gr.mesh.position.x = x
    gr.mesh.position.z = z
    gr.mesh.position.y = y
    var newCont = true
    var dis = 0
    var dia = Math.sqrt(2)
    dis += (gr.size * dia)
    dis += 5
    center = new THREE.Vector3(0, gr.size / 2, 0)
    if (gr.mesh.position.distanceTo(center) < dis) {
      newCont = false
    }

    for (var i = 0; i < presents.length; i++) {
      present = presents[i]
      var dis = 0
      dis += (gr.size * dia) / 2
      dis += (present.size * dia) / 2
      if (present.mesh.position.distanceTo(gr.mesh.position) < dis) {
        newCont = false
      }
    }
    if (quitlength > 100) {
      cont = true
    } else {
      cont = newCont
    }
  }
  gr.mesh.rotation.y = deg(randint(0, 360))
  return gr
}
for (var i = 0; i < 20; i++) {
  presents.push(newPresent())
}

var stockingColors = ['green', 'red', 'white']
var stockings = []
function newStocking(z) {
  gr = {}
  gr.color = stockingColors[randint(0, stockingColors.length)]
  gr.mesh = new THREE.Object3D();//create an empty container
  //main part:
  var geometry = new THREE.BoxGeometry(10, 1, 5);
  var material = new THREE.MeshPhongMaterial({ color: gr.color });
  gr.top = new THREE.Mesh(geometry, material);
  gr.mesh.add(gr.top);
  //heel:
  var geometry = new THREE.CylinderGeometry(2.5, 2.5, 1, 10);
  var material = new THREE.MeshPhongMaterial({ color: gr.color });
  gr.heel = new THREE.Mesh(geometry, material);
  gr.heel.position.x = -5
  gr.mesh.add(gr.heel);
  //foot:
  var geometry = new THREE.BoxGeometry(5, 1, 5);
  var material = new THREE.MeshPhongMaterial({ color: gr.color });
  gr.foot = new THREE.Mesh(geometry, material);
  gr.foot.position.x = -5
  gr.foot.position.z = 2.5
  gr.mesh.add(gr.foot);
  //heel:
  var geometry = new THREE.CylinderGeometry(2.5, 2.5, 1, 10);
  var material = new THREE.MeshPhongMaterial({ color: gr.color });
  gr.toe = new THREE.Mesh(geometry, material);
  gr.toe.position.x = -5
  gr.toe.position.z = 5
  gr.mesh.add(gr.toe);
  lighterScene.add(gr.mesh)
  gr.mesh.rotation.z = deg(90)
  gr.mesh.rotation.x = deg(20)
  gr.mesh.position.x = roomoffset.x - (roomsize / 2) + 21
  gr.mesh.position.y = 25
  gr.mesh.position.z = z
  var scaleFactor = 0.8
  gr.mesh.scale.x = scaleFactor
  gr.mesh.scale.z = scaleFactor
  return gr
}
for (var i = 55; i < 80; i += 10) {
  stockings.push(newStocking(i))
}
function newSnow() {
  gr = {}
  gr.geometry = new THREE.SphereGeometry(1, 5, 5);
  gr.material = new THREE.MeshBasicMaterial({ color: 'white', transparent: true, opacity: 0.5 });
  gr.mesh = new THREE.Mesh(gr.geometry, gr.material);
  scene.add(gr.mesh);
  gr.mesh.position.x = -(roomsize / 2) - randint(10, 50)
  gr.mesh.position.y = roomsize / 2
  gr.mesh.position.z = roomoffset.z / 2 + randint(-100, 200) - 20
  gr.dy = randint(10, 50) / 100
  gr.dz = randint(-10, 20) / 100
  return gr
}
var snow = []
var nextSnow = 0
var geometry = new THREE.OctahedronGeometry(5, 0)
var material = new THREE.MeshBasicMaterial({ color: 'yellow' });
var star = new THREE.Mesh(geometry, material)
scene.add(star)
star.position.y = 78
var starlight;
//
starlight = new THREE.PointLight('yellow', 0.5, 50);
starlight.position.y = 78
scene.add(starlight);
//end of elements
camera.position.x = 130;
camera.position.y = 30
camera.position.z = roomoffset.z / 2;
point = { x: camera.position.x, y: camera.position.z }
center = { x: 0, y: roomoffset.z / 2 }
r = rotateAround(point, center, 45)
camera.position.x = r.x
camera.position.z = r.y
lookAt = new THREE.Vector3(0, 30, roomoffset.z / 2)
oControls.target.set(0, 30, roomoffset.z / 2);
oControls.enablePan = false;
oControls.maxPolarAngle = Math.PI * 0.55;
oControls.minAzimuthAngle = Math.PI * 0; // radians
oControls.maxAzimuthAngle = Math.PI * 0.65; // radians
oControls.minDistance = 10;
oControls.maxDistance = 130;
oControls.update()
//oControls.target.set(0, 10, 0);
camera.lookAt(lookAt)

var render = function () {
  requestAnimationFrame(render);
  mainloop()
  renderer.clear();
  renderer.render(scene, camera);
  renderer.render(lighterScene, camera);
};

function mainloop() {
  nextSnow -= 1
  if (nextSnow < 0) {
    snow.push(newSnow())
    nextSnow = 1
  }
  snow.push(newSnow())
  for (var i = 0; i < snow.length; i++) {
    isnow = snow[i]
    isnow.mesh.position.y -= isnow.dy
    isnow.mesh.position.z += isnow.dz
    if (isnow.mesh.position.y < 0) {
      scene.remove(isnow.mesh)
      snow.splice(i, 1)
    }
  }
  for (var i = 0; i < fire.length; i++) {
    ifire = fire[i]
    ifire.sphere.scale.x += ifire.scaleD
    if (ifire.sphere.scale.x > 2) {
      ifire.scaleD = -(randint(2, 15) / 1000)
    }
    if (ifire.sphere.scale.x < 1) {
      ifire.scaleD = randint(2, 15) / 1000
    }
  }
  nlc -= 1
  if (nlc < 1) {
    nlc = randint(2, 5)
    intensity = randint(5, 3) / 10
    light.intensity = intensity
    firelight.intensity = intensity * 3
    lighterLight.intensity = intensity
    //lightbulb.intensity = control.roomlight / 100
  }
  playMessage();
  // Music

  backgroundMusic.play().fadeIn().loop();
}
render();
window.addEventListener('resize', onWindowResize, false);

function onWindowResize() {

  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);

}