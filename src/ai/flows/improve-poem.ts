'use server';

/**
 * @fileOverview An AI agent that improves a poem.
 *
 * - improvePoem - A function that handles the poem improvement process.
 * - ImprovePoemInput - The input type for the improvePoem function.
 * - ImprovePoemOutput - The return type for the improvePoem function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ImprovePoemInputSchema = z.object({
  poem: z.string().describe('The poem to improve.'),
});
export type ImprovePoemInput = z.infer<typeof ImprovePoemInputSchema>;

const ImprovePoemOutputSchema = z.object({
  improvedPoem: z.string().describe('The improved poem.'),
});
export type ImprovePoemOutput = z.infer<typeof ImprovePoemOutputSchema>;

export async function improvePoem(input: ImprovePoemInput): Promise<ImprovePoemOutput> {
  return improvePoemFlow(input);
}

const prompt = ai.definePrompt({
  name: 'improvePoemPrompt',
  input: {schema: ImprovePoemInputSchema},
  output: {schema: ImprovePoemOutputSchema},
  prompt: `You are an expert poet. Please improve the following poem, refining its imagery and rhythm:

Poem: {{{poem}}}`,
});

const improvePoemFlow = ai.defineFlow(
  {
    name: 'improvePoemFlow',
    inputSchema: ImprovePoemInputSchema,
    outputSchema: ImprovePoemOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
