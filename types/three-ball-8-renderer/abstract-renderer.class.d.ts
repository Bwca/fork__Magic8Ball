import { AnswerPayload } from './answer-payload.model';
export declare abstract class AbstractRenderer {
    abstract showBall(host: HTMLElement): void;
    abstract showAnswer(answerPayload: AnswerPayload): void;
}
