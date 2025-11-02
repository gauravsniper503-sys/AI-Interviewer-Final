'use server';

/**
 * @fileOverview Generates feedback on user answers to interview questions.
 *
 * - provideAnswerFeedback - A function that generates feedback for a given question and answer.
 * - ProvideAnswerFeedbackInput - The input type for the provideAnswerFeedback function.
 * - ProvideAnswerFeedbackOutput - The return type for the provideAnswerFeedback function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ProvideAnswerFeedbackInputSchema = z.object({
  question: z.string().describe('The interview question asked.'),
  answer: z.string().describe('The user’s answer to the question.'),
  interviewType: z.string().describe('The type of interview being conducted.'),
});
export type ProvideAnswerFeedbackInput = z.infer<
  typeof ProvideAnswerFeedbackInputSchema
>;

const ProvideAnswerFeedbackOutputSchema = z.object({
  feedback: z
    .string()
    .describe(
      'Constructive feedback on the user’s answer, highlighting strengths and areas for improvement.'
    ),
  suggestedAnswer: z
    .string()
    .describe(
      'An ideal or correct answer to the interview question for user reference.'
    ),
});
export type ProvideAnswerFeedbackOutput = z.infer<
  typeof ProvideAnswerFeedbackOutputSchema
>;

export async function provideAnswerFeedback(
  input: ProvideAnswerFeedbackInput
): Promise<ProvideAnswerFeedbackOutput> {
  return provideAnswerFeedbackFlow(input);
}

const provideAnswerFeedbackPrompt = ai.definePrompt({
  name: 'provideAnswerFeedbackPrompt',
  input: {schema: ProvideAnswerFeedbackInputSchema},
  output: {schema: ProvideAnswerFeedbackOutputSchema},
  prompt: `You are an AI Interviewer providing feedback on interview answers.

  Interview Type: {{interviewType}}

  Question: {{question}}
  Answer: {{answer}}

  Your task is to provide two things in the output:
  1.  **feedback**: Constructive feedback on the user's answer. Highlight what was good and suggest improvements. Be clear, constructive, professional, and concise. Keep the feedback to 2-3 sentences.
  2.  **suggestedAnswer**: A well-structured, ideal answer to the question. This should serve as a model for the user to learn from. Keep it brief and to the point.

  Generate the feedback and the suggested answer based on the provided question and answer. Both should be short.
  `,
});

const provideAnswerFeedbackFlow = ai.defineFlow(
  {
    name: 'provideAnswerFeedbackFlow',
    inputSchema: ProvideAnswerFeedbackInputSchema,
    outputSchema: ProvideAnswerFeedbackOutputSchema,
  },
  async input => {
    const {output} = await provideAnswerFeedbackPrompt(input);
    return output!;
  }
);
