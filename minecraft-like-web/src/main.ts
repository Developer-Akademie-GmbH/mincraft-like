import Renderer from './rendering/renderer';
import Camera from './rendering/camera';
import { generateWorld } from './game/world/generator';
import { Player } from './game/player/player';
import Controls from './game/player/controls';
import { updateInput } from './game/systems/inputSystem';
import { updatePhysics } from './game/systems/physicsSystem';
import { updateRender } from './game/systems/renderSystem';

const canvas = document.getElementById('app') as HTMLCanvasElement;
if (!canvas) {
  throw new Error('Canvas #app not found');
}

const renderer = new Renderer(canvas);
const camera = new Camera();
const player = new Player();
const controls = new Controls(canvas);

let lastTime = 0;

// KORREKT: player zuerst, controls danach (entspricht inputSystem.ts Signatur)
updateInput(player, controls);

function gameLoop(time: number) {
  const deltaTime = (time - lastTime) / 1000; // seconds
  lastTime = time;

  updatePhysics(player, deltaTime);
  renderer.beginFrame();
  // Kamera aus Player setzen, damit updateRender eine gültige View-Matrix erhält
  camera.setFromPlayer(player);
  // Übergib camera (und optional world), damit renderSystem die View-Matrix nutzen kann
  updateRender(renderer, camera, undefined);

  requestAnimationFrame(gameLoop);
}

generateWorld();
requestAnimationFrame(gameLoop);