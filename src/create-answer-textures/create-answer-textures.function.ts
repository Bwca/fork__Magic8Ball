import { CanvasTexture } from 'three';

export function createAnswerTextures(answer: string, lineSeparator: string): CanvasTexture {
    const answerLines = answer.split(lineSeparator);
    const canvasElement = document.createElement('canvas');
    canvasElement.width = canvasElement.height = 256;
    const ctx = canvasElement.getContext('2d');
    if (!ctx) {
        throw Error('Could not obtain 2d context for answer!');
    }
    ctx.clearRect(0, 0, 256, 256);
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    const size = 30;
    const sizeRatio = 1.0;
    ctx.font = `bold ${size}px 'Courier New'`;

    const startPoint = (answerLines.length - 1) * 0.5 * size * sizeRatio;
    ctx.fillStyle = '#fff';
    answerLines.forEach((pc, idx) => {
        ctx.fillText(pc.toUpperCase(), 127, 127 - startPoint + idx * size * sizeRatio);
    });

    return new CanvasTexture(canvasElement);
}
