import { THREEBall8Renderer } from './three-ball-8-renderer.class';

document.addEventListener('DOMContentLoaded', () => {
    const renderer = new THREEBall8Renderer();
    renderer.showBall();
    renderer.showAnswer('WOW');
    setTimeout(() => {
        renderer.showAnswer('finally|re-wrote it|to classes');
    }, 5000);
});
