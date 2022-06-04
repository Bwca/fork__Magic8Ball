import { PlaneGeometry, MeshBasicMaterial, InstancedMesh } from 'three';
import { GlobalUniforms } from './models/global-uniforms.model';
export declare function createTextInscription({ textBackgroundVisibility: baseVisibility, textVisibility, text, }: GlobalUniforms): InstancedMesh<PlaneGeometry, MeshBasicMaterial>;
