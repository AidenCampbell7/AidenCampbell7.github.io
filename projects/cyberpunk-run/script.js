// Cyberpunk Runner Game with Home and Game‑over Screens
//
// This version of the runner introduces a home screen, a game‑over screen
// and speed‑boost pads.  The game cycles between three states: "home",
// "playing" and "gameover".  Press Enter on the home or game‑over screens
// to start or restart.  During play, the player moves left/right with
// the arrow keys (or A/D).  Holding the space bar triggers a manual
// boost, while running over a golden boost pad grants a temporary speed
// increase.  Collisions with obstacles end the round.

let scene, camera, renderer;
let player, floor;
const obstacles = [];
const boostPads = [];
let speed = 0.15;
let score = 0;
let gameState = 'home'; // 'home', 'playing' or 'gameover'
let moveLeft = false;
let moveRight = false;
let boosting = false;
let boostTimer = 0;

function init() {
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x080015);

  const aspect = window.innerWidth / window.innerHeight;
  camera = new THREE.PerspectiveCamera(60, aspect, 0.1, 1000);
  camera.position.set(0, 2, 5);
  camera.lookAt(0, 1, 0);

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.getElementById('game-container').appendChild(renderer.domElement);

  // Lighting
  const ambient = new THREE.AmbientLight(0x404040, 2);
  scene.add(ambient);
  const neonLight = new THREE.PointLight(0x00ffff, 5, 30);
  neonLight.position.set(0, 10, 10);
  scene.add(neonLight);

  // Player
  const playerGeom = new THREE.BoxGeometry(0.5, 1, 0.5);
  const playerMat = new THREE.MeshStandardMaterial({ color: 0xff00ff });
  player = new THREE.Mesh(playerGeom, playerMat);
  player.position.y = 0.5;
  scene.add(player);

  // Floor
  const floorGeom = new THREE.PlaneGeometry(20, 400, 10, 100);
  const floorMat = new THREE.MeshBasicMaterial({ color: 0x111133, wireframe: true });
  floor = new THREE.Mesh(floorGeom, floorMat);
  floor.rotation.x = -Math.PI / 2;
  floor.position.z = -190;
  scene.add(floor);

  // Obstacles
  for (let i = 0; i < 10; i++) {
    const obsGeom = new THREE.BoxGeometry(0.5, 1, 0.5);
    const obsMat = new THREE.MeshStandardMaterial({ color: 0x00ffff });
    const obs = new THREE.Mesh(obsGeom, obsMat);
    resetObstacle(obs, true);
    obstacles.push(obs);
    scene.add(obs);
  }

  // Boost pads
  for (let i = 0; i < 5; i++) {
    const padGeom = new THREE.CylinderGeometry(0.4, 0.4, 0.1, 16);
    const padMat = new THREE.MeshStandardMaterial({ color: 0xffd700 });
    const pad = new THREE.Mesh(padGeom, padMat);
    resetBoostPad(pad, true);
    boostPads.push(pad);
    scene.add(pad);
  }

  // Input listeners
  document.addEventListener('keydown', onKeyDown);
  document.addEventListener('keyup', onKeyUp);
  window.addEventListener('resize', onWindowResize);

  animate();
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
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
      if (gameState === 'home' || gameState === 'gameover') {
        startGame();
      }
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

function resetObstacle(obs, initial = false) {
  obs.position.x = Math.random() * 4 - 2;
  obs.position.y = 0.5;
  obs.position.z = initial ? -(Math.random() * 100 + 20) : -100 - Math.random() * 50;
}

function resetBoostPad(pad, initial = false) {
  pad.position.x = Math.random() * 4 - 2;
  pad.position.y = 0.05;
  pad.position.z = initial ? -(Math.random() * 100 + 30) : -100 - Math.random() * 50;
}

function checkCollisions() {
  const playerBox = new THREE.Box3().setFromObject(player);
  // Collisions with obstacles
  for (const obs of obstacles) {
    const obsBox = new THREE.Box3().setFromObject(obs);
    if (playerBox.intersectsBox(obsBox)) {
      gameState = 'gameover';
      const board = document.getElementById('scoreboard');
      board.innerHTML = `Game Over! Final Score: ${Math.floor(score)}<br><small>Press Enter to play again</small>`;
      return;
    }
  }
  // Collisions with boost pads
  for (const pad of boostPads) {
    const padBox = new THREE.Box3().setFromObject(pad);
    if (playerBox.intersectsBox(padBox)) {
      boostTimer = 200; // frames of boosted speed
      resetBoostPad(pad);
    }
  }
}

function startGame() {
  gameState = 'playing';
  score = 0;
  speed = 0.15;
  boostTimer = 0;
  obstacles.forEach(o => resetObstacle(o, true));
  boostPads.forEach(p => resetBoostPad(p, true));
  player.position.x = 0;
  const board = document.getElementById('scoreboard');
  board.innerHTML = '';
}

function animate() {
  requestAnimationFrame(animate);
  const board = document.getElementById('scoreboard');
  if (gameState === 'home') {
    board.innerHTML = 'Cyberpunk Runner<br><small>Press Enter to play</small>';
  } else if (gameState === 'playing') {
    // Determine current speed
    let currentSpeed = speed + (boosting ? 0.1 : 0) + (boostTimer > 0 ? 0.2 : 0);
    if (boostTimer > 0) boostTimer--;
    // Move obstacles and pads
    obstacles.forEach(obs => {
      obs.position.z += currentSpeed;
      if (obs.position.z > camera.position.z + 1) {
        resetObstacle(obs);
      }
    });
    boostPads.forEach(pad => {
      pad.position.z += currentSpeed;
      if (pad.position.z > camera.position.z + 1) {
        resetBoostPad(pad);
      }
    });
    // Scroll the floor
    floor.position.z += currentSpeed;
    if (floor.position.z > camera.position.z + 200) {
      floor.position.z = -190;
    }
    // Horizontal movement
    if (moveLeft) player.position.x = Math.max(-3, player.position.x - 0.15);
    if (moveRight) player.position.x = Math.min(3, player.position.x + 0.15);
    // Increase score and speed
    score += currentSpeed * 2;
    speed += 0.00002;
    // Collision detection
    checkCollisions();
    // Update scoreboard
    let boostMsg = boostTimer > 0 ? ' BOOST!' : '';
    board.innerHTML = `Score: ${Math.floor(score)}${boostMsg}`;
  }
  // gameover state uses the message set in checkCollisions()
  renderer.render(scene, camera);
}

// Initialise the scene
init();