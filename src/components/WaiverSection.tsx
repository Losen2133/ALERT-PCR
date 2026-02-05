import { TabsContent } from "@radix-ui/react-tabs"
import { ScrollArea, ScrollBar } from "./ui/scroll-area"
import { Tabs, TabsList, TabsTrigger } from "./ui/tabs"
import { Card, CardContent, CardHeader } from "./ui/card"
import { Field, FieldGroup, FieldLabel, FieldSet } from "./ui/field"
import { InputGroup, InputGroupAddon, InputGroupInput } from "./ui/input-group"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Calendar as CalendarIcon, ChevronDown, Clock } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover"
import { Calendar } from "./ui/calendar"
import { useState } from "react"
import type { Waivers } from "@/interfaces/interfaces"
import { Textarea } from "./ui/textarea"
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog"
import { SignatureCanvas } from "./SigningCanvas"
import { type CanvasPath } from "@/interfaces/interfaces"

interface WaiverSectionProps {
    value?: Waivers;
    onChange: (value: Waivers) => void;
    className?: string
    signature1Ref?: React.Ref<any>;
    signature2Ref?: React.Ref<any>;
    signature3Ref?: React.Ref<any>;
    signature4Ref?: React.Ref<any>;
    signature5Ref?: React.Ref<any>;
    signature6Ref?: React.Ref<any>;
}

export const WaiverSection = ({
    value,
    onChange,
    className,
    signature1Ref,
    signature2Ref,
    signature3Ref,
    signature4Ref,
    signature5Ref,
    signature6Ref,
}: WaiverSectionProps) => {
    
    const [date1Open, setDate1Open] = useState(false);
    const [date2Open, setDate2Open] = useState(false);
    const [date3Open, setDate3Open] = useState(false);
    const [date4Open, setDate4Open] = useState(false);
    const [isSignCanvas1Open, setSignCanvas1Open] = useState(false);
    const [isSignCanvas2Open, setSignCanvas2Open] = useState(false);
    const [isSignCanvas3Open, setSignCanvas3Open] = useState(false);
    const [isSignCanvas4Open, setSignCanvas4Open] = useState(false);
    const [isSignCanvas5Open, setSignCanvas5Open] = useState(false);
    const [isSignCanvas6Open, setSignCanvas6Open] = useState(false);

    const update = (partial: Partial<Waivers>) => {
        onChange({
            ...value,
            ...partial
        })
    }

    return (
        <Tabs
            defaultValue="informedConsent"
            className={ className }
        >
            <ScrollArea className="w-full rounded-lg">
                <TabsList className="flex justify-center w-full gap-1">
                    <TabsTrigger value="informedConsent" className="border border-1px lg:border-none">
                        Informed Consent
                    </TabsTrigger>
                    <TabsTrigger value="refusalOfTreatment" className="border border-1px lg:border-none">
                        Refusal of Treatment or Transport
                    </TabsTrigger>
                    <TabsTrigger value="refusalForAdmission" className="border border-1px lg:border-none">
                        Refusal for Admission
                    </TabsTrigger>
                </TabsList>
                <ScrollBar orientation="horizontal" hidden/>
            </ScrollArea>
            <TabsContent value="informedConsent">
                <Card>
                    <CardHeader className="font-bold text-[35px]">
                        Informed Consent
                    </CardHeader>
                    <CardContent>
                        I knowingly and willingly submit myself to any/all range of medical services that the USJR ALERT EMS personnel will provide.
                        The type and extent of treatment I will receive will be determined based on thorough and holistic assessment of the responder.
                        I know the information shared with the USJR ALERT EMS staff is confidential and no information will be disclosed to the receiving without my consent.
                        <br />
                        <br />
                        Also, I waive USJR ALERT EMS responders and personnel of any liabilities after they divulge me from their professional care.
                        <br />
                        <br />
                        I have fully read and fully understood the above statement.
                        <br />
                        <br />
                        
                        <FieldSet className="space-y-10">
                            {/* PATIENT SECTION */}
                            <div className="space-y-4">
                                <FieldGroup className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6 lg:grid-cols-12 items-start">
                                
                                    {/* Signature Area - Spans full width on mobile, half on desktop */}
                                    <Field className="col-span-1 sm:col-span-6 lg:col-span-6">
                                        <InputGroup>
                                            <InputGroupInput 
                                                type="text" 
                                                className="text-center border-none shadow-none focus:ring-0" 
                                                placeholder="Type patient name here..."
                                                value={value?.informedConsent?.patientName ?? ""}
                                                onChange={(e) =>
                                                    update({
                                                        informedConsent: {
                                                            ...value?.informedConsent,
                                                            patientName: e.target.value
                                                        }
                                                    })
                                                }
                                            />
                                            <InputGroupAddon align={"inline-end"}>
                                                <Dialog open={isSignCanvas1Open} onOpenChange={setSignCanvas1Open}>
                                                    <DialogTrigger>
                                                        <Button variant="ghost" className="border-s rounded-none">Click to sign</Button>
                                                    </DialogTrigger>
                                                    <DialogContent className="w-[95vw] sm:max-w-[850px] max-h-[90vh] overflow-y-auto">
                                                        <SignatureCanvas 
                                                            ref={signature1Ref}
                                                            initialPaths={value?.informedConsent?.patientSign ?? []}
                                                            onSave={(paths: CanvasPath[], imageString: string) => {
                                                                update({
                                                                    informedConsent: {
                                                                        ...value?.informedConsent,
                                                                        patientSign: paths,
                                                                        patientSignImage: imageString
                                                                    }
                                                                })
                                                            }}
                                                        />
                                                    </DialogContent>
                                                </Dialog>
                                            </InputGroupAddon>
                                        </InputGroup>
                                        
                                        <FieldLabel className="text-center w-full block mt-1 border-t border-gray-300 pt-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                                            Patient name and Signature
                                        </FieldLabel>
                                    </Field>

                                    {/* Date - Spans full on mobile, half on tablet, 3/12 on desktop */}
                                    <Field className="col-span-1 sm:col-span-3 lg:col-span-3">
                                        <Popover open={date1Open} onOpenChange={setDate1Open}>
                                            <PopoverTrigger asChild>
                                                <Button variant='outline' className='w-full justify-between font-normal'>
                                                    <span className='flex items-center'>
                                                        <CalendarIcon className='mr-2' />
                                                        {value?.informedConsent?.date1 ? value?.informedConsent.date1.toLocaleDateString() : 'Pick a Date'}
                                                    </span>
                                                    <ChevronDown />
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent>
                                                <Calendar
                                                    mode="single"
                                                    selected={value?.informedConsent?.date1}
                                                    onSelect={date => {
                                                        update({
                                                            informedConsent: {
                                                                ...value?.informedConsent,
                                                                date1: date ?? undefined
                                                            }
                                                        });
                                                        setDate1Open(false);
                                                    }}
                                                />
                                            </PopoverContent>
                                        </Popover>
                                        <FieldLabel className="text-center w-full block mt-1 border-t border-gray-300 pt-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                                            Date
                                        </FieldLabel>
                                    </Field>

                                    {/* Time - Spans full on mobile, half on tablet, 3/12 on desktop */}
                                    <Field className="col-span-1 sm:col-span-3 lg:col-span-3">
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">
                                                <Clock className="h-4 w-4" />
                                            </div>
                                            <Input 
                                                type="time" 
                                                className="pl-9 text-center focus:ring-0"
                                                value={value?.informedConsent?.time1}
                                                onChange={(e) =>
                                                    update({
                                                        informedConsent: {
                                                            ...value?.informedConsent,
                                                            time1: e.target.value
                                                        }
                                                    })
                                                }
                                            />
                                        </div>
                                        <FieldLabel className="text-center w-full block mt-1 border-t border-gray-300 pt-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                                            Time
                                        </FieldLabel>
                                    </Field>
                                </FieldGroup>
                            </div>

                            {/* GUARDIAN SECTION (Identical Responsive Logic) */}
                            <div className="space-y-4">
                                <FieldGroup className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6 lg:grid-cols-12 items-start">
                                    <Field className="col-span-1 sm:col-span-6 lg:col-span-6">
                                        <InputGroup>
                                            <InputGroupInput
                                                type="text"
                                                className="text-center border-none shadow-none focus:ring-0"
                                                placeholder="Type guardian name here..."    
                                            />
                                            <InputGroupAddon align={"inline-end"}>
                                                <Dialog open={isSignCanvas2Open} onOpenChange={setSignCanvas2Open}>
                                                    <DialogTrigger>
                                                        <Button variant="ghost" className="border-s rounded-none">Click to sign</Button>
                                                    </DialogTrigger>
                                                    <DialogContent className="w-[95vw] sm:max-w-[850px] max-h-[90vh] overflow-y-auto">
                                                        <SignatureCanvas 
                                                            ref={signature2Ref}
                                                            initialPaths={value?.informedConsent?.guardianSign ?? []}
                                                            onSave={(paths: CanvasPath[], imageString: string) => {
                                                                update({
                                                                    informedConsent: {
                                                                        ...value?.informedConsent,
                                                                        guardianSign: paths,
                                                                        guardianSignImage: imageString
                                                                    }
                                                                })
                                                            }}
                                                        />
                                                    </DialogContent>
                                                </Dialog>
                                            </InputGroupAddon>
                                        </InputGroup>
                                        <FieldLabel className="text-center w-full block mt-1 border-t border-gray-300 pt-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                                            Guardian name and Signature
                                        </FieldLabel>
                                    </Field>

                                    <Field className="col-span-1 sm:col-span-3 lg:col-span-3">
                                        <Popover open={date2Open} onOpenChange={setDate2Open}>
                                            <PopoverTrigger asChild>
                                                <Button variant='outline' className='w-full justify-between font-normal'>
                                                    <span className='flex items-center'>
                                                        <CalendarIcon className='mr-2' />
                                                        {value?.informedConsent?.date2 ? value?.informedConsent.date2.toLocaleDateString() : 'Pick a Date'}
                                                    </span>
                                                    <ChevronDown />
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent>
                                                <Calendar
                                                    mode="single"
                                                    selected={value?.informedConsent?.date2}
                                                    onSelect={date => {
                                                        update({
                                                            informedConsent: {
                                                                ...value?.informedConsent,
                                                                date2: date ?? undefined
                                                            }
                                                        });
                                                        setDate1Open(false);
                                                    }}
                                                />
                                            </PopoverContent>
                                        </Popover>
                                        <FieldLabel className="text-center w-full block mt-1 border-t border-gray-300 pt-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                                            Date
                                        </FieldLabel>
                                    </Field>

                                    <Field className="col-span-1 sm:col-span-3 lg:col-span-3">
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">
                                                <Clock className="h-4 w-4" />
                                            </div>
                                            <Input 
                                                type="time" 
                                                className="pl-9 text-center focus:ring-0"
                                                value={value?.informedConsent?.time2}
                                                onChange={(e) =>
                                                    update({
                                                        informedConsent: {
                                                            ...value?.informedConsent,
                                                            time2: e.target.value
                                                        }
                                                    })
                                                }
                                            />
                                        </div>
                                        <FieldLabel className="text-center w-full block mt-1 border-t border-gray-300 pt-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                                            Time
                                        </FieldLabel>
                                    </Field>
                                </FieldGroup>
                            </div>
                        </FieldSet>
                    </CardContent>
                </Card>
            </TabsContent>
            <TabsContent value="refusalOfTreatment">
                <Card>
                    <CardHeader className="font-bold text-[35px]">
                        Refusal of Treatment or Transport
                    </CardHeader>
                    <CardContent>
                        This form is being provided to me because I have refused assessment and treatment
                        and/or refused transport to the nearest hospital via USJR ALERT EMS ambulance for myself
                        (or on behalf of this patient.)
                        <br />
                        <br />
                        <div className="ps-10">
                            <ul className="list-disc">
                                <li>
                                    I understand that the Medics or the Ambulance Nurses are not physicians and are not qualified
                                    to make a diagnosis and that their intervention is not substitute for that of a physician in the hospital.
                                </li>
                                <li>
                                    I recognize that there may be a serious injury or illness that could get worse if without medical attention even though
                                    I (or the patient) may feel fine at the present time.
                                </li>
                                <li>
                                    I understand that I may change my mind and dial{" "}
                                    <Input
                                        type="tel"
                                        value={value?.refusalOfTreatment?.contactNo}
                                        onChange={(e) =>
                                            update({
                                                refusalOfTreatment: {
                                                    ...value?.refusalOfTreatment,
                                                    contactNo: e.target.value
                                                }
                                            })
                                        }
                                        placeholder="000-000-0000"
                                        className="inline-block w-50 h-auto border-gray-400 bg-transparent p-0 text-center"
                                    />
                                    {" "}or other means of communication if assistance or treatment is needed later.
                                </li>
                                <li>
                                    I acknowledge that this advice has been explained to me by the EMS and that I have read this form and understand its terms.
                                </li>
                            </ul>
                        </div>
                        <br />
                        <FieldSet className="space-y-10">
                            <div className="space-y-4">
                                <FieldGroup className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6 lg:grid-cols-12 items-start">
                                    <Field className="col-span-1 sm:col-span-6 lg:col-span-6">
                                        <InputGroup>
                                            <InputGroupInput 
                                                type="text" 
                                                className="text-center border-none shadow-none focus:ring-0" 
                                                placeholder="Type patient name here..."
                                                value={value?.refusalOfTreatment?.patientName ?? ""}
                                                onChange={(e) =>
                                                    update({
                                                        refusalOfTreatment: {
                                                            ...value?.refusalOfTreatment,
                                                            patientName: e.target.value
                                                        }
                                                    })
                                                }
                                            />
                                            <InputGroupAddon align={"inline-end"}>
                                                <Dialog open={isSignCanvas3Open} onOpenChange={setSignCanvas3Open}>
                                                    <DialogTrigger>
                                                        <Button variant="ghost" className="border-s rounded-none">Click to sign</Button>
                                                    </DialogTrigger>
                                                    <DialogContent className="w-[95vw] sm:max-w-[850px] max-h-[90vh] overflow-y-auto">
                                                        <SignatureCanvas 
                                                            ref={signature3Ref}
                                                            initialPaths={value?.refusalOfTreatment?.patientSign ?? []}
                                                            onSave={(paths: CanvasPath[], imageString: string) => {
                                                                update({
                                                                    refusalOfTreatment: {
                                                                        ...value?.refusalOfTreatment,
                                                                        patientSign: paths,
                                                                        patientSignImage: imageString
                                                                    }
                                                                })
                                                            }}
                                                        />
                                                    </DialogContent>
                                                </Dialog>
                                            </InputGroupAddon>
                                        </InputGroup>
                                        <FieldLabel className="text-center w-full block mt-1 border-t border-gray-300 pt-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                                            Signature over Printed Name of Patient/SO
                                        </FieldLabel>
                                    </Field>
                                    <Field className="col-span-1 sm:col-span-6 lg:col-span-6">
                                        <InputGroup>
                                            <InputGroupInput 
                                                type="text" 
                                                className="text-center border-none shadow-none focus:ring-0" 
                                                placeholder="Type witness name here..."
                                                value={value?.refusalOfTreatment?.witnessName ?? ""}
                                                onChange={(e) =>
                                                    update({
                                                        refusalOfTreatment: {
                                                            ...value?.refusalOfTreatment,
                                                            witnessName: e.target.value
                                                        }
                                                    })
                                                }
                                            />
                                            <InputGroupAddon align={"inline-end"}>
                                                <Dialog open={isSignCanvas4Open} onOpenChange={setSignCanvas4Open}>
                                                    <DialogTrigger>
                                                        <Button variant="ghost" className="border-s rounded-none">Click to sign</Button>
                                                    </DialogTrigger>
                                                    <DialogContent className="w-[95vw] sm:max-w-[850px] max-h-[90vh] overflow-y-auto">
                                                        <SignatureCanvas 
                                                            ref={signature4Ref}
                                                            initialPaths={value?.refusalOfTreatment?.witnessSign ?? []}
                                                            onSave={(paths: CanvasPath[], imageString: string) => {
                                                                update({
                                                                    refusalOfTreatment: {
                                                                        ...value?.refusalOfTreatment,
                                                                        witnessSign: paths,
                                                                        witnessSignImage: imageString
                                                                    }
                                                                })
                                                            }}
                                                        />
                                                    </DialogContent>
                                                </Dialog>
                                            </InputGroupAddon>
                                        </InputGroup>
                                        <FieldLabel className="text-center w-full block mt-1 border-t border-gray-300 pt-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                                            Signature over Printed Name of Witness
                                        </FieldLabel>
                                    </Field>
                                </FieldGroup>
                            </div>
                        </FieldSet>
                    </CardContent>
                </Card>
            </TabsContent>
            <TabsContent value="refusalForAdmission">
                <Card>
                    <CardHeader className="font-bold text-[35px]">
                        Refusal for Admission
                    </CardHeader>
                    <CardContent>
                        Medical Facility:{" "}
                        <Input
                            type="text"
                            value={value?.refusalForAdmission?.medicalFacility}
                            onChange={(e) =>
                                update({
                                    refusalForAdmission: {
                                        ...value?.refusalForAdmission,
                                        medicalFacility: e.target.value
                                    }
                                })
                            }
                            className="inline-block w-75 h-auto bg-transparent"
                        />
                        {""}
                        <br />
                        <br />
                        By signing this document, I acknowledge that the patient's medical condition has been
                        properly endrosed by the USJR ALERT EMS responder, to the medical facility stated above
                        and to the physician/Nuse of duty. Despite this, the facility refuses or declines to admit
                        the patient due to:
                        <br />
                        <br />
                        <Field>
                            <FieldLabel className="text-[12px] font-bold text-gray-500 uppercase mb-1">
                                Reason for refusal
                            </FieldLabel>
                            <Textarea
                                placeholder="..."
                                className="h-[100px] sm:h-[160px] lg:h-[200px] resize-none"
                                value={value?.refusalForAdmission?.reasonForRefusal ?? ""}
                                onChange={(e) =>
                                    update({
                                        refusalForAdmission: {
                                            ...value?.refusalForAdmission,
                                            reasonForRefusal: e.target.value
                                        }
                                    })
                                }
                            />
                        </Field>
                        <br />
                        <FieldSet className="space-y-10">
                            <div className="space-y-4">
                                <FieldGroup className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6 lg:grid-cols-12 items-start">
                                    <Field className="col-span-6">
                                        <InputGroup>
                                            <InputGroupInput 
                                                type="text" 
                                                className="text-center border-none shadow-none focus:ring-0" 
                                                placeholder="Type Physician / Nurse on Duty name here..."
                                                value={value?.refusalForAdmission?.physicianName ?? ""}
                                                onChange={(e) =>
                                                    update({
                                                        refusalForAdmission: {
                                                            ...value?.refusalForAdmission,
                                                            physicianName: e.target.value
                                                        }
                                                    })
                                                }
                                            />
                                            <InputGroupAddon align={"inline-end"}>
                                                <Dialog open={isSignCanvas5Open} onOpenChange={setSignCanvas5Open}>
                                                    <DialogTrigger>
                                                        <Button variant="ghost" className="border-s rounded-none">Click to sign</Button>
                                                    </DialogTrigger>
                                                    <DialogContent className="w-[95vw] sm:max-w-[850px] max-h-[90vh] overflow-y-auto">
                                                        <SignatureCanvas 
                                                            ref={signature5Ref}
                                                            initialPaths={value?.refusalForAdmission?.physicianSign ?? []}
                                                            onSave={(paths: CanvasPath[], imageString: string) => {
                                                                update({
                                                                    refusalForAdmission: {
                                                                        ...value?.refusalForAdmission,
                                                                        physicianSign: paths,
                                                                        physicianSignImage: imageString
                                                                    }
                                                                })
                                                            }}
                                                        />
                                                    </DialogContent>
                                                </Dialog>
                                            </InputGroupAddon>
                                        </InputGroup>
                                        <FieldLabel className="text-center w-full block mt-1 border-t border-gray-300 pt-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                                            Physician / Nurse on Duty
                                        </FieldLabel>
                                    </Field>
                                    <Field className="col-span-6">
                                        <Popover open={date3Open} onOpenChange={setDate3Open}>
                                            <PopoverTrigger asChild>
                                                <Button variant='outline' className='w-full justify-between font-normal'>
                                                    <span className='flex items-center'>
                                                        <CalendarIcon className='mr-2' />
                                                        {value?.refusalForAdmission?.date1 ? value?.refusalForAdmission.date1.toLocaleDateString() : 'Pick a Date'}
                                                    </span>
                                                    <ChevronDown />
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent>
                                                <Calendar
                                                    mode="single"
                                                    selected={value?.refusalForAdmission?.date1}
                                                    onSelect={date => {
                                                        update({
                                                            refusalForAdmission: {
                                                                ...value?.refusalForAdmission,
                                                                date1: date ?? undefined
                                                            }
                                                        });
                                                        setDate3Open(false);
                                                    }}
                                                />
                                            </PopoverContent>
                                        </Popover>
                                        <FieldLabel className="text-center w-full block mt-1 border-t border-gray-300 pt-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                                            Date
                                        </FieldLabel>
                                    </Field>
                                </FieldGroup>
                            </div>
                            <div className="space-y-4">
                                <FieldGroup className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6 lg:grid-cols-12 items-start">
                                    <Field className="col-span-6">
                                        <InputGroup>
                                            <InputGroupInput 
                                                type="text" 
                                                className="text-center border-none shadow-none focus:ring-0" 
                                                placeholder="Type witness name here..."
                                                value={value?.refusalForAdmission?.witnessName ?? ""}
                                                onChange={(e) =>
                                                    update({
                                                        refusalForAdmission: {
                                                            ...value?.refusalForAdmission,
                                                            witnessName: e.target.value
                                                        }
                                                    })
                                                }
                                            />
                                            <InputGroupAddon align={"inline-end"}>
                                                <Dialog open={isSignCanvas6Open} onOpenChange={setSignCanvas6Open}>
                                                    <DialogTrigger>
                                                        <Button variant="ghost" className="border-s rounded-none">Click to sign</Button>
                                                    </DialogTrigger>
                                                    <DialogContent className="w-[95vw] sm:max-w-[850px] max-h-[90vh] overflow-y-auto">
                                                        <SignatureCanvas 
                                                            ref={signature6Ref}
                                                            initialPaths={value?.refusalForAdmission?.witnessSign ?? []}
                                                            onSave={(paths: CanvasPath[], imageString: string) => {
                                                                update({
                                                                    refusalForAdmission: {
                                                                        ...value?.refusalForAdmission,
                                                                        witnessSign: paths,
                                                                        witnessSignImage: imageString
                                                                    }
                                                                })
                                                            }}
                                                        />
                                                    </DialogContent>
                                                </Dialog>
                                            </InputGroupAddon>
                                        </InputGroup>
                                        <FieldLabel className="text-center w-full block mt-1 border-t border-gray-300 pt-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                                            Witness
                                        </FieldLabel>
                                    </Field>
                                    <Field className="col-span-6">
                                        <Popover open={date4Open} onOpenChange={setDate4Open}>
                                            <PopoverTrigger asChild>
                                                <Button variant='outline' className='w-full justify-between font-normal'>
                                                    <span className='flex items-center'>
                                                        <CalendarIcon className='mr-2' />
                                                        {value?.refusalForAdmission?.date2 ? value?.refusalForAdmission.date2.toLocaleDateString() : 'Pick a Date'}
                                                    </span>
                                                    <ChevronDown />
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent>
                                                <Calendar
                                                    mode="single"
                                                    selected={value?.refusalForAdmission?.date2}
                                                    onSelect={date => {
                                                        update({
                                                            refusalForAdmission: {
                                                                ...value?.refusalForAdmission,
                                                                date2: date ?? undefined
                                                            }
                                                        });
                                                        setDate4Open(false);
                                                    }}
                                                />
                                            </PopoverContent>
                                        </Popover>
                                        <FieldLabel className="text-center w-full block mt-1 border-t border-gray-300 pt-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                                            Date
                                        </FieldLabel>
                                    </Field>
                                </FieldGroup>
                            </div>
                        </FieldSet>
                    </CardContent>
                </Card>
            </TabsContent>
        </Tabs>
    )

    
}