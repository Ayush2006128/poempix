'use server';

/**
 * @fileOverview Generates a photo from a poem using GenAI.
 *
 * - generatePhotoFromPoem - A function that generates a photo from a poem.
 * - GeneratePhotoFromPoemInput - The input type for the generatePhotoFromPoem function.
 * - GeneratePhotoFromPoemOutput - The return type for the generatePhotoFromPoem function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GeneratePhotoFromPoemInputSchema = z.object({
  poem: z.string().describe('The poem to generate a photo from.'),
});
export type GeneratePhotoFromPoemInput = z.infer<typeof GeneratePhotoFromPoemInputSchema>;

const GeneratePhotoFromPoemOutputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      'The generated photo as a data URI that must include a MIME type and use Base64 encoding. Expected format: \'data:<mimetype>;base64,<encoded_data>\'.' // Per guidance, should document data uris like this.
    ),
});
export type GeneratePhotoFromPoemOutput = z.infer<typeof GeneratePhotoFromPoemOutputSchema>;

export async function generatePhotoFromPoem(input: GeneratePhotoFromPoemInput): Promise<GeneratePhotoFromPoemOutput> {
  return generatePhotoFromPoemFlow(input);
}

const generatePhotoFromPoemPrompt = ai.definePrompt({
  name: 'generatePhotoFromPoemPrompt',
  input: {schema: GeneratePhotoFromPoemInputSchema},
  output: {schema: GeneratePhotoFromPoemOutputSchema},
  prompt: `Generate a photo inspired by the following poem:\n\n{{{poem}}}`, // Correct handlebars syntax here.
  config: {
    safetySettings: [
      {
        category: 'HARM_CATEGORY_HATE_SPEECH',
        threshold: 'BLOCK_ONLY_HIGH',
      },
      {
        category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
        threshold: 'BLOCK_NONE',
      },
      {
        category: 'HARM_CATEGORY_HARASSMENT',
        threshold: 'BLOCK_MEDIUM_AND_ABOVE',
      },
      {
        category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
        threshold: 'BLOCK_LOW_AND_ABOVE',
      },
    ],
  },
});

const generatePhotoFromPoemFlow = ai.defineFlow(
  {
    name: 'generatePhotoFromPoemFlow',
    inputSchema: GeneratePhotoFromPoemInputSchema,
    outputSchema: GeneratePhotoFromPoemOutputSchema,
  },
  async input => {
    const {media} = await ai.generate({
      // IMPORTANT: ONLY the googleai/gemini-2.0-flash-exp model is able to generate images. You MUST use exactly this model to generate images.
      model: 'googleai/gemini-2.0-flash-exp',
      prompt: input.poem,
      config: {
        responseModalities: ['TEXT', 'IMAGE'], // MUST provide both TEXT and IMAGE, IMAGE only won't work
      },
    });

    return {photoDataUri: media.url!};
  }
);
