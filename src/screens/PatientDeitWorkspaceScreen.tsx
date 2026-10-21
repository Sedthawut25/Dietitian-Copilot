import React, { useState } from "react";
import { Alert, Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { Feather, FontAwesome5, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { usePatientStore, Patient, MealItem } from "../store/usePatientStore";
import { AddFoodModal } from "../components/AddFoodModal";

export function PatientDietWorkspaceScreen({ navigation }: any) {
    const { patients, selectedPatientId, setSelectedPatient, removeFoodFromMeal } = usePatientStore();
    const [activeMealTab, setActiveMealTab] = useState<'breakfast' | 'lunch' | 'dinner' | 'snack'>('lunch');
    const [isAddFoodModalOpen, setIsAddFoodModalOpen] = useState(false);

    // Current active patient or default to first patient
    const currentPatient: Patient = patients.find(p => p.id === selectedPatientId) || patients[0] || {
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
        meals: { breakfast: [], lunch: [], dinner: [], snack: [] }
    };

    const currentMealList: MealItem[] = currentPatient.meals ? currentPatient.meals[activeMealTab] || [] : [];

    // Calculated totals for today across all 4 meal types
    const totalConsumed = Object.values(currentPatient.meals || {}).reduce(
        (acc, mealArray) => {
            mealArray.forEach(item => {
                acc.calories += item.calories || 0;
                acc.protein += item.protein || 0;
                acc.sodium += item.sodium || 0;
            });
            return acc;
        },
        { calories: 0, protein: 0, sodium: 0 }
    );

    const calPercent = Math.min(100, Math.round((totalConsumed.calories / (currentPatient.targetQuota.calories || 1800)) * 100));
    const proteinPercent = Math.min(100, Math.round((totalConsumed.protein / (currentPatient.targetQuota.protein || 45)) * 100));
    const sodiumPercent = Math.min(100, Math.round((totalConsumed.sodium / (currentPatient.targetQuota.sodium || 2000)) * 100));

    const mealTabNames = {
        breakfast: 'มื้อเช้า',
        lunch: 'มื้อกลางวัน',
        dinner: 'มื้อเย็น',
        snack: 'อาหารว่าง'
    };

    const openMealEvaluation = (foodItem?: MealItem) => {
        const parentNavigation = navigation?.getParent?.();
        if (parentNavigation) {
            parentNavigation.navigate('MainTabs', {
                screen: 'MealEvaluation',
                params: foodItem ? { foodItem } : undefined,
            });
            return;
        }
        navigation?.navigate?.('MealEvaluation', foodItem ? { foodItem } : undefined);
    };

    const handleRemoveFood = (item: MealItem) => {
        Alert.alert(
            'ลบรายการอาหาร',
            `ต้องการลบ ${item.name} ออกจาก${mealTabNames[activeMealTab]}หรือไม่`,
            [
                { text: 'ยกเลิก', style: 'cancel' },
                { text: 'ลบรายการ', style: 'destructive', onPress: () => removeFoodFromMeal(currentPatient.id, activeMealTab, item.id) },
            ]
        );
    };

    return (
        <View className="flex-1 bg-slate-50">
            {/* Header Banner */}
            <View className="bg-blue-600 pt-14 pb-5 px-5 rounded-b-3xl shadow-lg flex-row justify-between items-center">
                <TouchableOpacity onPress={() => navigation?.goBack?.()} className="bg-white/20 p-2 rounded-2xl border border-white/30">
                    <Feather name="chevron-left" size={20} color="white" />
                </TouchableOpacity>
                <View className="items-center">
                    <Text style={{ fontFamily: 'Kanit_700Bold' }} className="text-white text-xl">
                        จัดการอาหารรายบุคคล
                    </Text>
                    <Text style={{ fontFamily: 'Kanit_400Regular' }} className="text-blue-100 text-xs">
                        Patient Clinical Diet Workspace
                    </Text>
                </View>
                <TouchableOpacity
                    onPress={() => navigation?.navigate?.('AddPatient')}
                    className="bg-white/20 p-2 rounded-2xl border border-white/30"
                >
                    <Feather name="user-plus" size={20} color="#FFFFFF" />
                </TouchableOpacity>
            </View>

            <ScrollView className="flex-1 px-4 pt-4" contentContainerStyle={{ paddingBottom: 110 }} showsVerticalScrollIndicator={false}>
                {/* Patient Profile Card */}
                <View className="bg-white rounded-3xl p-4 shadow-sm mb-4 border border-slate-100">
                    <View className="flex-row items-start mb-3">
                        <View className="flex-row items-center flex-1">
                            <View className="w-14 h-14 rounded-2xl bg-blue-50 items-center justify-center mr-3.5 border border-blue-100">
                                <FontAwesome5 name="user-alt" size={20} color="#2563EB" />
                            </View>
                            <View className="flex-1 min-w-0">
                                <Text style={{ fontFamily: 'Kanit_700Bold' }} className="text-lg text-slate-900">
                                    {currentPatient.name}
                                </Text>
                                <Text style={{ fontFamily: 'Kanit_400Regular' }} className="text-xs text-slate-500 mt-0.5">
                                    อายุ {currentPatient.age} ปี ({currentPatient.gender === 'male' ? 'ชาย' : 'หญิง'})
                                </Text>
                                <Text style={{ fontFamily: 'Kanit_400Regular' }} className="text-xs text-slate-500 mt-0.5">
                                    น้ำหนัก {currentPatient.weightKg ? `${currentPatient.weightKg} kg` : 'ยังไม่ระบุ'}
                                    {'  '}ส่วนสูง {currentPatient.heightCm ? `${currentPatient.heightCm} cm` : 'ยังไม่ระบุ'}
                                </Text>
                                <View className="flex-row items-center mt-1 gap-1">
                                    <FontAwesome5 name="hospital" size={11} color="#2563EB" />
                                    <Text style={{ fontFamily: 'Kanit_500Medium' }} className="text-xs text-blue-700">
                                        {currentPatient.ward} {currentPatient.bed}
                                    </Text>
                                </View>
                            </View>
                        </View>
                    </View>

                    {/* Diseases Badges */}
                    <View className="flex-row flex-wrap gap-2 mb-3">
                        {currentPatient.diseases.map((dis, idx) => (
                            <View key={idx} className="max-w-full bg-amber-50 border border-amber-200/80 px-2.5 py-1 rounded-lg flex-row items-center">
                                <MaterialCommunityIcons name="dna" size={12} color="#D97706" />
                                <Text style={{ fontFamily: 'Kanit_500Medium' }} className="text-amber-800 text-[11px] ml-1 flex-shrink">
                                    {dis}
                                </Text>
                            </View>
                        ))}
                    </View>

                    {/* Alert Banner for Med Guard */}
                    {currentPatient.medicationAlert && (
                        <View className="bg-red-500 px-3.5 py-2.5 rounded-2xl flex-row justify-between items-center shadow-sm mt-1">
                            <View className="flex-row items-center gap-2 flex-1 mr-2">
                                <Feather name="alert-triangle" size={16} color="#FFFFFF" />
                                <Text style={{ fontFamily: 'Kanit_500Medium' }} className="text-white text-xs flex-1">
                                    {currentPatient.medicationAlert}
                                </Text>
                            </View>
                            <Feather name="info" size={16} color="#FFFFFF" />
                        </View>
                    )}
                </View>

                {/* Nutrient Quota Status Card */}
                <View className="bg-white rounded-3xl p-5 shadow-sm mb-4 border border-slate-100">
                    <View className="flex-row justify-between items-center mb-4 border-b border-slate-100 pb-3">
                        <View className="flex-row items-center gap-2">
                            <Ionicons name="stats-chart" size={18} color="#2563EB" />
                            <Text style={{ fontFamily: 'Kanit_700Bold' }} className="text-base text-slate-900">
                                โควต้าสารอาหารประจำวัน
                            </Text>
                        </View>
                        <View className="bg-blue-50 px-2.5 py-1 rounded-xl border border-blue-100">
                            <Text style={{ fontFamily: 'Kanit_500Medium' }} className="text-blue-700 text-xs">
                                คำนวณตามโรค
                            </Text>
                        </View>
                    </View>

                    {/* Calories Progress */}
                    <View className="mb-3.5">
                        <View className="flex-row justify-between items-center mb-1.5">
                            <View className="flex-row items-center gap-2">
                                <View className="w-6 h-6 rounded-lg bg-emerald-100 items-center justify-center">
                                    <Ionicons name="flash" size={14} color="#059669" />
                                </View>
                                <Text style={{ fontFamily: 'Kanit_600SemiBold' }} className="text-sm text-slate-700">
                                    พลังงาน
                                </Text>
                            </View>
                            <Text style={{ fontFamily: 'Kanit_600SemiBold' }} className="text-sm text-slate-800">
                                {totalConsumed.calories.toLocaleString()} <Text style={{ fontFamily: 'Kanit_400Regular' }} className="text-xs text-slate-400">/ {currentPatient.targetQuota.calories} kcal</Text>
                            </Text>
                        </View>
                        <View className="h-3 bg-slate-100 rounded-full overflow-hidden">
                            <View className={`h-full ${calPercent > 100 ? 'bg-red-500' : 'bg-emerald-500'} rounded-full`} style={{ width: `${Math.min(100, calPercent)}%` }} />
                        </View>
                        <Text style={{ fontFamily: 'Kanit_500Medium' }} className="text-[11px] text-right text-slate-400 mt-1">
                            สะสม {calPercent}%
                        </Text>
                    </View>

                    {/* Protein Progress */}
                    <View className="mb-3.5">
                        <View className="flex-row justify-between items-center mb-1.5">
                            <View className="flex-row items-center gap-2">
                                <View className="w-6 h-6 rounded-lg bg-amber-100 items-center justify-center">
                                    <MaterialCommunityIcons name="food-drumstick" size={14} color="#D97706" />
                                </View>
                                <Text style={{ fontFamily: 'Kanit_600SemiBold' }} className="text-sm text-slate-700">
                                    โปรตีน
                                </Text>
                            </View>
                            <Text style={{ fontFamily: 'Kanit_600SemiBold' }} className="text-sm text-amber-700">
                                {totalConsumed.protein} <Text style={{ fontFamily: 'Kanit_400Regular' }} className="text-xs text-slate-400">/ {currentPatient.targetQuota.protein} g</Text>
                            </Text>
                        </View>
                        <View className="h-3 bg-slate-100 rounded-full overflow-hidden">
                            <View className={`h-full ${proteinPercent > 100 ? 'bg-red-500' : 'bg-amber-500'} rounded-full`} style={{ width: `${Math.min(100, proteinPercent)}%` }} />
                        </View>
                        <Text style={{ fontFamily: 'Kanit_500Medium' }} className="text-[11px] text-right text-slate-400 mt-1">
                            สะสม {proteinPercent}%
                        </Text>
                    </View>

                    {/* Sodium Progress */}
                    <View className="mb-1">
                        <View className="flex-row justify-between items-center mb-1.5">
                            <View className="flex-row items-center gap-2">
                                <View className="w-6 h-6 rounded-lg bg-red-100 items-center justify-center">
                                    <Text style={{ fontFamily: 'Kanit_700Bold' }} className="text-[11px] text-red-600">Na</Text>
                                </View>
                                <Text style={{ fontFamily: 'Kanit_600SemiBold' }} className="text-sm text-slate-700">
                                    โซเดียม
                                </Text>
                            </View>
                            <Text style={{ fontFamily: 'Kanit_600SemiBold' }} className={`text-sm ${sodiumPercent > 90 ? 'text-red-600' : 'text-slate-800'}`}>
                                {totalConsumed.sodium.toLocaleString()} <Text style={{ fontFamily: 'Kanit_400Regular' }} className="text-xs text-slate-400">/ {currentPatient.targetQuota.sodium} mg</Text>
                            </Text>
                        </View>
                        <View className="h-3 bg-slate-100 rounded-full overflow-hidden">
                            <View className={`h-full ${sodiumPercent > 90 ? 'bg-red-500' : 'bg-blue-500'} rounded-full`} style={{ width: `${Math.min(100, sodiumPercent)}%` }} />
                        </View>
                        <Text style={{ fontFamily: 'Kanit_600SemiBold' }} className={`text-[11px] text-right mt-1 ${sodiumPercent > 90 ? 'text-red-500' : 'text-slate-400'}`}>
                            สะสม {sodiumPercent}%
                        </Text>
                    </View>
                </View>

                {/* Meal Tabs Switcher */}
                <View className="flex-row bg-slate-200/60 p-1.5 rounded-2xl mb-4">
                    {(['breakfast', 'lunch', 'dinner', 'snack'] as const).map((tab) => {
                        const isActive = activeMealTab === tab;
                        return (
                            <TouchableOpacity
                                key={tab}
                                onPress={() => setActiveMealTab(tab)}
                                activeOpacity={0.8}
                                className="flex-1 py-2.5 flex-row items-center justify-center gap-1.5 rounded-xl"
                                style={isActive ? { backgroundColor: '#2563EB', elevation: 2 } : undefined}
                            >
                                <Feather
                                    name={tab === 'breakfast' ? 'sun' : tab === 'lunch' ? 'sun' : tab === 'dinner' ? 'moon' : 'coffee'}
                                    size={14}
                                    color={isActive ? '#FFFFFF' : '#475569'}
                                />
                                <Text style={{ fontFamily: 'Kanit_600SemiBold' }} className={`text-xs ${isActive ? 'text-white' : 'text-slate-600'}`}>
                                    {mealTabNames[tab]}
                                </Text>
                            </TouchableOpacity>
                        );
                    })}
                </View>

                {/* Selected Meal Food List Card */}
                <View className="bg-white rounded-3xl p-5 shadow-sm mb-4 border border-slate-100">
                    <View className="flex-row justify-between items-center mb-4 border-b border-slate-100 pb-3">
                        <View className="flex-row items-center gap-2">
                            <FontAwesome5 name="utensils" size={14} color="#2563EB" />
                            <Text style={{ fontFamily: 'Kanit_700Bold' }} className="text-sm text-slate-900">
                                รายการอาหาร ({mealTabNames[activeMealTab]})
                            </Text>
                        </View>
                        <View className="bg-slate-100 px-2.5 py-0.5 rounded-full border border-slate-200">
                            <Text style={{ fontFamily: 'Kanit_500Medium' }} className="text-xs text-slate-600">{currentMealList.length} รายการ</Text>
                        </View>
                    </View>

                    {currentMealList.length === 0 ? (
                        <View className="py-8 items-center justify-center">
                            <Feather name="inbox" size={32} color="#CBD5E1" />
                            <Text style={{ fontFamily: 'Kanit_400Regular' }} className="text-xs text-slate-400 mt-2">
                                ยังไม่มีรายการอาหารใน{mealTabNames[activeMealTab]}
                            </Text>
                        </View>
                    ) : (
                        currentMealList.map((item) => (
                            <View key={item.id} className="flex-row items-center justify-between py-3 border-b border-slate-100">
                                <View className="flex-row items-center flex-1 mr-3">
                                    <Image
                                        source={{ uri: item.imageUrl || 'https://assets.unileversolutions.com/recipes-v2/242153.jpg' }}
                                        className="w-13 h-13 rounded-2xl mr-3 bg-slate-100 border border-slate-200/60"
                                    />
                                    <View className="flex-1">
                                        <Text style={{ fontFamily: 'Kanit_600SemiBold' }} className="text-sm text-slate-900">{item.name}</Text>
                                        <Text style={{ fontFamily: 'Kanit_400Regular' }} className="text-xs text-slate-500 mt-0.5">
                                            พลังงาน {item.calories} kcal | โปรตีน {item.protein}g
                                        </Text>
                                        <Text style={{ fontFamily: 'Kanit_500Medium' }} className="text-xs text-slate-600">โซเดียม {item.sodium} mg</Text>
                                    </View>
                                </View>
                                <View className="flex-row items-center gap-2">
                                    <TouchableOpacity
                                        onPress={() => openMealEvaluation(item)}
                                        activeOpacity={0.8}
                                        className="bg-blue-50 border border-blue-200/80 p-2.5 rounded-xl"
                                        accessibilityLabel={`วิเคราะห์ ${item.name}`}
                                    >
                                        <Ionicons name="sparkles" size={15} color="#2563EB" />
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        onPress={() => handleRemoveFood(item)}
                                        activeOpacity={0.8}
                                        className="bg-red-50 border border-red-200 p-2.5 rounded-xl"
                                        accessibilityLabel={`ลบ ${item.name}`}
                                    >
                                        <Feather name="trash-2" size={15} color="#DC2626" />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        ))
                    )}

                    {/* Add Food Button */}
                    <TouchableOpacity
                        onPress={() => setIsAddFoodModalOpen(true)}
                        activeOpacity={0.8}
                        className="bg-blue-50 border border-blue-200 px-4 py-3 rounded-2xl flex-row items-center justify-center gap-2 mt-3"
                    >
                        <Feather name="plus-circle" size={18} color="#2563EB" />
                        <Text style={{ fontFamily: 'Kanit_600SemiBold' }} className="text-blue-600 text-sm">
                            เพิ่มเมนูอาหาร (จากฐานข้อมูล 50 เมนู)
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* AI Copilot Suggestion Box */}
                <TouchableOpacity
                    onPress={() => openMealEvaluation()}
                    activeOpacity={0.9}
                    className="bg-blue-50 border border-blue-200 p-4 rounded-3xl flex-row items-start shadow-sm mb-4"
                >
                    <View className="w-9 h-9 rounded-2xl bg-blue-600 items-center justify-center mr-3 mt-0.5 shadow-sm">
                        <Ionicons name="sparkles" size={18} color="#FFFFFF" />
                    </View>
                    <View className="flex-1 pr-1">
                        <View className="flex-row items-center mb-1 gap-1.5">
                            <Text style={{ fontFamily: 'Kanit_700Bold' }} className="text-xs text-blue-900">
                                AI Dietitian Copilot
                            </Text>
                            <View className="bg-blue-200/70 px-2 py-0.5 rounded-full">
                                <Text style={{ fontFamily: 'Kanit_500Medium' }} className="text-[10px] text-blue-900">
                                    Gemini 2.0 Flash
                                </Text>
                            </View>
                        </View>
                        <Text style={{ fontFamily: 'Kanit_400Regular' }} className="text-xs text-slate-700 leading-5">
                            {currentPatient.diseases.includes('CKD STAGE_4')
                                ? 'ผู้ป่วย CKD Stage 4 ควรควบคุมโซเดียมไม่เกิน 2,000 mg/วัน และโปรตีน 0.6g/น้ำหนักตัว กดปุ่มนี้เพื่อส่ง AI วิเคราะห์ปรับปรุงสูตรอาหารเต็มรูปแบบ'
                                : 'กดปุ่มนี้เพื่อส่งแผนอาหารให้ AI Dietitian ช่วยวิเคราะห์ส่วนผสมและการปรับปรุงสูตรอาหารรายบุคคล'}
                        </Text>
                    </View>
                    <Feather name="chevron-right" size={18} color="#94A3B8" />
                </TouchableOpacity>
            </ScrollView>

            {/* Food Selector Modal */}
            <AddFoodModal
                visible={isAddFoodModalOpen}
                onClose={() => setIsAddFoodModalOpen(false)}
                patientId={currentPatient.id}
                patientDiseases={currentPatient.diseases}
                mealType={activeMealTab}
            />
        </View>
    );
}