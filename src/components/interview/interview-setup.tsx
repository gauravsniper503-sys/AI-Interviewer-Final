'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Sparkles } from 'lucide-react';
import { useLanguage } from '@/context/language-context';
import { Label } from '../ui/label';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Slider } from '../ui/slider';
import { Separator } from '../ui/separator';

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
  const [difficulty, setDifficulty] = useState('Medium');
  const [numQuestions, setNumQuestions] = useState('10');
  const [customNumQuestions, setCustomNumQuestions] = useState(8);

  const router = useRouter();
  const { t } = useLanguage();

  const handleStartInterview = (type: string) => {
    if (type.trim()) {
      const questionCount =
        numQuestions === 'custom' ? customNumQuestions : parseInt(numQuestions, 10);
      router.push(
        `/interview/${encodeURIComponent(
          type.trim()
        )}?difficulty=${difficulty}&questions=${questionCount}`
      );
    }
  };

  return (
    <Card className="p-6 shadow-lg bg-card/80 w-full max-w-2xl mx-auto">
      <div className="space-y-8">
        <div>
          <h2 className="text-center text-xl font-semibold mb-6 text-foreground">
            {t('choosePresetRole')}
          </h2>
          <div className="grid grid-cols-1 gap-4">
            {predefinedTypes.map((type) => (
              <Card
                key={type.name}
                onClick={() => handleStartInterview(type.name)}
                className="cursor-pointer hover:shadow-xl hover:border-primary/50 transition-all duration-300 group bg-card/50 backdrop-blur-sm"
              >
                <CardContent className="flex items-center justify-start p-4">
                  <div className="text-primary group-hover:text-accent group-hover:scale-110 transition-all duration-300 mr-4">
                    {type.icon}
                  </div>
                  <p className="font-semibold text-card-foreground">
                    {type.name}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <Separator className="my-6" />

        <div>
          <Label className="text-center text-xl font-semibold mb-6 text-foreground block">
            {t('createCustomInterview')}
          </Label>
          <div className="flex flex-col sm:flex-row gap-3">
            <Input
              type="text"
              placeholder={t('customInterviewPlaceholder')}
              value={customType}
              onChange={(e) => setCustomType(e.target.value)}
              className="flex-grow text-base"
            />
            <Button
              type="button"
              onClick={() => handleStartInterview(customType)}
              disabled={!customType.trim()}
            >
              <Sparkles className="mr-2 h-4 w-4" />
              {t('startCustomInterview')}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
          <div>
            <Label className="font-semibold text-base mb-3 block">
              {t('difficulty')}
            </Label>
            <RadioGroup
              value={difficulty}
              onValueChange={setDifficulty}
              className="flex space-x-4"
            >
              {['Low', 'Medium', 'Hard'].map((level) => (
                <div key={level} className="flex items-center space-x-2">
                  <RadioGroupItem value={level} id={`difficulty-${level}`} />
                  <Label htmlFor={`difficulty-${level}`}>{t(level.toLowerCase())}</Label>
                </div>
              ))}
            </RadioGroup>
          </div>
          <div>
            <Label className="font-semibold text-base mb-3 block">
              {t('numberOfQuestions')}
            </Label>
            <RadioGroup
              value={numQuestions}
              onValueChange={setNumQuestions}
              className="flex items-center flex-wrap gap-4"
            >
              {['5', '10', '15', '20'].map((num) => (
                <div key={num} className="flex items-center space-x-2">
                  <RadioGroupItem value={num} id={`num-${num}`} />
                  <Label htmlFor={`num-${num}`}>{num}</Label>
                </div>
              ))}
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="custom" id="num-custom" />
                <Label htmlFor="num-custom">{t('custom')}</Label>
              </div>
            </RadioGroup>
            {numQuestions === 'custom' && (
              <div className="mt-4 flex items-center gap-4">
                <Slider
                  min={1}
                  max={50}
                  step={1}
                  value={[customNumQuestions]}
                  onValueChange={(value) => setCustomNumQuestions(value[0])}
                />
                <span className="font-semibold text-lg w-12 text-center">
                  {customNumQuestions}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}
