import { SphereGeometry, ShaderMaterial, BackSide, Mesh } from 'three';

import { NOISE_V3 } from './external-modules';

export function createBackground(time: { value: number }): Mesh {
    const backgroundGeometry = new SphereGeometry(1000, 100, 50);
    const backgroundMaterial = new ShaderMaterial({
        side: BackSide,
        uniforms: {
            time,
        },
        vertexShader: `
        varying vec3 vNormal;
        void main() {
            vNormal = normal;
            gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
        }`,
        fragmentShader: `
        uniform float bloom;
        uniform float time;
        varying vec3 vNormal;
        ${NOISE_V3}
        void main() {
            vec3 col = vec3(0.375);
            float ns = snoise(vec4(vNormal * 2., time * 0.1));
            col = mix(col*1.5, col, pow(abs(ns), 0.5));
            gl_FragColor = vec4( col, 1.0 );
        }`,
    });
    return new Mesh(backgroundGeometry, backgroundMaterial);
}
