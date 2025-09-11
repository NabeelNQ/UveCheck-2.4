export type QuestionKey = 'dateOfBirth' | 'dateOfDiagnosis' | 'subDiagnosis' | 'anaPositive' | 'onMethotrexate' | 'biologicalTreatment';

export interface FormData {
  dateOfBirth: string;
  dateOfDiagnosis: string;
  subDiagnosis: string;
  anaPositive: boolean;
  onMethotrexate: boolean;
  biologicalTreatment: string;
}

export interface CalculationResult {
  riskLevel: string;
  recommendation: string;
  followup: string;
  justification: string;
}

export interface DateDifference {
  years: number;
  days: number;
}

export interface Algorithm {
  name: string;
  questions: QuestionKey[];
  subDiagnosisOptions: string[];
  biologicalTreatmentOptions?: string[];
  calculate: (data: FormData) => CalculationResult;
}

export type AlgorithmKey = 
  | 'argentina' 
  | 'czech_slovak' 
  | 'germany' 
  | 'miwguc' 
  | 'nordic' 
  | 'us_pakistan' 
  | 'spain_portugal'
  | 'uk';

export interface Country {
    value: string; // Unique value for the dropdown option
    label: string;
    algorithmKey: AlgorithmKey; // The algorithm this country maps to
}