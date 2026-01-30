import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover"
import { Card, CardContent } from "./ui/card"
import { Field, FieldGroup, FieldLabel, FieldSet } from "./ui/field"
import { Input } from "./ui/input"
import { Button } from "./ui/button"
import { Calendar as CalendarIcon, ChevronDown, Clock } from "lucide-react"
import { useState } from "react"
import type { Case } from "@/interfaces/interfaces"
import { Calendar } from "./ui/calendar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"

interface CaseFieldCardProps {
    value?: Case;
    onChange: (value: Case) => void;
    className?: string
}

export const CaseFieldCard = ({value, onChange, className}: CaseFieldCardProps) => {
    const [dateOpen, setDateOpen] = useState(false);
    const update = (partial: Partial<Case>) => {
        onChange({
            ...value,
            ...partial
        });
    };

    return (
        <Card className={className ?? ""}>
            <CardContent>
                <FieldSet>
                    <FieldGroup className="flex flex-row gap-4 flex-wrap md:flex-nowrap lg:flex-nowrap">
                        <Field>
                            <FieldLabel htmlFor="case_number" className="text-[12px] font-bold text-gray-500 uppercase mb-1">Case Number</FieldLabel>
                            <Input 
                                type="text"
                                placeholder="..."
                                value={value?.caseNumber ?? ""}
                                onChange={e =>
                                    update({ caseNumber: e.target.value })
                                }
                            />
                        </Field>
                        <Field>
                            <FieldLabel htmlFor="case_date" className="text-[12px] font-bold text-gray-500 uppercase mb-1">Date</FieldLabel>
                            <Popover open={dateOpen} onOpenChange={setDateOpen}>
                                <PopoverTrigger asChild>
                                    <Button variant='outline' id='date' className='w-full justify-between font-normal'>
                                        <span className='flex items-center'>
                                            <CalendarIcon className='mr-2' />
                                            {value?.date ? value?.date.toLocaleDateString() : 'Pick a Date'}
                                        </span>
                                        <ChevronDown />
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent>
                                    <Calendar
                                        mode="single"
                                        selected={value?.date}
                                        onSelect={date => {
                                            update({ date: date ?? undefined });
                                            setDateOpen(false);
                                    }}
                                    />
                                </PopoverContent>
                            </Popover>
                        </Field>
                        <Field>
                            <FieldLabel htmlFor="case_dispatchTime" className="text-[12px] font-bold text-gray-500 uppercase mb-1">Dispatch Time</FieldLabel>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">
                                    <Clock className="h-4 w-4" />
                                </div>
                                <Input
                                    type="time"
                                    className="pl-9"
                                    value={value?.dispatchTime}
                                    onChange={e =>
                                        update({ dispatchTime: e.target.value })
                                    }
                                />
                            </div>
                        </Field>
                        <Field>
                            <FieldLabel htmlFor="case_priority" className="text-[12px] font-bold text-gray-500 uppercase mb-1">Priority</FieldLabel>
                            <Select 
                                value={value?.priority}
                                onValueChange={(priority: "Low" | "High") => update({ priority })}
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select Priority" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Low">Low</SelectItem>
                                    <SelectItem value="High">High</SelectItem>
                                </SelectContent>
                            </Select>
                        </Field>
                    </FieldGroup>
                </FieldSet>
            </CardContent>
        </Card>
    )
}