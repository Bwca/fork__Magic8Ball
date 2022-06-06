import { MathUtils } from 'three';

import { THREEBall8Renderer } from './three-ball-8-renderer/three-ball-8-renderer.class';

const DEFAULT_ANSWERS: string[] = [
    'It|is|certain',
    'It is|decidedly|so',
    'Without|a doubt',
    'Yes -|definitely',
    'You may|rely|on it',

    'As I|see it,|yes',
    'Most|likely',
    'Outlook|good',
    'Signs|point|to yes',
    'Yes',

    'Reply|hazy,|try|again',
    'Ask|again|later',
    'Better not|tell you|now',
    'Cannot|predict|now',
    'Concentrate|and ask|again',

    'Don’t|count|on it',
    'My|reply|is no',
    'My|sources|say no',
    'Outlook|not so|good',
    'Very|doubtful',
];

document.addEventListener('DOMContentLoaded', () => {
    const renderer = new THREEBall8Renderer();
    renderer.showBall();

    window.addEventListener('pointerup', (event) => {
        renderer.hideAnswer();
        const answer = DEFAULT_ANSWERS[MathUtils.randInt(0, DEFAULT_ANSWERS.length - 1)];
        renderer.showAnswer({
            answer,
            lineSeparator: '|',
            event,
        });
    });
});
