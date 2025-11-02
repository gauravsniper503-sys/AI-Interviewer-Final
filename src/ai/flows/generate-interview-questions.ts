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
    .min(1)
    .max(50)
    .default(8)
    .describe('The number of interview questions to generate (between 1 and 50).'),
  difficulty: z
    .enum(['Low', 'Medium', 'Hard'])
    .default('Medium')
    .describe('The difficulty level of the interview questions.'),
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
  prompt: `You are an AI Interviewer. Your task is to generate a realistic interview for the user based on the chosen "Interview Type" and "Difficulty".

  Interview Type: {{{interviewType}}}
  Difficulty: {{{difficulty}}}

  Generate a list of {{numberOfQuestions}} interview questions relevant to the specified interview type and difficulty.
  - For "Low" difficulty, ask basic, foundational questions.
  - For "Medium" difficulty, ask more in-depth and scenario-based questions.
  - For "Hard" difficulty, ask complex, challenging, and multi-part questions.

  Include a mix of technical, behavioral, and situational questions, if applicable.
  The questions should be appropriate for the interview type and difficulty specified.
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
