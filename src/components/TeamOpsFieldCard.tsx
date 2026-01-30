import type { TeamOps } from "@/interfaces/interfaces";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Ambulance, Clock } from "lucide-react";
import { Field, FieldGroup, FieldLabel, FieldSet } from "./ui/field";
import { Input } from "./ui/input";

interface TeamOpsFieldCardProps {
  value?: TeamOps;
  onChange: (value: TeamOps) => void;
  className?: string;
}

export const TeamsOpsFieldCard = ({
  value,
  onChange,
  className,
}: TeamOpsFieldCardProps) => {
  const update = (partial: Partial<TeamOps>) => {
    onChange({
      ...value,
      ...partial,
    });
  };

  return (
    <Card className={className ?? ""}>
      <CardHeader className="border-b pb-4">
        <CardTitle className="flex items-center gap-3">
          <div className="border border-slate-200 p-1.5 rounded-lg">
            <Ambulance className="h-5 w-5 text-blue-500" />
          </div>
          <span className="text-lg font-bold text-slate-800">
            Team and Operations
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <FieldSet className="space-y-6">
          {/* Team Info */}
          <FieldGroup className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Field>
              <FieldLabel className="text-[12px] font-bold text-gray-500 uppercase mb-1">
                Team Leader
              </FieldLabel>
              <Input
                type="text"
                placeholder="..."
                value={value?.teamInfo?.teamLeader}
                onChange={(e) =>
                  update({
                    teamInfo: {
                      ...value?.teamInfo,
                      teamLeader: e.target.value,
                    },
                  })
                }
              />
            </Field>
            <Field>
              <FieldLabel className="text-[12px] font-bold text-gray-500 uppercase mb-1">
                Crew
              </FieldLabel>
              <Input
                type="text"
                placeholder="..."
                value={value?.teamInfo?.crew}
                onChange={(e) =>
                  update({
                    teamInfo: {
                      ...value?.teamInfo,
                      crew: e.target.value,
                    },
                  })
                }
              />
            </Field>
            <Field>
              <FieldLabel className="text-[12px] font-bold text-gray-500 uppercase mb-1">
                Ambulance
              </FieldLabel>
              <Input
                type="text"
                placeholder="..."
                value={value?.teamInfo?.ambulance}
                onChange={(e) =>
                  update({
                    teamInfo: {
                      ...value?.teamInfo,
                      ambulance: e.target.value,
                    },
                  })
                }
              />
            </Field>
          </FieldGroup>

          {/* Endorsement Info */}
          <FieldGroup className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field>
              <FieldLabel className="text-[12px] font-bold text-gray-500 uppercase mb-1">
                Receiving Facility
              </FieldLabel>
              <Input
                type="text"
                placeholder="..."
                value={value?.endorsementInfo?.receivingFacility}
                onChange={(e) =>
                  update({
                    endorsementInfo: {
                      ...value?.endorsementInfo,
                      receivingFacility: e.target.value,
                    },
                  })
                }
              />
            </Field>
            <Field>
              <FieldLabel className="text-[12px] font-bold text-gray-500 uppercase mb-1">
                Receiving Personnel
              </FieldLabel>
              <Input
                type="text"
                placeholder="..."
                value={value?.endorsementInfo?.receivingPersonnel}
                onChange={(e) =>
                  update({
                    endorsementInfo: {
                      ...value?.endorsementInfo,
                      receivingPersonnel: e.target.value,
                    },
                  })
                }
              />
            </Field>
          </FieldGroup>

          {/* Time Info */}
          <FieldGroup className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { label: "Time Depart", valueKey: "timeDepart" },
              { label: "Time Arrived", valueKey: "timeArrived" },
              { label: "Time Received", valueKey: "timeReceived" },
            ].map(({ label, valueKey }) => (
              <Field key={valueKey}>
                <FieldLabel className="text-[12px] font-bold text-gray-500 uppercase mb-1">
                  {label}
                </FieldLabel>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">
                    <Clock className="h-4 w-4" />
                  </div>
                  <Input
                    type="time"
                    className="pl-9"
                    value={(value as any)?.[valueKey]}
                    onChange={(e) =>
                      update({ [valueKey]: e.target.value } as any)
                    }
                  />
                </div>
              </Field>
            ))}
          </FieldGroup>
        </FieldSet>
      </CardContent>
    </Card>
  );
};
