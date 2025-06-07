
import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { quizApi, Quiz } from "@/services/api";

const QuizList = () => {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [approvingIds, setApprovingIds] = useState<Set<string>>(new Set());
  const { toast } = useToast();

  const fetchQuizzes = async () => {
    try {
      setIsLoading(true);
      const data = await quizApi.getAllQuizzes();
      setQuizzes(data);
    } catch (error: any) {
      console.error('Error fetching quizzes:', error);
      toast({
        title: "Error",
        description: "Failed to fetch quizzes",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleApprove = async (quizId: string) => {
    setApprovingIds(prev => new Set(prev).add(quizId));
    
    try {
      await quizApi.approveQuiz(quizId);
      toast({
        title: "Success",
        description: "Quiz approved and email sent successfully!",
      });
      // Refresh the quiz list to get updated status
      await fetchQuizzes();
    } catch (error: any) {
      console.error('Error approving quiz:', error);
      toast({
        title: "Error",
        description: error.response?.data?.detail || "Failed to approve quiz",
        variant: "destructive",
      });
    } finally {
      setApprovingIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(quizId);
        return newSet;
      });
    }
  };

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'draft':
        return 'bg-yellow-100 text-yellow-800';
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading quizzes...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Quiz Management</h1>
            <p className="text-muted-foreground">Manage all your created quizzes</p>
          </div>
          <Button onClick={fetchQuizzes} variant="outline">
            Refresh
          </Button>
        </div>

        {quizzes.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <p className="text-muted-foreground mb-4">No quizzes found</p>
              <Button onClick={() => window.location.href = '/create'}>
                Create Your First Quiz
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {quizzes.map((quiz) => (
              <Card key={quiz.quiz_id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle className="text-lg">{quiz.title}</CardTitle>
                      <p className="text-sm text-muted-foreground font-mono">
                        ID: {quiz.quiz_id}
                      </p>
                    </div>
                    <Badge className={getStatusColor(quiz.status)}>
                      {quiz.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">
                        Google Form URL:
                      </label>
                      <div className="flex space-x-2 mt-1">
                        <input
                          type="text"
                          value={quiz.form_url}
                          readOnly
                          className="flex-1 p-2 bg-muted rounded font-mono text-sm"
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => window.open(quiz.form_url, '_blank')}
                        >
                          Open
                        </Button>
                      </div>
                    </div>
                    
                    <div className="flex space-x-2">
                      <Button
                        onClick={() => handleApprove(quiz.quiz_id)}
                        disabled={approvingIds.has(quiz.quiz_id) || quiz.status === 'approved'}
                        className="flex-1"
                      >
                        {approvingIds.has(quiz.quiz_id) 
                          ? "Approving..." 
                          : quiz.status === 'approved' 
                          ? "Already Approved" 
                          : "Approve & Send Email"
                        }
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default QuizList;
