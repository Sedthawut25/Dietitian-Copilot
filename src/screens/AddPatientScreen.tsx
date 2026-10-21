import React, { useState } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, Modal } from 'react-native';
import { Feather, FontAwesome5, Ionicons } from '@expo/vector-icons';
import { usePatientStore, Patient } from '../store/usePatientStore';

const normalizeDiseaseId = (disease: string) => {
    const normalized = disease.toUpperCase();
    if (normalized.includes('CKD STAGE_5') || normalized.includes('CKD_5')) return 'CKD STAGE_5';
    if (normalized.includes('CKD')) return 'CKD STAGE_4';
    if (normalized.includes('ความดัน') || normalized === 'HT') return 'HT';
    if (normalized.includes('เบาหวาน') || normalized.includes('DM')) return 'DM Type 2';
    if (normalized.includes('ไขมัน') || normalized.includes('DLP')) return 'DLP';
    return disease;
};

export function AddPatientScreen({ navigation, route }: any) {
    const { addPatient, updatePatient, patients } = usePatientStore();
    const editingPatient = patients.find((patient) => patient.id === route?.params?.patientId);
    const isEditing = Boolean(editingPatient);

    const [name, setName] = useState(editingPatient?.name || '');
    const [age, setAge] = useState(editingPatient?.age?.toString() || '');
    const [gender, setGender] = useState<'male' | 'female'>(editingPatient?.gender || 'female');
    const [ward, setWard] = useState(editingPatient?.ward || '');
    const [bed, setBed] = useState(editingPatient?.bed || '');
    const [weight, setWeight] = useState(editingPatient?.weightKg?.toString() || '');
    const [height, setHeight] = useState(editingPatient?.heightCm?.toString() || '');
    const [dialog, setDialog] = useState<{ title: string; message: string; tone: 'error' | 'success'; closeAfter: boolean } | null>(null);

    // Multi-disease selection
    const [selectedDiseases, setSelectedDiseases] = useState<string[]>(editingPatient?.diseases.map(normalizeDiseaseId) || ['CKD STAGE_4']);
    const [isWarfarin, setIsWarfarin] = useState(Boolean(editingPatient?.medicationAlert));

    const availableDiseases = [
        { id: 'CKD STAGE_4', name: 'โรคไตเรื้อรัง Stage 4 (CKD Stage 4)' },
        { id: 'CKD STAGE_5', name: 'โรคไตเรื้อรัง Stage 5 / ฟอกไต (CKD Stage 5)' },
        { id: 'HT', name: 'ความดันโลหิตสูง (Hypertension)' },
        { id: 'DM Type 2', name: 'เบาหวานชนิดที่ 2 (DM Type 2)' },
        { id: 'DLP', name: 'ไขมันในเลือดสูง (Dyslipidemia)' },
        { id: 'CHF', name: 'ภาวะหัวใจล้มเหลว (Heart Failure)' },
        { id: 'Gout', name: 'โรคเกาต์ (Gout)' }
    ];

    const toggleDisease = (diseaseId: string) => {
        if (selectedDiseases.includes(diseaseId)) {
            setSelectedDiseases(selectedDiseases.filter(d => d !== diseaseId));
        } else {
            setSelectedDiseases([...selectedDiseases, diseaseId]);
        }
    };

    const handleSave = () => {
        if (!name || !age || !ward || !bed) {
            setDialog({ title: 'ข้อมูลยังไม่ครบ', message: 'โปรดกรอกข้อมูลผู้ป่วยให้ครบถ้วนก่อนบันทึก', tone: 'error', closeAfter: false });
            return;
        }

        if (selectedDiseases.length === 0) {
            setDialog({ title: 'ยังไม่ได้เลือกโรค', message: 'โปรดเลือกโรคประจำตัวของผู้ป่วยอย่างน้อย 1 โรค', tone: 'error', closeAfter: false });
            return;
        }

        // Auto quota calculation
        const ageNum = parseInt(age) || 60;
        const wNum = parseFloat(weight) || 60;

        let targetCalories = weight
            ? Math.round(wNum * 30) || 1800
            : editingPatient?.targetQuota.calories || 1800;

        let targetProtein = weight
            ? Math.round(wNum * 0.8)
            : editingPatient?.targetQuota.protein || Math.round(wNum * 0.8);
        if (weight && selectedDiseases.some(d => d.includes('CKD STAGE_4'))) {
            targetProtein = Math.round(wNum * 0.6); // 0.6g/kg for CKD 4
        } else if (weight && selectedDiseases.some(d => d.includes('CKD STAGE_5'))) {
            targetProtein = Math.round(wNum * 1.2); // 1.2g/kg for Dialysis
        }

        const patientData = {
            name,
            gender,
            age: ageNum,
            weightKg: weight ? wNum : undefined,
            heightCm: height ? parseFloat(height) : undefined,
            ward,
            bed,
            diseases: selectedDiseases,
            medicationAlert: isWarfarin ? 'ทานยา Warfarin: เลี่ยงผักใบเขียวสูง' : undefined,
            targetQuota: {
                calories: targetCalories,
                protein: targetProtein,
                sodium: editingPatient?.targetQuota.sodium || 2000
            },
        };

        if (editingPatient) {
            updatePatient(editingPatient.id, patientData);
            setDialog({ title: 'อัปเดตข้อมูลสำเร็จ', message: 'ข้อมูลผู้ป่วยถูกแก้ไขเรียบร้อยแล้ว', tone: 'success', closeAfter: true });
            return;
        }

        const newPatient: Patient = {
            id: Date.now().toString(),
            hn: `HN-${Date.now().toString().slice(-6)}`,
            ...patientData,
            meals: { breakfast: [], lunch: [], dinner: [], snack: [] }
        };

        addPatient(newPatient);
        setDialog({ title: 'เพิ่มผู้ป่วยสำเร็จ', message: 'บันทึกประวัติและสร้างแผนโควตาสารอาหารเรียบร้อยแล้ว', tone: 'success', closeAfter: true });
    };

    const closeDialog = () => {
        const shouldGoBack = dialog?.closeAfter;
        setDialog(null);
        if (shouldGoBack) navigation.goBack();
    };

    return (
        <View className="flex-1 bg-slate-50">
            {/* Header */}
            <View className="bg-blue-600 pt-14 pb-5 px-5 flex-row items-center justify-between rounded-b-3xl shadow-lg">
                <View className="flex-row items-center gap-3">
                    <TouchableOpacity
                        onPress={() => navigation.goBack()}
                        className="bg-white/20 p-2 rounded-2xl border border-white/30"
                    >
                        <Feather name="x" size={20} color="#FFFFFF" />
                    </TouchableOpacity>
                    <View>
                        <Text style={{ fontFamily: 'Kanit_700Bold' }} className="text-white text-xl">
                            {isEditing ? 'แก้ไขข้อมูลผู้ป่วย' : 'เพิ่มข้อมูลผู้ป่วยใหม่'}
                        </Text>
                        <Text style={{ fontFamily: 'Kanit_400Regular' }} className="text-blue-100 text-xs">
                            {isEditing ? 'Update Patient Clinical Profile' : 'New Patient Registration & Clinical Profile'}
                        </Text>
                    </View>
                </View>
            </View>

            <ScrollView className="flex-1 p-5" showsVerticalScrollIndicator={false}>
                {/* Form Card 1 */}
                <View className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm mb-4">
                    <View className="flex-row items-center gap-2 border-b border-slate-100 pb-3 mb-4">
                        <Ionicons name="person" size={18} color="#2563EB" />
                        <Text style={{ fontFamily: 'Kanit_600SemiBold' }} className="text-sm text-slate-800">
                            1. ข้อมูลส่วนตัวและตำแหน่งเตียง
                        </Text>
                    </View>

                    <View className="mb-3.5">
                        <Text style={{ fontFamily: 'Kanit_500Medium' }} className="text-xs text-slate-600 mb-1.5">
                            ชื่อ-นามสกุล ผู้ป่วย *
                        </Text>
                        <TextInput
                            placeholder="เช่น นายสมชาย ใจดี"
                            placeholderTextColor="#94A3B8"
                            value={name}
                            onChangeText={setName}
                            style={{ fontFamily: 'Kanit_400Regular' }}
                            className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3 text-sm text-slate-900"
                        />
                    </View>

                    {/* Gender Selection */}
                    <View className="mb-3.5">
                        <Text style={{ fontFamily: 'Kanit_500Medium' }} className="text-xs text-slate-600 mb-1.5">
                            เพศ
                        </Text>
                        <View className="flex-row gap-3">
                            <TouchableOpacity
                                onPress={() => setGender('female')}
                                activeOpacity={0.8}
                                className={`flex-1 p-3 rounded-2xl border flex-row items-center justify-center gap-2 ${gender === 'female' ? 'bg-pink-50 border-pink-400' : 'bg-slate-50 border-slate-200/80'}`}
                            >
                                <FontAwesome5 name="venus" size={14} color={gender === 'female' ? '#EC4899' : '#64748B'} />
                                <Text style={{ fontFamily: 'Kanit_600SemiBold' }} className={`text-xs ${gender === 'female' ? 'text-pink-600' : 'text-slate-600'}`}>
                                    หญิง
                                </Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                onPress={() => setGender('male')}
                                activeOpacity={0.8}
                                className={`flex-1 p-3 rounded-2xl border flex-row items-center justify-center gap-2 ${gender === 'male' ? 'bg-blue-50 border-blue-400' : 'bg-slate-50 border-slate-200/80'}`}
                            >
                                <FontAwesome5 name="mars" size={14} color={gender === 'male' ? '#2563EB' : '#64748B'} />
                                <Text style={{ fontFamily: 'Kanit_600SemiBold' }} className={`text-xs ${gender === 'male' ? 'text-blue-600' : 'text-slate-600'}`}>
                                    ชาย
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View className="flex-row gap-2.5 mb-3.5">
                        <View className="flex-1">
                            <Text style={{ fontFamily: 'Kanit_500Medium' }} className="text-xs text-slate-600 mb-1.5">
                                อายุ (ปี) *
                            </Text>
                            <TextInput
                                placeholder="68"
                                placeholderTextColor="#94A3B8"
                                keyboardType="numeric"
                                value={age}
                                onChangeText={setAge}
                                style={{ fontFamily: 'Kanit_400Regular' }}
                                className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3 text-sm text-slate-900"
                            />
                        </View>
                        <View className="flex-1">
                            <Text style={{ fontFamily: 'Kanit_500Medium' }} className="text-xs text-slate-600 mb-1.5">
                                น้ำหนัก (kg)
                            </Text>
                            <TextInput
                                placeholder="55"
                                placeholderTextColor="#94A3B8"
                                keyboardType="numeric"
                                value={weight}
                                onChangeText={setWeight}
                                style={{ fontFamily: 'Kanit_400Regular' }}
                                className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3 text-sm text-slate-900"
                            />
                        </View>
                        <View className="flex-1">
                            <Text style={{ fontFamily: 'Kanit_500Medium' }} className="text-xs text-slate-600 mb-1.5">
                                ส่วนสูง (cm)
                            </Text>
                            <TextInput
                                placeholder="155"
                                placeholderTextColor="#94A3B8"
                                keyboardType="numeric"
                                value={height}
                                onChangeText={setHeight}
                                style={{ fontFamily: 'Kanit_400Regular' }}
                                className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3 text-sm text-slate-900"
                            />
                        </View>
                    </View>

                    <View className="flex-row gap-3">
                        <View className="flex-1">
                            <Text style={{ fontFamily: 'Kanit_500Medium' }} className="text-xs text-slate-600 mb-1.5">
                                ตึก/วอร์ด *
                            </Text>
                            <TextInput
                                placeholder="ตึกอายุรกรรม"
                                placeholderTextColor="#94A3B8"
                                value={ward}
                                onChangeText={setWard}
                                style={{ fontFamily: 'Kanit_400Regular' }}
                                className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3 text-sm text-slate-900"
                            />
                        </View>
                        <View className="flex-1">
                            <Text style={{ fontFamily: 'Kanit_500Medium' }} className="text-xs text-slate-600 mb-1.5">
                                เตียง *
                            </Text>
                            <TextInput
                                placeholder="เตียง 12"
                                placeholderTextColor="#94A3B8"
                                value={bed}
                                onChangeText={setBed}
                                style={{ fontFamily: 'Kanit_400Regular' }}
                                className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3 text-sm text-slate-900"
                            />
                        </View>
                    </View>
                </View>

                {/* Form Card 2 */}
                <View className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm mb-4">
                    <View className="flex-row items-center gap-2 border-b border-slate-100 pb-3 mb-4">
                        <Ionicons name="fitness" size={18} color="#2563EB" />
                        <Text style={{ fontFamily: 'Kanit_600SemiBold' }} className="text-sm text-slate-800">
                            2. ผลวินิจฉัยโรค (Clinical Diagnosis)
                        </Text>
                    </View>

                    <View className="gap-y-2">
                        {availableDiseases.map((d) => {
                            const isSelected = selectedDiseases.includes(d.id);
                            return (
                                <TouchableOpacity
                                    key={d.id}
                                    onPress={() => toggleDisease(d.id)}
                                    activeOpacity={0.8}
                                    className={`p-3.5 rounded-2xl border flex-row items-center justify-between ${isSelected ? 'bg-blue-50/70 border-blue-500' : 'bg-slate-50 border-slate-200/70'}`}
                                >
                                    <Text style={{ fontFamily: isSelected ? 'Kanit_600SemiBold' : 'Kanit_400Regular' }} className={`text-xs flex-1 pr-2 ${isSelected ? 'text-blue-800' : 'text-slate-700'}`}>
                                        {d.name}
                                    </Text>
                                    <View className={`w-5 h-5 rounded-lg border items-center justify-center ${isSelected ? 'bg-blue-600 border-blue-600' : 'border-slate-300'}`}>
                                        {isSelected && <Feather name="check" size={12} color="#FFFFFF" />}
                                    </View>
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                </View>

                {/* Form Card 3 */}
                <View className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm mb-6">
                    <View className="flex-row items-center gap-2 border-b border-slate-100 pb-3 mb-4">
                        <Ionicons name="shield-checkmark" size={18} color="#D97706" />
                        <Text style={{ fontFamily: 'Kanit_600SemiBold' }} className="text-sm text-slate-800">
                            3. ยาที่ต้องเฝ้าระวังพิเศษ (Medication Guard)
                        </Text>
                    </View>

                    <TouchableOpacity
                        onPress={() => setIsWarfarin(!isWarfarin)}
                        activeOpacity={0.8}
                        className={`p-4 rounded-2xl border flex-row items-center justify-between ${isWarfarin ? 'bg-amber-50/70 border-amber-400' : 'bg-slate-50 border-slate-200/70'}`}
                    >
                        <View className="flex-row items-center gap-3 flex-1 mr-2">
                            <Feather name="alert-circle" size={18} color={isWarfarin ? '#D97706' : '#64748B'} />
                            <Text style={{ fontFamily: 'Kanit_500Medium' }} className={`text-xs flex-1 ${isWarfarin ? 'text-amber-900' : 'text-slate-700'}`}>
                                ผู้ป่วยรับประทานยา Warfarin (จำกัดผักใบเขียวที่มีวิตามิน K สูง)
                            </Text>
                        </View>
                        <View className={`w-5 h-5 rounded-lg border items-center justify-center ${isWarfarin ? 'bg-amber-600 border-amber-600' : 'border-slate-300'}`}>
                            {isWarfarin && <Feather name="check" size={12} color="#FFFFFF" />}
                        </View>
                    </TouchableOpacity>
                </View>

                {/* Save Button */}
                <TouchableOpacity
                    onPress={handleSave}
                    activeOpacity={0.9}
                    className="bg-blue-600 py-4 rounded-2xl items-center shadow-lg border border-blue-400/30 mb-12"
                    style={{
                        shadowColor: '#2563EB',
                        shadowOffset: { width: 0, height: 4 },
                        shadowOpacity: 0.3,
                        shadowRadius: 10,
                        elevation: 6,
                    }}
                >
                    <Text style={{ fontFamily: 'Kanit_600SemiBold' }} className="text-white text-base">
                        {isEditing ? 'บันทึกการแก้ไขข้อมูลผู้ป่วย' : 'บันทึกประวัติและคำนวณโควตาสารอาหาร'}
                    </Text>
                </TouchableOpacity>
            </ScrollView>

            <Modal
                visible={Boolean(dialog)}
                transparent
                animationType="fade"
                onRequestClose={closeDialog}
            >
                <View className="flex-1 bg-slate-950/45 items-center justify-center px-6">
                    <View className="w-full max-w-sm bg-white rounded-3xl p-6 border border-slate-100 shadow-xl">
                        <View className={`w-14 h-14 rounded-2xl items-center justify-center mb-4 ${dialog?.tone === 'success' ? 'bg-emerald-100' : 'bg-red-100'}`}>
                            <Feather
                                name={dialog?.tone === 'success' ? 'check' : 'alert-circle'}
                                size={28}
                                color={dialog?.tone === 'success' ? '#059669' : '#DC2626'}
                            />
                        </View>
                        <Text style={{ fontFamily: 'Kanit_700Bold' }} className="text-xl text-slate-900">
                            {dialog?.title}
                        </Text>
                        <Text style={{ fontFamily: 'Kanit_400Regular' }} className="text-sm text-slate-600 mt-2 leading-5">
                            {dialog?.message}
                        </Text>
                        <TouchableOpacity
                            onPress={closeDialog}
                            activeOpacity={0.85}
                            className={`rounded-2xl py-3.5 items-center mt-5 ${dialog?.tone === 'success' ? 'bg-emerald-600' : 'bg-blue-600'}`}
                        >
                            <Text style={{ fontFamily: 'Kanit_600SemiBold' }} className="text-white text-base">
                                ตกลง
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
}