import InterviewClient from '@/components/interview/interview-client';
import { Suspense } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export default function InterviewPage({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const interviewType = decodeURIComponent(params.slug);
  const difficulty = (searchParams?.difficulty as string) || 'Medium';
  const numberOfQuestions = searchParams?.questions
    ? parseInt(searchParams.questions as string, 10)
    : 8;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Suspense fallback={<InterviewSkeleton />}>
        <InterviewClient
          interviewType={interviewType}
          difficulty={difficulty}
          numberOfQuestions={numberOfQuestions}
        />
      </Suspense>
    </div>
  );
}

function InterviewSkeleton() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-3xl space-y-8 animate-pulse">
        <header className="fixed top-0 left-0 right-0 z-10 bg-background/80 backdrop-blur-sm border-b">
          <div className="container mx-auto flex items-center justify-between h-16 px-4">
            <h1 className="text-2xl font-bold text-foreground font-sans">
              Interview Pro
            </h1>
            <Skeleton className="h-9 w-36" />
          </div>
        </header>
        <main className="pt-24 pb-12 container mx-auto">
          <Card>
            <CardContent className="p-6 space-y-6">
              <div className="text-center">
                <Skeleton className="h-7 w-3/4 mx-auto mb-2" />
                <Skeleton className="h-4 w-1/4 mx-auto" />
              </div>
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-10 w-32 ml-auto" />
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}
