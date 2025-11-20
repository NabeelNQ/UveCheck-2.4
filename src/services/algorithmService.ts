
import { Algorithm, AlgorithmKey, FormData, CalculationResult } from '../types';
import { parseDate, yearsDaysDiff } from './dateService';

// Helper for UK guideline to calculate years as a float
const calculateYears = (date: Date): number => {
    const today = new Date();
    const diffTime = today.getTime() - date.getTime();
    const diffDays = diffTime / (1000 * 60 * 60 * 24);
    return diffDays / 365.25;
};


const algorithms: Record<AlgorithmKey, Algorithm> = {
    uk: {
        name: 'United Kingdom Guidelines',
        questions: ['dateOfBirth', 'dateOfDiagnosis', 'subDiagnosis', 'anaPositive'],
        subDiagnosisOptions: [
            'Persistent Oligoarthritis', 'Extended Oligoarthritis', 'Psoriatic Arthritis', 
            'Enthesitis-related Arthritis', 'RF Negative Polyarthritis', 'Systemic Onset Arthritis', 
            'RF Positive Polyarthritis'
        ],
        calculate: (data: FormData): CalculationResult => {
            const dob = parseDate(data.dateOfBirth);
            const dod = parseDate(data.dateOfDiagnosis);
            if (!dob || !dod) return { riskLevel: 'Error', recommendation: 'Invalid date format', followup: '', justification: '' };

            const timeu = calculateYears(dod);
            const ageAtOnset = (dod.getTime() - dob.getTime()) / (1000 * 60 * 60 * 24 * 365.25);

            let risk_level = "No Risk";
            let followup = "None";
            let recommendation = "None";
            let justification = "None";

            const group1 = ['Persistent Oligoarthritis', 'Extended Oligoarthritis', 'Psoriatic Arthritis', 'Enthesitis-related Arthritis'].includes(data.subDiagnosis);
            const group2 = data.subDiagnosis === 'RF Negative Polyarthritis';
            const group3 = ['Systemic Onset Arthritis', 'RF Positive Polyarthritis'].includes(data.subDiagnosis);
            
            // Very Low Risk override conditions
            if ( (group1 && ( (ageAtOnset < 3 && timeu > 8) || (ageAtOnset >= 3 && ageAtOnset < 5 && timeu > 6) || (ageAtOnset >= 5 && ageAtOnset < 9 && timeu > 3) || (ageAtOnset >= 9 && timeu > 1) )) ||
                 (group2 && data.anaPositive && ( (ageAtOnset < 6 && timeu > 5) || (ageAtOnset >= 6 && ageAtOnset <= 9 && timeu > 2) || (ageAtOnset > 9 && timeu > 1) )) ||
                 (group2 && !data.anaPositive && ( (ageAtOnset < 7 && timeu > 5) || (ageAtOnset >= 7 && timeu > 1) )) ||
                 (group3 && ( (ageAtOnset < 7 && timeu > 5) || (ageAtOnset >= 7 && timeu > 1) ))
            ) {
                 return { riskLevel: "Very Low Risk", recommendation: "No screening required", followup: "None", justification: "Very low risk due to long time since diagnosis." };
            }

            if (group1) {
                risk_level = "High Risk";
                recommendation = "Every 3 - 4 Months";
                if (ageAtOnset < 3) {
                    followup = "Follow up continues for 8 years";
                    justification = "High risk due to onset age <3 years.";
                } else if (ageAtOnset >= 3 && ageAtOnset < 5) {
                    followup = "Follow up continues for 6 years";
                    justification = "High risk due to onset age between 3 and 4 years.";
                } else if (ageAtOnset >= 5 && ageAtOnset < 9) {
                    followup = "Follow up continues for 3 years";
                    justification = "High risk due to onset age between 5 and 8 years.";
                } else if (ageAtOnset >= 9 && ageAtOnset < 12) {
                    followup = "Follow up continues for 1 year";
                    justification = "High risk due to onset age between 9 and 11 years.";
                }
            } else if (group2) {
                risk_level = "High Risk";
                recommendation = "Every 3 - 4 Months";
                if (data.anaPositive) {
                    if (ageAtOnset < 6) {
                        followup = "Follow up continues for 5 years";
                        justification = "High risk due to onset age <6 years with positive ANA.";
                    } else if (ageAtOnset >= 6 && ageAtOnset <= 9) {
                        followup = "Follow up continues for 2 years";
                        justification = "High risk due to onset age between 6 and 9 years with positive ANA.";
                    } else if (ageAtOnset > 9) {
                        followup = "Follow up continues for 1 year";
                        justification = "High risk due to onset age >9 with positive ANA.";
                    }
                } else { // ANA negative
                    if (ageAtOnset < 7) {
                        followup = "Follow up continues for 5 years";
                        justification = "High risk due to early onset age with negative ANA.";
                    } else if (ageAtOnset >= 7) {
                        followup = "Follow up continues for 1 year";
                        justification = "High risk due to onset age at or after 7 years with negative ANA.";
                    }
                }
            } else if (group3) {
                if (ageAtOnset < 7) {
                    risk_level = "High Risk";
                    recommendation = "Every 3 - 4 Months";
                    followup = "Follow up continues for 5 years";
                    justification = "High risk due to onset age <7 years.";
                } else if (ageAtOnset >= 7 && ageAtOnset <= 16) {
                    risk_level = "High Risk";
                    recommendation = "Every 3 - 4 Months";
                    followup = "Follow up continues for 1 year";
                    justification = "High risk due to onset age between 7 and 16 years.";
                }
            }

            // Special recommendation prefix
            if (recommendation !== "Screen at Diagnosis" && recommendation !== "No screening required" && recommendation !== "None") {
                recommendation = `Screen for every 2 months, for the first 6 months. Then screen ${recommendation}`;
            }

            return { riskLevel: risk_level, recommendation, followup, justification };
        }
    },
    nordic: {
        name: 'Nordic Guidelines',
        maxAge: 16,
        questions: ['dateOfBirth', 'dateOfDiagnosis', 'subDiagnosis', 'anaPositive', 'onMethotrexate', 'biologicalTreatment'],
        subDiagnosisOptions: [
            'Oligoarthritis', 'RF Negative Polyarthritis', 'Psoriatic Arthritis', 
            'RF Positive Arthritis', 'Enthesitis related Arthritis', 'Systemic Onset Arthritis', 
            'Undifferentiated Arthritis'
        ],
        biologicalTreatmentOptions: ['Adalimumab', 'Certolizumab', 'Golimumab', 'Infliximab', 'Etanercept', 'None / Other'],
        calculate: (data: FormData): CalculationResult => {
            const dob = parseDate(data.dateOfBirth);
            const dod = parseDate(data.dateOfDiagnosis);
            if (!dob || !dod) return { riskLevel: 'Error', recommendation: 'Invalid date format', followup: '', justification: '' };
            
            const today = new Date();
            const currentAge = yearsDaysDiff(dob, today);
            const timeSinceDiagnosis = yearsDaysDiff(dod, today);
            const ageAtOnset = yearsDaysDiff(dob, dod);

            let risk_level = "No Risk";
            let followup = "None";
            let recommendation = "None";
            let justification = "Standard risk calculation applied.";

            const subdGroup1 = ['Oligoarthritis', 'RF Negative Polyarthritis', 'Psoriatic Arthritis', 'Undifferentiated Arthritis'].includes(data.subDiagnosis);
            const subdGroup2 = data.subDiagnosis === 'Enthesitis related Arthritis';
            const subdGroup3 = ['RF Positive Arthritis', 'Systemic Onset Arthritis'].includes(data.subDiagnosis);

            const onset_leq_6 = ageAtOnset.years < 6 || (ageAtOnset.years === 6 && ageAtOnset.days === 0);
            const timeu_leq_4 = timeSinceDiagnosis.years < 4 || (timeSinceDiagnosis.years === 4 && timeSinceDiagnosis.days === 0);
            const timeu_gt_4 = timeSinceDiagnosis.years > 4 || (timeSinceDiagnosis.years === 4 && timeSinceDiagnosis.days > 0);
            const timeu_gt_7 = timeSinceDiagnosis.years > 7 || (timeSinceDiagnosis.years === 7 && timeSinceDiagnosis.days > 0);
            const timeu_leq_2 = timeSinceDiagnosis.years < 2 || (timeSinceDiagnosis.years === 2 && timeSinceDiagnosis.days === 0);
            const timeu_gt_2 = timeSinceDiagnosis.years > 2 || (timeSinceDiagnosis.years === 2 && timeSinceDiagnosis.days > 0);
            const timeu_gt_0 = timeSinceDiagnosis.years > 0 || (timeSinceDiagnosis.years === 0 && timeSinceDiagnosis.days > 0);

            if (currentAge.years > 16 || (currentAge.years === 16 && currentAge.days > 0)) {
                return { riskLevel: 'Very Low Risk', recommendation: 'No screening required', followup: 'None', justification: 'Screening guidelines apply only until 16 years of age.' };
            }

            if (subdGroup1) {
                if (onset_leq_6) {
                    if (data.anaPositive && !data.onMethotrexate && timeu_leq_4) {
                        recommendation = "Every 3 Months"; risk_level = "High Risk"; justification = "High risk due to ANA+ without methotrexate, age at onset ≤ 6 years, time since diagnosis 0–4 years.";
                    } else if (data.anaPositive && data.onMethotrexate && timeu_leq_4) {
                        recommendation = "Every 6 Months"; risk_level = "Medium Risk"; justification = "Medium risk due to ANA+ with methotrexate, age at onset ≤ 6 years, time since diagnosis 0–4 years.";
                    } else if (data.anaPositive && !data.onMethotrexate && timeu_gt_4 && !timeu_gt_7) {
                        recommendation = "Every 6 Months"; risk_level = "Medium Risk"; justification = "Medium risk due to ANA+ without methotrexate, age at onset ≤ 6 years, time since diagnosis 4–7 years.";
                    } else if (data.anaPositive && data.onMethotrexate && timeu_gt_4) {
                        recommendation = "Every 12 Months"; risk_level = "Low Risk"; justification = "Low risk due to ANA+ with methotrexate, age at onset ≤ 6 years, time since diagnosis >4 years.";
                    } else if (data.anaPositive && !data.onMethotrexate && timeu_gt_7) {
                        recommendation = "Every 12 Months"; risk_level = "Low Risk"; justification = "Low risk due to ANA+ without methotrexate, age at onset ≤ 6 years, time since diagnosis >7 years.";
                    } else if (!data.anaPositive && !data.onMethotrexate && timeu_leq_4) {
                        recommendation = "Every 6 Months"; risk_level = "Medium Risk"; justification = "Medium risk due to ANA- without methotrexate, age at onset ≤ 6 years, time since diagnosis 0–4 years.";
                    } else if (!data.anaPositive && !data.onMethotrexate && timeu_gt_4) {
                        recommendation = "Every 12 Months"; risk_level = "Low Risk"; justification = "Low risk due to ANA- without methotrexate, age at onset ≤ 6 years, time since diagnosis > 4 years.";
                    } else if (!data.anaPositive && data.onMethotrexate && timeu_gt_0) {
                        recommendation = "Every 12 Months"; risk_level = "Low Risk"; justification = "Low risk due to ANA- with methotrexate, age at onset ≤ 6 years";
                    }
                    followup = "Follow-up continues until 16 Years of age";
                } else { // onset > 6
                    if (data.anaPositive && !data.onMethotrexate && timeu_leq_2) {
                        recommendation = "Every 6 Months"; risk_level = "Medium Risk"; justification = "Medium risk due to ANA+ without methotrexate, age at onset > 6 years, time since diagnosis ≤ 2 years.";
                    } else if (data.anaPositive && !data.onMethotrexate && timeu_gt_2) {
                        recommendation = "Every 12 Months"; risk_level = "Low Risk"; justification = "Low risk due to ANA+ without methotrexate, onset > 6 years, time since diagnosis > 2 years.";
                    } else if (data.anaPositive && data.onMethotrexate && timeu_gt_0) {
                        recommendation = "Every 12 Months"; risk_level = "Low Risk"; justification = "Low risk due to ANA+ with methotrexate, onset > 6 years.";
                    } else if (!data.anaPositive) {
                        recommendation = "Every 12 Months"; risk_level = "Low Risk"; justification = "Low risk due to ANA- regardless of methotrexate, onset > 6 years.";
                    }
                    followup = "Follow-up for 2 - 4 years, max 16 years of age";
                }
            } else if (subdGroup2) {
                if (onset_leq_6) {
                    recommendation = "Every 12 Months"; risk_level = "Low Risk"; followup = "Follow-up for 4 - 7 years, max 16 years of age"; justification = "Low risk: Enthesitis related arthritis with onset ≤ 6 years.";
                } else {
                    recommendation = "Every 12 Months"; risk_level = "Low Risk"; followup = "Follow-up for 2 - 4 years, max 16 years of age"; justification = "Low risk: Enthesitis related arthritis with onset > 6 years.";
                }
            } else if (subdGroup3) {
                recommendation = "Screen at Diagnosis"; risk_level = "Very Low Risk"; followup = "No Follow up required"; justification = "Very low risk: RF positive or systemic onset arthritis.";
            }

            if (data.biologicalTreatment && !['None / Other', 'Etanercept'].includes(data.biologicalTreatment)) {
                if (risk_level === "High Risk") {
                    risk_level = "Medium Risk"; recommendation = "Every 6 Months"; justification = "Risk downgraded due to biological treatment.";
                } else if (risk_level === "Medium Risk") {
                    risk_level = "Low Risk"; recommendation = "Every 12 Months"; justification = "Risk downgraded due to biological treatment.";
                }
            }

            return { riskLevel: risk_level, recommendation, followup, justification };
        }
    },
    us_pakistan: {
        name: 'US and Pakistan Guidelines',
        questions: ['dateOfBirth', 'dateOfDiagnosis', 'subDiagnosis', 'anaPositive'],
        subDiagnosisOptions: [
            'Extended Oligoarthritis', 'Persistent Oligoarthritis', 'RF Negative Polyarthritis', 
            'Psoriatic Arthritis', 'RF Positive Arthritis', 'Enthesitis related Arthritis', 
            'Systemic onset Arthritis', 'Undifferentiated Arthritis'
        ],
        calculate: (data: FormData): CalculationResult => {
             const dob = parseDate(data.dateOfBirth);
            const dod = parseDate(data.dateOfDiagnosis);
            if (!dob || !dod) return { riskLevel: 'Error', recommendation: 'Invalid date format', followup: '', justification: '' };

            const today = new Date();
            const timeSinceDiagnosis = yearsDaysDiff(dod, today);
            const ageAtOnset = yearsDaysDiff(dob, dod);

            let risk_level = "No Risk";
            let recommendation = "No screening required";
            let justification = "Standard risk calculation applied.";

            const subdGroup1 = ['Extended Oligoarthritis', 'Persistent Oligoarthritis', 'RF Negative Polyarthritis', 'Psoriatic Arthritis', 'Undifferentiated Arthritis'].includes(data.subDiagnosis);
            const subdGroup2 = ['Enthesitis related Arthritis', 'RF Positive Arthritis', 'Systemic onset Arthritis'].includes(data.subDiagnosis);

            const onset_lt_7 = ageAtOnset.years < 7;
            const timeu_leq_4 = timeSinceDiagnosis.years < 4 || (timeSinceDiagnosis.years === 4 && timeSinceDiagnosis.days === 0);
            const timeu_gt_4 = timeSinceDiagnosis.years > 4 || (timeSinceDiagnosis.years === 4 && timeSinceDiagnosis.days > 0);
            const timeu_lt_7 = timeSinceDiagnosis.years < 7 || (timeSinceDiagnosis.years === 7 && timeSinceDiagnosis.days === 0);
            const timeu_gt_7 = timeSinceDiagnosis.years > 7 || (timeSinceDiagnosis.years === 7 && timeSinceDiagnosis.days > 0);

            if (subdGroup1) {
                if (onset_lt_7) {
                    if (data.anaPositive && timeu_leq_4) {
                        recommendation = "Every 3 Months"; risk_level = "High Risk"; justification = "High risk due to positive ANA, age at onset < 7, time since diagnosis ≤ 4 years.";
                    } else if (data.anaPositive && timeu_gt_4 && timeu_lt_7) {
                        recommendation = "Every 6 Months"; risk_level = "Medium Risk"; justification = "Medium risk due to positive ANA, age at onset < 7, time since diagnosis between 4 and 7 years.";
                    } else if (data.anaPositive && timeu_gt_7) {
                        recommendation = "Every 12 Months"; risk_level = "Low Risk"; justification = "Low risk due to positive ANA, age at onset < 7, time since diagnosis > 7 years.";
                    } else if (!data.anaPositive && timeu_leq_4) {
                        recommendation = "Every 6 Months"; risk_level = "Medium Risk"; justification = "Medium risk due to negative ANA, age at onset < 7, time since diagnosis ≤ 4 years.";
                    } else if (!data.anaPositive && timeu_gt_4) {
                        recommendation = "Every 12 Months"; risk_level = "Low Risk"; justification = "Low risk due to negative ANA, age at onset < 7, time since diagnosis > 4 years.";
                    }
                } else { // onset >= 7
                    if (data.anaPositive && timeu_leq_4) {
                        recommendation = "Every 6 Months"; risk_level = "Medium Risk"; justification = "Medium risk due to positive ANA, age at onset ≥ 7, time since diagnosis ≤ 4 years.";
                    } else if (data.anaPositive && timeu_gt_4) {
                        recommendation = "Every 12 Months"; risk_level = "Low Risk"; justification = "Low risk due to positive ANA, age at onset ≥ 7, time since diagnosis > 4 years.";
                    } else {
                        recommendation = "Every 12 Months"; risk_level = "Low Risk"; justification = "Low risk due to negative ANA and age at onset > 7.";
                    }
                }
            } else if (subdGroup2) {
                recommendation = "Every 12 Months"; risk_level = "Low Risk"; justification = `Low risk due to diagnosis of ${data.subDiagnosis}.`;
            }

            return { riskLevel: risk_level, recommendation, followup: "Follow-up continues into adulthood", justification };
        }
    },
    germany: {
        name: 'German Guidelines',
        questions: ['dateOfBirth', 'dateOfDiagnosis', 'subDiagnosis', 'anaPositive'],
        subDiagnosisOptions: [
            'Persistent Oligoarthritis', 'Extended Oligoarthritis', 'RF Negative Polyarthritis', 
            'Psoriatic Arthritis', 'RF Positive Arthritis', 'Enthesitis related Arthritis', 
            'Systemic onset Arthritis', 'Undifferentiated Arthritis'
        ],
        calculate: (data: FormData): CalculationResult => {
            const dob = parseDate(data.dateOfBirth);
            const dod = parseDate(data.dateOfDiagnosis);
            if (!dob || !dod) return { riskLevel: 'Error', recommendation: 'Invalid date format', followup: '', justification: '' };

            const today = new Date();
            const timeSinceDiagnosis = yearsDaysDiff(dod, today);
            const ageAtOnset = yearsDaysDiff(dob, dod);

            let risk_level = "No Risk";
            let followup = "No screening required";
            let recommendation = "None";
            let justification = "Standard risk calculation applied.";

            const timeu_gt_7 = timeSinceDiagnosis.years > 7 || (timeSinceDiagnosis.years === 7 && timeSinceDiagnosis.days > 0);
            if (timeu_gt_7) {
                return { riskLevel: "Very Low Risk", followup: "No screening required", recommendation: "None", justification: "Very low risk due to time since diagnosis > 7 years." };
            }

            const subdGroup1 = ['Persistent Oligoarthritis', 'Extended Oligoarthritis', 'RF Negative Polyarthritis', 'Psoriatic Arthritis', 'Undifferentiated Arthritis'].includes(data.subDiagnosis);
            const subdGroup2 = ['Enthesitis related Arthritis', 'RF Positive Arthritis', 'Systemic onset Arthritis'].includes(data.subDiagnosis);

            const onset_leq_6 = ageAtOnset.years < 6 || (ageAtOnset.years === 6 && ageAtOnset.days === 0);
            const timeu_leq_4 = timeSinceDiagnosis.years < 4 || (timeSinceDiagnosis.years === 4 && timeSinceDiagnosis.days === 0);
            const timeu_gt_4 = timeSinceDiagnosis.years > 4 || (timeSinceDiagnosis.years === 4 && timeSinceDiagnosis.days > 0);
            const timeu_leq_2 = timeSinceDiagnosis.years < 2 || (timeSinceDiagnosis.years === 2 && timeSinceDiagnosis.days === 0);
            const timeu_gt_2 = timeSinceDiagnosis.years > 2 || (timeSinceDiagnosis.years === 2 && timeSinceDiagnosis.days > 0);

            if (subdGroup1) {
                if (onset_leq_6) {
                    if (data.anaPositive && timeu_leq_4) {
                        recommendation = "Every 3 Months"; risk_level = "High Risk"; justification = "High risk due to positive ANA, onset age ≤ 6, and time since diagnosis ≤ 4 years.";
                    } else if (data.anaPositive && timeu_gt_4) {
                        recommendation = "Every 6 Months"; risk_level = "Medium Risk"; justification = "Medium risk due to positive ANA, onset age ≤ 6, and time since diagnosis > 4 years.";
                    } else if (!data.anaPositive && timeu_leq_4) {
                        recommendation = "Every 6 Months"; risk_level = "Medium Risk"; justification = "Medium risk due to negative ANA, onset age ≤ 6, and time since diagnosis ≤ 4 years.";
                    } else if (!data.anaPositive && timeu_gt_4) {
                        recommendation = "Every 12 Months"; risk_level = "Low Risk"; justification = "Low risk due to negative ANA, onset age ≤ 6, and time since diagnosis > 4 years.";
                    }
                } else { // onset > 6
                    if (data.anaPositive && timeu_leq_2) {
                        recommendation = "Every 6 Months"; risk_level = "Medium Risk"; justification = "Medium risk due to positive ANA, onset age > 6, and time since diagnosis ≤ 2 years.";
                    } else if (data.anaPositive && timeu_gt_2) {
                        recommendation = "Every 12 Months"; risk_level = "Low Risk"; justification = "Low risk due to positive ANA, onset age > 6, and time since diagnosis > 2 years.";
                    } else {
                        recommendation = "Every 12 Months"; risk_level = "Low Risk"; justification = "Low risk due to negative ANA and onset age > 6.";
                    }
                }
                followup = "Follow-up continues for 7 years from diagnosis";
            } else if (subdGroup2) {
                recommendation = "Every 12 Months"; risk_level = "Low Risk"; followup = "Follow-up continues for 7 years from diagnosis"; justification = `Low risk due to diagnosis of ${data.subDiagnosis}.`;
            }

            return { riskLevel: risk_level, recommendation, followup, justification };
        }
    },
    spain_portugal: {
        name: 'Spain and Portugal Guidelines',
        maxAge: 16,
        questions: ['dateOfBirth', 'dateOfDiagnosis', 'subDiagnosis', 'anaPositive'],
        subDiagnosisOptions: [
            'Persistent Oligoarthritis', 'Extended Oligoarthritis', 'RF Negative Polyarthritis', 
            'Psoriatic Arthritis', 'RF Positive Arthritis', 'Enthesitis related Arthritis', 
            'Systemic onset Arthritis', 'Undifferentiated Arthritis'
        ],
        calculate: (data: FormData): CalculationResult => {
             const dob = parseDate(data.dateOfBirth);
            const dod = parseDate(data.dateOfDiagnosis);
            if (!dob || !dod) return { riskLevel: 'Error', recommendation: 'Invalid date format', followup: '', justification: '' };

            const today = new Date();
            const currentAge = yearsDaysDiff(dob, today);
            const timeSinceDiagnosis = yearsDaysDiff(dod, today);
            const ageAtOnset = yearsDaysDiff(dob, dod);

            if (currentAge.years > 16 || (currentAge.years === 16 && currentAge.days > 0)) {
                return { riskLevel: 'Very Low Risk', followup: 'No screening required', recommendation: 'None', justification: 'Very low risk due to current age > 16 years.' };
            }

            let risk_level = "No Risk";
            let recommendation = "";
            let followup = "";
            let justification = "";

            const subdGroup1 = ['Persistent Oligoarthritis', 'Extended Oligoarthritis', 'RF Negative Polyarthritis', 'Psoriatic Arthritis'].includes(data.subDiagnosis);
            const subdGroup2 = ['Enthesitis related Arthritis', 'RF Positive Arthritis', 'Systemic onset Arthritis'].includes(data.subDiagnosis);

            const onset_leq_6 = ageAtOnset.years < 6 || (ageAtOnset.years === 6 && ageAtOnset.days === 0);
            const timeu_leq_4 = timeSinceDiagnosis.years < 4 || (timeSinceDiagnosis.years === 4 && timeSinceDiagnosis.days === 0);
            const timeu_gt_4 = timeSinceDiagnosis.years > 4 || (timeSinceDiagnosis.years === 4 && timeSinceDiagnosis.days > 0);
            const timeu_leq_7 = timeSinceDiagnosis.years < 7 || (timeSinceDiagnosis.years === 7 && timeSinceDiagnosis.days === 0);
            const timeu_gt_7 = timeSinceDiagnosis.years > 7 || (timeSinceDiagnosis.years === 7 && timeSinceDiagnosis.days > 0);
            const timeu_leq_2 = timeSinceDiagnosis.years < 2 || (timeSinceDiagnosis.years === 2 && timeSinceDiagnosis.days === 0);
            const timeu_gt_2 = timeSinceDiagnosis.years > 2 || (timeSinceDiagnosis.years === 2 && timeSinceDiagnosis.days > 0);

            if (subdGroup1) {
                if (onset_leq_6) {
                    if (data.anaPositive && timeu_leq_4) {
                        recommendation = "Every 3 Months"; risk_level = "High Risk"; justification = "High risk due to positive ANA, onset age ≤ 6, and time since diagnosis ≤ 4 years.";
                    } else if (data.anaPositive && timeu_gt_4 && timeu_leq_7) {
                        recommendation = "Every 6 Months"; risk_level = "Medium Risk"; justification = "Medium risk due to positive ANA, onset age ≤ 6, and time since diagnosis between 4 and 7 years.";
                    } else if (data.anaPositive && timeu_gt_7) {
                        recommendation = "Every 12 Months"; risk_level = "Low Risk"; justification = "Low risk due to positive ANA, onset age ≤ 6, and time since diagnosis > 7 years.";
                    } else if (!data.anaPositive && timeu_leq_4) {
                        recommendation = "Every 6 Months"; risk_level = "Medium Risk"; justification = "Medium risk due to negative ANA, onset age ≤ 6, and time since diagnosis ≤ 4 years.";
                    } else if (!data.anaPositive && timeu_gt_4) {
                        recommendation = "Every 12 Months"; risk_level = "Low Risk"; justification = "Low risk due to negative ANA, onset age ≤ 6, and time since diagnosis > 4 years.";
                    }
                } else { // Onset > 6
                    if (data.anaPositive && timeu_leq_2) {
                        recommendation = "Every 6 Months"; risk_level = "Medium Risk"; justification = "Medium risk due to positive ANA, onset age > 6, and time since diagnosis ≤ 2 years.";
                    } else if (data.anaPositive && timeu_gt_2) {
                        recommendation = "Every 12 Months"; risk_level = "Low Risk"; justification = "Low risk due to positive ANA, onset age > 6, and time since diagnosis > 2 years.";
                    } else {
                        recommendation = "Every 12 Months"; risk_level = "Low Risk"; justification = "Low risk due to negative ANA and onset age > 6.";
                    }
                }
                followup = "Follow-up continues until 16 years of age";
            } else if (subdGroup2) {
                recommendation = "Every 12 Months"; risk_level = "Low Risk"; followup = "Follow-up continues until 16 years of age"; justification = `Low risk due to diagnosis of ${data.subDiagnosis}.`;
            }

            return { riskLevel: risk_level, recommendation, followup, justification };
        }
    },
    czech_slovak: {
        name: 'Czech and Slovak Guidelines',
        maxAge: 18,
        questions: ['dateOfBirth', 'dateOfDiagnosis', 'subDiagnosis', 'anaPositive'],
        subDiagnosisOptions: [
            'Persistent Oligoarthritis', 'Extended Oligoarthritis', 'RF Negative Polyarthritis', 
            'Psoriatic Arthritis', 'RF Positive Polyarthritis', 'Systemic Onset Arthritis', 'HLAB27+ Arthritis'
        ],
        calculate: (data: FormData): CalculationResult => {
            const dob = parseDate(data.dateOfBirth);
            const dod = parseDate(data.dateOfDiagnosis);
            if (!dob || !dod) return { riskLevel: 'Error', recommendation: 'Invalid date format', followup: '', justification: '' };

            const today = new Date();
            const currentAge = yearsDaysDiff(dob, today);
            const timeSinceDiagnosis = yearsDaysDiff(dod, today);
            const ageAtOnset = yearsDaysDiff(dob, dod);

            const group1 = ['Persistent Oligoarthritis', 'Extended Oligoarthritis', 'Psoriatic Arthritis', 'RF Negative Polyarthritis'].includes(data.subDiagnosis);
            const group2 = data.subDiagnosis === 'HLAB27+ Arthritis';
            
            if (data.subDiagnosis === 'RF Positive Polyarthritis') {
                return { 
                    riskLevel: 'Medium Risk',
                    recommendation: 'Every 6 months',
                    followup: 'Until 18 years of age',
                    justification: 'Medium risk due to diagnosis of RF Positive Polyarthritis.' 
                };
            }
            if (data.subDiagnosis === 'Systemic Onset Arthritis') {
                 return { 
                    riskLevel: 'Medium Risk', 
                    recommendation: 'Screen at diagnosis, then every 6 months until 18 years of age', 
                    followup: '', 
                    justification: `Medium risk due to diagnosis of Systemic Onset Arthritis.` 
                };
            }

            if ((currentAge.years > 18 || (currentAge.years === 18 && currentAge.days > 0)) && !data.anaPositive) {
                return { riskLevel: 'Very Low Risk', recommendation: 'No screening required', followup: 'None', justification: 'Very low risk due to age > 18 years and negative ANA.' };
            }

            let risk_level = "No Risk";
            let recommendation = "";
            let followup = "";
            let justification = "";

            const onset_leq_6 = ageAtOnset.years < 6 || (ageAtOnset.years === 6 && ageAtOnset.days === 0);
            const timeu_leq_4 = timeSinceDiagnosis.years < 4 || (timeSinceDiagnosis.years === 4 && timeSinceDiagnosis.days === 0);
            const timeu_gt_4 = timeSinceDiagnosis.years > 4 || (timeSinceDiagnosis.years === 4 && timeSinceDiagnosis.days > 0);
            const inFirst6Months = timeSinceDiagnosis.years === 0 && timeSinceDiagnosis.days < 183;
            const isOver18 = currentAge.years > 18 || (currentAge.years === 18 && currentAge.days > 0);

            if (group1 || group2) {
                if (onset_leq_6 || data.anaPositive) {
                    if (inFirst6Months) {
                        risk_level = "High Risk"; recommendation = "Every 2 months"; followup = "Continue into adulthood"; justification = "High risk due to onset age < 6 or positive ANA, and time since diagnosis < 0.5 years.";
                    } else if (timeu_leq_4) {
                        risk_level = "High Risk"; recommendation = "Every 3 months"; followup = "Continue into adulthood"; justification = "High risk due to onset age < 6 or positive ANA, and time since diagnosis ≤ 4 years.";
                    } else if (timeu_gt_4) {
                        risk_level = "Medium Risk"; recommendation = "Every 6 months"; followup = "Continue into adulthood"; justification = "Medium risk due to onset age < 6 or positive ANA, time since diagnosis >4 years.";
                    }
                    if (isOver18 && data.anaPositive) {
                         risk_level = "Low to Medium Risk"; recommendation = "Every 6-12 months"; followup = "Continue into adulthood"; justification = "Low to medium risk due to age > 18 and positive ANA.";
                    }
                } else { // onset > 6 and ANA negative
                    if (timeu_leq_4) {
                        risk_level = "High Risk"; recommendation = "Every 3 months"; followup = "Until 18 years of age"; justification = "High risk due to negative ANA, onset age > 6, and time since diagnosis ≤ 4 years.";
                    } else {
                        risk_level = "Medium Risk"; recommendation = "Every 6 months"; followup = "Until 18 years of age"; justification = "Medium risk due to negative ANA, onset age > 6, and time since diagnosis > 4 years.";
                    }
                }
            }

            return { riskLevel: risk_level, recommendation, followup, justification };
        }
    },
    argentina: {
        name: 'Argentina Guidelines',
        maxAge: 21,
        questions: ['dateOfBirth', 'dateOfDiagnosis', 'subDiagnosis', 'anaPositive'],
        subDiagnosisOptions: [
            'Persistent Oligoarthritis', 'Extended Oligoarthritis', 'RF Negative Polyarthritis', 
            'Psoriatic Arthritis', 'RF Positive Arthritis', 'Enthesitis related Arthritis', 'Systemic onset Arthritis'
        ],
        calculate: (data: FormData): CalculationResult => {
            const dob = parseDate(data.dateOfBirth);
            const dod = parseDate(data.dateOfDiagnosis);
            if (!dob || !dod) return { riskLevel: 'Error', recommendation: 'Invalid date format', followup: '', justification: '' };

            const today = new Date();
            const currentAge = yearsDaysDiff(dob, today);
            const timeSinceDiagnosis = yearsDaysDiff(dod, today);
            const ageAtOnset = yearsDaysDiff(dob, dod);
            
            if ((currentAge.years > 21) || (currentAge.years === 21 && currentAge.days > 0)) {
                return { riskLevel: "Very Low Risk", recommendation: "No screening required", followup: "None", justification: "Very low risk due to age > 21 years." };
            }

            const isSystemic = data.subDiagnosis === 'Systemic onset Arthritis';
            if (isSystemic) {
                return { riskLevel: 'Low Risk', recommendation: 'Every 12 Months', followup: 'Until 21 years', justification: 'Low risk due to diagnosis of Systemic onset Arthritis.' };
            }
            
            let risk_level = "No Risk";
            let recommendation = "";
            let followup = "Until 21 years";
            let justification = "";

            const onset_leq_6 = ageAtOnset.years < 6 || (ageAtOnset.years === 6 && ageAtOnset.days === 0);
            const timeu_leq_4 = timeSinceDiagnosis.years < 4 || (timeSinceDiagnosis.years === 4 && timeSinceDiagnosis.days === 0);
            const timeu_gt_4 = timeSinceDiagnosis.years > 4 || (timeSinceDiagnosis.years === 4 && timeSinceDiagnosis.days > 0);
            const timeu_between_4_7 = timeu_gt_4 && (timeSinceDiagnosis.years < 7 || (timeSinceDiagnosis.years === 7 && timeSinceDiagnosis.days === 0));
            const timeu_gt_7 = timeSinceDiagnosis.years > 7 || (timeSinceDiagnosis.years === 7 && timeSinceDiagnosis.days > 0);

            if (onset_leq_6) {
                if (data.anaPositive && timeu_leq_4) {
                    risk_level = "High Risk"; recommendation = "Every 3 Months"; justification = "High risk due to positive ANA, onset age ≤ 6, and time since diagnosis ≤ 4 years.";
                } else if (data.anaPositive && timeu_between_4_7) {
                    risk_level = "Medium Risk"; recommendation = "Every 6 Months"; justification = "Medium risk due to positive ANA, onset age ≤ 6, and time since diagnosis between 4 and 7 years.";
                } else if (data.anaPositive && timeu_gt_7) {
                    risk_level = "Low Risk"; recommendation = "Every 12 Months"; justification = "Low risk due to positive ANA, onset age ≤ 6, and time since diagnosis > 7 years.";
                } else if (!data.anaPositive && timeu_leq_4) {
                    risk_level = "Medium Risk"; recommendation = "Every 6 Months"; justification = "Medium risk due to negative ANA, onset age ≤ 6, and time since diagnosis ≤ 4 years.";
                } else if (!data.anaPositive && timeu_gt_4) {
                    risk_level = "Low Risk"; recommendation = "Every 12 Months"; justification = "Low risk due to negative ANA, onset age ≤ 6, and time since diagnosis > 4 years.";
                }
            } else { // onset > 6
                if (data.anaPositive && timeu_leq_4) {
                    risk_level = "Medium Risk"; recommendation = "Every 6 Months"; justification = "Medium risk due to positive ANA, onset age > 6, and time since diagnosis ≤ 4 years.";
                } else if (data.anaPositive && timeu_gt_4) {
                    risk_level = "Low Risk"; recommendation = "Every 12 Months"; justification = "Low risk due to positive ANA, onset age > 6, and time since diagnosis > 4 years.";
                } else if (!data.anaPositive && timeu_gt_4) {
                    risk_level = "Low Risk"; recommendation = "Every 12 Months"; justification = "Low risk due to negative ANA, onset age > 6, and time since diagnosis > 4 years.";
                }
            }
             return { riskLevel: risk_level, recommendation, followup, justification };
        }
    },
    miwguc: {
        name: 'MIWGUC Guidelines',
        questions: ['dateOfBirth', 'dateOfDiagnosis', 'subDiagnosis'],
        subDiagnosisOptions: ['Juvenile Idiopathic Arthritis', 'Systemic-onset Arthritis'],
        calculate: (data: FormData): CalculationResult => {
            const dob = parseDate(data.dateOfBirth);
            const dod = parseDate(data.dateOfDiagnosis);
            if (!dob || !dod) return { riskLevel: 'Error', recommendation: 'Invalid date format', followup: '', justification: '' };

            const timeSinceDiagnosis = yearsDaysDiff(dod, new Date());
            const ageAtOnset = yearsDaysDiff(dob, dod);

            if (data.subDiagnosis === 'Systemic-onset Arthritis') {
                return { riskLevel: "Very Low Risk", recommendation: "No screening required", followup: "None", justification: "Very low risk due to diagnosis of Systemic-onset Arthritis." };
            }
            
            let risk_level = "No Risk";
            let recommendation = "No screening required";
            let followup = "None";
            let justification = "None";

            const onset_lt_7 = ageAtOnset.years < 7;
            const timeu_leq_1 = timeSinceDiagnosis.years < 1 || (timeSinceDiagnosis.years === 1 && timeSinceDiagnosis.days === 0);
            const timeu_leq_4 = timeSinceDiagnosis.years < 4 || (timeSinceDiagnosis.years === 4 && timeSinceDiagnosis.days === 0);
            const timeu_leq_7 = timeSinceDiagnosis.years < 7 || (timeSinceDiagnosis.years === 7 && timeSinceDiagnosis.days === 0);
            
            if (data.subDiagnosis === 'Juvenile Idiopathic Arthritis') {
                followup = "Follow-up continues into adulthood";
                if (onset_lt_7) {
                    if (timeu_leq_1) {
                        risk_level = "High Risk"; recommendation = "Every 2 Months"; justification = "High risk due to JIA diagnosed before 7 years of age and within the last year.";
                    } else if (timeu_leq_4) {
                        risk_level = "High Risk"; recommendation = "Every 3–4 Months"; justification = "High risk due to JIA diagnosed before 7 years of age and within 4 years.";
                    } else if (timeu_leq_7) {
                        risk_level = "Medium Risk"; recommendation = "Every 6 Months"; justification = "Medium risk due to JIA diagnosed before 7 years of age and within 7 years.";
                    } else {
                        risk_level = "Low Risk"; recommendation = "Every 12 Months"; justification = "Low risk due to JIA diagnosed before 7 years of age and over 7 years ago.";
                    }
                } else { // onset >= 7
                    if (timeu_leq_1) {
                        risk_level = "High Risk"; recommendation = "Every 3–4 Months"; justification = "High risk due to JIA diagnosed at or after 7 years of age and within the last year.";
                    } else if (timeu_leq_4) {
                        risk_level = "Medium Risk"; recommendation = "Every 6 Months"; justification = "Medium risk due to JIA diagnosed at or after 7 years of age and within 4 years.";
                    } else {
                        risk_level = "Low Risk"; recommendation = "Every 12 Months"; justification = "Low risk due to JIA diagnosed at or after 7 years of age and over 4 years ago";
                    }
                }
            }

            return { riskLevel: risk_level, recommendation, followup, justification };
        }
    }
};

export const getAlgorithm = (key: AlgorithmKey): Algorithm => algorithms[key];
