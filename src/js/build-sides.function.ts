import { Vector3, PlaneGeometry, SphereGeometry } from 'three';

export function buildSides(sphereGeometry: SphereGeometry): PlaneGeometry {
    const vector = new Vector3();
    const { widthSegments } = sphereGeometry.parameters;
    console.log(widthSegments)
    const points = new Array((widthSegments));
    for (let i = 0; i <= widthSegments; i++) {
        vector.fromBufferAttribute(sphereGeometry.attributes.position, i);
        points[i] = vector.clone().setLength(vector.length() * 0.9);
        points[i + (widthSegments + 1)] = vector.clone();
    }

    const planeGeometry = new PlaneGeometry(1, 1, widthSegments, 1);
    planeGeometry.setFromPoints(points);
    planeGeometry.computeVertexNormals();
    return planeGeometry;
}
