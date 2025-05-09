"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Wand2, Loader2 } from "lucide-react";

const formSchema = z.object({
  poem: z.string()
    .min(10, "Poem must be at least 10 characters long.")
    .max(2000, "Poem cannot exceed 2000 characters."),
});

type PoemInputFormProps = {
  onSubmit: (poem: string) => void;
  isLoading: boolean;
};

export default function PoemInputForm({ onSubmit, isLoading }: PoemInputFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      poem: "",
    },
  });

  function handleSubmit(values: z.infer<typeof formSchema>) {
    onSubmit(values.poem);
  }

  return (
    <Card className="shadow-xl rounded-lg overflow-hidden">
      <CardHeader className="bg-card-foreground/5 p-6">
        <div className="flex items-center space-x-3">
          <Wand2 className="h-7 w-7 text-primary" />
          <CardTitle className="text-xl sm:text-2xl">Craft Your Vision</CardTitle>
        </div>
        <CardDescription className="pt-1">Let our AI weave its magic and illustrate your words.</CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="poem"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">Your Poem</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Paste or type your poem here...\n\nExample:\nThe woods are lovely, dark and deep,\nBut I have promises to keep,\nAnd miles to go before I sleep,\nAnd miles to go before I sleep."
                      className="min-h-[180px] text-base resize-y rounded-md focus:ring-primary focus:border-primary"
                      {...field}
                      aria-label="Poem input area"
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormDescription className="text-xs">
                    Enter a poem (10-2000 characters) to generate an image.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button 
              type="submit" 
              disabled={isLoading} 
              className="w-full text-md sm:text-lg py-3 rounded-md transition-all duration-150 ease-in-out transform hover:scale-[1.02] focus:scale-[1.02] active:scale-[0.98]"
              size="lg"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Wand2 className="mr-2 h-5 w-5" />
                  Generate Photo
                </>
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
