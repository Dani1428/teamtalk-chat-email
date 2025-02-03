import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { PieChart, ChevronDown, ChevronUp, Users } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

interface PollOption {
  id: string;
  text: string;
  votes: number;
}

interface PollMessageProps {
  question: string;
  options: PollOption[];
  totalVotes: number;
  endTime?: Date;
  onVote: (optionId: string) => void;
}

export function PollMessage({ question, options, totalVotes, endTime, onVote }: PollMessageProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const handleVote = (optionId: string) => {
    setSelectedOption(optionId);
    onVote(optionId);
  };

  const getTimeRemaining = () => {
    if (!endTime) return null;
    const now = new Date();
    const remaining = endTime.getTime() - now.getTime();
    if (remaining <= 0) return 'Terminé';
    
    const hours = Math.floor(remaining / (1000 * 60 * 60));
    const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m restantes`;
  };

  const timeRemaining = getTimeRemaining();

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="space-y-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <PieChart className="h-5 w-5 text-primary" />
            <CardTitle className="text-lg">Sondage</CardTitle>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? <ChevronUp /> : <ChevronDown />}
          </Button>
        </div>
        <CardDescription className="font-medium text-foreground">
          {question}
        </CardDescription>
        {timeRemaining && (
          <div className="text-sm text-muted-foreground">
            {timeRemaining}
          </div>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          {options.map((option) => {
            const percentage = totalVotes > 0 ? (option.votes / totalVotes) * 100 : 0;
            const isSelected = selectedOption === option.id;

            return (
              <div
                key={option.id}
                className={`relative ${
                  isExpanded ? 'space-y-2' : ''
                }`}
              >
                <Button
                  variant={isSelected ? "default" : "outline"}
                  className="w-full justify-between"
                  onClick={() => handleVote(option.id)}
                  disabled={selectedOption !== null}
                >
                  <span>{option.text}</span>
                  <span className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    {option.votes}
                  </span>
                </Button>
                {isExpanded && (
                  <div className="space-y-1">
                    <Progress value={percentage} className="h-2" />
                    <div className="text-sm text-muted-foreground text-right">
                      {percentage.toFixed(1)}%
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
        <div className="text-sm text-muted-foreground text-center">
          {totalVotes} votes au total
        </div>
      </CardContent>
    </Card>
  );
}
