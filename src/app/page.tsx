import { InterviewSetup } from '@/components/interview/interview-setup';
import { Logo } from '@/components/logo';
import { Cpu, Bot, PenTool, BarChart, Code } from 'lucide-react';

export default function Home() {
  const interviewTypes = [
    { name: 'Software Engineer', icon: <Cpu className="w-8 h-8" /> },
    { name: 'Product Designer', icon: <PenTool className="w-8 h-8" /> },
    { name: 'Data Analyst', icon: <BarChart className="w-8 h-8" /> },
    { name: 'Frontend Developer', icon: <Code className="w-8 h-8" /> },
  ];

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-background p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center bg-primary text-primary-foreground p-4 rounded-full mb-6 shadow-lg">
            <Bot className="w-12 h-12" />
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-foreground font-headline tracking-tight">
            Welcome to InterviewAce
          </h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Sharpen your interview skills with our AI-powered simulator. Select a
            role or define your own to begin.
          </p>
        </div>
        <InterviewSetup predefinedTypes={interviewTypes} />
      </div>
       <footer className="text-center p-4 mt-8 text-muted-foreground text-sm">
          © {new Date().getFullYear()} InterviewAce. All rights reserved.
        </footer>
    </main>
  );
}
