import { create } from 'zustand';

export interface PatientProfile {
    patientId: string;
    diseaseStage: 'CKD_STAGE_4' | 'CKD_STAGE_5' | 'HT' | 'GENERAL';
    targetDailyEnergyKcal: number;
    targetSodiumMg: number;
    targetPotassiumMg: number;
    targetPhosphorusMg: number;
}

export interface ConsumedNutrients {
    totalSodiumMg: number;
    totalPotassiumMg: number;
    totalPhosphorusMg: number;
    totalCholesterolMg: number;
    totalSfaGram: number;
}

interface NutritionStore {
    patientProfile: PatientProfile;
    consumedToday: ConsumedNutrients;
    updateConsumed: (nutrients: Partial<ConsumedNutrients>) => void;
}

export const useNutritionStore = create<NutritionStore>((set) => ({
    patientProfile: {
        patientId: 'HN-994821',
        diseaseStage: 'CKD_STAGE_4',
        targetDailyEnergyKcal: 1800,
        targetSodiumMg: 2000,
        targetPotassiumMg: 1500,
        targetPhosphorusMg: 800,
    },
    consumedToday: {
        totalSodiumMg: 1650,
        totalPotassiumMg: 1200,
        totalPhosphorusMg: 750,
        totalCholesterolMg: 180,
        totalSfaGram: 10,
    },
    updateConsumed: (nutrients) =>
        set((state) => ({
            consumedToday: { ...state.consumedToday, ...nutrients },
        })),
}));