import type { Assessment, Management } from "@/interfaces/interfaces"
import { getCurrentTime } from "@/lib/utils"
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Clock, Plus, Stethoscope } from "lucide-react"
import { Field, FieldGroup, FieldLabel, FieldSet } from "./ui/field"
import { Textarea } from "./ui/textarea"
import { Checkbox } from "./ui/checkbox"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog"
import { Button } from "./ui/button"
import { managementColumns } from "./Management-Columns"
import { DataTable } from "./DataTable"


interface PatientAssessmentFieldsSectionProps {
    value?: Assessment
    onChange: (value: Assessment) => void
    className?: string
}

export const PatientAssessmentFieldsSection = ({
    value,
    onChange,
    className
}: PatientAssessmentFieldsSectionProps) => {

    const assessment: Assessment = value ?? { management: [] };
    
    const [newManagement, setNewManagement] = useState<Management>({
        time: getCurrentTime(),
        care: "",
    });

    const update = (partial: Partial<Assessment>) => {
        onChange({
            ...assessment,
            ...partial
        });
    };

    const addManagement = () => {
        if (!newManagement.time && !newManagement.care) return;

        update({
        management: [
            ...(assessment.management ?? []),
            newManagement,
        ],
        });

        setNewManagement({ time: "", care: "" });
    };

    const resetManagement = () => setNewManagement({
        time: getCurrentTime(),
        care: "",
    });

    return (
        <div className={className ?? ""}>
            <Card className="h-fit mb-3">
                <CardHeader className="border-b pb-3">
                    <CardTitle className="flex items-center gap-3">
                        <div className="border border-slate-200 p-1.5 rounded-lg">
                            <Stethoscope className="h-5 w-5 text-blue-500" />
                        </div>
                        <span className="text-lg font-bold text-slate-800">
                            Patient Assessment
                        </span>
                    </CardTitle>
                </CardHeader>

                <CardContent>
                    <FieldSet>
                        <FieldGroup className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                            <Field className="col-span-1 lg:col-span-5">
                                <FieldLabel className="text-[12px] font-bold text-gray-500 uppercase mb-1">
                                    Chief Complaints
                                </FieldLabel>
                                <Textarea
                                    placeholder="..."
                                    className="h-[180px] sm:h-[220px] lg:h-[260px] resize-none"
                                    value={assessment.chiefComplaints ?? ""}
                                    onChange={(e) =>
                                    update({ chiefComplaints: e.target.value })
                                    }
                                />
                            </Field>

                            <FieldGroup className="col-span-1 lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <Field orientation="horizontal" className="col-span-1 sm:col-span-2">
                                    <Checkbox
                                        className="w-5 h-5"
                                        checked={assessment.immobilizationRequired ?? false}
                                        onCheckedChange={(checked) =>
                                            update({ immobilizationRequired: checked === true })
                                        }
                                    />
                                    <FieldLabel className="text-[12px] font-bold text-gray-500 uppercase">
                                        C-Spine / Immobilization Required
                                    </FieldLabel>
                                </Field>

                                {[
                                    ["Level of Consciousness", "levelOfConciousness"],
                                    ["Airway", "airway"],
                                    ["Nature of Illness", "natureOfIllness"],
                                    ["Breathing", "breathing"],
                                    ["Mechanism of Injury", "mechanismOfInjury"],
                                    ["Circulation", "circulation"],
                                ].map(([label, key]) => (
                                    <Field key={key}>
                                    <FieldLabel className="text-[12px] font-bold text-gray-500 uppercase mb-1">
                                        {label}
                                    </FieldLabel>
                                    <Input
                                        placeholder="..."
                                        value={(assessment as any)[key]}
                                        onChange={(e) =>
                                        update({ [key]: e.target.value } as any)
                                        }
                                    />
                                    </Field>
                                ))}
                            </FieldGroup>
                        </FieldGroup>
                    </FieldSet>
                </CardContent>
            </Card>
            <Card className="h-fit">
                <CardHeader className="border-b pb-3">
                    <CardTitle className="flex items-center gap-3">
                        <div className="border border-slate-200 p-1.5 rounded-lg">
                            <Stethoscope className="h-5 w-5 text-green-500" />
                        </div>
                        <span className="text-lg font-bold text-slate-800">
                            Other Details
                        </span>
                    </CardTitle>
                </CardHeader>

                <CardContent>
                    <FieldSet>
                        <FieldGroup className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                            <Field className="col-span-1 lg:col-span-5">
                                <FieldLabel className="text-[12px] font-bold text-gray-500 uppercase mb-1">
                                    Provider Impression
                                </FieldLabel>
                                <Textarea
                                    placeholder="..."
                                    className="h-[180px] sm:h-[220px] lg:h-[260px] resize-none"
                                    value={assessment.providerImpressions ?? ""}
                                    onChange={(e) =>
                                        update({ providerImpressions: e.target.value })
                                    }
                                />
                            </Field>

                            <div className="col-span-1 lg:col-span-7 flex flex-col">
                                <div className="flex justify-between mb-1">
                                    <Label className="text-[12px] font-bold text-gray-500 uppercase">
                                        Management
                                    </Label>
                                    <Dialog>
                                        <DialogTrigger asChild>
                                            <Button size="sm" variant="outline">
                                                <Plus className="h-4 w-4 mr-1" />
                                                Add Care
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent>
                                            <DialogHeader>
                                                <DialogTitle>Add Care</DialogTitle>
                                            </DialogHeader>

                                            <FieldSet>
                                                <FieldGroup>
                                                    <Field>
                                                        <FieldLabel className="text-[12px] font-bold text-gray-500 uppercase mb-1">Time</FieldLabel>
                                                        <div className="relative">
                                                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">
                                                                <Clock className="h-4 w-4" />
                                                            </div>
                                                            <Input
                                                                type="time"
                                                                className="pl-9"
                                                                value={newManagement.time}
                                                                onChange={(e) =>
                                                                    setNewManagement(prev => ({
                                                                        ...prev,
                                                                        time: e.target.value
                                                                    }))
                                                                }
                                                            />
                                                        </div>
                                                    </Field>
                                                    <Field>
                                                        <FieldLabel className="text-[12px] font-bold text-gray-500 uppercase mb-1">Care</FieldLabel>
                                                        <Input
                                                            placeholder="..."
                                                            value={newManagement.care}
                                                            onChange={(e) =>
                                                                setNewManagement(prev => ({
                                                                ...prev,
                                                                care: e.target.value,
                                                                }))
                                                            }
                                                        />
                                                    </Field>
                                                </FieldGroup>
                                            </FieldSet>
                                            <DialogFooter>
                                                <DialogClose asChild>
                                                    <Button variant="outline" onClick={resetManagement}>Cancel</Button>
                                                </DialogClose>
                                                <DialogClose asChild>
                                                    <Button onClick={() => {
                                                        addManagement();
                                                        resetManagement();
                                                    }}>Save</Button>
                                                </DialogClose>
                                            </DialogFooter>
                                        </DialogContent>
                                    </Dialog>
                                </div>
                                
                                <DataTable<Management, any>
                                    columns={managementColumns}
                                    data={assessment.management ?? []}
                                    noValueString="No care logged."
                                    className="w-full h-[260px] flex flex-col gap-4"
                                />
                            </div>
                        </FieldGroup>
                    </FieldSet>
                </CardContent>
            </Card>
        </div>
    )
}