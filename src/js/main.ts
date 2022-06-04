import { Tween, update } from '@tweenjs/tween.js';
import {
    Scene,
    PerspectiveCamera,
    WebGLRenderer,
    TextureLoader,
    sRGBEncoding,
    EquirectangularReflectionMapping,
    DirectionalLight,
    AmbientLight,
    Vector2,
    Raycaster,
    MathUtils,
    Clock,
} from 'three';

import { createAnswerTextures } from './create-answer-textures';
import { createBackground } from './create-background.function';
import { createBall } from './create-ball.function';
import { createTextInscription } from './create-text-inscription.function';
import { DEFAULT_ANSWERS } from './default-answers.const';
import { GlobalUniforms } from './global-uniforms.model';
import { OrbitControls } from './three-r136/examples/jsm/controls/orbit-controls.class';

export async function create8Ball(answers = DEFAULT_ANSWERS, lineSeparator = '|'): Promise<void> {
    const scene = new Scene();
    const camera = new PerspectiveCamera(60, innerWidth / innerHeight, 0.1, 2000);
    camera.position.set(0, 1, 0.375).setLength(15);
    const renderer = new WebGLRenderer({
        antialias: true,
    });
    renderer.setSize(innerWidth, innerHeight);
    document.body.appendChild(renderer.domElement);
    window.addEventListener('resize', () => {
        camera.aspect = innerWidth / innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(innerWidth, innerHeight);
    });

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enablePan = false;
    controls.enableDamping = true;
    controls.minDistance = 8;
    controls.maxDistance = 15;

    const textureLoader = new TextureLoader();

    const texture = await textureLoader.loadAsync('https://threejs.org/examples/textures/2294472375_24a3b8ef46_o.jpg');
    texture.encoding = sRGBEncoding;
    texture.mapping = EquirectangularReflectionMapping;

    const light = new DirectionalLight(0xffffff, 0.5);
    light.position.set(2, 1, -2);
    scene.add(new AmbientLight(0xffffff, 1));

    const answersTextures = createAnswerTextures(answers, lineSeparator);

    const globalUniforms: GlobalUniforms = {
        time: { value: 0 },
        baseVisibility: { value: 1 },
        textVisibility: { value: 0 },
        text: { value: null },
    };

    const writing = createTextInscription(globalUniforms);
    writing.renderOrder = 9998;
    scene.add(writing);

    const theBall = createBall(texture, globalUniforms.time);
    theBall.renderOrder = 9999;
    scene.add(theBall);

    const background = createBackground(globalUniforms.time);
    scene.add(background);

    // <INTERACTION>
    let isRunning = true;
    function animation(param: { value: number }, valStart: number, valEnd: number, duration = 1000, delay = 0): Tween<{ val: number }> {
        return new Tween<{ val: number }>({ val: valStart })
            .to({ val: valEnd }, duration)
            .delay(delay)
            .onUpdate((val) => {
                param.value = val.val;
            });
    }
    animation(globalUniforms.baseVisibility, 1, 0.375, 2000, 2000).start();
    animation(globalUniforms.textVisibility, 0, 1, 2000, 4000)
        .onStart(() => {
            setNewText();
        })
        .onComplete(() => {
            isRunning = false;
        })
        .start();

    const pointer = new Vector2();
    const raycaster = new Raycaster();
    window.addEventListener('pointerup', (event) => {
        if (isRunning) {
            return;
        }

        pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
        pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;
        raycaster.setFromCamera(pointer, camera);
        // check, if we're in the central circle only
        const isInsideInnerCircle = raycaster.intersectObject(writing).some((m) => m.uv!.subScalar(0.5).length() * 2 < 0.5);
        if (isInsideInnerCircle) {
            runAnimation();
        }
    });

    function runAnimation(): void {
        const fadeOut = animation(globalUniforms.textVisibility, 1, 0, 1000, 500);
        fadeOut.onStart(() => {
            isRunning = true;
        });
        const fadeIn = animation(globalUniforms.textVisibility, 0, 1, 2000, 1000);
        fadeIn.onStart(() => {
            setNewText();
        });
        fadeIn.onComplete(() => {
            isRunning = false;
        });
        fadeOut.chain(fadeIn);
        fadeOut.start();
    }

    function setNewText(): void {
        globalUniforms.text.value = answersTextures[MathUtils.randInt(0, answersTextures.length - 1)];
    }

    // </INTERACTION>

    const clock = new Clock();

    renderer.setAnimationLoop(() => {
        const time = clock.getElapsedTime();
        globalUniforms.time.value = time;
        controls.update();
        update();
        renderer.render(scene, camera);
    });
}

document.addEventListener('DOMContentLoaded', () => create8Ball());
