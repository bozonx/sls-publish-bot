
export default interface PollData {
  question: string;
  options: string[];
  isAnonymous: boolean,
  type: 'regular' | 'quiz',

  isClosed?: false,
  multipleAnswers?: boolean;
  correctOptionId?: number;
  // explanation in incorrect answer case in quiz
  explanation?: string;
}
