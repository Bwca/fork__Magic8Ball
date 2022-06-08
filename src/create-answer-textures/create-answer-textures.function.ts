import { CanvasTexture } from 'three';

import { CreateAnswerTexturesPayload } from '../models';

export function createAnswerTextures({ answer, fontParams }: CreateAnswerTexturesPayload): CanvasTexture {
    const answerLines = answer.text.split(answer.lineSeparator);
    const { fillStyle, font, size, sizeRatio } = fontParams;
    const side = 256;
    const canvasElement = document.createElement('canvas');
    canvasElement.width = canvasElement.height = side;
    const ctx = canvasElement.getContext('2d');
    if (!ctx) {
        throw Error('Could not obtain 2d context for answer!');
    }
    ctx.clearRect(0, 0, side, side);
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = font;

    const startPoint = (answerLines.length - 1) * 0.5 * size * sizeRatio;
    ctx.fillStyle = fillStyle;
    const halfSide = (side - 2) / 2;
    answerLines.forEach((pc, idx) => {
        ctx.fillText(pc.toUpperCase(), halfSide, halfSide - startPoint + idx * size * sizeRatio);
    });

    return new CanvasTexture(canvasElement);
}
