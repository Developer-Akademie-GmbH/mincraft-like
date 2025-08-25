class Controls {
  private sensitivity = 0.0025;
  private moveSpeed = 4.0; // units per second (we'll interpret per-frame as fixed small step)
  private jumpSpeed = 5.0;

  constructor(private canvas?: HTMLCanvasElement) {
    // nothing to do here for minimal implementation
  }

  // movement functions receive player object and mutate position/velocity
  moveForward(player: any) {
    if (!player) return;
  const yaw = player.rotation?.y || 0;
  const step = 0.1;
  const dx = Math.sin(yaw) * step;
  const dz = Math.cos(yaw) * step;
  player.position.x += dx;
  player.position.z += dz;
  }

  moveBackward(player: any) {
    if (!player) return;
  const yaw = player.rotation?.y || 0;
  const step = 0.1;
  const dx = -Math.sin(yaw) * step;
  const dz = -Math.cos(yaw) * step;
  player.position.x += dx;
  player.position.z += dz;
  }

  moveLeft(player: any) {
    if (!player) return;
  const yaw = player.rotation?.y || 0;
  const step = 0.1;
  // right vector
  const rx = Math.cos(yaw) * step;
  const rz = -Math.sin(yaw) * step;
  // left is negative right
  player.position.x -= rx;
  player.position.z -= rz;
  }

  moveRight(player: any) {
    if (!player) return;
  const yaw = player.rotation?.y || 0;
  const step = 0.1;
  const dx = Math.cos(yaw) * step;
  const dz = -Math.sin(yaw) * step;
  player.position.x += dx;
  player.position.z += dz;
  }

  jump(player: any) {
    if (!player) return;
    if (!player.velocity) player.velocity = { x: 0, y: 0, z: 0 };
    // simple jump impulse if on ground flag exists or y <= threshold
    if (!player.onGround) {
      // ignore if already in air
      return;
    }
    player.velocity.y = this.jumpSpeed;
    player.onGround = false;
  }

  // mouse look: update player's rotation (expects player.rotation.y = yaw, rotation.x = pitch)
  lookAround(player: any, movementX: number, movementY: number) {
    if (!player) return;
    if (!player.rotation) player.rotation = { x: 0, y: 0, z: 0 };

    player.rotation.y -= movementX * this.sensitivity; // yaw
    player.rotation.x -= movementY * this.sensitivity; // pitch

    // clamp pitch to avoid flipping
    const maxPitch = Math.PI / 2 - 0.01;
    if (player.rotation.x > maxPitch) player.rotation.x = maxPitch;
    if (player.rotation.x < -maxPitch) player.rotation.x = -maxPitch;
  }
}

export default Controls;