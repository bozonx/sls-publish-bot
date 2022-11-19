
export default interface PollData {
  question: string;
  options: string[];
  isClosed: false,
  isAnonymous: boolean,
  type: 'regular' | 'quiz',
  multipleAnswers?: boolean;
  correctOptionId?: number;
  // explanation in incorrect answer case in quiz
  explanation?: string;
}
