export type Vector3 = {
    x: number;
    y: number;
    z: number;
};

export type Block = {
    type: string;
    color: string;
};

export interface PlayerState {
    position: Vector3;
    rotation: Vector3;
    isJumping: boolean;
}

export interface World {
    chunks: Chunk[];
}

export interface Chunk {
    position: Vector3;
    voxels: Block[][];
}