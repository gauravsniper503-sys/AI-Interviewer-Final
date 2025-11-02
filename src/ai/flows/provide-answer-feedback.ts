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
  answer: z.string().describe('The user\u2019s answer to the question.'),
  interviewType: z.string().describe('The type of interview being conducted.'),
});
export type ProvideAnswerFeedbackInput = z.infer<
  typeof ProvideAnswerFeedbackInputSchema
>;

const ProvideAnswerFeedbackOutputSchema = z.object({
  feedback: z.string().describe('Constructive feedback on the user\u2019s answer.'),
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

  Provide constructive feedback, highlighting strengths, weaknesses, and suggestions for improvement. Be clear, constructive, and professional.
  Highlight what was good in the answer. Suggest how to improve it for real interviews.
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
