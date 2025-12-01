import React, { useState, useEffect } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { Feather } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../hooks/useTheme';
import { RoleColors, Colors } from '../constants/theme';

import SplashScreen from '../screens/SplashScreen';
import LanguageSelectionScreen from '../screens/LanguageSelectionScreen';
import LoginScreen from '../screens/LoginScreen';
import TeacherDashboardScreen from '../screens/TeacherDashboardScreen';
import StudentDashboardScreen from '../screens/StudentDashboardScreen';
import ParentDashboardScreen from '../screens/ParentDashboardScreen';
import DirectorDashboardScreen from '../screens/DirectorDashboardScreen';
import AttendanceScreen from '../screens/AttendanceScreen';
import AssignmentsScreen from '../screens/AssignmentsScreen';
import MessagesScreen from '../screens/MessagesScreen';
import ResourcesScreen from '../screens/ResourcesScreen';
import ProfileScreen from '../screens/ProfileScreen';
import SuperAdminScreen from '../screens/SuperAdminScreen';
import SettingsScreen from '../screens/SettingsScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();

function createRoleDrawer(Main: React.ComponentType<any>, drawerTintColor?: string) {
  return function RoleDrawer() {
    const themeResult = useTheme();
    const theme = (themeResult && themeResult.theme) ? themeResult.theme : Colors.light;

    return (
      <Drawer.Navigator
        screenOptions={{
          headerShown: false,
          drawerActiveTintColor: drawerTintColor || undefined,
          drawerStyle: { backgroundColor: theme?.backgroundRoot || Colors.light.backgroundRoot },
        }}
      >
        <Drawer.Screen
          name="Home"
          component={Main}
          options={{ drawerIcon: ({ color, size }) => <Feather name="home" size={size} color={color} /> }}
        />
        <Drawer.Screen
          name="Profile"
          component={ProfileScreen}
          options={{ drawerIcon: ({ color, size }) => <Feather name="user" size={size} color={color} /> }}
        />
        <Drawer.Screen
          name="Settings"
          component={SettingsScreen}
          options={{ drawerIcon: ({ color, size }) => <Feather name="settings" size={size} color={color} /> }}
        />
      </Drawer.Navigator>
    );
  };
}

function TeacherTabs() {
  const themeResult = useTheme();
  const theme = (themeResult && themeResult.theme) ? themeResult.theme : Colors.light;

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: RoleColors.teacher,
        tabBarInactiveTintColor: theme?.tabIconDefault || Colors.light.tabIconDefault,
        tabBarStyle: {
          backgroundColor: theme?.backgroundRoot || Colors.light.backgroundRoot,
          borderTopColor: theme?.border || Colors.light.border,
        },
        headerStyle: {
          backgroundColor: theme?.backgroundRoot || Colors.light.backgroundRoot,
        },
        headerTintColor: theme?.text || Colors.light.text,
      }}
    >
      <Tab.Screen
        name="Dashboard"
        component={TeacherDashboardScreen}
        options={{
          tabBarIcon: ({ color, size }) => <Feather name="home" size={size} color={color} />,
          title: 'ደብተርLink',
        }}
      />
      <Tab.Screen
        name="Attendance"
        component={AttendanceScreen}
        options={{
          tabBarIcon: ({ color, size }) => <Feather name="check-circle" size={size} color={color} />,
        }}
      />
      <Tab.Screen
        name="Messages"
        component={MessagesScreen}
        options={{
          tabBarIcon: ({ color, size }) => <Feather name="message-circle" size={size} color={color} />,
        }}
      />
      <Tab.Screen
        name="Resources"
        component={ResourcesScreen}
        options={{
          tabBarIcon: ({ color, size }) => <Feather name="book" size={size} color={color} />,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ color, size }) => <Feather name="user" size={size} color={color} />,
        }}
      />
    </Tab.Navigator>
  );
}

function StudentTabs() {
  const themeResult = useTheme();
  const theme = (themeResult && themeResult.theme) ? themeResult.theme : Colors.light;

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: RoleColors.student,
        tabBarInactiveTintColor: theme?.tabIconDefault || Colors.light.tabIconDefault,
        tabBarStyle: {
          backgroundColor: theme?.backgroundRoot || Colors.light.backgroundRoot,
          borderTopColor: theme?.border || Colors.light.border,
        },
        headerStyle: {
          backgroundColor: theme?.backgroundRoot || Colors.light.backgroundRoot,
        },
        headerTintColor: theme?.text || Colors.light.text,
      }}
    >
      <Tab.Screen
        name="Home"
        component={StudentDashboardScreen}
        options={{
          tabBarIcon: ({ color, size }) => <Feather name="home" size={size} color={color} />,
          title: 'ደብተርLink',
        }}
      />
      <Tab.Screen
        name="Assignments"
        component={AssignmentsScreen}
        options={{
          tabBarIcon: ({ color, size }) => <Feather name="file-text" size={size} color={color} />,
        }}
      />
      <Tab.Screen
        name="Results"
        component={AssignmentsScreen}
        options={{
          tabBarIcon: ({ color, size }) => <Feather name="award" size={size} color={color} />,
        }}
      />
      <Tab.Screen
        name="Resources"
        component={ResourcesScreen}
        options={{
          tabBarIcon: ({ color, size }) => <Feather name="book" size={size} color={color} />,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ color, size }) => <Feather name="user" size={size} color={color} />,
        }}
      />
    </Tab.Navigator>
  );
}

function ParentTabs() {
  const themeResult = useTheme();
  const theme = (themeResult && themeResult.theme) ? themeResult.theme : Colors.light;

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: RoleColors.parent,
        tabBarInactiveTintColor: theme?.tabIconDefault || Colors.light.tabIconDefault,
        tabBarStyle: {
          backgroundColor: theme?.backgroundRoot || Colors.light.backgroundRoot,
          borderTopColor: theme?.border || Colors.light.border,
        },
        headerStyle: {
          backgroundColor: theme?.backgroundRoot || Colors.light.backgroundRoot,
        },
        headerTintColor: theme?.text || Colors.light.text,
      }}
    >
      <Tab.Screen
        name="Overview"
        component={ParentDashboardScreen}
        options={{
          tabBarIcon: ({ color, size }) => <Feather name="home" size={size} color={color} />,
          title: 'ደብተርLink',
        }}
      />
      <Tab.Screen
        name="Messages"
        component={MessagesScreen}
        options={{
          tabBarIcon: ({ color, size }) => <Feather name="message-circle" size={size} color={color} />,
        }}
      />
      <Tab.Screen
        name="Reports"
        component={AssignmentsScreen}
        options={{
          tabBarIcon: ({ color, size }) => <Feather name="bar-chart-2" size={size} color={color} />,
        }}
      />
      <Tab.Screen
        name="Calendar"
        component={ResourcesScreen}
        options={{
          tabBarIcon: ({ color, size }) => <Feather name="calendar" size={size} color={color} />,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ color, size }) => <Feather name="user" size={size} color={color} />,
        }}
      />
    </Tab.Navigator>
  );
}

function DirectorNavigator() {
  const themeResult = useTheme();
  const theme = (themeResult && themeResult.theme) ? themeResult.theme : Colors.light;

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: theme?.backgroundRoot || Colors.light.backgroundRoot,
        },
        headerTintColor: theme?.text || Colors.light.text,
      }}
    >
      <Stack.Screen
        name="Dashboard"
        component={DirectorDashboardScreen}
        options={{ title: 'ደብተርLink - Director' }}
      />
    </Stack.Navigator>
  );
}

function SuperAdminNavigator() {
  const themeResult = useTheme();
  const theme = (themeResult && themeResult.theme) ? themeResult.theme : Colors.light;

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: theme?.backgroundRoot || Colors.light.backgroundRoot,
        },
        headerTintColor: theme?.text || Colors.light.text,
      }}
    >
      <Stack.Screen
        name="SuperAdmin"
        component={SuperAdminScreen}
        options={{ title: 'ደብተርLink – National Command' }}
      />
    </Stack.Navigator>
  );
}

// Create drawer wrappers for each role's main navigator so app shows a drawer
const TeacherDrawer = createRoleDrawer(TeacherTabs, RoleColors.teacher);
const StudentDrawer = createRoleDrawer(StudentTabs, RoleColors.student);
const ParentDrawer = createRoleDrawer(ParentTabs, RoleColors.parent);
const DirectorDrawer = createRoleDrawer(DirectorNavigator, RoleColors.director);
const SuperAdminDrawer = createRoleDrawer(SuperAdminNavigator, RoleColors.superAdmin);

export default function AppNavigator() {
  const { user } = useAuth();
  const [showSplash, setShowSplash] = useState(true);
  const [showLanguage, setShowLanguage] = useState(false);

  // Reset splash and language when user logs out
  useEffect(() => {
    if (!user) {
      setShowSplash(false);
      setShowLanguage(false);
    }
  }, [user]);

  if (showSplash && user) {
    return <SplashScreen onComplete={() => {
      setShowSplash(false);
      setShowLanguage(true);
    }} />;
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
    case 'teacher':
      return <TeacherDrawer />;
    case 'student':
      return <StudentDrawer />;
    case 'parent':
      return <ParentDrawer />;
    case 'director':
    case 'admin':
      return <DirectorDrawer />;
    case 'director':
      return <DirectorDrawer />;
    case 'superAdmin':
      return <SuperAdminDrawer />;
    default:
      return null;
  }
}
