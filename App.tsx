import React, { useEffect } from 'react';
import { View, Text, TextInput, ActivityIndicator } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Feather, FontAwesome5, Ionicons } from '@expo/vector-icons';
import {
  useFonts,
  Kanit_400Regular,
  Kanit_500Medium,
  Kanit_600SemiBold,
  Kanit_700Bold,
} from '@expo-google-fonts/kanit';

// Import Screens
import { PatientListScreen } from './src/screens/PatientListScreen';
import { AddPatientScreen } from './src/screens/AddPatientScreen';
import { PatientDietWorkspaceScreen } from './src/screens/PatientDeitWorkspaceScreen';
import { MealEvaluationScreen } from './src/screens/DietitionReviewScreen';

export type RootStackParamList = {
  MainTabs: undefined;
  AddPatient: undefined;
};

export type MainTabParamList = {
  PatientList: undefined;
  PatientDietWorkspace: undefined;
  MealEvaluation: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();
const queryClient = new QueryClient();

// Keep Thai typography consistent across screens and native navigation labels.
(Text as any).defaultProps = {
  ...(Text as any).defaultProps,
  style: [{ fontFamily: 'Kanit_400Regular' }, (Text as any).defaultProps?.style],
};
(TextInput as any).defaultProps = {
  ...(TextInput as any).defaultProps,
  style: [{ fontFamily: 'Kanit_400Regular' }, (TextInput as any).defaultProps?.style],
};

function MainTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#2563EB',
        tabBarInactiveTintColor: '#64748B',
        tabBarStyle: {
          height: 70,
          paddingBottom: 12,
          paddingTop: 8,
          backgroundColor: '#FFFFFF',
          borderTopWidth: 1,
          borderTopColor: '#F1F5F9',
          elevation: 12,
          shadowColor: '#0F172A',
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 0.06,
          shadowRadius: 10,
        },
        tabBarLabelStyle: {
          fontFamily: 'Kanit_500Medium',
          fontSize: 12,
          marginTop: 2,
        },
      }}
    >
      <Tab.Screen
        name="PatientList"
        component={PatientListScreen}
        options={{
          tabBarLabel: 'รายชื่อผู้ป่วย',
          tabBarIcon: ({ color, size, focused }) => (
            <View className={`p-1.5 rounded-xl ${focused ? 'bg-blue-50' : ''}`}>
              <FontAwesome5 name="user-friends" size={size - 4} color={color} />
            </View>
          ),
        }}
      />

      <Tab.Screen
        name="PatientDietWorkspace"
        component={PatientDietWorkspaceScreen}
        options={{
          tabBarLabel: 'จัดโภชนาการ',
          tabBarIcon: ({ color, size, focused }) => (
            <View className={`p-1.5 rounded-xl ${focused ? 'bg-blue-50' : ''}`}>
              <FontAwesome5 name="utensils" size={size - 4} color={color} />
            </View>
          ),
        }}
      />

      <Tab.Screen
        name="MealEvaluation"
        component={MealEvaluationScreen}
        options={{
          tabBarLabel: 'วิเคราะห์ AI',
          tabBarIcon: ({ color, size, focused }) => (
            <View className={`p-1.5 rounded-xl ${focused ? 'bg-blue-50' : ''}`}>
              <Ionicons name="sparkles" size={size} color={focused ? '#2563EB' : color} />
            </View>
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  const [fontsLoaded] = useFonts({
    Kanit_400Regular,
    Kanit_500Medium,
    Kanit_600SemiBold,
    Kanit_700Bold,
  });

  useEffect(() => {
    void import('./src/store/usePatientStore').then(({ usePatientStore }) => usePatientStore.getState().loadPatients());
  }, []);

  if (!fontsLoaded) {
    return (
      <View className="flex-1 items-center justify-center bg-slate-50">
        <ActivityIndicator size="large" color="#2563EB" />
      </View>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaProvider>
        <NavigationContainer>
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="MainTabs" component={MainTabNavigator} />
            <Stack.Screen
              name="AddPatient"
              component={AddPatientScreen}
              options={{ presentation: 'modal' }}
            />
          </Stack.Navigator>
        </NavigationContainer>
        <StatusBar style="dark" />
      </SafeAreaProvider>
    </QueryClientProvider>
  );
}