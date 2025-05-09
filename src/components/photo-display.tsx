"use client";

import NextImage from "next/image";
import { Button } from "@/components/ui/button";
import { Download, ImageOff } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useEffect, useState } from "react";

type PhotoDisplayProps = {
  imageUrl: string | null;
  poemTitle?: string | null;
};

export default function PhotoDisplay({ imageUrl, poemTitle }: PhotoDisplayProps) {
  const [isImageVisible, setIsImageVisible] = useState(false);
  const [imageLoadError, setImageLoadError] = useState(false);

  useEffect(() => {
    if (imageUrl) {
      setIsImageVisible(false); 
      setImageLoadError(false);
      // Delay slightly to ensure CSS transition triggers on new image
      const timer = setTimeout(() => setIsImageVisible(true), 50);
      return () => clearTimeout(timer);
    } else {
      setIsImageVisible(false);
    }
  }, [imageUrl]);

  if (!imageUrl) {
    return null;
  }

  const handleDownload = () => {
    if (imageLoadError || !imageUrl) return;
    const link = document.createElement("a");
    link.href = imageUrl;
    const safePoemTitle = poemTitle ? poemTitle.replace(/[^\w\s]/gi, '').replace(/\s+/g, '_') : 'poem';
    const fileName = `${safePoemTitle}_poempix.png`;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Card 
      className={`shadow-xl rounded-lg overflow-hidden transition-all duration-700 ease-in-out ${isImageVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}
      aria-live="polite"
    >
      <CardHeader className="bg-card-foreground/5 p-6">
        <CardTitle className="text-xl sm:text-2xl">Your Visualized Poem</CardTitle>
        {poemTitle && <CardDescription>An artistic interpretation of "{poemTitle}"</CardDescription>}
      </CardHeader>
      <CardContent className="p-6 flex justify-center items-center bg-muted/30">
        {imageLoadError ? (
          <div className="w-full aspect-square max-w-md flex flex-col items-center justify-center bg-muted rounded-md p-4">
            <ImageOff className="w-16 h-16 text-destructive mb-4" />
            <p className="text-destructive font-semibold">Could not load image</p>
            <p className="text-sm text-muted-foreground text-center">The generated image data might be corrupted or unsupported.</p>
          </div>
        ) : (
          <div className="relative w-full aspect-square max-w-md rounded-lg overflow-hidden shadow-md border border-border">
            <NextImage
              src={imageUrl}
              alt={poemTitle ? `Generated image for poem: ${poemTitle}` : "Generated image from poem"}
              fill
              style={{ objectFit: "cover" }}
              data-ai-hint="artistic interpretation"
              priority
              onLoad={() => setImageLoadError(false)}
              onError={() => setImageLoadError(true)}
              unoptimized={imageUrl.startsWith('data:image')} // Recommended for data URIs if issues arise, though usually fine
            />
          </div>
        )}
      </CardContent>
      <CardFooter className="p-6 flex justify-center">
        <Button 
          onClick={handleDownload} 
          variant="outline" 
          className="text-base py-3 px-6 rounded-md transition-all duration-150 ease-in-out transform hover:scale-105 focus:scale-105 active:scale-95"
          disabled={imageLoadError || !imageUrl}
          aria-label="Download generated image"
        >
          <Download className="mr-2 h-5 w-5" />
          Download Image
        </Button>
      </CardFooter>
    </Card>
  );
}
