import { Answer } from './answer.model';
import { FontParams } from './font-pafams.model';

export interface CreateAnswerTexturesPayload {
    answer: Answer;
    fontParams: FontParams;
}
