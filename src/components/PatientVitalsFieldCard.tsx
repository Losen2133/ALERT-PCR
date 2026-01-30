import type { Vitals } from "@/interfaces/interfaces"
import { calculateRTS, getCurrentTime } from "@/lib/utils"
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Activity, Clock, Plus } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog"
import { Button } from "./ui/button"
import { Field, FieldGroup, FieldLabel, FieldSet } from "./ui/field"
import { Input } from "./ui/input"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "./ui/input-group"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "./ui/popover"
import { DialogClose } from "@radix-ui/react-dialog"
import { DataTable } from "./DataTable"
import { vitalsColumns } from "./Vitals-Columns"

interface PatientVitalsFieldCardProps {
  value?: Vitals[]
  onChange: (value: Vitals) => void
  className?: string
}

export const PatientVitalsFieldCard = ({
  value,
  onChange,
  className,
}: PatientVitalsFieldCardProps) => {
  const [isOpen, setIsOpen] = useState(false)

  const [newVital, setNewVital] = useState<Partial<Vitals>>({
    time: getCurrentTime(),
  })

  const resetVitals = () => {
    setNewVital({
      time: getCurrentTime(),
      temp: undefined,
      BP: { systolic: undefined, diastolic: undefined },
      RR: undefined,
      Pulse: undefined,
      SpO2: undefined,
      RBS: undefined,
      GCS: { eyeOpening: undefined, verbal: undefined, motor: undefined },
      RTS: undefined,
    })
  }

  const handleSave = () => {
    if (!newVital.time) return

    const RTS = calculateRTS(
      {
        eyeOpening: newVital.GCS?.eyeOpening ?? 0,
        verbal: newVital.GCS?.verbal ?? 0,
        motor: newVital.GCS?.motor ?? 0,
      },
      newVital.BP?.systolic ?? 0,
      newVital.RR ?? 0
    )

    onChange({
      ...(newVital as Vitals),
      RTS,
    })

    resetVitals()
    setIsOpen(false)
  }

  return (
    <Card className={className}>
      <CardHeader className="border-b pb-4">
        <CardTitle className="flex items-center gap-3">
          <div className="border border-slate-200 p-1.5 rounded-lg">
            <Activity className="h-5 w-5 text-blue-500" />
          </div>
          <span className="text-lg font-bold text-slate-800">
            Patient Vitals
          </span>
        </CardTitle>
      </CardHeader>

      <CardContent>
        {/* Header */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="border border-slate-200 p-1.5 rounded-lg">
              <Activity className="h-5 w-5 text-red-500" />
            </div>
            <span className="text-lg font-bold text-slate-800">
              Vitals Logging
            </span>
          </div>

          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Plus className="h-4 w-4 mr-1" />
                Add Vital
              </Button>
            </DialogTrigger>

            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>Patient Vitals</DialogTitle>
              </DialogHeader>

              <FieldSet>
                <FieldGroup className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field>
                    <FieldLabel className="text-[12px] font-bold uppercase mb-1">
                      Time
                    </FieldLabel>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">
                        <Clock className="h-4 w-4" />
                      </div>
                      <Input
                        type="time"
                        className="pl-9"
                        value={newVital.time}
                        onChange={(e) =>
                          setNewVital((p) => ({
                            ...p,
                            time: e.target.value,
                          }))
                        }
                      />
                    </div>
                  </Field>

                  <Field>
                    <FieldLabel className="text-[12px] font-bold uppercase mb-1">
                      Temperature
                    </FieldLabel>
                    <InputGroup>
                      <InputGroupInput
                        type="number"
                        value={newVital.temp}
                        onChange={(e) =>
                          setNewVital((p) => ({
                            ...p,
                            temp: Number(e.target.value),
                          }))
                        }
                      />
                      <InputGroupAddon>°C</InputGroupAddon>
                    </InputGroup>
                  </Field>

                  <Field className="sm:col-span-2">
                    <FieldLabel className="text-[12px] font-bold uppercase mb-1">
                      Blood Pressure
                    </FieldLabel>
                    <div className="flex gap-2">
                      <Input
                        type="number"
                        placeholder="Systolic"
                        value={newVital.BP?.systolic}
                        onChange={(e) =>
                          setNewVital((p) => ({
                            ...p,
                            BP: {
                              ...p.BP,
                              systolic: Number(e.target.value),
                            },
                          }))
                        }
                      />
                      <Input
                        type="number"
                        placeholder="Diastolic"
                        value={newVital.BP?.diastolic}
                        onChange={(e) =>
                          setNewVital((p) => ({
                            ...p,
                            BP: {
                              ...p.BP,
                              diastolic: Number(e.target.value),
                            },
                          }))
                        }
                      />
                    </div>
                  </Field>

                  {["RR", "Pulse", "SpO2", "RBS"].map((key) => (
                    <Field key={key}>
                      <FieldLabel className="text-[12px] font-bold uppercase mb-1">
                        {key}
                      </FieldLabel>
                      <Input
                        type="number"
                        value={(newVital as any)[key]}
                        onChange={(e) =>
                          setNewVital((p) => ({
                            ...p,
                            [key]: Number(e.target.value),
                          }))
                        }
                      />
                    </Field>
                  ))}

                  <Field className="sm:col-span-2">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full">
                          Score GCS
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent>
                        <FieldGroup className="grid grid-cols-3 gap-3">
                          {["eyeOpening", "verbal", "motor"].map((k) => (
                            <Field key={k}>
                              <FieldLabel className="text-[12px] font-bold uppercase mb-1">
                                {k}
                              </FieldLabel>
                              <Input
                                type="number"
                                placeholder="1-5"
                                min={1}
                                max={5}
                                value={(newVital.GCS as any)?.[k]}
                                onChange={(e) =>
                                  setNewVital((p) => ({
                                    ...p,
                                    GCS: {
                                      ...p.GCS,
                                      [k]: Math.min(
                                        5,
                                        Math.max(1, Number(e.target.value))
                                      ),
                                    },
                                  }))
                                }
                              />
                            </Field>
                          ))}
                        </FieldGroup>
                      </PopoverContent>
                    </Popover>
                  </Field>
                </FieldGroup>
              </FieldSet>

              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline" onClick={resetVitals}>
                    Cancel
                  </Button>
                </DialogClose>
                <Button onClick={handleSave}>Add Record</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        
        <DataTable<Vitals, any> 
          columns={vitalsColumns}
          data={value ?? []}
          noValueString="No vitals recorded." 
          className="w-full h-[320px] flex flex-col gap-4"
        />
        
      </CardContent>
    </Card>
  )
}
