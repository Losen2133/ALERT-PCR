import type { PCRRecord } from "@/interfaces/interfaces";
import type { Dispatch, SetStateAction } from "react";
import {
    Card,
    CardHeader,
    CardTitle,
    CardContent
} from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input";
import { Ambulance, Clock } from "lucide-react";

interface TeamOpsCardProps {
  newPCRRecord: PCRRecord;
  setNewPCRRecord: Dispatch<SetStateAction<PCRRecord>>;
}

export function TeamOpsCard({
    newPCRRecord,
    setNewPCRRecord,
}: TeamOpsCardProps) {
    const update = (patch: Partial<PCRRecord>) => {
        setNewPCRRecord(prev => ({
            ...prev,
            ...patch,
        }));
    };

    return (
        <Card>
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
                <div className="inline-grid grid-cols-2 w-full gap-4">
                    {/* Left Column */}
                    <div className="inline-grid grid-rows-[auto_auto_auto] gap-4">
                    <div>
                        <Label className="text-[12px] font-bold text-gray-500 uppercase mb-1">Team Leader</Label>
                        <Input
                        type="text"
                        placeholder="..."
                        value={newPCRRecord.caseTeamOpsInfo?.teamInfo?.teamLeader}
                        onChange={(e) => 
                            update({
                                caseTeamOpsInfo: {
                                    ...newPCRRecord.caseTeamOpsInfo,
                                    teamInfo: {
                                        ...newPCRRecord.caseTeamOpsInfo?.teamInfo,
                                        teamLeader: e.target.value
                                    }
                                }
                            })
                        }
                        />

                        Field
                    </div>
                    <div>
                        <Label className="text-[12px] font-bold text-gray-500 uppercase mb-1">Crew</Label>
                        <Input
                        type="text"
                        placeholder="..."
                        value={newPCRRecord.caseTeamOpsInfo?.teamInfo?.crew}
                        onChange={(e) => 
                            update({
                                caseTeamOpsInfo: {
                                    ...newPCRRecord.caseTeamOpsInfo,
                                    teamInfo: {
                                        ...newPCRRecord.caseTeamOpsInfo?.teamInfo,
                                        crew: e.target.value
                                    }
                                }
                            })
                        }
                        />
                    </div>
                    <div>
                        <Label className="text-[12px] font-bold text-gray-500 uppercase mb-1">Vehicle / Ambulance</Label>
                        <Input
                        type="text"
                        placeholder="..."
                        value={newPCRRecord.caseTeamOpsInfo?.teamInfo?.ambulance}
                        onChange={(e) => 
                            update({
                                caseTeamOpsInfo: {
                                    ...newPCRRecord.caseTeamOpsInfo,
                                    teamInfo: {
                                        ...newPCRRecord.caseTeamOpsInfo?.teamInfo,
                                        ambulance: e.target.value
                                    }
                                }
                            })
                        }
                        />
                    </div>
                    </div>

                    {/* Right Column */}
                    <div className="inline-grid grid-rows-[auto_auto] gap-4">
                    <div>
                        <Label className="text-[12px] font-bold text-gray-500 uppercase mb-1">Receiving Facility</Label>
                        <Input
                        type="text"
                        placeholder="..."
                        value={newPCRRecord.caseTeamOpsInfo?.endorsementInfo?.receivingFacility}
                        onChange={(e) => 
                            update({
                                caseTeamOpsInfo: {
                                    ...newPCRRecord.caseTeamOpsInfo,
                                    endorsementInfo: {
                                        ...newPCRRecord.caseTeamOpsInfo?.endorsementInfo,
                                        receivingFacility: e.target.value
                                    }
                                }
                            })
                        }
                        />
                    </div>
                    <div>
                        <Label className="text-[12px] font-bold text-gray-500 uppercase mb-1">Receiving Personnel</Label>
                        <Input
                        type="text"
                        placeholder="..."
                        value={newPCRRecord.caseTeamOpsInfo?.endorsementInfo?.receivingPersonnel}
                        onChange={(e) => 
                            update({
                                caseTeamOpsInfo: {
                                    ...newPCRRecord.caseTeamOpsInfo,
                                    endorsementInfo: {
                                        ...newPCRRecord.caseTeamOpsInfo?.endorsementInfo,
                                        receivingPersonnel: e.target.value
                                    }
                                }
                            })
                        }
                        />
                    </div>
                    </div>

                    {/* Bottom Row: Times (span both columns) */}
                    <div className="inline-grid grid-cols-[auto_auto_auto] gap-4 col-span-2">
                    <div>
                        <Label className="text-[12px] font-bold text-gray-500 uppercase mb-1">Time Depart</Label>
                        <div className="relative">
                        <div className="text-muted-foreground pointer-events-none absolute inset-y-0 left-0 flex items-center justify-center pl-3">
                            <Clock className="size-4" />
                            <span className="sr-only">User</span>
                        </div>
                        <Input
                            type="time"
                            id="time-depart"
                            value={newPCRRecord.caseTeamOpsInfo?.timeDepart}
                            onChange={(e) =>
                                    update({
                                    caseTeamOpsInfo: {
                                        ...newPCRRecord.caseTeamOpsInfo,
                                        timeDepart: e.target.value,
                                    },
                                })
                            }
                            className="peer bg-background appearance-none pl-9 [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                        />
                        </div>
                    </div>

                    <div>
                        <Label className="text-[12px] font-bold text-gray-500 uppercase mb-1">Time Arrived</Label>
                        <div className="relative">
                        <div className="text-muted-foreground pointer-events-none absolute inset-y-0 left-0 flex items-center justify-center pl-3">
                            <Clock className="size-4" />
                            <span className="sr-only">User</span>
                        </div>
                        <Input
                            type="time"
                            id="time-arrived"
                            value={newPCRRecord.caseTeamOpsInfo?.timeArrived}
                            onChange={(e) =>
                                    update({
                                    caseTeamOpsInfo: {
                                        ...newPCRRecord.caseTeamOpsInfo,
                                        timeArrived: e.target.value,
                                    },
                                })
                            }
                            className="peer bg-background appearance-none pl-9 [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                        />
                        </div>
                    </div>

                    <div>
                        <Label className="text-[12px] font-bold text-gray-500 uppercase mb-1">Time Received</Label>
                        <div className="relative">
                        <div className="text-muted-foreground pointer-events-none absolute inset-y-0 left-0 flex items-center justify-center pl-3">
                            <Clock className="size-4" />
                            <span className="sr-only">User</span>
                        </div>
                        <Input
                            type="time"
                            id="time-received"
                            value={newPCRRecord.caseTeamOpsInfo?.timeReceived}
                            onChange={(e) =>
                                    update({
                                    caseTeamOpsInfo: {
                                        ...newPCRRecord.caseTeamOpsInfo,
                                        timeReceived: e.target.value,
                                    },
                                })
                            }
                            className="peer bg-background appearance-none pl-9 [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                        />
                        </div>
                    </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}