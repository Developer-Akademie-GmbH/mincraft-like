import { perspective, multiply } from '../../utils/mat4';

export function updateRender(renderer: any, camera: any, world: any) {
    // safe: benutze vorhandene Renderer-API wenn verfügbar
    // beginFrame wird in main.ts bereits aufgerufen, daher hier keine doppelte clear()
    const viewMatrix = camera && typeof camera.getViewMatrix === 'function'
        ? camera.getViewMatrix()
        : null;

    if (typeof renderer.setViewport === 'function') {
        renderer.setViewport(window.innerWidth, window.innerHeight);
    }
    if (typeof renderer.renderWorld === 'function') {
        // build projection matrix
        const aspect = window.innerWidth / window.innerHeight;
        const proj = perspective((60 * Math.PI) / 180, aspect, 0.1, 1000);
        let pv = proj;
        if (viewMatrix) {
            pv = multiply(proj, viewMatrix as Float32Array);
        }
        renderer.renderWorld(world, viewMatrix, pv);
    }
}