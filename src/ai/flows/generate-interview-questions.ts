'use server';

/**
 * @fileOverview A flow to generate interview questions based on the selected interview type.
 *
 * - generateInterviewQuestions - A function that generates interview questions.
 * - GenerateInterviewQuestionsInput - The input type for the generateInterviewQuestions function.
 * - GenerateInterviewQuestionsOutput - The return type for the generateInterviewQuestions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateInterviewQuestionsInputSchema = z.object({
  interviewType: z
    .string()
    .describe('The type of interview to generate questions for.'),
  numberOfQuestions: z
    .number()
    .min(5)
    .max(10)
    .default(8)
    .describe('The number of interview questions to generate (between 5 and 10).'),
});
export type GenerateInterviewQuestionsInput = z.infer<
  typeof GenerateInterviewQuestionsInputSchema
>;

const GenerateInterviewQuestionsOutputSchema = z.object({
  questions: z.array(z.string()).describe('The generated interview questions.'),
});
export type GenerateInterviewQuestionsOutput = z.infer<
  typeof GenerateInterviewQuestionsOutputSchema
>;

export async function generateInterviewQuestions(
  input: GenerateInterviewQuestionsInput
): Promise<GenerateInterviewQuestionsOutput> {
  return generateInterviewQuestionsFlow(input);
}

const interviewQuestionsPrompt = ai.definePrompt({
  name: 'interviewQuestionsPrompt',
  input: {schema: GenerateInterviewQuestionsInputSchema},
  output: {schema: GenerateInterviewQuestionsOutputSchema},
  prompt: `You are an AI Interviewer. Your task is to generate a realistic interview for the user based on the chosen "Interview Type".

  Interview Type: {{{interviewType}}}

  Generate a list of {{numberOfQuestions}} interview questions relevant to the specified interview type. Include a mix of technical, behavioral, and situational questions, if applicable.
  The questions should be appropriate for the interview type specified.
  The questions must be different and must not be repeated. They should also be interesting to answer.
  Return the questions as a JSON array of strings.
  `,
});

const generateInterviewQuestionsFlow = ai.defineFlow(
  {
    name: 'generateInterviewQuestionsFlow',
    inputSchema: GenerateInterviewQuestionsInputSchema,
    outputSchema: GenerateInterviewQuestionsOutputSchema,
  },
  async input => {
    const {output} = await interviewQuestionsPrompt(input);
    return output!;
  }
);
