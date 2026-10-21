import axios from 'axios';
import { Platform } from 'react-native';

// Override this for a physical device, e.g. EXPO_PUBLIC_API_URL=http://192.168.1.11:4000/api.
const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || (Platform.OS === 'ios'
    ? 'http://localhost:4000/api'
    : 'http://10.0.2.2:4000/api');

export const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 30000,
});

export const evaluateMealApi = async (payload: any) => {
    const response = await apiClient.post('/meals/evaluate', payload);
    return response.data;
};

export const suggestDietApi = async (payload: any) => {
    const response = await apiClient.post('/ai/suggest-diet', payload);
    return response.data;
};

export const generateSoapNoteApi = async (rawSpeechText: string) => {
    const response = await apiClient.post('/notes/soap', { rawSpeechText });
    return response.data;
};

export const getPatientsApi = async () => {
    const response = await apiClient.get('/patients');
    return response.data.data;
};

export const createPatientApi = async (patient: any) => {
    const response = await apiClient.post('/patients', patient);
    return response.data.data;
};

export const updatePatientApi = async (id: string, patient: any) => {
    const response = await apiClient.put(`/patients/${id}`, patient);
    return response.data.data;
};

export const deletePatientApi = async (id: string) => {
    await apiClient.delete(`/patients/${id}`);
};

export const createMealApi = async (patientId: string, meal: any) => {
    const response = await apiClient.post(`/patients/${patientId}/meals`, meal);
    return response.data.data;
};

export const deleteMealApi = async (mealItemId: string) => {
    await apiClient.delete(`/meals/${mealItemId}`);
};

export const approveDietPlanApi = async (
    patientId: string,
    plan: any
) => {
    const response = await apiClient.post(
        `/patients/${patientId}/mealplan/approve`,
        plan
    );
    return response.data;
};

export const rejectDietPlanApi = async (
    planId: string,
    reviewNote: string
) => {
    const response = await apiClient.patch(
        `/mealplans/${planId}/reject`,
        {reviewNote}
    );
    return response.data;
}