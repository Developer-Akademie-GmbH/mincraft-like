export function generateWorld(width: number, height: number, depth: number): number[][][] {
    const world: number[][][] = [];

    for (let x = 0; x < width; x++) {
        world[x] = [];
        for (let y = 0; y < height; y++) {
            world[x][y] = [];
            for (let z = 0; z < depth; z++) {
                // Simple generation logic: fill with air (0) or solid block (1)
                if (y < height / 2) {
                    world[x][y][z] = 1; // Solid block
                } else {
                    world[x][y][z] = 0; // Air
                }
            }
        }
    }

    return world;
}