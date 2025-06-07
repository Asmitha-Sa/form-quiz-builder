
import { Link } from "react-router-dom";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const Index = () => {
  return (
    <Layout>
      <div className="text-center space-y-8">
        <div className="space-y-4">
          <h1 className="text-4xl font-bold text-foreground">Quiz Management System</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Create and manage quizzes with Google Forms integration. Submit quiz content, 
            generate forms automatically, and send them via email.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Create Quiz</CardTitle>
              <CardDescription>
                Submit your quiz content in MCQ format and generate a Google Form automatically
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link to="/create">
                <Button className="w-full">Start Creating</Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Manage Quizzes</CardTitle>
              <CardDescription>
                View all your created quizzes, access form links, and approve quizzes for distribution
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link to="/list">
                <Button variant="outline" className="w-full">View Quizzes</Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        <div className="bg-muted p-6 rounded-lg max-w-2xl mx-auto">
          <h3 className="font-semibold mb-2">Example Quiz Format:</h3>
          <pre className="text-sm text-left bg-background p-4 rounded border">
{`Q1: What is the capital of India?
A) Mumbai
B) New Delhi
C) Chennai
Answer: B

Q2: 5 + 3 = ?
A) 7
B) 8
C) 9
Answer: B`}
          </pre>
        </div>
      </div>
    </Layout>
  );
};

export default Index;
