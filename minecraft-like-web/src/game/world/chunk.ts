export class Chunk {
    private voxels: Voxel[][][];

    constructor(public x: number, public y: number, public z: number) {
        this.voxels = this.generate();
    }

    private generate(): Voxel[][][] {
        const size = 16; // Size of the chunk
        const voxels: Voxel[][][] = [];

        for (let i = 0; i < size; i++) {
            voxels[i] = [];
            for (let j = 0; j < size; j++) {
                voxels[i][j] = [];
                for (let k = 0; k < size; k++) {
                    voxels[i][j][k] = new Voxel(); // Create a new voxel
                }
            }
        }

        return voxels;
    }

    public render(renderer: Renderer): void {
        // Implement rendering logic for the chunk
        renderer.renderWorld(this.voxels);
    }
}