"use client";

import { useState, useEffect } from 'react';
import PoemInputForm from '@/components/poem-input-form';
import PhotoDisplay from '@/components/photo-display';
import { handleGeneratePhotoAction } from '@/app/actions';
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { Card, CardContent } from '@/components/ui/card';

export default function PoemPixPage() {
  const [poem, setPoem] = useState<string>('');
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleSubmitPoem = async (submittedPoem: string) => {
    setPoem(submittedPoem);
    setIsLoading(true);
    setError(null);
    setGeneratedImageUrl(null); 

    try {
      const result = await handleGeneratePhotoAction(submittedPoem);
      if (result.error) {
        setError(result.error);
        toast({
          title: "Error Generating Photo",
          description: result.error,
          variant: "destructive",
          duration: 5000,
        });
        setGeneratedImageUrl(null);
      } else {
        setGeneratedImageUrl(result.photoDataUri);
      }
    } catch (e: any) {
      const errorMessage = e.message || "An unexpected error occurred.";
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
        duration: 5000,
      });
      setGeneratedImageUrl(null);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center py-8 sm:py-12 px-4">
      <header className="mb-8 sm:mb-12 text-center">
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight" style={{ fontFamily: 'var(--font-geist-sans)' }}>
          Poem<span className="text-primary">Pix</span>
        </h1>
        <p className="text-muted-foreground mt-2 text-md sm:text-lg max-w-prose">
          Transform your poetic verses into stunning visuals with the magic of AI.
        </p>
      </header>

      <main className="w-full max-w-2xl space-y-8">
        <PoemInputForm onSubmit={handleSubmitPoem} isLoading={isLoading} />

        {isLoading && (
          <Card className="shadow-lg">
            <CardContent className="p-6 sm:p-10 flex flex-col items-center justify-center">
              <Loader2 className="h-10 w-10 sm:h-12 sm:w-12 animate-spin text-primary mb-4" />
              <p className="text-md sm:text-lg text-muted-foreground">Generating your masterpiece...</p>
              <p className="text-sm text-muted-foreground/80 mt-1">This may take a moment.</p>
            </CardContent>
          </Card>
        )}

        {error && !isLoading && (
           <Card className="shadow-md bg-destructive/10 border-destructive">
            <CardContent className="p-6">
              <h3 className="font-semibold text-destructive mb-2 text-lg">Generation Failed</h3>
              <p className="text-destructive/90">{error}</p>
            </CardContent>
           </Card>
        )}
        
        {!isLoading && generatedImageUrl && (
          <PhotoDisplay imageUrl={generatedImageUrl} poemTitle={poem.substring(0,30)} />
        )}
      </main>
      
      <footer className="mt-12 sm:mt-16 text-center text-muted-foreground text-xs sm:text-sm">
        <p>&copy; {new Date().getFullYear()} PoemPix. All rights reserved.</p>
      </footer>
    </div>
  );
}
