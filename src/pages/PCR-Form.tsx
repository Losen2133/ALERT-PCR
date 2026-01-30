
import { Button } from "@/components/ui/button";
import { Activity, Ambulance, FileText, Printer, Save, Signature, Stethoscope, User } from "lucide-react";
import { motion } from "motion/react";
import { CaseFieldCard } from "@/components/CaseFieldCard";
import type { PCRRecord, Vitals } from "@/interfaces/interfaces";
import { useRef, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { PatientDemographicsFieldCard } from "@/components/PatientDemographicsFieldCard";
import { PatientAssessmentFieldsSection } from "@/components/PatientAssessmentFieldsSection";
import { PatientVitalsFieldCard } from "@/components/PatientVitalsFieldCard";
import { PatientHistoryFieldCard } from "@/components/PatientHistoryFieldCard";
import { PatientSecondaryAssessmentFieldCard } from "@/components/PatientSecondaryAssessmentFieldCard";
import type { ReactSketchCanvasRef } from "react-sketch-canvas";
import { handleGeneratePDF } from "@/lib/pdf"
import { TeamsOpsFieldCard } from "@/components/TeamOpsFieldCard";

export const PCRForm = () => {
    const traumaCanvasRef = useRef<ReactSketchCanvasRef>(null);
    const [newPCRRecord, setNewPCRRecord] = useState<PCRRecord>({
            caseDetails: {},
            patientDemographics: {},
            patientAssessment: {},
            patientVitals: [],
            patientHistory: {},
            caseTeamOpsInfo: {},
            secondaryAssessment: {}
        });

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1 }}
            transition={{ duration: 0.2 }}
        >
            <div className="flex justify-end gap-x-3 border-b-1 pb-3 mb-3">
                <Button variant="outline" size={"lg"}>Cancel</Button>
                <Button variant="default" size={"lg"}><Save />Save</Button>
                <Button variant="outline" size={"lg"} onClick={() => { handleGeneratePDF(newPCRRecord) }}><Printer />Print as PDF</Button>
                {/* <Button variant="outline" size={"lg"}><Printer />Print as PDF</Button> */}
            </div>
            <CaseFieldCard 
                value={newPCRRecord.caseDetails}
                onChange={(caseDetails) =>
                    setNewPCRRecord(prev => ({
                        ...prev,
                        caseDetails
                    }))
                }
                className="mb-3"
            />
            <Tabs
                defaultValue="patient"
                className="w-full"
            >
                <ScrollArea className="w-full rounded-lg">
                    <TabsList className="flex justify-center w-full gap-1 bg-gray-700 text-white">
                        {/* <ScrollArea> */}
                            <TabsTrigger value="patient" className="border border-1px lg:border-none">
                                <User className="mr-2 h-4 w-4" />
                                Patient Info
                            </TabsTrigger>
                            <TabsTrigger value="p-assessment" className="border border-1px lg:border-none">
                                <Stethoscope className="mr-2 h-4 w-4" />
                                Primary Assessment
                            </TabsTrigger>
                            <TabsTrigger value="vitals" className="border border-1px lg:border-none">
                                <Activity className="mr-2 h-4 w-4" />
                                Vitals
                            </TabsTrigger>
                            <TabsTrigger value="history" className="border border-1px lg:border-none">
                                <FileText className="mr-2 h-4 w-4" />
                                History
                            </TabsTrigger>
                            <TabsTrigger value="s-assessment" className="border border-1px lg:border-none">
                                <Stethoscope className="mr-2 h-4 w-4" />
                                Secondary Assessment
                            </TabsTrigger>
                            <TabsTrigger value="team-ops" className="border border-1px lg:border-none">
                                <Ambulance className="mr-2 h-4 w-4" />
                                Team & Ops
                            </TabsTrigger>
                            <TabsTrigger value="wavers" className="border border-1px lg:border-none">
                                <Signature className="mr-2 h-4 w-4"/>
                                Waivers
                            </TabsTrigger>
                            {/* <ScrollBar orientation="horizontal" /> */}
                        {/* </ScrollArea> */}
                    </TabsList>
                    <ScrollBar orientation="horizontal" hidden/>
                </ScrollArea>
                <TabsContent value="patient">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 30 }}
                        transition={{ duration: 0.2 }}
                    >
                        <PatientDemographicsFieldCard
                            value={newPCRRecord.patientDemographics}
                            onChange={(patientDemographics) =>
                                setNewPCRRecord(prev => ({
                                    ...prev,
                                    patientDemographics
                                }))
                            }
                        />
                    </motion.div>
                    
                </TabsContent>
                <TabsContent value="p-assessment">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 30 }}
                        transition={{ duration: 0.2 }}
                    >
                        <PatientAssessmentFieldsSection
                            value={newPCRRecord.patientAssessment}
                            onChange={(patientAssessment) =>
                                setNewPCRRecord(prev => ({
                                    ...prev,
                                    patientAssessment
                                }))
                            }
                        />
                    </motion.div>
                </TabsContent>
                <TabsContent value="vitals">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 30 }}
                        transition={{ duration: 0.2 }}
                    >
                        <PatientVitalsFieldCard 
                            value={newPCRRecord.patientVitals ?? []}
                            onChange={(newEntry: Vitals) =>
                                setNewPCRRecord((prev) => ({
                                ...prev,
                                patientVitals: [...(prev.patientVitals ?? []), newEntry],
                                }))
                            }
                        />
                    </motion.div>
                </TabsContent>
                <TabsContent value="history">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 30 }}
                        transition={{ duration: 0.2 }}
                    >
                        <PatientHistoryFieldCard
                            value={newPCRRecord.patientHistory}
                            onChange={(patientHistory) => 
                                setNewPCRRecord(prev => ({
                                    ...prev,
                                    patientHistory
                                }))
                            }
                        />
                    </motion.div>
                </TabsContent>
                <TabsContent value="s-assessment">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 30 }}
                        transition={{ duration: 0.2 }}
                    >
                        <PatientSecondaryAssessmentFieldCard 
                            value={newPCRRecord.secondaryAssessment}
                            onChange={(data) => // 'data' is the SecondaryAssessment object from the child
                                setNewPCRRecord(prev => ({
                                    ...prev,
                                    secondaryAssessment: data // FIX: Use 'secondaryAssessment', not 'patientSecondaryAssessment'
                                }))
                            }
                            ref={traumaCanvasRef}
                        />
                    </motion.div>
                </TabsContent>
                <TabsContent value="team-ops">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 30 }}
                        transition={{ duration: 0.2 }}
                    >
                        <TeamsOpsFieldCard
                            value={newPCRRecord.caseTeamOpsInfo}
                            onChange={(caseTeamOpsInfo) => 
                                setNewPCRRecord(prev => ({
                                    ...prev,
                                    caseTeamOpsInfo
                                }))
                            }
                        />
                    </motion.div>
                </TabsContent>
            </Tabs>
        </motion.div>
    )    
}