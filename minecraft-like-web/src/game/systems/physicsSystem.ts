export function updatePhysics(player: any, deltaTime: number, world?: any) {
    if (!deltaTime) deltaTime = 1 / 60;
    // Apply gravity
    if (!player.velocity) player.velocity = { x: 0, y: 0, z: 0 };
    player.velocity.y -= 9.81 * deltaTime;

    // Update player position based on velocity
    player.position.x += player.velocity.x * deltaTime;
    player.position.y += player.velocity.y * deltaTime;
    player.position.z += player.velocity.z * deltaTime;

    // simple ground collision at y=0
    if (player.position.y <= 0) {
        player.position.y = 0;
        player.velocity.y = 0;
        player.onGround = true;
    } else {
        player.onGround = false;
    }
}

function checkCollision(player: any, world?: any) {
    return null; // placeholder
}