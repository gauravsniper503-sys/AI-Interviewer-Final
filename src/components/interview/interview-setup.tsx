'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles } from 'lucide-react';

type PredefinedType = {
  name: string;
  icon: React.ReactNode;
};

export function InterviewSetup({
  predefinedTypes,
}: {
  predefinedTypes: PredefinedType[];
}) {
  const [customType, setCustomType] = useState('');
  const router = useRouter();

  const handleSelectType = (type: string) => {
    if (type.trim()) {
      router.push(`/interview/${encodeURIComponent(type.trim())}`);
    }
  };

  return (
    <div>
      <h2 className="text-center text-xl font-semibold mb-6 text-foreground">
        Choose a preset role
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {predefinedTypes.map((type) => (
          <Card
            key={type.name}
            onClick={() => handleSelectType(type.name)}
            className="cursor-pointer hover:shadow-xl hover:border-primary/50 transition-all duration-300 group bg-card/50 backdrop-blur-sm"
          >
            <CardContent className="flex flex-col items-center justify-center p-6">
              <div className="text-primary group-hover:text-accent group-hover:scale-110 transition-all duration-300 mb-3">
                {type.icon}
              </div>
              <p className="font-semibold text-center text-card-foreground">
                {type.name}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="p-6 shadow-lg bg-card/80">
        <p className="text-center font-semibold text-lg mb-4 text-card-foreground">
          Or create a custom interview
        </p>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSelectType(customType);
          }}
          className="flex flex-col sm:flex-row gap-3"
        >
          <Input
            type="text"
            placeholder="e.g., 'Civil Engineer for a bridge project'"
            value={customType}
            onChange={(e) => setCustomType(e.target.value)}
            className="flex-grow text-base"
          />
          <Button type="submit" disabled={!customType.trim()}>
            <Sparkles className="mr-2 h-4 w-4" />
            Start Custom Interview
          </Button>
        </form>
      </Card>
    </div>
  );
}
