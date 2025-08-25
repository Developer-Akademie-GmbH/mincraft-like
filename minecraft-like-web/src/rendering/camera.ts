class Camera {
  position = { x: 0, y: 1.6, z: 0 };
  rotation = { x: 0, y: 0, z: 0 }; // pitch (x), yaw (y)

  constructor(position, rotation) {
    // nur zuweisen wenn tatsächlich übergeben
    if (position) this.position = position;
    if (rotation) this.rotation = rotation;
  }

  // optional: bind to a player object (used by game loop)
  setFromPlayer(player: any) {
    if (!player) return;
    if (player.position) {
      this.position.x = player.position.x;
      this.position.y = player.position.y + (player.eyeHeight ?? 0);
      this.position.z = player.position.z;
    }
    if (player.rotation) {
      this.rotation.x = player.rotation.x;
      this.rotation.y = player.rotation.y;
    }
  }

  // Return view matrix (column-major Float32Array length 16)
  getViewMatrix(): Float32Array {
    // build rotation (yaw around Y, pitch around X) then translate
    const cx = Math.cos(this.rotation.x);
    const sx = Math.sin(this.rotation.x);
    const cy = Math.cos(this.rotation.y);
    const sy = Math.sin(this.rotation.y);

    // camera forward vector
    const fx = sx * sy + cx * 0; // simpler: compute via rotation matrices
    // We'll compute view matrix by constructing lookAt from position and forward vector
    const forward = [
      Math.cos(this.rotation.x) * Math.sin(this.rotation.y),
      Math.sin(this.rotation.x),
      Math.cos(this.rotation.x) * Math.cos(this.rotation.y),
    ];

    const eye = [this.position.x, this.position.y, this.position.z];
    const center = [eye[0] + forward[0], eye[1] + forward[1], eye[2] + forward[2]];
    const up = [0, 1, 0];

    return Camera.lookAt(eye, center, up);
  }

  static lookAt(eye: number[], center: number[], up: number[]) {
    const zx = eye[0] - center[0];
    const zy = eye[1] - center[1];
    const zz = eye[2] - center[2];
    let zl = Math.hypot(zx, zy, zz);
    if (zl === 0) zl = 1;
    const zxN = zx / zl, zyN = zy / zl, zzN = zz / zl;

    // x = up cross z
    const xx = up[1] * zzN - up[2] * zyN;
    const xy = up[2] * zxN - up[0] * zzN;
    const xz = up[0] * zyN - up[1] * zxN;
    let xl = Math.hypot(xx, xy, xz);
    if (xl === 0) xl = 1;
    const xxN = xx / xl, xyN = xy / xl, xzN = xz / xl;

    // y = z cross x
    const yx = zyN * xzN - zzN * xyN;
    const yy = zzN * xxN - zxN * xzN;
    const yz = zxN * xyN - zyN * xxN;

    const tx = -(xxN * eye[0] + xyN * eye[1] + xzN * eye[2]);
    const ty = -(yx * eye[0] + yy * eye[1] + yz * eye[2]);
    const tz = -(zxN * eye[0] + zyN * eye[1] + zzN * eye[2]);

    // column-major
    return new Float32Array([
      xxN, yx, zxN, 0,
      xyN, yy, zyN, 0,
      xzN, yz, zzN, 0,
      tx,  ty,  tz,  1,
    ]);
  }
}

export default Camera;