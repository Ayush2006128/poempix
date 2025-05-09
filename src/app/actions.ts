"use server";

import { generatePhotoFromPoem, GeneratePhotoFromPoemInput } from "@/ai/flows/generate-photo-from-poem";
import type { GeneratePhotoFromPoemOutput } from "@/ai/flows/generate-photo-from-poem";

export async function handleGeneratePhotoAction(
  poem: string
): Promise<{ photoDataUri: string } | { error: string }> {
  if (!poem || poem.trim().length === 0) {
    return { error: "Poem content cannot be empty." };
  }
  if (poem.trim().length < 10) {
    return { error: "Poem must be at least 10 characters long." };
  }
  if (poem.trim().length > 2000) {
    return { error: "Poem cannot exceed 2000 characters." };
  }

  const input: GeneratePhotoFromPoemInput = { poem };

  try {
    const output: GeneratePhotoFromPoemOutput = await generatePhotoFromPoem(input);
    
    if (!output.photoDataUri) {
      return { error: "AI failed to generate an image. The data URI is missing." };
    }
    
    // Validate if it's a data URI for an image
    if (!output.photoDataUri.startsWith('data:image')) {
        console.error("Generated output is not a valid image data URI:", output.photoDataUri.substring(0,100)); // Log only a part for brevity
        return { error: "AI generated invalid image data. Please try a different poem or try again later." };
    }

    return { photoDataUri: output.photoDataUri };
  } catch (error: any) {
    console.error("Error generating photo from poem:", error);
    
    let errorMessage = "An unexpected error occurred while generating the image.";
    if (error.message) {
        if (error.message.includes("SAFETY") || error.message.includes("policy") || error.message.includes("PROMPT_BLOCKED")) {
            errorMessage = "The poem could not be processed due to content policies. Please revise your poem and try again.";
        } else if (error.message.includes("quota") || error.message.includes("resource exhausted")) {
            errorMessage = "The image generation service is temporarily unavailable due to high demand or resource limits. Please try again later.";
        } else if (error.message.includes("model")) {
             errorMessage = "There was an issue with the AI model. Please try again later.";
        } else {
             errorMessage = `Failed to generate image.`; // Avoid exposing detailed internal errors directly to user
        }
    }
    return { error: errorMessage };
  }
}
