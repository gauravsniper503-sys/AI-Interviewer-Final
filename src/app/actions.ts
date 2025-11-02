'use server';

import {
  generateInterviewQuestions,
  type GenerateInterviewQuestionsOutput,
  type GenerateInterviewQuestionsInput,
} from '@/ai/flows/generate-interview-questions';
import {
  provideAnswerFeedback,
  type ProvideAnswerFeedbackOutput,
} from '@/ai/flows/provide-answer-feedback';

export async function startInterviewAction(
  params: GenerateInterviewQuestionsInput
): Promise<GenerateInterviewQuestionsOutput> {
  try {
    const response = await generateInterviewQuestions(params);
    return response;
  } catch (error) {
    console.error('Error starting interview:', error);
    // This will be caught by the client
    throw new Error('Failed to generate interview questions.');
  }
}

export async function getFeedbackAction(
  question: string,
  answer: string,
  interviewType: string
): Promise<{
  question: string;
  answer: string;
  feedback: string;
  suggestedAnswer: string;
}> {
  try {
    const response = await provideAnswerFeedback({
      question,
      answer,
      interviewType,
    });
    return {
      question,
      answer,
      feedback: response.feedback,
      suggestedAnswer: response.suggestedAnswer,
    };
  } catch (error) {
    console.error('Error getting feedback:', error);
    throw new Error('Failed to generate feedback for the answer.');
  }
}
