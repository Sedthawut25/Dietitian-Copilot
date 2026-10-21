import React, { useState } from 'react';
import { ActivityIndicator, ScrollView, Text, TouchableOpacity, View, TextInput } from 'react-native';
import { useMutation } from '@tanstack/react-query';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { approveDietPlanApi, suggestDietApi } from '../services/api';
import { Patient, usePatientStore } from '../store/usePatientStore';
import { DietPlanReview } from '../types/dietPlan';

const mealOrder = ['BREAKFAST', 'LUNCH', 'DINNER', 'SNACK'] as const;
const mealNames: Record<(typeof mealOrder)[number], string> = {
  BREAKFAST: 'มื้อเช้า',
  LUNCH: 'มื้อกลางวัน',
  DINNER: 'มื้อเย็น',
  SNACK: 'อาหารว่าง',
};

const getDiseaseStage = (patient: Patient) => {
  const disease = patient.diseases.find((item) => item.toUpperCase().includes('CKD'));
  if (disease?.includes('5')) return 'CKD_STAGE_5';
  if (disease) return 'CKD_STAGE_4';
  if (patient.diseases.some((item) => item.toUpperCase().includes('DM') || item.includes('เบาหวาน'))) return 'DM';
  if (patient.diseases.some((item) => item.toUpperCase().includes('HT') || item.includes('ความดัน'))) return 'HT';
  if (patient.diseases.some((item) => item.toUpperCase().includes('DLP') || item.includes('ไขมัน'))) return 'DYSLIPIDEMIA';
  return 'GENERAL';
};

export function MealEvaluationScreen() {
  const { patients, selectedPatientId, setSelectedPatient } = usePatientStore();
  const [selectedId, setSelectedId] = useState(selectedPatientId || patients[0]?.id || '');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const selectedPatient = patients.find((patient) => patient.id === selectedId) || patients[0];
  const [reviewPlan, setReviewPlan] = useState<DietPlanReview | null>(null);  

  const { mutate: suggestDiet, isPending } = useMutation({
    mutationFn: suggestDietApi,
    onSuccess: (data) => {
      if (!selectedPatient) return;

      const aiPlan = data.suggestions;
      
      setErrorMessage(null);

      setReviewPlan({
        patientId: selectedPatient.id,
        status: 'PENDING_REVIEW',
        dailySummary: aiPlan.dailySummary,
        meals: aiPlan.suggestions,
        warningMessage: aiPlan.warningMessage,
        reviewNote: '',
      });
    },
    onError: (error: any) => {
      console.error('Diet plan generation failed:', error);
      setErrorMessage(error?.code === 'ECONNABORTED'
        ? 'การจัดแผนอาหารใช้เวลานานเกินไป กรุณาลองใหม่'
        : 'ไม่สามารถสร้างแผนอาหารได้ กรุณาตรวจสอบการเชื่อมต่อแล้วลองใหม่');
    },
  });

  const selectPatient = (patient: Patient) => {
    setSelectedId(patient.id);
    setSelectedPatient(patient.id);
    setReviewPlan(null);
    setErrorMessage(null);
  };

  const generatePlan = () => {
    if (!selectedPatient) return;
    setErrorMessage(null);
    suggestDiet({
      patientProfile: {
        patientId: selectedPatient.id,
        diseaseStage: getDiseaseStage(selectedPatient),
        diseases: selectedPatient.diseases,
        medicationAlert: selectedPatient.medicationAlert,
        targetDailyEnergyKcal: selectedPatient.targetQuota.calories,
        targetSodiumMg: selectedPatient.targetQuota.sodium,
        targetPotassiumMg: 1500,
        targetPhosphorusMg: 800,
        targetProteinGram: selectedPatient.targetQuota.protein,
      },
      consumedToday: {
        totalSodiumMg: 0,
        totalPotassiumMg: 0,
        totalPhosphorusMg: 0,
        totalCholesterolMg: 0,
        totalSfaGram: 0,
        totalCalories: 0,
        totalProteinGram: 0,
      },
    });
  };

  const updateMealName = (mealType: string, menuName: string) => {
    setReviewPlan((current) => {
      if(!current) return current;
      return {
        ...current,
        meals: current.meals.map((meal) =>
          meal.mealType === mealType
            ? {...meal, menuName}
            :meal
        ),
      };
    });
  };

  const approvePlanMutation = useMutation({
    mutationFn: () => {
      if (!selectedPatient || !reviewPlan) {
        throw new Error('Missing patient or review plan');
      }
      return approveDietPlanApi(selectedPatient.id, {
        dailySummary: reviewPlan.dailySummary,
        meals: reviewPlan.meals,
        reviewNote: reviewPlan.reviewNote,
      });
    },
    onSuccess: () => {
      setReviewPlan((current) => 
        current
          ? {
            ...current,
            status: 'APPROVED',
            }
          : current
      );
    },
  });

  const meals = reviewPlan?.meals || [];
  const getMeal = (mealType: string) => meals.find((item) => item.mealType === mealType);

  return (
    <View className="flex-1 bg-slate-50">
      <View className="bg-blue-600 pt-12 pb-5 px-5 rounded-b-3xl shadow-lg">
        <View className="flex-row items-center gap-3">
          <View className="w-11 h-11 rounded-2xl bg-white/20 items-center justify-center">
            <MaterialCommunityIcons name="robot-outline" size={24} color="#FFFFFF" />
          </View>
          <View className="flex-1">
            <Text style={{ fontFamily: 'Kanit_700Bold' }} className="text-white text-xl">AI จัดแผนอาหาร</Text>
            <Text style={{ fontFamily: 'Kanit_400Regular' }} className="text-blue-100 text-xs">เลือกผู้ป่วยและสร้างแผนครบ 4 มื้อ</Text>
          </View>
        </View>
      </View>

      {reviewPlan?.status === 'PENDING_REVIEW' && (
        <View className="bg-amber-50 border border-amber-200 rounded-xl px-3 py-2 mb-3">
          <Text style={{ fontFamily: 'Kanit_600SemiBold' }} className="text-xs text-amber-800">
            สถานะ: รอตรวจสอบโดยนักกำหนดอาหาร
          </Text>
        </View>
      )}

      <ScrollView className="flex-1 px-4 pt-4" contentContainerStyle={{ paddingBottom: 110 }} showsVerticalScrollIndicator={false}>
        <Text style={{ fontFamily: 'Kanit_600SemiBold' }} className="text-sm text-slate-800 mb-2">เลือกผู้ป่วย</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-4">
          <View className="flex-row gap-2">
            {patients.map((patient) => {
              const isSelected = patient.id === selectedPatient?.id;
              return (
                <TouchableOpacity
                  key={patient.id}
                  onPress={() => selectPatient(patient)}
                  className={`px-4 py-3 rounded-2xl border ${isSelected ? 'bg-blue-600 border-blue-600' : 'bg-white border-slate-200'}`}
                >
                  <Text style={{ fontFamily: 'Kanit_600SemiBold' }} className={`text-sm ${isSelected ? 'text-white' : 'text-slate-800'}`}>{patient.name}</Text>
                  <Text style={{ fontFamily: 'Kanit_400Regular' }} className={`text-xs mt-0.5 ${isSelected ? 'text-blue-100' : 'text-slate-500'}`}>{patient.diseases.join(', ')}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </ScrollView>

        {selectedPatient && (
          <View className="bg-white rounded-2xl p-4 border border-slate-200 mb-4">
            <View className="flex-row items-center gap-2 mb-2">
              <Feather name="user" size={16} color="#2563EB" />
              <Text style={{ fontFamily: 'Kanit_700Bold' }} className="text-base text-slate-900">{selectedPatient.name}</Text>
            </View>
            <Text style={{ fontFamily: 'Kanit_400Regular' }} className="text-xs text-slate-600">โรค: {selectedPatient.diseases.join(', ')}</Text>
            <Text style={{ fontFamily: 'Kanit_400Regular' }} className="text-xs text-slate-600 mt-1">เป้าหมาย: {selectedPatient.targetQuota.calories} kcal | โปรตีน {selectedPatient.targetQuota.protein} g | โซเดียม {selectedPatient.targetQuota.sodium} mg</Text>
            {selectedPatient.medicationAlert && <Text style={{ fontFamily: 'Kanit_500Medium' }} className="text-xs text-red-600 mt-2">คำเตือนยา: {selectedPatient.medicationAlert}</Text>}
          </View>
        )}

        <TouchableOpacity
          onPress={generatePlan}
          disabled={isPending || !selectedPatient}
          className="bg-blue-600 rounded-2xl py-4 flex-row items-center justify-center gap-2 mb-4"
        >
          {isPending ? <ActivityIndicator color="#FFFFFF" /> : <MaterialCommunityIcons name="auto-fix" size={20} color="#FFFFFF" />}
          <Text style={{ fontFamily: 'Kanit_700Bold' }} className="text-white text-base">{isPending ? 'กำลังจัดแผนอาหาร...' : 'จัดแผนอาหารด้วย AI'}</Text>
        </TouchableOpacity>

        {errorMessage && (
          <View className="bg-red-50 border border-red-200 rounded-2xl p-4 mb-4">
            <Text style={{ fontFamily: 'Kanit_400Regular' }} className="text-sm text-red-700 mb-2">{errorMessage}</Text>
            <TouchableOpacity onPress={generatePlan} className="self-start bg-red-600 px-3 py-2 rounded-lg">
              <Text style={{ fontFamily: 'Kanit_600SemiBold' }} className="text-white text-xs">ลองอีกครั้ง</Text>
            </TouchableOpacity>
          </View>
        )}

        {reviewPlan && (
          <View className="bg-sky-50 border border-sky-200 rounded-2xl p-4">
            <View className="flex-row items-center gap-2 mb-2">
              <MaterialCommunityIcons name="calendar-check" size={20} color="#0369A1" />
              <Text style={{ fontFamily: 'Kanit_700Bold' }} className="text-base text-sky-900">แผนอาหารสำหรับวันนี้</Text>
            </View>
            <Text style={{ fontFamily: 'Kanit_400Regular' }} className="text-xs text-slate-700 mb-3">{reviewPlan.dailySummary}</Text>

            {mealOrder.map((mealType) => {
              const meal = getMeal(mealType);
              return (
                <View 
                  key={mealType} 
                  className="bg-white rounded-xl p-3 mb-2 border border-sky-100"
                >
                    <Text style={{ fontFamily: 'Kanit_700Bold' }} className="text-sm text-slate-900 mb-2">{mealNames[mealType]}</Text>
                    <TextInput 
                      value={meal?.menuName || ''}
                      onChangeText={(value) => updateMealName(mealType, value)}
                      editable={reviewPlan.status !== 'APPROVED'}
                      style={{ fontFamily: 'Kanit_600SemiBold' }}
                      className='bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-900'
                    />
                    <Text
                      style={{fontFamily: 'Kanit_400Regular'}}
                      className='text-xs text-slate-600 mt-2'
                    >
                      {meal?.reason || 'ยังไม่มีคำแนะนำ'}
                    </Text>
                </View>
              );
            })}
            {reviewPlan.warningMessage && <Text style={{ fontFamily: 'Kanit_500Medium' }} className="text-xs text-amber-700 mt-2">คำเตือน: {reviewPlan.warningMessage}</Text>}

            <View className='flex-row gap-2 mt-4'>
              <TouchableOpacity 
                disabled={approvePlanMutation.isPending}
                onPress={() => approvePlanMutation.mutate()}
                className='flex-1 bg-emerald-600 rounded-xl py-3 items-center'
              >
                <Text 
                  style={{fontFamily: 'Kanit_600SemiBold'}}
                  className='text-white text-sm'
                > 
                  {approvePlanMutation.isPending
                    ? 'กำลังบันทึก...'
                    : 'อนุมัติแผนอาหาร'
                  }
                </Text>
              </TouchableOpacity>
            </View>
            {reviewPlan.status === 'APPROVED' && (
              <View className='bg-emerald-50 border border-emerald-200 px-3 py-2 mt-3'>
                <Text
                  style={{fontFamily: 'Kanit_600SemiBold'}}
                  className='text-xs text-emerald-800'
                >
                  อนุมัติแผนอาหารแล้ว
                </Text>
              </View>
            )}
          </View>
        )}
      </ScrollView>
    </View>
  );
}
