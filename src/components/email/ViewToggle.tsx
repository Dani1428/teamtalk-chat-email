'use client';

import { LayoutGrid, LayoutList } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import type { ViewToggleProps } from '@/types';

export function ViewToggle({ viewMode, onViewModeChange }: ViewToggleProps) {
  return (
    <div className="flex items-center gap-2">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9"
            onClick={() => onViewModeChange('list')}
            data-active={viewMode === 'list'}
          >
            <LayoutList className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Vue liste</TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9"
            onClick={() => onViewModeChange('grid')}
            data-active={viewMode === 'grid'}
          >
            <LayoutGrid className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Vue grille</TooltipContent>
      </Tooltip>
    </div>
  );
}
