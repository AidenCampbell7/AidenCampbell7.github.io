// Cyberpunk Runner Game
//
// This script creates a simple endless runner using Three.js.  A neon‑coloured
// cube represents the player; obstacles slide toward the camera along the Z
// axis.  The player can move left and right to dodge obstacles and hold the
// space bar for a speed boost.  The score increases as long as the player
// survives.  Collisions result in game over with the option to restart by
// pressing Enter.

let scene, camera, renderer;
let player, floor;
const obstacles = [];
let speed = 0.15;
let score = 0;
let isGameOver = false;

// Input flags
let moveLeft = false;
let moveRight = false;
let boosting = false;

function init() {
  scene = new THREE.Scene();
  // Dark backdrop reminiscent of a cyberpunk night sky
  scene.background = new THREE.Color(0x080015);

  const aspect = window.innerWidth / window.innerHeight;
  camera = new THREE.PerspectiveCamera(60, aspect, 0.1, 1000);
  camera.position.set(0, 2, 5);
  camera.lookAt(0, 1, 0);

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.getElementById('game-container').appendChild(renderer.domElement);

  // Ambient and point lights to give a neon glow
  const ambient = new THREE.AmbientLight(0x404040, 2);
  scene.add(ambient);
  const neonLight = new THREE.PointLight(0x00ffff, 5, 30);
  neonLight.position.set(0, 10, 10);
  scene.add(neonLight);

  // Player represented by a magenta cube
  const playerGeom = new THREE.BoxGeometry(0.5, 1, 0.5);
  const playerMat = new THREE.MeshStandardMaterial({ color: 0xff00ff });
  player = new THREE.Mesh(playerGeom, playerMat);
  player.position.y = 0.5;
  scene.add(player);

  // Large wireframe plane to simulate the road.  It scrolls beneath the player.
  const floorGeom = new THREE.PlaneGeometry(20, 400, 10, 100);
  const floorMat = new THREE.MeshBasicMaterial({ color: 0x111133, wireframe: true });
  floor = new THREE.Mesh(floorGeom, floorMat);
  floor.rotation.x = -Math.PI / 2;
  floor.position.z = -190;
  scene.add(floor);

  // Create obstacles at varying Z positions and X offsets
  for (let i = 0; i < 10; i++) {
    const obsGeom = new THREE.BoxGeometry(0.5, 1, 0.5);
    const obsMat = new THREE.MeshStandardMaterial({ color: 0x00ffff });
    const obs = new THREE.Mesh(obsGeom, obsMat);
    resetObstacle(obs, true);
    obstacles.push(obs);
    scene.add(obs);
  }

  // Input handlers
  document.addEventListener('keydown', onKeyDown);
  document.addEventListener('keyup', onKeyUp);

  // Responsive resizing
  window.addEventListener('resize', onWindowResize);

  animate();
}

function onWindowResize() {
  const aspect = window.innerWidth / window.innerHeight;
  camera.aspect = aspect;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

function onKeyDown(e) {
  switch (e.code) {
    case 'ArrowLeft':
    case 'KeyA':
      moveLeft = true;
      break;
    case 'ArrowRight':
    case 'KeyD':
      moveRight = true;
      break;
    case 'Space':
      boosting = true;
      break;
    case 'Enter':
      if (isGameOver) restartGame();
      break;
  }
}

function onKeyUp(e) {
  switch (e.code) {
    case 'ArrowLeft':
    case 'KeyA':
      moveLeft = false;
      break;
    case 'ArrowRight':
    case 'KeyD':
      moveRight = false;
      break;
    case 'Space':
      boosting = false;
      break;
  }
}

// Position an obstacle either initially or when it passes the camera.  When
// initial is true, place it randomly far ahead to spread them out.
function resetObstacle(obs, initial = false) {
  obs.position.x = Math.random() * 4 - 2; // range [-2, 2]
  obs.position.y = 0.5;
  obs.position.z = initial ? -(Math.random() * 100 + 20) : -100 - Math.random() * 50;
}

function checkCollisions() {
  const playerBox = new THREE.Box3().setFromObject(player);
  for (const obs of obstacles) {
    const obsBox = new THREE.Box3().setFromObject(obs);
    if (playerBox.intersectsBox(obsBox)) {
      isGameOver = true;
      const board = document.getElementById('scoreboard');
      board.innerHTML = `Game Over! Final Score: ${Math.floor(score)}<br><small>Press Enter to restart</small>`;
      return;
    }
  }
}

function restartGame() {
  isGameOver = false;
  score = 0;
  speed = 0.15;
  obstacles.forEach(obs => resetObstacle(obs, true));
  const board = document.getElementById('scoreboard');
  board.innerHTML = '';
}

function animate() {
  requestAnimationFrame(animate);
  if (!isGameOver) {
    const currentSpeed = speed + (boosting ? 0.1 : 0);
    // Move obstacles toward the camera.  When an obstacle passes the camera
    // position, reposition it further down the track.
    obstacles.forEach(obs => {
      obs.position.z += currentSpeed;
      if (obs.position.z > camera.position.z + 1) {
        resetObstacle(obs);
      }
    });
    // Scroll the floor to simulate movement
    floor.position.z += currentSpeed;
    if (floor.position.z > camera.position.z + 200) {
      floor.position.z = -190;
    }
    // Horizontal movement
    if (moveLeft) player.position.x = Math.max(-3, player.position.x - 0.15);
    if (moveRight) player.position.x = Math.min(3, player.position.x + 0.15);
    // Increase score and gradually accelerate
    score += currentSpeed * 2;
    speed += 0.00002;
    // Check for collisions
    checkCollisions();
    // Update scoreboard text
    const board = document.getElementById('scoreboard');
    board.innerHTML = `Score: ${Math.floor(score)}`;
  }
  renderer.render(scene, camera);
}

// Start the game
init();