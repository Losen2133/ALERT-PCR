import { ReactSketchCanvas, type ReactSketchCanvasRef } from "react-sketch-canvas";
import type { CanvasPath } from "react-sketch-canvas";
import { useRef } from "react";
import { Button } from "@/components/ui/button";
import anatomy from "@/assets/anatomy-edited.png";

/* ================================
   Path-based bounding box trimming
   ================================ */

type BoundingBox = {
  x: number;
  y: number;
  width: number;
  height: number;
};

const STROKE_PADDING = 6; // prevent stroke clipping

function getPathsBoundingBox(paths: CanvasPath[]): BoundingBox | null {
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;

  paths.forEach(path => {
    path.paths.forEach(point => {
      minX = Math.min(minX, point.x);
      minY = Math.min(minY, point.y);
      maxX = Math.max(maxX, point.x);
      maxY = Math.max(maxY, point.y);
    });
  });

  if (!isFinite(minX)) return null;

  return {
    x: Math.max(minX - STROKE_PADDING, 0),
    y: Math.max(minY - STROKE_PADDING, 0),
    width: maxX - minX + STROKE_PADDING * 2,
    height: maxY - minY + STROKE_PADDING * 2,
  };
}

async function trimImageByBoundingBox(
  dataUrl: string,
  box: BoundingBox
): Promise<string> {
  return new Promise(resolve => {
    const img = new Image();
    img.src = dataUrl;

    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = box.width;
      canvas.height = box.height;

      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(
        img,
        box.x,
        box.y,
        box.width,
        box.height,
        0,
        0,
        box.width,
        box.height
      );

      resolve(canvas.toDataURL("image/png"));
    };
  });
}

/* ================================
   Component
   ================================ */

export default function TrimmedSketchCanvas() {
  const canvasRef = useRef<ReactSketchCanvasRef | null>(null);

  const handleSave = async () => {
    if (!canvasRef.current) return;

    const paths = await canvasRef.current.exportPaths();
    if (paths.length === 0) return;

    const bbox = getPathsBoundingBox(paths);
    if (!bbox) return;

    const dataUrl = await canvasRef.current.exportImage("png");
    const trimmedPng = await trimImageByBoundingBox(dataUrl, bbox);

    // ⬇️ DOWNLOAD PNG
    const link = document.createElement("a");
    link.href = trimmedPng;
    link.download = "signature.png";
    link.click();
  };

  return (
    <>
      {/* <div className="h-screen overflow-y-auto snap-y snap-mandatory">
        <section className="h-screen snap-start bg-red-200">
          Section 1
        </section>

        <section className="h-screen snap-start bg-blue-200">
          Section 2
        </section>

        <section className="h-screen snap-start bg-green-200">
          Section 3
        </section>
      </div> */}
      <div style={{ maxWidth: 600 }}>
        <ReactSketchCanvas
          ref={canvasRef}
          strokeWidth={3}
          strokeColor="black"
          className="border rounded-md w-full h-64 bg-white"
        />

        <div style={{ marginTop: 12, display: "flex", gap: 8 }}>
          <Button onClick={() => canvasRef.current?.clearCanvas()}>
            Clear
          </Button>

          <Button onClick={handleSave}>
            Save (Trimmed)
          </Button>
        </div>
      </div>
      <Button
        style={{ backgroundImage: `url(${anatomy})` }}
        className="bg-cover bg-center text-white border-none shadow-md hover:brightness-90"
      >
        View Anatomy
      </Button>
    </>
    
    
    
  );
}
