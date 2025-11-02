'use client';

import { useState, useEffect, useCallback, type FC } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { getFeedbackAction, startInterviewAction } from '@/app/actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { Logo } from '@/components/logo';
import { ArrowRight, Home, Loader2, Sparkles, Terminal } from 'lucide-react';

type InterviewState =
  | 'LOADING_QUESTIONS'
  | 'IN_PROGRESS'
  | 'GENERATING_FEEDBACK'
  | 'RESULTS'
  | 'ERROR';

type FeedbackResult = {
  question: string;
  answer: string;
  feedback: string;
};

export default function InterviewClient({
  interviewType,
}: {
  interviewType: string;
}) {
  const [interviewState, setInterviewState] =
    useState<InterviewState>('LOADING_QUESTIONS');
  const [questions, setQuestions] = useState<string[]>([]);
  const [answers, setAnswers] = useState<string[]>([]);
  const [feedbackResults, setFeedbackResults] = useState<FeedbackResult[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    const startInterview = async () => {
      try {
        const { questions: fetchedQuestions } = await startInterviewAction(
          interviewType
        );
        if (fetchedQuestions && fetchedQuestions.length > 0) {
          setQuestions(fetchedQuestions);
          setInterviewState('IN_PROGRESS');
        } else {
          throw new Error('No questions were generated.');
        }
      } catch (error) {
        setErrorMessage(
          'Failed to start the interview. Please try a different topic or check your connection.'
        );
        setInterviewState('ERROR');
        toast({
          variant: 'destructive',
          title: 'Error',
          description: (error as Error).message,
        });
      }
    };
    startInterview();
  }, [interviewType, toast]);

  const handleGenerateFeedback = useCallback(async (finalAnswers: string[]) => {
    setInterviewState('GENERATING_FEEDBACK');
    try {
      const feedbackPromises = questions.map((question, index) =>
        getFeedbackAction(question, finalAnswers[index], interviewType)
      );
      const results = await Promise.all(feedbackPromises);
      setFeedbackResults(results);
      setInterviewState('RESULTS');
    } catch (error) {
      setErrorMessage(
        'Failed to generate feedback. You can still see your answers below.'
      );
      setInterviewState('ERROR');
      toast({
        variant: 'destructive',
        title: 'Feedback Error',
        description: (error as Error).message,
      });
    }
  }, [questions, interviewType, toast]);

  const handleNextQuestion = () => {
    if (currentAnswer.trim() === '') {
      toast({
        variant: 'destructive',
        title: 'Empty Answer',
        description: 'Please provide an answer before proceeding.',
      });
      return;
    }

    const newAnswers = [...answers, currentAnswer];
    setAnswers(newAnswers);
    setCurrentAnswer('');

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      handleGenerateFeedback(newAnswers);
    }
  };

  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  const Views: Record<InterviewState, JSX.Element> = {
    LOADING_QUESTIONS: <LoadingView />,
    IN_PROGRESS: (
      <InProgressView
        interviewType={interviewType}
        question={questions[currentQuestionIndex]}
        questionNumber={currentQuestionIndex + 1}
        totalQuestions={questions.length}
        progress={progress}
        currentAnswer={currentAnswer}
        setCurrentAnswer={setCurrentAnswer}
        handleNextQuestion={handleNextQuestion}
      />
    ),
    GENERATING_FEEDBACK: <FeedbackLoadingView />,
    RESULTS: (
      <ResultsView
        interviewType={interviewType}
        results={feedbackResults}
        onRestart={() => router.push('/')}
      />
    ),
    ERROR: <ErrorView message={errorMessage} onRestart={() => router.push('/')} />,
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-10 bg-background/80 backdrop-blur-sm border-b">
        <div className="container mx-auto flex items-center justify-between h-16 px-4">
          <Logo />
          <Button variant="ghost" onClick={() => router.push('/')}>
            <Home className="mr-2 h-4 w-4" />
            New Interview
          </Button>
        </div>
      </header>
      <main className="pt-24 pb-12">
        <div className="container mx-auto max-w-3xl">{Views[interviewState]}</div>
      </main>
    </>
  );
}

const LoadingView: FC = () => (
  <div className="flex flex-col items-center justify-center text-center gap-4 py-10">
    <Loader2 className="w-12 h-12 animate-spin text-primary" />
    <h2 className="text-2xl font-headline font-semibold">
      Preparing Your Interview...
    </h2>
    <p className="text-muted-foreground">
      Our AI is crafting the perfect questions for you. Please wait a moment.
    </p>
  </div>
);

const InProgressView: FC<{
  interviewType: string;
  question: string;
  questionNumber: number;
  totalQuestions: number;
  progress: number;
  currentAnswer: string;
  setCurrentAnswer: (answer: string) => void;
  handleNextQuestion: () => void;
}> = ({
  interviewType,
  question,
  questionNumber,
  totalQuestions,
  progress,
  currentAnswer,
  setCurrentAnswer,
  handleNextQuestion,
}) => (
  <Card className="shadow-2xl">
    <CardHeader>
      <div className="text-center mb-4">
        <p className="font-semibold text-accent font-headline">
          {interviewType} Interview
        </p>
        <CardTitle className="text-2xl font-bold mt-1 font-headline">
          Question {questionNumber} of {totalQuestions}
        </CardTitle>
      </div>
      <Progress value={progress} className="w-full" />
    </CardHeader>
    <CardContent className="space-y-6 p-6">
      <p className="text-lg md:text-xl font-medium text-center leading-relaxed">
        {question}
      </p>
      <Textarea
        placeholder="Type your answer here..."
        value={currentAnswer}
        onChange={(e) => setCurrentAnswer(e.target.value)}
        rows={8}
        className="text-base"
        autoFocus
      />
      <div className="flex justify-end">
        <Button onClick={handleNextQuestion} size="lg">
          {questionNumber === totalQuestions ? 'Finish & Get Feedback' : 'Next Question'}
          <ArrowRight className="ml-2 w-4 h-4" />
        </Button>
      </div>
    </CardContent>
  </Card>
);

const FeedbackLoadingView: FC = () => (
  <div className="flex flex-col items-center justify-center text-center gap-4 py-10">
    <Loader2 className="w-12 h-12 animate-spin text-primary" />
    <h2 className="text-2xl font-headline font-semibold">
      Analyzing Your Answers...
    </h2>
    <p className="text-muted-foreground">
      Our AI is generating personalized feedback. This will just take a moment.
    </p>
  </div>
);

const ResultsView: FC<{
  interviewType: string;
  results: FeedbackResult[];
  onRestart: () => void;
}> = ({ interviewType, results, onRestart }) => (
  <div className="space-y-8">
    <div className="text-center">
      <h1 className="text-4xl font-extrabold font-headline">Interview Report</h1>
      <p className="text-xl text-muted-foreground mt-2">
        Role: <span className="font-semibold text-accent">{interviewType}</span>
      </p>
    </div>
    <Accordion type="single" collapsible className="w-full" defaultValue="item-0">
      {results.map((result, index) => (
        <AccordionItem value={`item-${index}`} key={index}>
          <AccordionTrigger className="text-left hover:no-underline">
            <span className="font-semibold md:text-lg">
              Q{index + 1}: {result.question}
            </span>
          </AccordionTrigger>
          <AccordionContent className="space-y-6 pt-4">
            <div>
              <h4 className="font-semibold text-muted-foreground mb-2">Your Answer:</h4>
              <p className="p-4 bg-muted/50 rounded-md whitespace-pre-wrap">
                {result.answer}
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-accent mb-2 flex items-center gap-2">
                <Sparkles className="w-5 h-5" /> AI Feedback:
              </h4>
              <div className="p-4 border-l-4 border-accent bg-accent/10 rounded-r-md whitespace-pre-wrap">
                {result.feedback}
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
    <div className="flex justify-center mt-8">
      <Button onClick={onRestart} size="lg">
        Start New Interview
      </Button>
    </div>
  </div>
);

const ErrorView: FC<{ message: string; onRestart: () => void }> = ({
  message,
  onRestart,
}) => (
  <Alert variant="destructive" className="max-w-2xl mx-auto">
    <Terminal className="h-4 w-4" />
    <AlertTitle>An Error Occurred</AlertTitle>
    <AlertDescription>{message}</AlertDescription>
    <div className="mt-4">
      <Button variant="destructive" onClick={onRestart}>
        Try Again
      </Button>
    </div>
  </Alert>
);
