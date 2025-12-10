/* eslint-disable import/no-unresolved */
import React, { useState, useEffect } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { Feather } from "@expo/vector-icons";
import { useAuth } from "../contexts/AuthContext";
import { useTheme } from "../hooks/useTheme";
import { RoleColors, Colors } from "../constants/theme";
import { KeyboardProvider } from "react-native-keyboard-controller";

import SplashScreen from "../screens/SplashScreen";
import LanguageSelectionScreen from "../screens/LanguageSelectionScreen";
import LoginScreen from "../screens/LoginScreen";
import TeacherDashboardScreen from "../screens/TeacherDashboardScreen";
import StudentDashboardScreen from "../screens/StudentDashboardScreen";
import ParentDashboardScreen from "../screens/ParentDashboardScreen";
import DirectorDashboardScreen from "../screens/DirectorDashboardScreen";
import AttendanceScreen from "../screens/AttendanceScreen";
import AssignmentsScreen from "../screens/AssignmentsScreen";
import MessagesScreen from "../screens/MessagesScreen";
import ResourcesScreen from "../screens/ResourcesScreen";
import ProfileScreen from "../screens/ProfileScreen";
import SuperAdminScreen from "../screens/SuperAdminScreen";
import SettingsScreen from "../screens/SettingsScreen";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();

function createRoleDrawer(Main: React.ComponentType<any>, drawerTintColor?: string) {
  return function RoleDrawer() {
    const themeResult = useTheme();
    const theme = themeResult?.theme || Colors.light;

    return (
      <KeyboardProvider>
        <Drawer.Navigator
          screenOptions={{
            headerShown: false,
            drawerActiveTintColor: drawerTintColor || undefined,
            drawerStyle: { backgroundColor: theme.backgroundRoot },
          }}
        >
          <Drawer.Screen
            name="HomeDrawer"
            component={Main}
            options={{
              drawerIcon: ({ color, size }) => <Feather name="home" size={size} color={color} />,
              title: "Home",
            }}
          />
          <Drawer.Screen
            name="ProfileDrawer"
            component={ProfileScreen}
            options={{
              drawerIcon: ({ color, size }) => <Feather name="user" size={size} color={color} />,
              title: "Profile",
            }}
          />
          <Drawer.Screen
            name="SettingsDrawer"
            component={SettingsScreen}
            options={{
              drawerIcon: ({ color, size }) => <Feather name="settings" size={size} color={color} />,
              title: "Settings",
            }}
          />
        </Drawer.Navigator>
      </KeyboardProvider>
    );
  };
}

function TeacherTabs() {
  const themeResult = useTheme();
  const theme = themeResult?.theme || Colors.light;

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: RoleColors.teacher,
        tabBarInactiveTintColor: theme.tabIconDefault,
        tabBarStyle: { backgroundColor: theme.backgroundRoot, borderTopColor: theme.border },
        headerStyle: { backgroundColor: theme.backgroundRoot },
        headerTintColor: theme.text,
      }}
    >
      <Tab.Screen
        name="TeacherDashboard"
        component={TeacherDashboardScreen}
        options={{ tabBarIcon: ({ color, size }) => <Feather name="home" size={size} color={color} />, title: "ደብተርLink" }}
      />
      <Tab.Screen
        name="TeacherAttendance"
        component={AttendanceScreen}
        options={{ tabBarIcon: ({ color, size }) => <Feather name="check-circle" size={size} color={color} /> }}
      />
      <Tab.Screen
        name="TeacherMessages"
        component={MessagesScreen}
        options={{ tabBarIcon: ({ color, size }) => <Feather name="message-circle" size={size} color={color} /> }}
      />
      <Tab.Screen
        name="TeacherResources"
        component={ResourcesScreen}
        options={{ tabBarIcon: ({ color, size }) => <Feather name="book" size={size} color={color} /> }}
      />
      <Tab.Screen
        name="TeacherProfile"
        component={ProfileScreen}
        options={{ tabBarIcon: ({ color, size }) => <Feather name="user" size={size} color={color} /> }}
      />
    </Tab.Navigator>
  );
}

function StudentTabs() {
  const themeResult = useTheme();
  const theme = themeResult?.theme || Colors.light;

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: RoleColors.student,
        tabBarInactiveTintColor: theme.tabIconDefault,
        tabBarStyle: { backgroundColor: theme.backgroundRoot, borderTopColor: theme.border },
        headerStyle: { backgroundColor: theme.backgroundRoot },
        headerTintColor: theme.text,
      }}
    >
      <Tab.Screen
        name="StudentHome"
        component={StudentDashboardScreen}
        options={{ tabBarIcon: ({ color, size }) => <Feather name="home" size={size} color={color} />, title: "ደብተርLink" }}
      />
      <Tab.Screen
        name="StudentAssignments"
        component={AssignmentsScreen}
        options={{ tabBarIcon: ({ color, size }) => <Feather name="file-text" size={size} color={color} /> }}
      />
      <Tab.Screen
        name="StudentResults"
        component={AssignmentsScreen}
        options={{ tabBarIcon: ({ color, size }) => <Feather name="award" size={size} color={color} /> }}
      />
      <Tab.Screen
        name="StudentResources"
        component={ResourcesScreen}
        options={{ tabBarIcon: ({ color, size }) => <Feather name="book" size={size} color={color} /> }}
      />
      <Tab.Screen
        name="StudentProfile"
        component={ProfileScreen}
        options={{ tabBarIcon: ({ color, size }) => <Feather name="user" size={size} color={color} /> }}
      />
    </Tab.Navigator>
  );
}

function ParentTabs() {
  const themeResult = useTheme();
  const theme = themeResult?.theme || Colors.light;

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: RoleColors.parent,
        tabBarInactiveTintColor: theme.tabIconDefault,
        tabBarStyle: { backgroundColor: theme.backgroundRoot, borderTopColor: theme.border },
        headerStyle: { backgroundColor: theme.backgroundRoot },
        headerTintColor: theme.text,
      }}
    >
      <Tab.Screen
        name="ParentOverview"
        component={ParentDashboardScreen}
        options={{ tabBarIcon: ({ color, size }) => <Feather name="home" size={size} color={color} />, title: "ደብተርLink" }}
      />
      <Tab.Screen
        name="ParentMessages"
        component={MessagesScreen}
        options={{ tabBarIcon: ({ color, size }) => <Feather name="message-circle" size={size} color={color} /> }}
      />
      <Tab.Screen
        name="ParentReports"
        component={AssignmentsScreen}
        options={{ tabBarIcon: ({ color, size }) => <Feather name="bar-chart-2" size={size} color={color} /> }}
      />
      <Tab.Screen
        name="ParentCalendar"
        component={ResourcesScreen}
        options={{ tabBarIcon: ({ color, size }) => <Feather name="calendar" size={size} color={color} /> }}
      />
      <Tab.Screen
        name="ParentProfile"
        component={ProfileScreen}
        options={{ tabBarIcon: ({ color, size }) => <Feather name="user" size={size} color={color} /> }}
      />
    </Tab.Navigator>
  );
}

function DirectorNavigator() {
  const themeResult = useTheme();
  const theme = themeResult?.theme || Colors.light;

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: theme.backgroundRoot },
        headerTintColor: theme.text,
      }}
    >
      <Stack.Screen
        name="DirectorDashboard"
        component={DirectorDashboardScreen}
        options={{ title: "ደብተርLink - Director" }}
      />
    </Stack.Navigator>
  );
}

function SuperAdminNavigator() {
  const themeResult = useTheme();
  const theme = themeResult?.theme || Colors.light;

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: theme.backgroundRoot },
        headerTintColor: theme.text,
      }}
    >
      <Stack.Screen
        name="SuperAdmin"
        component={SuperAdminScreen}
        options={{ title: "ደብተርLink – National Command" }}
      />
    </Stack.Navigator>
  );
}

// Drawer wrappers
const TeacherDrawer = createRoleDrawer(TeacherTabs, RoleColors.teacher);
const StudentDrawer = createRoleDrawer(StudentTabs, RoleColors.student);
const ParentDrawer = createRoleDrawer(ParentTabs, RoleColors.parent);
const DirectorDrawer = createRoleDrawer(DirectorNavigator, RoleColors.director);
const SuperAdminDrawer = createRoleDrawer(SuperAdminNavigator, RoleColors.superAdmin);

export default function AppNavigator() {
  const { user } = useAuth();
  const [showSplash, setShowSplash] = useState(true);
  const [showLanguage, setShowLanguage] = useState(false);

  useEffect(() => {
    if (!user) {
      setShowSplash(false);
      setShowLanguage(false);
    }
  }, [user]);

  if (showSplash && user) {
    return <SplashScreen onComplete={() => { setShowSplash(false); setShowLanguage(true); }} />;
  }

  if (showLanguage && user) {
    return <LanguageSelectionScreen onComplete={() => setShowLanguage(false)} />;
  }

  if (!user) {
    return (
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginScreen} />
      </Stack.Navigator>
    );
  }

  switch (user.role) {
    case "teacher":
      return <TeacherDrawer />;
    case "student":
      return <StudentDrawer />;
    case "parent":
      return <ParentDrawer />;
    case "director":
    case "admin":
      return <DirectorDrawer />;
    case "superAdmin":
      return <SuperAdminDrawer />;
    default:
      return null;
  }
}
