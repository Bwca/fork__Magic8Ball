import { PlaneGeometry, InstancedBufferAttribute, MeshBasicMaterial, Color, AdditiveBlending, InstancedMesh, Matrix4 } from 'three';

import { GlobalUniforms } from './models/global-uniforms.model';

export function createTextInscription({
    textBackgroundVisibility: baseVisibility,
    textVisibility,
    text,
}: GlobalUniforms): InstancedMesh<PlaneGeometry, MeshBasicMaterial> {
    const backgroundGeometry = new PlaneGeometry(0.4 * 8, 0.4 * 8);
    backgroundGeometry.rotateX(-Math.PI * 0.5);
    backgroundGeometry.setAttribute('instId', new InstancedBufferAttribute(new Float32Array([0, 1, 2, 3]), 1));
    const backgroundMaterial = new MeshBasicMaterial({
        color: new Color(0, 0.5, 1),
        transparent: true,
        opacity: 1,
        blending: AdditiveBlending,
    });
    backgroundMaterial.onBeforeCompile = (shader): void => {
        shader.uniforms.baseVisibility = baseVisibility;
        shader.uniforms.textVisibility = textVisibility;
        shader.uniforms.text = text;
        shader.vertexShader = `
        attribute float instId;
        varying float vInstId;
        ${shader.vertexShader}`.replace(
            '#include <begin_vertex>',
            `#include <begin_vertex>
        vInstId = instId;`
        );

        shader.fragmentShader = `
        #define ss(a, b, c) smoothstep(a, b, c)
        uniform float baseVisibility;
        uniform float textVisibility;
        uniform sampler2D text;
        varying float vInstId;
        float tri(vec2 uv, int N){
          float Pi = 3.1415926;
          float Pi2 = Pi * 2.;
          float a = atan(uv.x,uv.y)+Pi;
          float r = Pi2/float(N);
          return cos(floor(.5+a/r)*r-a)*length(uv);
        }
        ${shader.fragmentShader}`.replace(
            'vec4 diffuseColor = vec4( diffuse, opacity );',
            `vec4 diffuseColor = vec4( diffuse, opacity * ((vInstId / 3.) * 0.9 + 0.1) );
        vec2 uv = (vUv - 0.5) * 6.;
        float fw = length(fwidth(uv));
        float fb = tri(uv, 3);
        float b = 0.;
        b = max(b, ss(1.1 - fw, 1.1, fb) - ss(1.2, 1.2 + fw, fb));
        vec2 uv81 = uv - vec2(0, 0.5);
        fb = tri(uv81, 60);
        b = max(b, ss(0.25 - fw, 0.25, fb) - ss(0.45, 0.45 + fw, fb));
        vec2 uv82 = uv + vec2(0, 0.25);
        fb = tri(uv82, 60);
        b = max(b, ss(0.3 - fw, 0.3, fb) - ss(0.5, 0.5 + fw, fb));
        b *= baseVisibility;
        vec3 col = vec3(0);
        col = mix(col, diffuse, b);
        vec4 text = texture(text, (vUv - 0.5) + 0.5);
        float tx = text.a * textVisibility;
        col = mix(col, text.rgb * vec3(1, 0.5, 0), tx);
        float f = max(b, tx);
        diffuseColor.rgb = col;
        diffuseColor.a *= f;`
        );
    };
    backgroundMaterial.defines = { USE_UV: '' };

    const writing = new InstancedMesh(backgroundGeometry, backgroundMaterial, 4);
    const step = 0.05;
    writing.setMatrixAt(0, new Matrix4().setPosition(0, 0.75 * 4 - step * 3, 0));
    writing.setMatrixAt(1, new Matrix4().setPosition(0, 0.75 * 4 - step * 2, 0));
    writing.setMatrixAt(2, new Matrix4().setPosition(0, 0.75 * 4 - step * 1, 0));
    writing.setMatrixAt(3, new Matrix4().setPosition(0, 0.75 * 4 - step * 0, 0));

    return writing;
}
