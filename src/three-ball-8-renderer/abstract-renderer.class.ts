import { AnswerPayload } from './answer-payload.model';

export abstract class AbstractRenderer {
    // eslint-disable-next-line no-unused-vars
    public abstract showBall(host: HTMLElement): void;
    // eslint-disable-next-line no-unused-vars
    public abstract showAnswer(answerPayload: AnswerPayload): void;
    public abstract hideAnswer(): void;
}
