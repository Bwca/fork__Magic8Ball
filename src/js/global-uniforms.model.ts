import { CanvasTexture } from 'three';

export interface GlobalUniforms {
    time: {
        value: number;
    };
    baseVisibility: {
        value: number;
    };
    textVisibility: {
        value: number;
    };
    text: {
        value: CanvasTexture | null;
    };
}
