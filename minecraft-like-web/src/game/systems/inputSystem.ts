export function updateInput(player: any, controls: any) {
    // Keyboard
    document.addEventListener('keydown', (event) => {
        switch (event.code) {
            case 'KeyW':
                if (typeof controls.moveForward === 'function') controls.moveForward(player);
                break;
            case 'KeyS':
                if (typeof controls.moveBackward === 'function') controls.moveBackward(player);
                break;
            case 'KeyA':
                if (typeof controls.moveLeft === 'function') controls.moveLeft(player);
                break;
            case 'KeyD':
                if (typeof controls.moveRight === 'function') controls.moveRight(player);
                break;
            case 'Space':
                if (typeof controls.jump === 'function') controls.jump(player);
                break;
            default:
                break;
        }
    });

    // Mouse move -> now we pass player so Controls can update player's rotation
    document.addEventListener('mousemove', (event) => {
        if (typeof controls.lookAround === 'function') {
            controls.lookAround(player, event.movementX || 0, event.movementY || 0);
        }
    });

    // Optional: pointerlock activation on click
    document.addEventListener('click', () => {
        const el = document.body;
        if (el.requestPointerLock) el.requestPointerLock();
    });
}