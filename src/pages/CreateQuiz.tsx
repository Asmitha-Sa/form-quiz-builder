
import { useState } from "react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { quizApi } from "@/services/api";

const CreateQuiz = () => {
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!content.trim()) {
      toast({
        title: "Error",
        description: "Please enter quiz content",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setResult(null);

    try {
      const response = await quizApi.createQuiz({ content });
      setResult(response);
      setContent("");
      toast({
        title: "Success",
        description: "Quiz created successfully!",
      });
    } catch (error: any) {
      console.error('Error creating quiz:', error);
      toast({
        title: "Error",
        description: error.response?.data?.detail || "Failed to create quiz",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-foreground">Create New Quiz</h1>
          <p className="text-muted-foreground">
            Paste your quiz content in MCQ format below
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Quiz Content</CardTitle>
            <CardDescription>
              Enter your questions in the format: Question, multiple choice options (A, B, C), and the correct answer
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder={`Paste your quiz text here (MCQ format)

Example:
Q1: What is the capital of India?
A) Mumbai
B) New Delhi
C) Chennai
Answer: B

Q2: 5 + 3 = ?
A) 7
B) 8
C) 9
Answer: B`}
                className="min-h-[300px] font-mono text-sm"
              />
              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading ? "Creating Quiz..." : "Create Quiz"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {result && (
          <Card>
            <CardHeader>
              <CardTitle className="text-green-600">Quiz Created Successfully!</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Quiz ID:</label>
                  <p className="font-mono text-sm bg-muted p-2 rounded">{result.quiz_id}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Title:</label>
                  <p className="font-semibold">{result.title}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Status:</label>
                  <span className="inline-block bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-sm">
                    {result.status}
                  </span>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Google Form URL:</label>
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={result.form_url}
                      readOnly
                      className="flex-1 p-2 bg-muted rounded font-mono text-sm"
                    />
                    <Button
                      variant="outline"
                      onClick={() => window.open(result.form_url, '_blank')}
                    >
                      Open Form
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
};

export default CreateQuiz;
