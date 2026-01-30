
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
import { getGCSSum } from "@/lib/utils";
import { PDFDocument } from "pdf-lib";

export const TestingGrounds2 = () => {
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

    async function generatePCRPDF(data: PCRRecord): Promise<Uint8Array> {
        // 1️⃣ Load the PDF template
        const pdfBytes = await fetch("/pcr_template.pdf").then(res => res.arrayBuffer());
        const pdfDoc = await PDFDocument.load(pdfBytes);
        const form = pdfDoc.getForm();
        const page = pdfDoc.getPages()[0];

        // 2️⃣ Fill out the text fields
        form.getTextField("case_number").setText(data.caseDetails?.caseNumber ?? "");
        form.getTextField("case_date").setText(
            data.caseDetails?.date ? new Date(data.caseDetails.date).toLocaleDateString() : ""
        );
        form.getTextField("case_dispatchTime").setText(data.caseDetails?.dispatchTime ?? "");
        form.getTextField("patient_lastName").setText(data.patientDemographics?.lastName ?? "");
        form.getTextField("patient_firstName").setText(data.patientDemographics?.firstName ?? "");
        form.getTextField("patient_mi").setText(data.patientDemographics?.mi ?? "");
        form.getTextField("patient_age").setText(String(data.patientDemographics?.age ?? ""));
        form.getTextField("patient_sex").setText(data.patientDemographics?.sex ?? "");
        form.getTextField("assessment_chiefComplaints").setText(data.patientAssessment?.chiefComplaints ?? "");
        form.getTextField("assessment_levelOfConciousness").setText(data.patientAssessment?.levelOfConciousness ?? "");
        form.getTextField("assessment_natureOfIllness").setText(data.patientAssessment?.natureOfIllness ?? "");
        form.getTextField("assessment_mechanismOfInjury").setText(data.patientAssessment?.mechanismOfInjury ?? "");
        form.getTextField("assessment_airway").setText(data.patientAssessment?.airway ?? "");
        form.getTextField("assessment_breathing").setText(data.patientAssessment?.breathing ?? "");
        form.getTextField("assessment_circulation").setText(data.patientAssessment?.circulation ?? "");

        if (data.patientAssessment?.immobilizationRequired) {
            form.getTextField("assessment_cSpine").setText("Immobilization Considered");
        }

        if(data.caseDetails?.priority) {
            form.getRadioGroup("assessment_priority").select(
                data.caseDetails?.priority === "Low" ? "2" : "1"
            );
        }

        // 3️⃣ Fill vitals
        for (let i = 0; i < 3; i++) {
            const vital = data.patientVitals?.[i];
            if (!vital) continue;

            form.getTextField(`vitals_time${i + 1}`).setText(vital.time ?? "");
            form.getTextField(`vitals_temp${i + 1}`).setText(String(vital.temp ?? ""));
            form.getTextField(`vitals_bp${i + 1}`).setText(
                vital.BP ? `${vital.BP.systolic ?? ""}/${vital.BP.diastolic ?? ""}` : ""
            );
            form.getTextField(`vitals_rr${i + 1}`).setText(String(vital.RR ?? ""));
            form.getTextField(`vitals_pulse${i + 1}`).setText(String(vital.Pulse ?? ""));
            form.getTextField(`vitals_spo2${i + 1}`).setText(String(vital.SpO2 ?? ""));
            form.getTextField(`vitals_gcs${i + 1}`).setText(String(getGCSSum(vital.GCS)));
            form.getTextField(`vitals_rts${i + 1}`).setText(String(vital.RTS ?? ""));
            form.getTextField(`vitals_rbs${i + 1}`).setText(String(vital.RBS ?? ""));
        }
        
        form.getTextField("assessment_providerImpression").setText(String(data.patientAssessment?.providerImpressions));
        const management = data.patientAssessment?.management ?? [];
        let managementText = "";

        for (let i = 0; i < management.length; i++) {
            const m = management[i];
            managementText += `[${m.time ?? "-"}] - ${m.care ?? "-"}\n`;
        }

        form.getTextField("assessment_management").enableMultiline();
        form.getTextField("assessment_management").setText(managementText.trim());

        form.getTextField("opqrst_onset").setText(String(data.secondaryAssessment?.opqrst?.onset ?? ""));
        form.getTextField("opqrst_provocation").setText(String(data.secondaryAssessment?.opqrst?.provocation ?? ""));
        form.getTextField("opqrst_quality").setText(String(data.secondaryAssessment?.opqrst?.quality ?? ""));
        form.getTextField("opqrst_radiation").setText(String(data.secondaryAssessment?.opqrst?.radiation ?? ""));
        form.getTextField("opqrst_severity").setText(String(data.secondaryAssessment?.opqrst?.severity ?? ""));
        form.getTextField("opqrst_timing").setText(String(data.secondaryAssessment?.opqrst?.timing ?? ""));
        
        form.getTextField("apgar_appearance").setText(String(data.secondaryAssessment?.apgar?.appearance ?? ""));
        form.getTextField("apgar_pain").setText(String(data.secondaryAssessment?.apgar?.pain ?? ""));
        form.getTextField("apgar_grimace").setText(String(data.secondaryAssessment?.apgar?.grimace ?? ""));
        form.getTextField("apgar_activity").setText(String(data.secondaryAssessment?.apgar?.activity ?? ""));
        form.getTextField("apgar_respiration").setText(String(data.secondaryAssessment?.apgar?.respiration ?? ""));
        form.getTextField("apgar_total").setText(
            String(
                (data.secondaryAssessment?.apgar?.appearance ?? 0) +
                (data.secondaryAssessment?.apgar?.pain ?? 0) +
                (data.secondaryAssessment?.apgar?.grimace ?? 0) +
                (data.secondaryAssessment?.apgar?.activity ?? 0) +
                (data.secondaryAssessment?.apgar?.respiration ?? 0)
            ) ?? ""
        );

        form.getTextField("teamOps_teamLeader").setText(String(data.caseTeamOpsInfo?.teamInfo?.teamLeader ?? ""));
        form.getTextField("teamOps_ambulance").setText(String(data.caseTeamOpsInfo?.teamInfo?.ambulance ?? ""));
        form.getTextField("teamOps_crew").setText(String(data.caseTeamOpsInfo?.teamInfo?.crew ?? ""));
        form.getTextField("teamOps_receivingFacility").setText(String(data.caseTeamOpsInfo?.endorsementInfo?.receivingFacility ?? ""));
        form.getTextField("teamOps_receivingPersonnel").setText(String(data.caseTeamOpsInfo?.endorsementInfo?.receivingPersonnel ?? ""));
        form.getTextField("teamOps_timeArrived").setText(String(data.caseTeamOpsInfo?.timeArrived ?? ""));
        form.getTextField("teamOps_timeDepart").setText(String(data.caseTeamOpsInfo?.timeDepart ?? ""));
        form.getTextField("teamOps_timeReceived").setText(String(data.caseTeamOpsInfo?.timeReceived ?? ""));

        form.getTextField("history_signsSymptoms").setText(String(data.patientHistory?.symptoms ?? ""));
        form.getTextField("history_allergies").setText(String(data.patientHistory?.allergies ?? ""));
        form.getTextField("history_medication").setText(String(data.patientHistory?.medication ?? ""));
        form.getTextField("history_pastMedical").setText(String(data.patientHistory?.pastMedical ?? ""));
        form.getTextField("history_lastIntake").setText(String(data.patientHistory?.lastIntake ?? ""));
        form.getTextField("history_eventsPrior").setText(String(data.patientHistory?.eventsPrior ?? ""));


        // 4️⃣ Flatten form so text becomes non-editable
        form.flatten();

        // 5️⃣ Embed trauma diagram from ReactSketchCanvas
        const savedImage = data.secondaryAssessment?.traumaImageString;

        if (savedImage && savedImage.includes("base64,")) {
            try {
                const base64 = savedImage.split(",")[1];
                const imageBytes = Uint8Array.from(atob(base64), c => c.charCodeAt(0));
                const pngImage = await pdfDoc.embedPng(imageBytes);
                
                const { height: pageHeight } = page.getSize();

                page.drawImage(pngImage, {
                    x: 122,
                    y: pageHeight - 670, 
                    width: 146, 
                    height: 126,
                });
            } catch (error) {
                console.error("Failed to embed saved trauma image:", error);
            }
        }

        // 6️⃣ Return PDF bytes
        return await pdfDoc.save();
    }

    const handleGeneratePDF = async (): Promise<void> => {
        try {
            // setLoading(true);
            const pdfBytes = await generatePCRPDF(newPCRRecord);

            const blob = new Blob([new Uint8Array(pdfBytes)], { type: "application/pdf" });
            const url = URL.createObjectURL(blob);
            window.open(url, "_blank");
        } catch (error) {
            console.error(error);
            alert("Failed to generate PCR PDF");
        } finally {
            // setLoading(false);
        }
    };

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
                <Button variant="outline" size={"lg"} onClick={handleGeneratePDF}><Printer />Print as PDF</Button>
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
            </Tabs>
        </motion.div>
    )    
}