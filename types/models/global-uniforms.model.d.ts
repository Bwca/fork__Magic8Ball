import { CanvasTexture } from 'three';
import { Value } from './value.model';
export interface GlobalUniforms {
    time: Value;
    textBackgroundVisibility: Value;
    textVisibility: Value;
    text: Value<CanvasTexture | null>;
}
