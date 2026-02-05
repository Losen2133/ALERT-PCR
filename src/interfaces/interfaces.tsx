export interface PatientDemographics {
  lastName?: string;
  firstName?: string;
  mi?: string;
  age?: number;
  sex?: 'Male' | 'Female';
}

export interface Case {
  caseNumber?: string;
  date?: Date | undefined;
  dispatchTime?: string;
  priority?: 'Low' | 'High';
}

export interface GCS {
  eyeOpening?: number;
  verbal?: number;
  motor?: number;
}

export interface BP {
  systolic?: number;
  diastolic?: number;
}

export interface Vitals {
  time?: string;
  temp?: number;
  BP?: BP;
  RR?: number;
  Pulse?: number;
  SpO2?: number;
  RBS?: number;
  GCS?: GCS;
  RTS?: number;
}

export interface Assessment {
  chiefComplaints?: string;
  immobilizationRequired?: boolean;
  levelOfConciousness?: string;
  airway?: string;
  natureOfIllness?: string;
  breathing?: string;
  mechanismOfInjury?: string;
  circulation?: string;
  providerImpressions?: string;
  management?: Management[];
}

export interface Management {
  time?: string;
  care?: string;
}

export interface History {
  symptoms?: string;
  allergies?: string;
  medication?: string;
  pastMedical?: string;
  lastIntake?: string;
  eventsPrior?: string;
}

export interface Team {
  teamLeader?: string;
  crew?: string;
  ambulance?: string;
}

export interface Endorsement {
  receivingFacility?: string;
  receivingPersonnel?: string;
}

export interface TeamOps {
  teamInfo?: Team;
  endorsementInfo?: Endorsement;
  timeDepart?: string;
  timeArrived?: string;
  timeReceived?: string;
}

export interface SecondaryAssessment {
  traumaDiagram?: CanvasPath[];
  traumaImageString?: string;
  opqrst?: {
    onset?: string;
    provocation?: string;
    quality?: string;
    radiation?: string;
    severity?: number;
    timing?: string;
  };
  apgar?: {
    appearance?: number;
    pain?: number;
    grimace?: number;
    activity?: number;
    respiration?: number;
  }
}

export interface PCRRecord {
  caseDetails?: Case;
  patientDemographics?: PatientDemographics;
  patientAssessment?: Assessment;
  patientVitals?: Vitals[];
  patientHistory?: History;
  caseTeamOpsInfo?: TeamOps;
  secondaryAssessment?: SecondaryAssessment
  waivers?: Waivers
}

export interface Waivers {
  informedConsent?: {
    patientName?: string;
    patientSign?: CanvasPath[];
    patientSignImage?: string;
    date1?: Date | undefined;
    time1?: string;
    guardianName?: string;
    guardianSign?: CanvasPath[];
    guardianSignImage?: string;
    date2?: Date | undefined;
    time2?: string;
  };
  refusalOfTreatment?: {
    contactNo?: string;
    patientName?: string;
    patientSign?: CanvasPath[];
    patientSignImage?: string;
    witnessName?: string;
    witnessSign?: CanvasPath[];
    witnessSignImage?: string;
  }
  refusalForAdmission?: {
    medicalFacility?: string;
    reasonForRefusal?: string;
    physicianName?: string;
    physicianSign?: CanvasPath[];
    physicianSignImage?: string;
    witnessName?: string;
    witnessSign?: CanvasPath[];
    witnessSignImage?: string;
    date1?: Date | undefined;
    date2?: Date | undefined;
  }
}

export interface CanvasPath {
  points: number[];
  stroke: string;
  strokeWidth: number;
}
