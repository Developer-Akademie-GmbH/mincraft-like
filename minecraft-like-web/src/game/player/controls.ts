class Controls {
  private sensitivity = 0.0025;
  private moveSpeed = 4.0; // units per second
  private jumpSpeed = 5.0;

  constructor(private canvas?: HTMLCanvasElement) {
    // nothing to do here for minimal implementation
  }

  // movement functions receive player object and mutate position/velocity
  moveForward(player: any, deltaTime: number) {
    if (!player) return;
    const yaw = player.rotation?.y || 0;
    const step = this.moveSpeed * deltaTime;
    const dx = Math.sin(yaw) * step;
    const dz = Math.cos(yaw) * step;
    player.position.x += dx;
    player.position.z += dz;
  }

  moveBackward(player: any, deltaTime: number) {
    if (!player) return;
    const yaw = player.rotation?.y || 0;
    const step = this.moveSpeed * deltaTime;
    const dx = -Math.sin(yaw) * step;
    const dz = -Math.cos(yaw) * step;
    player.position.x += dx;
    player.position.z += dz;
  }

  moveRight(player: any, deltaTime: number) {
    if (!player) return;
    const yaw = player.rotation?.y || 0;
    const step = this.moveSpeed * deltaTime;
  // compute forward and right vectors from yaw
  const forwardX = Math.sin(yaw);
  const forwardZ = Math.cos(yaw);
  const rightX = Math.cos(yaw);
  const rightZ = -Math.sin(yaw);
  // left = -right
  player.position.x += -rightX * step;
  player.position.z += -rightZ * step;
  }

  moveLeft(player: any, deltaTime: number) {
    if (!player) return;
    const yaw = player.rotation?.y || 0;
    const step = this.moveSpeed * deltaTime;
  // compute forward and right vectors from yaw
  const forwardX = Math.sin(yaw);
  const forwardZ = Math.cos(yaw);
  const rightX = Math.cos(yaw);
  const rightZ = -Math.sin(yaw);
  player.position.x += rightX * step;
  player.position.z += rightZ * step;
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
  
  // Apply a continuous input state per-frame for smooth movement
  applyInput(state: { forward: boolean; backward: boolean; left: boolean; right: boolean }, player: any, deltaTime: number) {
    if (state.forward) this.moveForward(player, deltaTime);
    if (state.backward) this.moveBackward(player, deltaTime);
    if (state.left) this.moveLeft(player, deltaTime);
    if (state.right) this.moveRight(player, deltaTime);
  }
}

export default Controls;