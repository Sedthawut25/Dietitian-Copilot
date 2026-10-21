// src/store/usePatientStore.ts
import { create } from 'zustand';
import { createMealApi, createPatientApi, deleteMealApi, deletePatientApi, getPatientsApi, updatePatientApi } from '../services/api';

export interface MealItem {
    id: string;
    name: string;
    calories: number;
    protein: number;
    sodium: number;
    imageUrl?: string;
}

export interface Patient {
    id: string;
    hn: string;
    name: string;
    gender: 'male' | 'female';
    age: number;
    weightKg?: number;
    heightCm?: number;
    ward: string;
    bed: string;
    diseases: string[]; // เช่น ['CKD Stage 4', 'ความดันโลหิตสูง']
    medicationAlert?: string; // เช่น 'ทานยา Warfarin: ผักใบเขียว'
    targetQuota: {
        calories: number;
        protein: number;
        sodium: number;
    };
    meals: {
        breakfast: MealItem[];
        lunch: MealItem[];
        dinner: MealItem[];
        snack: MealItem[];
    };
}

interface PatientStoreState {
    patients: Patient[];
    selectedPatientId: string | null;
    isLoadingPatients: boolean;
    patientLoadError: string | null;
    setSelectedPatient: (id: string) => void;
    addPatient: (patient: Patient) => void;
    updatePatient: (id: string, updates: Partial<Patient>) => void;
    deletePatient: (id: string) => void;
    addFoodToMeal: (patientId: string, mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack', item: MealItem) => void;
    removeFoodFromMeal: (patientId: string, mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack', itemId: string) => void;
    loadPatients: () => Promise<void>;
}

const toDiseaseStage = (diseases: string[]) => {
    const value = diseases.join(' ').toUpperCase();
    if (value.includes('CKD STAGE_5') || value.includes('CKD_5')) return 'CKD_STAGE_5';
    if (value.includes('CKD')) return 'CKD_STAGE_4';
    if (value.includes('DM') || value.includes('เบาหวาน')) return 'DM';
    if (value.includes('DLP') || value.includes('ไขมัน')) return 'DYSLIPIDEMIA';
    if (value.includes('HT') || value.includes('ความดัน')) return 'HT';
    return 'GENERAL';
};

const toPatientPayload = (patient: Patient) => ({
    hn: patient.hn,
    name: patient.name,
    gender: patient.gender,
    age: patient.age,
    weightKg: patient.weightKg,
    heightCm: patient.heightCm,
    ward: patient.ward,
    bed: patient.bed,
    diseases: patient.diseases,
    medicationAlert: patient.medicationAlert,
    diseaseStage: toDiseaseStage(patient.diseases),
    targetDailyEnergyKcal: patient.targetQuota.calories,
    targetProteinGram: patient.targetQuota.protein,
    targetSodiumMg: patient.targetQuota.sodium,
    targetPotassiumMg: 1500,
    targetPhosphorusMg: 800,
});

const fromApiPatient = (patient: any): Patient => {
    const meals = patient.mealPlans?.[0]?.meals || [];
    return {
        id: patient.id,
        hn: patient.hn,
        name: patient.name,
        gender: patient.gender === 'male' ? 'male' : 'female',
        age: patient.age || 0,
        weightKg: patient.weightKg || undefined,
        heightCm: patient.heightCm || undefined,
        ward: patient.ward || '',
        bed: patient.bed || '',
        diseases: Array.isArray(patient.diseases) ? patient.diseases : [patient.diseaseStage],
        medicationAlert: patient.medicationAlert || undefined,
        targetQuota: {
            calories: patient.targetDailyEnergyKcal || 1800,
            protein: patient.targetProteinGram || 45,
            sodium: patient.targetSodiumMg || 2000,
        },
        meals: {
            breakfast: meals.filter((meal: any) => meal.mealType === 'BREAKFAST').map(fromApiMeal),
            lunch: meals.filter((meal: any) => meal.mealType === 'LUNCH').map(fromApiMeal),
            dinner: meals.filter((meal: any) => meal.mealType === 'DINNER').map(fromApiMeal),
            snack: meals.filter((meal: any) => meal.mealType === 'SNACK').map(fromApiMeal),
        },
    };
};

const fromApiMeal = (meal: any): MealItem => ({
    id: meal.id,
    name: meal.recipeName,
    calories: meal.calories || 0,
    protein: meal.proteinGram || 0,
    sodium: meal.sodiumMg || 0,
});

// ข้อมูลเริ่มต้นสำหรับทดสอบ (Mock Initial Patients)
const initialPatients: Patient[] = [
    {
        id: 'p1',
        hn: 'HN-000001',
        name: 'นางสมใจ ใจดี',
        gender: 'female',
        age: 68,
        ward: 'ตึกอายุรกรรม',
        bed: 'เตียง 12',
        diseases: ['CKD STAGE_4', 'ความดันโลหิตสูง'],
        medicationAlert: 'ทานยา Warfarin: ผักใบเขียว',
        targetQuota: { calories: 1800, protein: 45, sodium: 2000 },
        meals: {
            breakfast: [],
            lunch: [
                { id: 'm1', name: 'กะเพราไก่ไข่ดาว', calories: 520, protein: 28, sodium: 850 },
                { id: 'm2', name: 'ต้มจืดเต้าหู้หมูสับ', calories: 150, protein: 10, sodium: 300 }
            ],
            dinner: [],
            snack: []
        }
    },
    {
        id: 'p2',
        hn: 'HN-000002',
        name: 'นายสมศักดิ์ รักดี',
        gender: 'male',
        age: 55,
        ward: 'ตึกศัลยกรรม',
        bed: 'เตียง 05',
        diseases: ['DM Type 2', 'ไขมันในเลือดสูง'],
        medicationAlert: undefined,
        targetQuota: { calories: 2000, protein: 65, sodium: 1500 },
        meals: { breakfast: [], lunch: [], dinner: [], snack: [] }
    }
];

export const usePatientStore = create<PatientStoreState>((set) => ({
    patients: initialPatients,
    selectedPatientId: 'p1', // Default เลือกเคสแรก
    isLoadingPatients: false,
    patientLoadError: null,
    setSelectedPatient: (id) => set({ selectedPatientId: id }),
    addPatient: (newPatient) => {
        set((state) => ({ patients: [newPatient, ...state.patients] }));
        void createPatientApi(toPatientPayload(newPatient)).then((saved) => {
            set((state) => ({ patients: state.patients.map((patient) => patient.id === newPatient.id ? fromApiPatient(saved) : patient) }));
        });
    },
    updatePatient: (id, updates) => {
        set((state) => ({ patients: state.patients.map((patient) => patient.id === id ? { ...patient, ...updates } : patient) }));
        const patient = usePatientStore.getState().patients.find((item) => item.id === id);
        if (patient) void updatePatientApi(id, toPatientPayload(patient));
    },
    deletePatient: (id) => {
        set((state) => {
            const patients = state.patients.filter((patient) => patient.id !== id);
            return {
                patients,
                selectedPatientId: state.selectedPatientId === id ? patients[0]?.id || null : state.selectedPatientId,
            };
        }),
        void deletePatientApi(id);
    },
    addFoodToMeal: (patientId, mealType, item) => {
        set((state) => ({
            patients: state.patients.map((p) => {
                if (p.id !== patientId) return p;
                return {
                    ...p,
                    meals: {
                        ...p.meals,
                        [mealType]: [...p.meals[mealType], item]
                    }
                };
            })
        }));
        void createMealApi(patientId, {
            mealType: mealType.toUpperCase(),
            recipeName: item.name,
            calories: item.calories,
            proteinGram: item.protein,
            sodiumMg: item.sodium,
        });
    },
    removeFoodFromMeal: (patientId, mealType, itemId) => {
        set((state) => ({
            patients: state.patients.map((patient) => {
                if (patient.id !== patientId) return patient;
                return {
                    ...patient,
                    meals: {
                        ...patient.meals,
                        [mealType]: patient.meals[mealType].filter((item) => item.id !== itemId),
                    },
                };
            }),
        }));
        void deleteMealApi(itemId);
    },
    loadPatients: async () => {
        set({ isLoadingPatients: true, patientLoadError: null });
        try {
            const savedPatients = await getPatientsApi();
            const mappedPatients: Patient[] = savedPatients.map(fromApiPatient);
            set((state) => ({
                patients: mappedPatients,
                selectedPatientId: mappedPatients.some((patient) => patient.id === state.selectedPatientId)
                    ? state.selectedPatientId
                    : mappedPatients[0]?.id || null,
                isLoadingPatients: false,
                patientLoadError: null,
            }));
        } catch (error) {
            console.warn('Patient database unavailable.', error);
            set({
                isLoadingPatients: false,
                patientLoadError: 'ไม่สามารถโหลดข้อมูลผู้ป่วยจากฐานข้อมูลได้',
            });
        }
    },
}));