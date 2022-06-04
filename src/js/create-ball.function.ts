import { SphereGeometry, Material, MeshStandardMaterial, Color, MeshLambertMaterial, BackSide, Mesh, Texture } from 'three';

import { buildSides } from './build-sides.function';
import { FBM } from './external-modules';
import { mergeBufferGeometries } from './three-r136/examples/jsm/utils/merge-buffer-geometries.util';

export function createBall(tex: Texture, time: { value: number }): Mesh {
    const outerSphere = new SphereGeometry(4, 200, 100, 1, Math.PI * 2, Math.PI * 0.15, Math.PI * 0.85);
    const innerSphere = outerSphere.clone().scale(0.9, 0.9, 0.9);
    const slides = buildSides(outerSphere);
    const lens = new SphereGeometry(3.99, 200, 25, 0, Math.PI * 2, 0, Math.PI * 0.15);
    const geometry = mergeBufferGeometries([outerSphere, innerSphere, slides, lens], true);
    if (!geometry) {
        throw new Error('Could not obtain geometry for the ball!');
    }
    const standardMaterial = new MeshStandardMaterial({
        envMap: tex,
        color: new Color('indigo').addScalar(0.25).multiplyScalar(5),
        roughness: 0.75,
        metalness: 1,
    });
    standardMaterial.onBeforeCompile = (shader): void => {
        shader.uniforms.time = time;
        shader.vertexShader = `varying vec3 vPos;
        ${shader.vertexShader}`.replace(
            '#include <begin_vertex>',
            `#include <begin_vertex>
            vPos = position;`
        );
        shader.fragmentShader = `#define ss(a, b, c) smoothstep(a, b, c)
        uniform float time;
        varying vec3 vPos;
        ${FBM}
        ${shader.fragmentShader}`.replace(
            '#include <roughnessmap_fragment>',
            `float roughnessFactor = roughness;
        vec2 v2d = normalize(vPos.xz) * 1.;
        vec3 nCoord = vPos + vec3(0, time, 0);
        float nd = clamp(fbm(nCoord) * 0.25, 0., 1.);
        nd = pow(nd, 0.5);
        float hFactor = vUv.y;
        nd = mix(0.25, nd, ss(0.4, 0.6, hFactor));
        nd = mix(nd, 0., ss(0.9, 1., hFactor));
        roughnessFactor *= clamp((nd * 0.8) + 0.2, 0., 1.);`
        );
    };
    const meshLambertMaterial = new MeshLambertMaterial({
        color: 0xaa0000,
    });
    meshLambertMaterial.onBeforeCompile = (shader): void => {
        shader.fragmentShader = `
        #define ss(a, b, c) smoothstep(a, b, c)
        mat2 rot(float a){
            float c = cos(a), s = sin(a);
            return mat2( c, s, -s, c);
        }
        ${shader.fragmentShader}`.replace(
            'vec4 diffuseColor = vec4( diffuse, opacity );',
            `vec3 col = diffuse;
            vec2 uv = vUv;
            vec2 wUv = uv - 0.5;
            wUv.y *= 5.;
            wUv.y += sin(uv.x * PI2 * 100.) * 0.1;
            float fw = length(fwidth(wUv * PI));
            float l = ss(fw, 0., abs(sin(wUv.y * PI)));
            col = mix(col * 0.5, col, l);
            vec4 diffuseColor = vec4( col, opacity );`
        );
    };
    const materials: Material[] = [
        standardMaterial,
        new MeshLambertMaterial({
            color: 0x000088,
            side: BackSide,
        }),
        meshLambertMaterial,
        new MeshStandardMaterial({
            envMap: tex,
            envMapIntensity: 10,
            color: 0xffffff,
            transparent: true,
            opacity: 0.25,
            metalness: 1,
            roughness: 0,
        }),
    ];
    materials[0].defines = { USE_UV: '' };
    materials[2].defines = { USE_UV: '' };
    return new Mesh(geometry, materials);
}
