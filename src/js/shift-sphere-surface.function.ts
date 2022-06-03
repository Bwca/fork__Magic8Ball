import { Spherical, Vector3 } from 'three';

export function shiftSphereSurface(sphere: THREE.SphereGeometry): void {
    const sectors = 5;
    const spherical = new Spherical();
    const firstVector = new Vector3();
    const secondVector = new Vector3();

    for (let i = 0; i < sphere.attributes.position.count; i++) {
        firstVector.fromBufferAttribute(sphere.attributes.position, i);
        spherical.setFromVector3(firstVector);
        const localTheta = ((Math.abs(spherical.theta) * sectors) / (Math.PI * 2)) % 1;
        const phiShift = 1 - (Math.cos(localTheta * Math.PI * 2) * 0.5 + 0.5);
        let phiAspect = spherical.phi / Math.PI;
        phiAspect = 1 - phiAspect;
        const phiVal = Math.pow(phiShift, 0.9) * 0.05 * phiAspect;
        spherical.phi += -phiVal;
        firstVector.setFromSpherical(spherical);
        sphere.attributes.position.setXYZ(i, firstVector.x, firstVector.y, firstVector.z);
        secondVector.copy(firstVector).normalize();
        sphere.attributes.normal.setXYZ(i, secondVector.x, secondVector.y, secondVector.z);
    }
}
