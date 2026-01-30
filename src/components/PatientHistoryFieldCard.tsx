import type { History } from "@/interfaces/interfaces";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { FileText } from "lucide-react";
import { Field, FieldGroup, FieldLabel, FieldSet } from "./ui/field";
import { Input } from "./ui/input";

interface PatientHistoryFieldCardProps {
    value?: History
    onChange: (value: History) => void
    className?: string
}

export const PatientHistoryFieldCard = ({
    value,
    onChange,
    className
}: PatientHistoryFieldCardProps) => {
    const update = (patch: Partial<History>) => {
        onChange({
            ...value,
            ...patch
        });
    };

    return(
        <Card className={ className ?? "" }>
            <CardHeader className="border-b pb-4">
                <CardTitle className="flex items-center gap-3">
                    <div className="border border-slate-200 p-1.5 rounded-lg">
                        <FileText className="h-5 w-5 text-blue-500" />
                    </div>
                    <span className="text-lg font-bold text-slate-800">
                        Patient History
                    </span>
                </CardTitle>
            </CardHeader>
            <CardContent>
                <FieldSet>
                    <FieldGroup className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        <Field>
                            <FieldLabel className="text-[12px] font-bold text-gray-500 uppercase mb-1">
                                Signs and Symptoms
                            </FieldLabel>
                            <Input 
                                type="text"
                                placeholder="..."
                                value={value?.symptoms}
                                onChange={e => 
                                    update({ symptoms: e.target.value })
                                }
                            />
                        </Field>
                        <Field>
                            <FieldLabel className="text-[12px] font-bold text-gray-500 uppercase mb-1">
                                Allergies
                            </FieldLabel>
                            <Input 
                                type="text"
                                placeholder="..."
                                value={value?.allergies}
                                onChange={e => 
                                    update({ allergies: e.target.value })
                                }
                            />
                        </Field>
                        <Field>
                            <FieldLabel className="text-[12px] font-bold text-gray-500 uppercase mb-1">
                                Medication
                            </FieldLabel>
                            <Input 
                                type="text"
                                placeholder="..."
                                value={value?.medication}
                                onChange={e => 
                                    update({ medication: e.target.value })
                                }
                            />
                        </Field>
                        <Field>
                            <FieldLabel className="text-[12px] font-bold text-gray-500 uppercase mb-1">
                                Past Medical
                            </FieldLabel>
                            <Input 
                                type="text"
                                placeholder="..."
                                value={value?.pastMedical}
                                onChange={e => 
                                    update({ pastMedical: e.target.value })
                                }
                            />
                        </Field>
                        <Field>
                            <FieldLabel className="text-[12px] font-bold text-gray-500 uppercase mb-1">
                                Last Intake
                            </FieldLabel>
                            <Input 
                                type="text"
                                placeholder="..."
                                value={value?.lastIntake}
                                onChange={e => 
                                    update({ lastIntake: e.target.value })
                                }
                            />
                        </Field>
                        <Field>
                            <FieldLabel className="text-[12px] font-bold text-gray-500 uppercase mb-1">
                                Events Prior
                            </FieldLabel>
                            <Input 
                                type="text"
                                placeholder="..."
                                value={value?.eventsPrior}
                                onChange={e => 
                                    update({ eventsPrior: e.target.value })
                                }
                            />
                        </Field>
                    </FieldGroup>
                </FieldSet>
            </CardContent>
        </Card>
    )
}