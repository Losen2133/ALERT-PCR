import type { SecondaryAssessment, CanvasPath } from "@/interfaces/interfaces";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Stethoscope } from "lucide-react";
import { Field, FieldGroup, FieldLabel, FieldLegend, FieldSet } from "./ui/field";
import { Input } from "./ui/input";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import TraumaCanvas from "./TraumaCanvas";
import { Button } from "./ui/button";
import anatomy from "@/assets/anatomy-edited.png";

interface PatientSecondaryAssessmentFieldCardProps {
  value?: SecondaryAssessment;
  onChange: (value: SecondaryAssessment) => void;
  className?: string;
  // Use 'any' or a more specific Konva-based type if needed for the ref
  traumaCanvasRef?: React.Ref<any>; 
}

export const PatientSecondaryAssessmentFieldCard = ({
  value,
  onChange,
  className,
  traumaCanvasRef,
}: PatientSecondaryAssessmentFieldCardProps) => {
  const [isDiagramOpen, setIsDiagramOpen] = useState(false);

  // Helper to update specific nested objects within SecondaryAssessment
  const update = (partial: Partial<SecondaryAssessment>) => {
    onChange({
      ...value,
      ...partial,
    } as SecondaryAssessment);
  };

  const opqrstFields: [string, keyof NonNullable<SecondaryAssessment["opqrst"]>][] = [
    ["Onset", "onset"],
    ["Provocation", "provocation"],
    ["Quality", "quality"],
    ["Radiation", "radiation"],
    ["Severity", "severity"],
    ["Timing", "timing"],
  ];

  const apgarFields: [string, keyof NonNullable<SecondaryAssessment["apgar"]>][] = [
    ["Appearance", "appearance"],
    ["Pain", "pain"],
    ["Grimace", "grimace"],
    ["Activity", "activity"],
    ["Respiration", "respiration"],
  ];

  return (
    <Card className={className ?? undefined}>
      <CardHeader className="border-b pb-4">
        <CardTitle className="flex items-center gap-3">
          <div className="border border-slate-200 p-1.5 rounded-lg">
            <Stethoscope className="h-5 w-5 text-blue-500" />
          </div>
          <span className="text-lg font-bold text-slate-800">
            Patient Secondary Assessment
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <FieldSet className="flex flex-col lg:flex-row gap-6">
          
          {/* O P Q R S T SECTION */}
          <FieldSet className="flex-1">
            <FieldLegend className="text-center font-bold mb-4">
              O P Q R S T
            </FieldLegend>
            <FieldGroup className="grid grid-cols-2 gap-4">
              {opqrstFields.map(([label, key]) => (
                <Field key={key}>
                  <FieldLabel className="text-[12px] font-bold text-gray-500 uppercase mb-1">
                    {label}
                  </FieldLabel>
                  <Input
                    type={key === "severity" ? "number" : "text"}
                    placeholder={key === "severity" ? "1-10" : "..."}
                    value={value?.opqrst?.[key] ?? ""}
                    min={key === "severity" ? 1 : undefined}
                    max={key === "severity" ? 10 : undefined}
                    onChange={(e) =>
                      update({
                        opqrst: {
                          ...value?.opqrst,
                          [key]:
                            key === "severity"
                              ? Math.min(10, Math.max(1, Number(e.target.value)))
                              : e.target.value,
                        },
                      })
                    }
                  />
                </Field>
              ))}
            </FieldGroup>
          </FieldSet>

          {/* TRAUMA DIAGRAM SECTION */}
          <FieldSet className="flex-1 flex flex-col items-center justify-center border-y py-6 border-x-0 lg:border-y-0 lg:border-x lg:px-6 lg:py-0">
            <Dialog open={isDiagramOpen} onOpenChange={setIsDiagramOpen}>
              <DialogTrigger asChild>
                <Button
                  style={{
                    backgroundImage: `linear-gradient(rgba(0,0,0,0.45), rgba(0,0,0,0.45)), url(${anatomy})`,
                  }}
                  variant="outline"
                  className="hover:brightness-110 bg-center bg-contain bg-no-repeat w-full h-full min-h-[150px] py-8 border-dashed border-2 flex flex-col gap-2 transition-all"
                >
                  <span className="font-bold text-white drop-shadow-md">
                    Trauma Diagram
                  </span>
                  <span className="text-xs text-white/90 font-medium drop-shadow-sm">
                    {value?.traumaDiagram && value.traumaDiagram.length > 0 
                      ? `${value.traumaDiagram.length} marks applied` 
                      : "Click to mark injuries"}
                  </span>
                </Button>
              </DialogTrigger>

              <DialogContent className="w-[95vw] sm:max-w-[850px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Mark Trauma Locations</DialogTitle>
                </DialogHeader>

                <div className="py-4">
                  <TraumaCanvas
                    ref={traumaCanvasRef}
                    initialPaths={value?.traumaDiagram ?? []}
                    onSave={(paths: CanvasPath[], imageString: string) => {
                      update({
                        traumaDiagram: paths,
                        traumaImageString: imageString,
                      });
                    }}
                  />
                </div>
              </DialogContent>
            </Dialog>
          </FieldSet>

          {/* A P G A R SECTION */}
          <FieldSet className="flex-1">
            <FieldLegend className="text-center font-bold mb-4">
              A P G A R
            </FieldLegend>
            <FieldGroup className="grid grid-cols-2 gap-4">
              {apgarFields.map(([label, key]) => (
                <Field key={key}>
                  <FieldLabel className="text-[12px] font-bold text-gray-500 uppercase mb-1">
                    {label}
                  </FieldLabel>
                  <Input
                    type="number"
                    placeholder="..."
                    value={value?.apgar?.[key] ?? ""}
                    onChange={(e) =>
                      update({
                        apgar: {
                          ...value?.apgar,
                          [key]: Number(e.target.value),
                        },
                      })
                    }
                  />
                </Field>
              ))}
            </FieldGroup>
          </FieldSet>

        </FieldSet>
      </CardContent>
    </Card>
  );
};