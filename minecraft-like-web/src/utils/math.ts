export function addVectors(a: { x: number; y: number; z: number }, b: { x: number; y: number; z: number }) {
    return { x: a.x + b.x, y: a.y + b.y, z: a.z + b.z };
}

export function subtractVectors(a: { x: number; y: number; z: number }, b: { x: number; y: number; z: number }) {
    return { x: a.x - b.x, y: a.y - b.y, z: a.z - b.z };
}

export function multiplyVectorByScalar(v: { x: number; y: number; z: number }, scalar: number) {
    return { x: v.x * scalar, y: v.y * scalar, z: v.z * scalar };
}

export function dotProduct(a: { x: number; y: number; z: number }, b: { x: number; y: number; z: number }) {
    return a.x * b.x + a.y * b.y + a.z * b.z;
}

export function crossProduct(a: { x: number; y: number; z: number }, b: { x: number; y: number; z: number }) {
    return {
        x: a.y * b.z - a.z * b.y,
        y: a.z * b.x - a.x * b.z,
        z: a.x * b.y - a.y * b.x,
    };
}

export function length(v: { x: number; y: number; z: number }) {
    return Math.sqrt(v.x * v.x + v.y * v.y + v.z * v.z);
}

export function normalize(v: { x: number; y: number; z: number }) {
    const len = length(v);
    return len > 0 ? { x: v.x / len, y: v.y / len, z: v.z / len } : { x: 0, y: 0, z: 0 };
}

export function lerp(a: number, b: number, t: number) {
    return a + (b - a) * t;
}