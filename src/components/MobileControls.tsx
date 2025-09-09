import { Button } from "@/components/ui/button";
import { ChevronUp, ChevronDown } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

interface MobileControlsProps {
  onUpPress: () => void;
  onUpRelease: () => void;
  onDownPress: () => void;
  onDownRelease: () => void;
}

export const MobileControls = ({ 
  onUpPress, 
  onUpRelease, 
  onDownPress, 
  onDownRelease 
}: MobileControlsProps) => {
  const isMobile = useIsMobile();

  if (!isMobile) return null;

  return (
    <div className="fixed right-4 top-1/2 -translate-y-1/2 flex flex-col gap-4 z-50">
      <Button
        variant="outline"
        size="icon"
        className="h-16 w-16 rounded-full border-cosmic-glow/30 bg-cosmic-void/80 backdrop-blur-sm hover:bg-cosmic-glow/20 hover:border-cosmic-glow/60 transition-all duration-200"
        onTouchStart={onUpPress}
        onTouchEnd={onUpRelease}
        onMouseDown={onUpPress}
        onMouseUp={onUpRelease}
        onMouseLeave={onUpRelease}
      >
        <ChevronUp className="h-8 w-8 text-cosmic-glow" />
      </Button>
      
      <Button
        variant="outline"
        size="icon"
        className="h-16 w-16 rounded-full border-cosmic-glow/30 bg-cosmic-void/80 backdrop-blur-sm hover:bg-cosmic-glow/20 hover:border-cosmic-glow/60 transition-all duration-200"
        onTouchStart={onDownPress}
        onTouchEnd={onDownRelease}
        onMouseDown={onDownPress}
        onMouseUp={onDownRelease}
        onMouseLeave={onDownRelease}
      >
        <ChevronDown className="h-8 w-8 text-cosmic-glow" />
      </Button>
    </div>
  );
};