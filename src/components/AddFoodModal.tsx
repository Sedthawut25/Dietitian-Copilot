import React, { useState } from 'react';
import { View, Text, Modal, TouchableOpacity, TextInput, FlatList, ScrollView } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { THAI_MEALS_DATABASE, ThaiMeal, DiseaseKey, SafetyTag } from '../data/thaiMealsDatabase';
import { usePatientStore, MealItem } from '../store/usePatientStore';

interface AddFoodModalProps {
    visible: boolean;
    onClose: () => void;
    patientId: string;
    patientDiseases: string[];
    mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
}

export function AddFoodModal({ visible, onClose, patientId, patientDiseases, mealType }: AddFoodModalProps) {
    const { addFoodToMeal } = usePatientStore();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string>('ทั้งหมด');
    const [selectedSafetyFilter, setSelectedSafetyFilter] = useState<'all' | 'safe' | 'warning' | 'danger'>('all');

    // Map patient diseases to DB DiseaseKey
    const mapDiseaseToDBType = (diseaseStr: string): DiseaseKey => {
        const str = diseaseStr.toUpperCase();
        if (str.includes('CKD STAGE_5') || str.includes('CKD_5')) return 'CKD_5';
        if (str.includes('CKD')) return 'CKD_4';
        if (str.includes('ความดัน') || str.includes('HT')) return 'HT';
        if (str.includes('เบาหวาน') || str.includes('DM')) return 'DM';
        if (str.includes('ไขมัน') || str.includes('DLP')) return 'DYSLIPIDEMIA';
        return 'GENERAL';
    };

    const activeDiseaseKeys = patientDiseases.map(mapDiseaseToDBType);

    const categories = ['ทั้งหมด', 'rice', 'stir-fry', 'soup', 'curry', 'noodle', 'salad', 'snack'];
    const categoryNames: Record<string, string> = {
        'ทั้งหมด': 'ทั้งหมด',
        'rice': 'จานเดียว/ข้าว',
        'stir-fry': 'ผัด/กระเทียม',
        'soup': 'ต้ม/แกงจืด',
        'curry': 'แกงเผ็ด/กะทิ',
        'noodle': 'ก๋วยเตี๋ยว',
        'salad': 'ยำ/สลัด',
        'snack': 'ของว่าง'
    };

    const getOverallSafety = (meal: ThaiMeal): 'safe' | 'warning' | 'danger' => {
        if (activeDiseaseKeys.length === 0) return 'safe';
        let hasWarning = false;
        for (const disKey of activeDiseaseKeys) {
            const status: SafetyTag = meal.safety[disKey] || 'green';
            if (status === 'red') return 'danger';
            if (status === 'yellow') hasWarning = true;
        }
        return hasWarning ? 'warning' : 'safe';
    };

    const filteredMeals = THAI_MEALS_DATABASE.filter((meal) => {
        const matchesQuery = meal.nameTh.toLowerCase().includes(searchQuery.toLowerCase()) ||
            meal.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory === 'ทั้งหมด' || meal.category === selectedCategory;

        const safety = getOverallSafety(meal);
        const matchesSafety = selectedSafetyFilter === 'all' || safety === selectedSafetyFilter;

        return matchesQuery && matchesCategory && matchesSafety;
    });

    const handleSelectFood = (meal: ThaiMeal) => {
        const item: MealItem = {
            id: Date.now().toString() + Math.random().toString(36).substring(2, 5),
            name: meal.nameTh,
            calories: meal.calories,
            protein: meal.protein,
            sodium: meal.sodium,
        };
        addFoodToMeal(patientId, mealType, item);
        onClose();
    };

    const mealTypeNames = {
        breakfast: 'มื้อเช้า',
        lunch: 'มื้อกลางวัน',
        dinner: 'มื้อเย็น',
        snack: 'อาหารว่าง'
    };

    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent={false}
            onRequestClose={onClose}
        >
            <View className="flex-1 bg-slate-100">
                {/* Modal Header */}
                <View className="bg-blue-600 pt-12 pb-4 px-4 flex-row items-center justify-between shadow-md">
                    <View className="flex-row items-center gap-2">
                        <TouchableOpacity onPress={onClose} className="p-1">
                            <Feather name="arrow-left" size={24} color="#FFFFFF" />
                        </TouchableOpacity>
                        <View>
                            <Text style={{ fontFamily: 'Kanit_700Bold' }} className="text-white text-lg">เลือกเมนูอาหาร ({mealTypeNames[mealType]})</Text>
                            <Text style={{ fontFamily: 'Kanit_400Regular' }} className="text-blue-100 text-xs">ฐานข้อมูลอาหารไทย 50 เมนู</Text>
                        </View>
                    </View>
                </View>

                {/* Search Bar */}
                <View className="p-4 bg-white border-b border-slate-200 shadow-sm">
                    <View className="flex-row items-center bg-slate-100 rounded-xl px-3 py-2 border border-slate-200">
                        <Feather name="search" size={18} color="#64748B" />
                        <TextInput
                            placeholder="ค้นหาเมนูอาหาร (เช่น ต้มยำ, กะเพรา, แกงจืด...)"
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                            style={{ fontFamily: 'Kanit_400Regular' }}
                            className="flex-1 ml-2 text-sm text-slate-800"
                        />
                        {searchQuery !== '' && (
                            <TouchableOpacity onPress={() => setSearchQuery('')}>
                                <Feather name="x" size={18} color="#94A3B8" />
                            </TouchableOpacity>
                        )}
                    </View>

                    {/* Category Selector */}
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mt-3">
                        {categories.map((cat) => (
                            <TouchableOpacity
                                key={cat}
                                onPress={() => setSelectedCategory(cat)}
                                className={`px-3.5 py-1.5 rounded-full mr-2 border ${selectedCategory === cat ? 'bg-blue-600 border-blue-600' : 'bg-slate-50 border-slate-200'}`}
                            >
                                <Text style={{ fontFamily: 'Kanit_700Bold' }} className={`text-xs ${selectedCategory === cat ? 'text-white' : 'text-slate-600'}`}>
                                    {categoryNames[cat] || cat}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>

                    {/* Safety Filter Tabs */}
                    <View className="flex-row gap-2 mt-3">
                        <TouchableOpacity
                            onPress={() => setSelectedSafetyFilter('all')}
                            className={`flex-1 py-1 rounded-lg items-center border ${selectedSafetyFilter === 'all' ? 'bg-slate-800 border-slate-800' : 'bg-slate-50 border-slate-200'}`}
                        >
                            <Text style={{ fontFamily: 'Kanit_600SemiBold' }} className={`text-xs ${selectedSafetyFilter === 'all' ? 'text-white' : 'text-slate-600'}`}>ทั้งหมด</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => setSelectedSafetyFilter('safe')}
                            className={`flex-1 py-1 rounded-lg items-center border ${selectedSafetyFilter === 'safe' ? 'bg-emerald-600 border-emerald-600' : 'bg-emerald-50 border-emerald-200'}`}
                        >
                            <Text style={{ fontFamily: 'Kanit_600SemiBold' }} className={`text-xs ${selectedSafetyFilter === 'safe' ? 'text-white' : 'text-emerald-700'}`}>🟢 ปลอดภัย</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => setSelectedSafetyFilter('warning')}
                            className={`flex-1 py-1 rounded-lg items-center border ${selectedSafetyFilter === 'warning' ? 'bg-amber-600 border-amber-600' : 'bg-amber-50 border-amber-200'}`}
                        >
                            <Text style={{ fontFamily: 'Kanit_600SemiBold' }} className={`text-xs ${selectedSafetyFilter === 'warning' ? 'text-white' : 'text-amber-700'}`}>🟡 เฝ้าระวัง</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => setSelectedSafetyFilter('danger')}
                            className={`flex-1 py-1 rounded-lg items-center border ${selectedSafetyFilter === 'danger' ? 'bg-red-600 border-red-600' : 'bg-red-50 border-red-200'}`}
                        >
                            <Text style={{ fontFamily: 'Kanit_600SemiBold' }} className={`text-xs ${selectedSafetyFilter === 'danger' ? 'text-white' : 'text-red-700'}`}>🔴 เลี่ยง/จำกัด</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Food List */}
                <FlatList
                    data={filteredMeals}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={{ padding: 16 }}
                    renderItem={({ item }) => {
                        const overallSafety = getOverallSafety(item);
                        return (
                            <TouchableOpacity
                                onPress={() => handleSelectFood(item)}
                                className="bg-white p-4 rounded-2xl mb-3 border border-slate-200/80 shadow-sm flex-row items-center"
                            >
                                <View className="flex-1 mr-3">
                                    <View className="flex-row items-center justify-between">
                                        <Text style={{ fontFamily: 'Kanit_700Bold' }} className="text-base text-slate-900 flex-1">{item.nameTh}</Text>
                                        {/* Safety Badge */}
                                        <View className={`px-2 py-0.5 rounded-full border ${overallSafety === 'safe' ? 'bg-emerald-50 border-emerald-300' : overallSafety === 'warning' ? 'bg-amber-50 border-amber-300' : 'bg-red-50 border-red-300'}`}>
                                            <Text style={{ fontFamily: 'Kanit_700Bold' }} className={`text-[10px] ${overallSafety === 'safe' ? 'text-emerald-700' : overallSafety === 'warning' ? 'text-amber-700' : 'text-red-700'}`}>
                                                {overallSafety === 'safe' ? '🟢 ปลอดภัย' : overallSafety === 'warning' ? '🟡 เฝ้าระวัง' : '🔴 ควรเลี่ยง'}
                                            </Text>
                                        </View>
                                    </View>

                                    <Text style={{ fontFamily: 'Kanit_400Regular' }} className="text-xs text-slate-500 mt-1">
                                        พลังงาน {item.calories} kcal | โปรตีน {item.protein}g
                                    </Text>
                                    <Text style={{ fontFamily: 'Kanit_600SemiBold' }} className="text-xs text-slate-600">
                                        โซเดียม {item.sodium} mg | K: {item.potassium} mg | P: {item.phosphorus} mg
                                    </Text>

                                    {/* Warnings for active diseases */}
                                    {activeDiseaseKeys.map((disKey) => {
                                        const note = item.notes?.[disKey];
                                        const tag = item.safety[disKey];
                                        if (tag === 'green' || !note) return null;
                                        return (
                                            <Text key={disKey} style={{ fontFamily: 'Kanit_600SemiBold' }} className={`text-[11px] mt-1 ${tag === 'red' ? 'text-red-600' : 'text-amber-600'}`}>
                                                ⚠️ [{disKey}]: {note}
                                            </Text>
                                        );
                                    })}
                                </View>

                                <View className="w-10 h-10 rounded-full bg-blue-600 items-center justify-center border-2 border-blue-100 shadow-sm">
                                    <Feather name="plus" size={20} color="#FFFFFF" />
                                </View>
                            </TouchableOpacity>
                        );
                    }}
                />
            </View>
        </Modal>
    );
}
