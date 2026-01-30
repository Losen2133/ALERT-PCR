import React, {
  useEffect,
  useRef,
  useState,
  useImperativeHandle,
} from "react";
import type { ReactSketchCanvasRef, CanvasPath } from "react-sketch-canvas";
import { ReactSketchCanvas } from "react-sketch-canvas";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { RotateCcw, Undo2, Redo2 } from "lucide-react";
import anatomy from "@/assets/anatomy-edited.png";

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

export type StrokeColorValue =
  (typeof STROKE_COLORS)[number]["color"];

interface TraumaCanvasProps {
  paths: CanvasPath[];
  onSave: (paths: CanvasPath[], image: string) => void;
  ref?: React.Ref<ReactSketchCanvasRef | null>;
}

/** Logical export size (DO NOT CHANGE) */
const EXPORT_WIDTH = 508;
const EXPORT_HEIGHT = 405;

export function TraumaCanvas({ paths, onSave, ref }: TraumaCanvasProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const internalRef = useRef<ReactSketchCanvasRef | null>(null);

  const [containerWidth, setContainerWidth] = useState(0);
  const [strokeColor, setStrokeColor] = useState<StrokeColorValue>(
    STROKE_COLORS[0].color
  );

  useImperativeHandle(ref, () => internalRef.current!);

  /** Measure available width */
  useEffect(() => {
    if (!containerRef.current) return;

    const observer = new ResizeObserver(entries => {
      setContainerWidth(entries[0].contentRect.width);
    });

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  /** Scale for display only */
  const safeContainerWidth = containerWidth || EXPORT_WIDTH;
  const scale = Math.min(safeContainerWidth / EXPORT_WIDTH, 1);
  const DISPLAY_WIDTH = Math.max(EXPORT_WIDTH * scale, 1);
  const DISPLAY_HEIGHT = Math.max(EXPORT_HEIGHT * scale, 1);

  /** Load existing paths */
  useEffect(() => {
    if (!paths?.length) return;

    const id = setTimeout(() => {
      internalRef.current?.loadPaths(paths);
    }, 50);

    return () => clearTimeout(id);
  }, []);

  /** Save paths + full-res image */
  const handleSave = async () => {
    if (!internalRef.current) return;

    const exportedPaths = await internalRef.current.exportPaths();
    const image = await internalRef.current.exportImage("png");

    onSave(exportedPaths, image);
  };

  return (
    <div className="flex items-center justify-center">
      <div className="grid grid-cols-1 lg:grid-cols-[auto_1fr] gap-4 w-full">
        {/* CANVAS */}
        <div
  ref={containerRef}
  className="w-full flex items-center justify-center overflow-hidden"
>
  <ReactSketchCanvas
    ref={internalRef}
    width={`${DISPLAY_WIDTH}px`}
    height={`${DISPLAY_HEIGHT}px`}
    strokeColor={strokeColor}
    backgroundImage={anatomy}
    exportWithBackgroundImage
    onChange={handleSave}
    className="rounded-md bg-muted/20"
  />
</div>

        {/* CONTROLS */}
        <div className="flex flex-col gap-4 w-full lg:w-48 items-center justify-center">
          <RadioGroup
            value={strokeColor}
            onValueChange={(color) =>
              setStrokeColor(color as StrokeColorValue)
            }
            className="grid grid-cols-2 sm:grid-cols-3 lg:flex lg:flex-col gap-3"
          >
            {STROKE_COLORS.map(({ value, label, color }) => (
              <div key={value} className="flex items-center gap-2">
                <RadioGroupItem value={color} id={value} />
                <Label
                  htmlFor={value}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <span
                    className="h-3 w-3 rounded-full"
                    style={{ backgroundColor: color }}
                  />
                  {label}
                </Label>
              </div>
            ))}
          </RadioGroup>

          <div className="flex items-center gap-2 pt-4 border-t">
            <Button
              size="icon"
              variant="outline"
              onClick={() => internalRef.current?.clearCanvas()}
              title="Clear All"
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
            <Button
              size="icon"
              variant="outline"
              onClick={() => internalRef.current?.undo()}
              title="Undo"
            >
              <Undo2 className="h-4 w-4" />
            </Button>
            <Button
              size="icon"
              variant="outline"
              onClick={() => internalRef.current?.redo()}
              title="Redo"
            >
              <Redo2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TraumaCanvas;
