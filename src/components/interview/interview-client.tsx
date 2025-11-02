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
import { ArrowRight, Home, Loader2, Sparkles, Terminal, BookCheck } from 'lucide-react';
import { useLanguage } from '@/context/language-context';
import { LanguageSwitcher } from '../language-switcher';
import { Badge } from '../ui/badge';
import { ThemeToggle } from '../theme-toggle';

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
  suggestedAnswer: string;
};

export default function InterviewClient({
  interviewType,
  difficulty,
  numberOfQuestions,
}: {
  interviewType: string;
  difficulty: string;
  numberOfQuestions: number;
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
  const { t } = useLanguage();

  useEffect(() => {
    const startInterview = async () => {
      try {
        const { questions: fetchedQuestions } = await startInterviewAction({
          interviewType,
          difficulty,
          numberOfQuestions,
        });
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
  }, [interviewType, difficulty, numberOfQuestions, toast]);

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
        title: t('emptyAnswer'),
        description: t('provideAnswer'),
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
        difficulty={difficulty}
        question={questions[currentQuestionIndex]}
        questionNumber={currentQuestionIndex + 1}
        totalQuestions={questions.length}
        progress={progress}
        currentAnswer={currentAnswer}
        setCurrentAnswer={setCurrentAnswer}
        handleNextQuestion={handleNextQuestion}
        t={t}
      />
    ),
    GENERATING_FEEDBACK: <FeedbackLoadingView />,
    RESULTS: (
      <ResultsView
        interviewType={interviewType}
        difficulty={difficulty}
        results={feedbackResults}
        onRestart={() => router.push('/')}
        t={t}
      />
    ),
    ERROR: <ErrorView message={errorMessage} onRestart={() => router.push('/')} t={t} />,
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-10 bg-background/80 backdrop-blur-sm border-b">
        <div className="container mx-auto flex items-center justify-between h-16 px-4">
          <Logo />
          <div className='flex items-center gap-2'>
            <LanguageSwitcher />
            <ThemeToggle />
            <Button variant="ghost" onClick={() => router.push('/')}>
              <Home className="mr-2 h-4 w-4" />
              {t('newInterview')}
            </Button>
          </div>
        </div>
      </header>
      <main className="pt-24 pb-12">
        <div className="container mx-auto max-w-3xl">{Views[interviewState]}</div>
      </main>
    </>
  );
}

const LoadingView: FC = () => {
  const { t } = useLanguage();
  return(
    <div className="flex flex-col items-center justify-center text-center gap-4 py-10">
      <Loader2 className="w-12 h-12 animate-spin text-primary" />
      <h2 className="text-2xl font-headline font-semibold">
        {t('preparingInterview')}
      </h2>
      <p className="text-muted-foreground">
        {t('craftingQuestions')}
      </p>
    </div>
  )
};

const InProgressView: FC<{
  interviewType: string;
  difficulty: string;
  question: string;
  questionNumber: number;
  totalQuestions: number;
  progress: number;
  currentAnswer: string;
  setCurrentAnswer: (answer: string) => void;
  handleNextQuestion: () => void;
  t: (key: string) => string;
}> = ({
  interviewType,
  difficulty,
  question,
  questionNumber,
  totalQuestions,
  progress,
  currentAnswer,
  setCurrentAnswer,
  handleNextQuestion,
  t
}) => (
  <Card className="shadow-2xl">
    <CardHeader>
      <div className="text-center mb-4 space-y-2">
        <div className="flex justify-center items-center gap-4">
          <p className="font-semibold text-accent font-headline">
            {interviewType} {t('interview')}
          </p>
          <Badge variant="outline">{t(difficulty.toLowerCase())}</Badge>
        </div>
        <CardTitle className="text-2xl font-bold mt-1 font-headline">
          {t('question')} {questionNumber} {t('of')} {totalQuestions}
        </CardTitle>
      </div>
      <Progress value={progress} className="w-full" />
    </CardHeader>
    <CardContent className="space-y-6 p-6">
      <p className="text-lg md:text-xl font-medium text-center leading-relaxed">
        {question}
      </p>
      <Textarea
        placeholder={t('typeAnswer')}
        value={currentAnswer}
        onChange={(e) => setCurrentAnswer(e.target.value)}
        rows={8}
        className="text-base"
        autoFocus
      />
      <div className="flex justify-end">
        <Button onClick={handleNextQuestion} size="lg">
          {questionNumber === totalQuestions ? t('finishAndGetFeedback') : t('nextQuestion')}
          <ArrowRight className="ml-2 w-4 h-4" />
        </Button>
      </div>
    </CardContent>
  </Card>
);

const FeedbackLoadingView: FC = () => {
  const {t} = useLanguage();
  return (
    <div className="flex flex-col items-center justify-center text-center gap-4 py-10">
      <Loader2 className="w-12 h-12 animate-spin text-primary" />
      <h2 className="text-2xl font-headline font-semibold">
        {t('analyzingAnswers')}
      </h2>
      <p className="text-muted-foreground">
        {t('generatingFeedback')}
      </p>
    </div>
  )
};

const ResultsView: FC<{
  interviewType: string;
  difficulty: string;
  results: FeedbackResult[];
  onRestart: () => void;
  t: (key: string) => string;
}> = ({ interviewType, difficulty, results, onRestart, t }) => (
  <div className="space-y-8">
    <div className="text-center">
      <h1 className="text-4xl font-extrabold font-headline">{t('interviewReport')}</h1>
      <div className="flex justify-center items-center gap-4 mt-2">
        <p className="text-xl text-muted-foreground">
          {t('role')}: <span className="font-semibold text-accent">{interviewType}</span>
        </p>
        <Badge variant="outline">{t(difficulty.toLowerCase())}</Badge>
      </div>
    </div>
    <Accordion type="single" collapsible className="w-full" defaultValue="item-0">
      {results.map((result, index) => (
        <AccordionItem value={`item-${index}`} key={index}>
          <AccordionTrigger className="text-left hover:no-underline">
            <span className="font-semibold md:text-lg">
              {t('q')}
              {index + 1}: {result.question}
            </span>
          </AccordionTrigger>
          <AccordionContent className="space-y-6 pt-4">
            <div>
              <h4 className="font-semibold text-muted-foreground mb-2">{t('yourAnswer')}:</h4>
              <p className="p-4 bg-muted/50 rounded-md whitespace-pre-wrap">
                {result.answer}
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-accent mb-2 flex items-center gap-2">
                <Sparkles className="w-5 h-5" /> {t('aiFeedback')}:
              </h4>
              <div className="p-4 border-l-4 border-accent bg-accent/10 rounded-r-md whitespace-pre-wrap">
                {result.feedback}
              </div>
            </div>
             <div>
              <h4 className="font-semibold text-green-500 mb-2 flex items-center gap-2">
                <BookCheck className="w-5 h-5" /> {t('suggestedAnswer')}:
              </h4>
              <div className="p-4 border-l-4 border-green-500 bg-green-500/10 rounded-r-md whitespace-pre-wrap">
                {result.suggestedAnswer}
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
    <div className="flex justify-center mt-8">
      <Button onClick={onRestart} size="lg">
        {t('startNewInterview')}
      </Button>
    </div>
  </div>
);

const ErrorView: FC<{ message: string; onRestart: () => void; t: (key: string) => string; }> = ({
  message,
  onRestart,
  t
}) => (
  <Alert variant="destructive" className="max-w-2xl mx-auto">
    <Terminal className="h-4 w-4" />
    <AlertTitle>{t('errorOccurred')}</AlertTitle>
    <AlertDescription>{message}</AlertDescription>
    <div className="mt-4">
      <Button variant="destructive" onClick={onRestart}>
        {t('tryAgain')}
      </Button>
    </div>
  </Alert>
);
