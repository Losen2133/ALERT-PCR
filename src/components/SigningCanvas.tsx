import React, { useRef, useState, useImperativeHandle, useEffect, useCallback } from "react";
import { Stage, Layer, Line } from "react-konva";
import Konva from "konva";
import { Button } from "@/components/ui/button";
import { RotateCcw, Undo2 } from "lucide-react";
import { type CanvasPath } from "@/interfaces/interfaces";

interface SignatureCanvasProps {
  initialPaths?: CanvasPath[];
  onSave: (paths: CanvasPath[], image: string) => void;
  ref?: React.Ref<any>;
}

const EXPORT_WIDTH = 600;
const EXPORT_HEIGHT = 200;

export function SignatureCanvas({ initialPaths = [], onSave, ref }: SignatureCanvasProps) {
  const [paths, setPaths] = useState<CanvasPath[]>(initialPaths);
  const [scale, setScale] = useState(1);
  const containerRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<Konva.Stage>(null);
  const isDrawing = useRef(false);

  // Responsive Scaling Logic
  const handleResize = useCallback(() => {
    if (containerRef.current) {
      const containerWidth = containerRef.current.offsetWidth;
      // Calculate scale based on container width vs the base EXPORT_WIDTH
      const newScale = Math.min(1, containerWidth / EXPORT_WIDTH);
      setScale(newScale);
    }
  }, []);

  useEffect(() => {
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [handleResize]);

  const triggerSave = useCallback((currentPaths: CanvasPath[]) => {
    if (stageRef.current) {
      setTimeout(() => {
        const dataUrl = stageRef.current?.toDataURL({ 
          pixelRatio: 1 / scale,
          mimeType: "image/png" 
        }) || "";
        onSave(currentPaths, dataUrl);
      }, 0);
    }
  }, [onSave, scale]);

  useImperativeHandle(ref, () => ({
    clear: handleClear,
    undo: handleUndo,
    exportImage: () => stageRef.current?.toDataURL({ pixelRatio: 1 / scale }),
  }));

  const getPointerPos = (stage: Konva.Stage) => {
    const pos = stage.getPointerPosition();
    return pos ? { x: pos.x / scale, y: pos.y / scale } : null;
  };

  const handleStart = (e: any) => {
    isDrawing.current = true;
    const pos = getPointerPos(e.target.getStage());
    if (!pos) return;

    // Duplicating the point here allows single-click dots to render
    setPaths([...paths, { 
      points: [pos.x, pos.y, pos.x, pos.y], 
      stroke: "#0f172a", 
      strokeWidth: 2.5 
    }]);
  };

  const handleMove = (e: any) => {
    if (!isDrawing.current) return;
    if (e.evt && e.evt.cancelable) e.evt.preventDefault();

    const pos = getPointerPos(e.target.getStage());
    if (!pos) return;

    const lastPath = { ...paths[paths.length - 1] };
    
    // Check if we are still on the "dot" (initial 4 coordinates)
    // If we've started moving, we can just append new points
    lastPath.points = lastPath.points.concat([pos.x, pos.y]);
    
    const newPaths = [...paths.slice(0, -1), lastPath];
    setPaths(newPaths);
  };

  const handleEnd = () => {
    isDrawing.current = false;
    triggerSave(paths);
  };

  const handleClear = () => {
    setPaths([]);
    triggerSave([]);
  };

  const handleUndo = () => {
    const newPaths = paths.slice(0, -1);
    setPaths(newPaths);
    triggerSave(newPaths);
  };

  return (
    <div className="w-full flex flex-col gap-3">
      {/* Container ensures the canvas doesn't break layout */}
      <div 
        ref={containerRef} 
        className="w-full border-2 border-dashed border-gray-200 rounded-xl bg-slate-50 overflow-hidden touch-none flex items-center justify-center"
        style={{ height: EXPORT_HEIGHT * scale }}
      >
        <Stage
          width={EXPORT_WIDTH * scale}
          height={EXPORT_HEIGHT * scale}
          scaleX={scale}
          scaleY={scale}
          onMouseDown={handleStart}
          onMouseMove={handleMove}
          onMouseUp={handleEnd}
          onTouchStart={handleStart}
          onTouchMove={handleMove}
          onTouchEnd={handleEnd}
          ref={stageRef}
          className="cursor-crosshair"
        >
          <Layer>
            {paths.map((path, i) => (
              <Line
                key={i}
                points={path.points}
                stroke={path.stroke}
                strokeWidth={path.strokeWidth}
                tension={0.4}
                lineCap="round"
                lineJoin="round"
              />
            ))}
          </Layer>
        </Stage>
      </div>

      <div className="flex flex-col items-center gap-4">
         <div className="w-full border-t border-gray-200" />
         
         {/* Adaptive Footer: Stacks on mobile, row on desktop */}
         <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3 rounded-lg border shadow-sm">
           <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">
             Sign Above
           </p>
           
           <div className="flex gap-2 w-full sm:w-auto">
             <Button 
               variant="outline" 
               size="sm" 
               className="flex-1 sm:flex-none" 
               onClick={handleUndo}
               disabled={paths.length === 0}
             >
               <Undo2 className="h-4 w-4 mr-2" /> Undo
             </Button>
             <Button 
               variant="outline" 
               size="sm" 
               className="flex-1 sm:flex-none text-destructive hover:text-destructive" 
               onClick={handleClear}
               disabled={paths.length === 0}
             >
               <RotateCcw className="h-4 w-4 mr-2" /> Clear
             </Button>
           </div>
         </div>
      </div>
    </div>
  );
}