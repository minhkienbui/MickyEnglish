import { expect, test } from 'vitest';
import { useExamStore } from '../src/stores/useExamStore';
import { mockExams } from '../src/data/mockExams';

test('startExam initializes exam session and timer', () => {
  const exam = mockExams[0];
  const { startExam } = useExamStore.getState();

  startExam(exam);
  const state = useExamStore.getState();
  expect(state.activeExam?.id).toBe(exam.id);
  expect(state.userAnswers).toEqual({});
  expect(state.isCompleted).toBe(false);
});

test('submitExam calculates total score and accuracy', () => {
  const exam = mockExams[0];
  const { startExam, selectAnswer, submitExam } = useExamStore.getState();

  startExam(exam);
  if (exam.questions && exam.questions.length > 0) {
    selectAnswer(String(exam.questions[0].id), exam.questions[0].correctAnswer);
  }

  const result = submitExam();
  expect(result.totalQuestions).toBe(3544);
  expect(result.correctCount).toBe(1);
});
