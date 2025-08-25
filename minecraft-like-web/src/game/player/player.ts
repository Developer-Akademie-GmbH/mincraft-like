export class Player {
    position: { x: number; y: number; z: number };
    velocity: { x: number; y: number; z: number };
    speed: number;

    constructor() {
        this.position = { x: 0, y: 0, z: 0 };
        this.velocity = { x: 0, y: 0, z: 0 };
        this.speed = 5;
    }

    move(direction: { x: number; y: number; z: number }) {
        this.position.x += direction.x * this.speed;
        this.position.y += direction.y * this.speed;
        this.position.z += direction.z * this.speed;
    }

    jump() {
        this.velocity.y = 10; // Simple jump implementation
    }

    update() {
        this.position.y += this.velocity.y;
        this.velocity.y -= 0.5; // Gravity effect

        if (this.position.y < 0) {
            this.position.y = 0;
            this.velocity.y = 0; // Reset velocity when hitting the ground
        }
    }
}