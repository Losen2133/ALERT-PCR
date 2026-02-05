import React, { useRef, useState, useImperativeHandle, useEffect, useCallback } from "react";
import { Stage, Layer, Line, Image as KonvaImage } from "react-konva";
import Konva from "konva";
import useImage from "use-image";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { RotateCcw, Undo2, Redo2 } from "lucide-react";
import anatomy from "@/assets/anatomy-edited.png";
import { type CanvasPath } from "@/interfaces/interfaces";

export const STROKE_COLORS = [
  { value: "deformities", label: "Deformities", color: "#E11D48" },
  { value: "contusion", label: "Contusion", color: "#F97316" },
  { value: "abrasion", label: "Abrasion", color: "#FACC15" },
  { value: "burn", label: "Burn", color: "#22C55E" },
  { value: "puncture", label: "Puncture", color: "#14B8A6" },
  { value: "tenderness", label: "Tenderness", color: "#3B82F6" },
  { value: "laceration", label: "Laceration", color: "#6366F1" },
  { value: "swelling", label: "Swelling", color: "#A855F7" },
] as const;

export type StrokeColorValue = (typeof STROKE_COLORS)[number]["color"];

interface TraumaCanvasProps {
  initialPaths: CanvasPath[];
  onSave: (paths: CanvasPath[], image: string) => void;
  ref?: React.Ref<any>;
}

const EXPORT_WIDTH = 508;
const EXPORT_HEIGHT = 405;

export function TraumaCanvas({ initialPaths, onSave, ref }: TraumaCanvasProps) {
  // Logic Fix: Sync local state if initialPaths changes (e.g. when reopening dialog)
  const [paths, setPaths] = useState<CanvasPath[]>(initialPaths || []);
  const [redoStack, setRedoStack] = useState<CanvasPath[]>([]);
  const [strokeColor, setStrokeColor] = useState<StrokeColorValue>(STROKE_COLORS[0].color);
  
  const [scale, setScale] = useState(1);
  const containerRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<Konva.Stage>(null);
  const isDrawing = useRef(false);
  const [image] = useImage(anatomy);

  // Helper logic to trigger the parent update
  const triggerSave = useCallback((currentPaths: CanvasPath[]) => {
    if (stageRef.current) {
      // We use a small timeout to allow Konva to finish rendering the state change 
      // before we capture the dataURL.
      setTimeout(() => {
        const dataUrl = stageRef.current?.toDataURL({ pixelRatio: 1 / scale }) || "";
        onSave(currentPaths, dataUrl);
      }, 0);
    }
  }, [onSave, scale]);

  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.offsetWidth;
        const newScale = Math.min(1, containerWidth / EXPORT_WIDTH);
        setScale(newScale);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useImperativeHandle(ref, () => ({
    clearCanvas: handleClear,
    undo: handleUndo,
    redo: handleRedo,
    exportImage: () => stageRef.current?.toDataURL({ pixelRatio: 1 / scale }),
    exportPaths: () => paths,
  }));

  const getRelativePointerPosition = (stage: Konva.Stage) => {
    const pointer = stage.getPointerPosition();
    if (!pointer) return null;
    return { x: pointer.x / scale, y: pointer.y / scale };
  };

  const handleStart = (e: any) => {
    isDrawing.current = true;
    const stage = e.target.getStage();
    const pos = getRelativePointerPosition(stage);
    if (!pos) return;

    setPaths([...paths, { points: [pos.x, pos.y], stroke: strokeColor, strokeWidth: 3 }]);
    setRedoStack([]);
  };

  const handleMove = (e: any) => {
    if (!isDrawing.current) return;
    if (e.evt && e.evt.cancelable) e.evt.preventDefault();

    const stage = e.target.getStage();
    const pos = getRelativePointerPosition(stage);
    if (!pos) return;

    const lastPath = { ...paths[paths.length - 1] };
    lastPath.points = lastPath.points.concat([pos.x, pos.y]);

    const newPaths = [...paths];
    newPaths[newPaths.length - 1] = lastPath;
    setPaths(newPaths);
  };

  const handleEnd = () => {
    isDrawing.current = false;
    triggerSave(paths);
  };

  // Logic Fixes for Manual Controls: Calculate the new state and SAVE IT immediately
  const handleClear = () => {
    const newPaths: CanvasPath[] = [];
    setPaths(newPaths);
    setRedoStack([]);
    triggerSave(newPaths);
  };

  const handleUndo = () => {
    if (paths.length === 0) return;
    const lastPath = paths[paths.length - 1];
    const newPaths = paths.slice(0, -1);
    setRedoStack([...redoStack, lastPath]);
    setPaths(newPaths);
    triggerSave(newPaths);
  };

  const handleRedo = () => {
    if (redoStack.length === 0) return;
    const nextPath = redoStack[redoStack.length - 1];
    const newPaths = [...paths, nextPath];
    setRedoStack(redoStack.slice(0, -1));
    setPaths(newPaths);
    triggerSave(newPaths);
  };

  return (
    <div className="flex items-center justify-center w-full">
      <div className="grid grid-cols-1 lg:grid-cols-[auto_1fr] gap-4 w-full">
        <div ref={containerRef} className="border rounded-md bg-white shadow-sm overflow-hidden flex items-center justify-center touch-none w-full">
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
          >
            <Layer>
              {image && (
                <KonvaImage
                  image={image}
                  width={EXPORT_WIDTH}
                  height={EXPORT_HEIGHT}
                  listening={false}
                />
              )}
              {paths.map((path, i) => (
                <Line
                  key={i}
                  points={path.points}
                  stroke={path.stroke}
                  strokeWidth={path.strokeWidth}
                  tension={0.5}
                  lineCap="round"
                  lineJoin="round"
                />
              ))}
            </Layer>
          </Stage>
        </div>

        <div className="flex flex-col gap-4 w-full lg:w-48 items-center justify-center">
          <RadioGroup
            value={strokeColor}
            onValueChange={(color) => setStrokeColor(color as StrokeColorValue)}
            className="grid grid-cols-2 sm:grid-cols-3 lg:flex lg:flex-col gap-3"
          >
            {STROKE_COLORS.map(({ value, label, color }) => (
              <div key={value} className="flex items-center gap-2">
                <RadioGroupItem value={color} id={value} />
                <Label htmlFor={value} className="flex items-center gap-2 cursor-pointer text-sm">
                  <span className="h-3 w-3 rounded-full" style={{ backgroundColor: color }} />
                  {label}
                </Label>
              </div>
            ))}
          </RadioGroup>

          <div className="flex items-center gap-2 pt-4 border-t w-full justify-center">
            <Button size="icon" variant="outline" onClick={handleClear} title="Clear All">
              <RotateCcw className="h-4 w-4" />
            </Button>
            <Button size="icon" variant="outline" onClick={handleUndo} title="Undo">
              <Undo2 className="h-4 w-4" />
            </Button>
            <Button size="icon" variant="outline" onClick={handleRedo} title="Redo">
              <Redo2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TraumaCanvas;