import { Tween, update } from '@tweenjs/tween.js';
import {
    Scene,
    PerspectiveCamera,
    WebGLRenderer,
    TextureLoader,
    sRGBEncoding,
    EquirectangularReflectionMapping,
    AmbientLight,
    Clock,
    Texture,
    Raycaster,
    Vector2,
    InstancedMesh,
    MeshBasicMaterial,
    PlaneGeometry,
} from 'three';

import { createAnswerTextures } from '../create-answer-textures';
import { createBackground } from '../create-background.function';
import { createBall } from '../create-ball.function';
import { createTextInscription } from '../create-text-inscription.function';
import { GlobalUniforms } from '../models/global-uniforms.model';
import { TweenValue } from '../models/tween-value.model';
import { TEXTURE } from '../texture.const';
import { OrbitControls } from '../three-r136/examples/jsm/controls/orbit-controls.class';
import { AbstractRenderer } from './abstract-renderer.class';
import { AnswerPayload } from './answer-payload.model';

export class THREEBall8Renderer implements AbstractRenderer {
    private readonly globalUniforms: GlobalUniforms = {
        time: { value: 0 },
        textBackgroundVisibility: { value: 1 },
        textVisibility: { value: 0 },
        text: { value: null },
    };
    private readonly scene: Scene;
    private texture!: Texture;
    private camera!: PerspectiveCamera;
    private renderer!: WebGLRenderer;
    private controls!: OrbitControls;
    private readonly clock = new Clock();
    private isRunning = false;
    private writing!: InstancedMesh<PlaneGeometry, MeshBasicMaterial>;

    public constructor(ballColor: number | string = 'indigo') {
        this.scene = new Scene();
        this.setupCamera();
        this.setupRenderer();
        this.setupControls();
        this.loadTexture();
        this.addLighting();
        this.addWriting();
        this.addTheBall(ballColor);
        this.addBackground();
    }

    // eslint-disable-next-line no-unused-vars
    public showBall(host?: HTMLElement): void {
        this.startAnimationLoop();
        this.generateAnimation(this.globalUniforms.textBackgroundVisibility, 1, 0.3, 2000, 2000).start();
    }

    public showAnswer({ answer, event, lineSeparator }: AnswerPayload): void {
        if (this.isRunning) {
            return;
        }

        if (event && !this.isEventInsideCentralCircle(event)) {
            return;
        }

        const fadeOut = this.hideText;
        fadeOut.onStart(() => {
            this.isRunning = true;
        });
        const fadeIn = this.showText;
        fadeIn.onStart(() => {
            this.setNewText(answer, lineSeparator);
        });
        fadeIn.onComplete(() => {
            this.isRunning = false;
        });
        fadeOut.chain(fadeIn);
        fadeOut.start();
    }

    private get hideText(): TweenValue {
        return this.generateAnimation(this.globalUniforms.textVisibility, 1, 0, 1000, 500);
    }

    private get showText(): TweenValue {
        return this.generateAnimation(this.globalUniforms.textVisibility, 0, 1, 2000, 1000);
    }

    private isEventInsideCentralCircle(event: PointerEvent | MouseEvent): boolean {
        const pointer = new Vector2();
        const raycaster = new Raycaster();
        pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
        pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;
        raycaster.setFromCamera(pointer, this.camera);
        return raycaster.intersectObject(this.writing).some((m) => m.uv!.subScalar(0.5).length() * 2 < 0.5);
    }

    private setupControls(): void {
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enablePan = false;
        this.controls.enableDamping = true;
        this.controls.minDistance = 8;
        this.controls.maxDistance = 15;
    }

    private setupCamera(): void {
        this.camera = new PerspectiveCamera(60, innerWidth / innerHeight, 0.1, 2000);
        this.camera.position.set(0, 1, 0.375).setLength(15);
    }

    private setupRenderer(): void {
        this.renderer = new WebGLRenderer({
            antialias: true,
        });
        this.renderer.setSize(innerWidth, innerHeight);
        document.body.appendChild(this.renderer.domElement);
        window.addEventListener('resize', () => {
            this.camera.aspect = innerWidth / innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(innerWidth, innerHeight);
        });
    }

    private loadTexture(): void {
        this.texture = new TextureLoader().load(TEXTURE);
        this.texture.encoding = sRGBEncoding;
        this.texture.mapping = EquirectangularReflectionMapping;
    }

    private addLighting(): void {
        this.scene.add(new AmbientLight(0xffffff, 1));
    }

    private addWriting(): void {
        this.writing = createTextInscription(this.globalUniforms);
        this.writing.renderOrder = 9998;
        this.scene.add(this.writing);
    }

    private addTheBall(ballColor: number | string): void {
        const theBall = createBall(this.texture, this.globalUniforms.time, ballColor);
        theBall.renderOrder = 9999;
        this.scene.add(theBall);
    }

    private addBackground(): void {
        const background = createBackground(this.globalUniforms.time);
        this.scene.add(background);
    }

    private startAnimationLoop(): void {
        this.renderer.setAnimationLoop(() => {
            const time = this.clock.getElapsedTime();
            this.globalUniforms.time.value = time;
            this.controls.update();
            update();
            this.renderer.render(this.scene, this.camera);
        });
    }

    private setNewText(text: string, lineSeparator: string): void {
        this.globalUniforms.text.value = createAnswerTextures(text, lineSeparator);
    }

    private generateAnimation(param: { value: number }, valStart: number, valEnd: number, duration = 1000, delay = 0): TweenValue {
        return new Tween<{ val: number }>({ val: valStart })
            .to({ val: valEnd }, duration)
            .delay(delay)
            .onUpdate((val) => {
                param.value = val.val;
            });
    }
}
