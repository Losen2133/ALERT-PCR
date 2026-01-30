import type { PatientDemographics } from "@/interfaces/interfaces"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { User } from "lucide-react";
import { Field, FieldGroup, FieldLabel, FieldSet } from "./ui/field";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

interface PatientDemographicsFieldCardProps {
    value?: PatientDemographics
    onChange: (value: PatientDemographics) => void
    className?: string
}

export const PatientDemographicsFieldCard = ({
    value,
    onChange,
    className
}: PatientDemographicsFieldCardProps) => {
    const update = (partial: Partial<PatientDemographics>) => {
        onChange({
            ...value,
            ...partial
        });
    };
    
    return (
        <Card className={className ?? ""}>
            <CardHeader className="border-b pb-4">
                <CardTitle className="flex items-center gap-3">
                    <div className="border border-slate-200 p-1.5 rounded-lg">
                        <User className="h-5 w-5 text-blue-500" />
                    </div>
                    <span className="text-lg font-bold text-slate-800">
                        Patient Demographics
                    </span>
                </CardTitle>
            </CardHeader>
            <CardContent>
                <FieldSet>
                    <FieldGroup className="flex flex-row gap-4 flex-wrap">
                        <Field className="flex-1 min-w-[200px]">
                            <FieldLabel
                                htmlFor="patient_lastName"
                                className="text-[12px] font-bold text-gray-500 uppercase mb-1"
                            >
                                Last Name
                            </FieldLabel>
                            <Input 
                                type="text"
                                placeholder="..."
                                value={value?.lastName}
                                onChange={e => 
                                    update({ lastName: e.target.value })
                                }
                            />
                        </Field>
                        <Field className="flex-1 min-w-[200px]">
                            <FieldLabel
                                htmlFor="patient_firstName"
                                className="text-[12px] font-bold text-gray-500 uppercase mb-1"
                            >
                                First Name
                            </FieldLabel>
                            <Input 
                                type="text"
                                placeholder="..."
                                value={value?.firstName}
                                onChange={e => 
                                    update({ firstName: e.target.value })
                                }
                            />
                        </Field>
                        <Field className="flex-1 min-w-[100px]">
                            <FieldLabel
                                htmlFor="patient_mi"
                                className="text-[12px] font-bold text-gray-500 uppercase mb-1"
                            >
                                M.I.
                            </FieldLabel>
                            <Input 
                                type="text"
                                placeholder="..."
                                value={value?.mi}
                                onChange={e => 
                                    update({ mi: e.target.value })
                                }
                            />
                        </Field>
                        <Field className="flex-1 min-w-[100px]">
                            <FieldLabel
                                htmlFor="patient_age"
                                className="text-[12px] font-bold text-gray-500 uppercase mb-1"
                            >
                                Age
                            </FieldLabel>
                            <Input 
                                type="number"
                                placeholder="..."
                                value={value?.age}
                                onChange={e => 
                                    update({ age: Number(e.target.value) })
                                }
                            />
                        </Field>
                        <Field className="flex-1 min-w-[150px]">
                            <FieldLabel
                                htmlFor="patient_sex"
                                className="text-[12px] font-bold text-gray-500 uppercase mb-1"
                            >
                                Sex
                            </FieldLabel>
                            <Select
                                value={value?.sex} 
                                onValueChange={(sex: "Male" | "Female") => update({ sex })}
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select the sex" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="male">Male</SelectItem>
                                    <SelectItem value="female">Female</SelectItem>
                                </SelectContent>
                            </Select>
                        </Field>
                    </FieldGroup>
                </FieldSet>
            </CardContent>
        </Card>
    )
}