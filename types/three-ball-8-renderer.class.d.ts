declare abstract class AbstractRenderer {
    abstract showBall(host: HTMLElement): void;
    abstract question(): void;
    abstract hideAnswer(): void;
    abstract showAnswer(answer: string, lineSeparator: string): void;
}
export declare class THREEBall8Renderer implements AbstractRenderer {
    private readonly globalUniforms;
    private readonly scene;
    private texture;
    private camera;
    private renderer;
    private controls;
    private readonly clock;
    private readonly createAnswerTextures;
    constructor();
    showBall(host?: HTMLElement): void;
    hideAnswer(): void;
    question(): void;
    showAnswer(answer: string, lineSeparator: string): void;
    private get hideText();
    private get showText();
    private setupControls;
    private setupCamera;
    private setupRenderer;
    private loadTexture;
    private addLighting;
    private addWriting;
    private addTheBall;
    private addBackground;
    private startAnimationLoop;
    private setNewText;
    private generateAnimation;
}
export {};
