export type InputState = {
    forward: boolean;
    backward: boolean;
    left: boolean;
    right: boolean;
    jump: boolean;
};

// Registers event listeners and returns an InputState object which is updated by events.
export function updateInput(player: any, controls: any): InputState {
    const state: InputState = {
        forward: false,
        backward: false,
        left: false,
        right: false,
        jump: false,
    };

    // Keyboard (keydown/keyup -> state flags)
    document.addEventListener('keydown', (event) => {
        switch (event.code) {
            case 'KeyW':
                state.forward = true;
                break;
            case 'KeyS':
                state.backward = true;
                break;
            case 'KeyA':
                state.left = true;
                break;
            case 'KeyD':
                state.right = true;
                break;
            case 'Space':
                state.jump = true;
                if (typeof controls.jump === 'function') controls.jump(player);
                break;
            default:
                break;
        }
    });
    document.addEventListener('keyup', (event) => {
        switch (event.code) {
            case 'KeyW':
                state.forward = false;
                break;
            case 'KeyS':
                state.backward = false;
                break;
            case 'KeyA':
                state.left = false;
                break;
            case 'KeyD':
                state.right = false;
                break;
            case 'Space':
                state.jump = false;
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
        const el = document.body as any;
        if (el.requestPointerLock) el.requestPointerLock();
    });

    return state;
}