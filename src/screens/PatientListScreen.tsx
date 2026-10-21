import React from 'react';
import { Alert, RefreshControl, View, Text, FlatList, TouchableOpacity, TextInput } from 'react-native';
import { Feather, FontAwesome5, Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { usePatientStore } from '../store/usePatientStore';

export function PatientListScreen({ navigation }: any) {
    const {
        patients,
        setSelectedPatient,
        deletePatient,
        loadPatients,
        isLoadingPatients,
        patientLoadError,
    } = usePatientStore();
    const [searchQuery, setSearchQuery] = React.useState('');

    useFocusEffect(
        React.useCallback(() => {
            void loadPatients();
        }, [loadPatients])
    );

    const handleSelectPatient = (id: string) => {
        setSelectedPatient(id);
        navigation.navigate('PatientDietWorkspace');
    };

    const handleDeletePatient = (id: string, name: string) => {
        Alert.alert(
            'ลบข้อมูลผู้ป่วย',
            `ต้องการลบข้อมูลของ ${name} และรายการอาหารทั้งหมดหรือไม่`,
            [
                { text: 'ยกเลิก', style: 'cancel' },
                { text: 'ลบข้อมูล', style: 'destructive', onPress: () => deletePatient(id) },
            ]
        );
    };

    const filteredPatients = patients.filter(
        p => p.name.includes(searchQuery) || p.hn.includes(searchQuery) || p.ward.includes(searchQuery)
    );

    return (
        <View className="flex-1 bg-slate-50">
            {/* Modern Header Banner */}
            <View className="bg-blue-600 pt-14 pb-6 px-5 rounded-b-3xl shadow-lg">
                <View className="flex-row justify-between items-center mb-4">
                    <View>
                        <View className="flex-row items-center gap-2">
                            <Ionicons name="medical" size={18} color="#93C5FD" />
                            <Text style={{ fontFamily: 'Kanit_700Bold' }} className="text-white text-2xl tracking-tight">
                                รายชื่อผู้ป่วยในความดูแล
                            </Text>
                        </View>
                        <Text style={{ fontFamily: 'Kanit_400Regular' }} className="text-blue-100 text-xs mt-0.5">
                            Dietitian Clinical Co-pilot • {patients.length} รายในระบบ
                        </Text>
                    </View>
                    <TouchableOpacity
                        onPress={() => navigation.navigate('AddPatient')}
                        className="bg-white/20 p-2.5 rounded-2xl border border-white/30 active:bg-white/30"
                    >
                        <Feather name="user-plus" size={20} color="#FFFFFF" />
                    </TouchableOpacity>
                </View>

                {/* Search Bar */}
                <View className="bg-white/10 flex-row items-center px-3.5 py-2.5 rounded-2xl border border-white/20">
                    <Feather name="search" size={18} color="#93C5FD" className="mr-2" />
                    <TextInput
                        placeholder="ค้นหาชื่อผู้ป่วย, HN, หรือ Ward..."
                        placeholderTextColor="#93C5FD"
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        style={{ fontFamily: 'Kanit_400Regular' }}
                        className="flex-1 text-white text-sm py-0"
                    />
                    {searchQuery.length > 0 && (
                        <TouchableOpacity onPress={() => setSearchQuery('')}>
                            <Feather name="x" size={16} color="#93C5FD" />
                        </TouchableOpacity>
                    )}
                </View>
            </View>

            {/* Patient Cards List */}
            <FlatList
                data={filteredPatients}
                keyExtractor={(item) => item.id}
                contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
                showsVerticalScrollIndicator={false}
                refreshControl={(
                    <RefreshControl
                        refreshing={isLoadingPatients}
                        onRefresh={() => void loadPatients()}
                        tintColor="#2563EB"
                        colors={["#2563EB"]}
                    />
                )}
                ListHeaderComponent={patientLoadError ? (
                    <View className="bg-red-50 border border-red-200 rounded-xl px-3 py-2 mb-3">
                        <Text style={{ fontFamily: 'Kanit_400Regular' }} className="text-xs text-red-700">
                            {patientLoadError}
                        </Text>
                        <TouchableOpacity onPress={() => void loadPatients()} className="mt-2 self-start bg-red-600 px-3 py-1.5 rounded-lg">
                            <Text style={{ fontFamily: 'Kanit_600SemiBold' }} className="text-xs text-white">
                                ลองโหลดใหม่
                            </Text>
                        </TouchableOpacity>
                    </View>
                ) : null}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        onPress={() => handleSelectPatient(item.id)}
                        activeOpacity={0.8}
                        className="bg-white rounded-2xl p-4 mb-3.5 border border-slate-100 shadow-sm active:border-blue-300"
                        style={{
                            shadowColor: '#0F172A',
                            shadowOffset: { width: 0, height: 2 },
                            shadowOpacity: 0.04,
                            shadowRadius: 8,
                            elevation: 2,
                        }}
                    >
                        <View className="flex-row items-center justify-between mb-3">
                            <View className="flex-row items-center flex-1">
                                <View className="w-12 h-12 rounded-2xl bg-blue-50 items-center justify-center mr-3.5 border border-blue-100">
                                    <FontAwesome5 name="user-alt" size={18} color="#2563EB" />
                                </View>
                                <View className="flex-1">
                                    <View className="flex-row items-center gap-2">
                                        <Text style={{ fontFamily: 'Kanit_600SemiBold' }} className="text-base text-slate-900">
                                            {item.name}
                                        </Text>
                                        <View className="bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200">
                                            <Text style={{ fontFamily: 'Kanit_500Medium' }} className="text-[10px] text-slate-600">
                                                {item.hn}
                                            </Text>
                                        </View>
                                    </View>
                                    <Text style={{ fontFamily: 'Kanit_400Regular' }} className="text-xs text-slate-500 mt-0.5">
                                        อายุ {item.age} ปี ({item.gender === 'male' ? 'ชาย' : 'หญิง'}) • {item.ward} {item.bed}
                                    </Text>
                                </View>
                            </View>
                            <View className="flex-row items-center gap-2">
                                <TouchableOpacity
                                    onPress={() => navigation.navigate('AddPatient', { patientId: item.id })}
                                    className="bg-blue-50 p-2 rounded-xl border border-blue-100"
                                    accessibilityLabel={`แก้ไขข้อมูล ${item.name}`}
                                >
                                    <Feather name="edit-2" size={16} color="#2563EB" />
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={() => handleDeletePatient(item.id, item.name)}
                                    className="bg-red-50 p-2 rounded-xl border border-red-100"
                                    accessibilityLabel={`ลบข้อมูล ${item.name}`}
                                >
                                    <Feather name="trash-2" size={16} color="#DC2626" />
                                </TouchableOpacity>
                            </View>
                        </View>

                        {/* Disease Badges */}
                        <View className="flex-row flex-wrap gap-1.5 pt-1 border-t border-slate-100">
                            {item.diseases.map((disease, idx) => (
                                <View key={idx} className="bg-blue-50 border border-blue-100 px-2.5 py-1 rounded-lg">
                                    <Text style={{ fontFamily: 'Kanit_500Medium' }} className="text-blue-700 text-[11px]">
                                        {disease}
                                    </Text>
                                </View>
                            ))}
                        </View>

                        {/* Alert Tag */}
                        {item.medicationAlert && (
                            <View className="mt-2.5 bg-amber-50 border border-amber-200/70 px-3 py-1.5 rounded-xl flex-row items-center gap-1.5">
                                <Feather name="alert-circle" size={14} color="#D97706" />
                                <Text style={{ fontFamily: 'Kanit_500Medium' }} className="text-amber-800 text-xs flex-1">
                                    {item.medicationAlert}
                                </Text>
                            </View>
                        )}
                    </TouchableOpacity>
                )}
            />

            {/* Floating Add Patient Button */}
            <TouchableOpacity
                onPress={() => navigation.navigate('AddPatient')}
                activeOpacity={0.9}
                className="absolute bottom-6 right-6 bg-blue-600 px-5 py-3.5 rounded-2xl flex-row items-center gap-2 shadow-xl border border-blue-400/30"
                style={{
                    shadowColor: '#2563EB',
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.35,
                    shadowRadius: 10,
                    elevation: 8,
                }}
            >
                <Feather name="plus-circle" size={20} color="#FFFFFF" />
                <Text style={{ fontFamily: 'Kanit_600SemiBold' }} className="text-white text-sm">
                    เพิ่มผู้ป่วยใหม่
                </Text>
            </TouchableOpacity>
        </View>
    );
}