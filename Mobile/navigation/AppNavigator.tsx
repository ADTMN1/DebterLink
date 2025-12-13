/* eslint-disable import/no-unresolved */
import React, { useState, useEffect } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { 
  createDrawerNavigator, 
  DrawerNavigationProp,
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem
} from "@react-navigation/drawer";
import { CompositeNavigationProp } from "@react-navigation/native";
import { Feather } from "@expo/vector-icons";
import { View, TouchableOpacity } from 'react-native';
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

// Custom Drawer Content with Logout Button
function CustomDrawerContent(props: any) {
  const { logout } = useAuth();
  const theme = useTheme()?.theme || Colors.light;
  
  return (
    <DrawerContentScrollView 
      {...props} 
      contentContainerStyle={{ flex: 1, justifyContent: 'space-between' }}
    >
      <View>
        <DrawerItemList {...props} />
      </View>
      <View>
        <DrawerItem
          label="Logout"
          onPress={async () => {
            try {
              await logout();
            } catch (error) {
              console.error('Logout error:', error);
            }
          }}
          icon={({ color, size }) => (
            <Feather name="log-out" size={size} color={color} />
          )}
          labelStyle={{ marginLeft: -8, color: theme.text }}
        />
      </View>
    </DrawerContentScrollView>
  );
}

function createRoleDrawer(Main: React.ComponentType<any>, drawerTintColor?: string) {
  return function RoleDrawer() {
    const themeResult = useTheme();
    const theme = themeResult?.theme || Colors.light;

    return (
      <KeyboardProvider>
        <Drawer.Navigator
          screenOptions={{
            headerShown: true,
            drawerActiveTintColor: drawerTintColor,
            drawerInactiveTintColor: theme.text,
            drawerStyle: { 
              backgroundColor: theme.backgroundRoot,
              width: '70%'
            },
            drawerLabelStyle: { 
              marginLeft: 20,  // Increased from -15 to create space after the icon
              fontSize: 16,
              fontWeight: '500',  // Make text slightly bolder
            },
            drawerItemStyle: {
              marginVertical: 4,  // Add vertical spacing between items
              borderRadius: 8,    // Rounded corners for items
              paddingVertical: 8,  // Vertical padding for better touch targets
            },
            headerStyle: {
              backgroundColor: theme.backgroundRoot,
            },
            headerTintColor: theme.text,
          }}
          drawerContent={(props) => <CustomDrawerContent {...props} />}
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

// Tab Navigator for Teachers
const TeacherTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Feather.glyphMap = 'home';
          
          if (route.name === 'Dashboard') {
            iconName = 'home';
          } else if (route.name === 'Attendance') {
            iconName = 'check-square';
          } else if (route.name === 'Assignments') {
            iconName = 'book';
          } else if (route.name === 'Messages') {
            iconName = 'message-square';
          } else if (route.name === 'Resources') {
            iconName = 'folder';
          }

          return <Feather name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: RoleColors.teacher,
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen 
        name="Dashboard" 
        component={TeacherDashboardScreen} 
        options={{ headerShown: false }}
      />
      <Tab.Screen 
        name="Attendance" 
        component={AttendanceScreen} 
        options={{ headerShown: false }}
      />
      <Tab.Screen 
        name="Assignments" 
        component={AssignmentsScreen} 
        options={{ headerShown: false }}
      />
      <Tab.Screen 
        name="Messages" 
        component={MessagesScreen} 
        options={{ headerShown: false }}
      />
      <Tab.Screen 
        name="Resources" 
        component={ResourcesScreen} 
        options={{ headerShown: false }}
      />
    </Tab.Navigator>
  );
};

// Tab Navigator for Students
const StudentTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Feather.glyphMap = 'home';
          
          if (route.name === 'Dashboard') {
            iconName = 'home';
          } else if (route.name === 'Assignments') {
            iconName = 'book';
          } else if (route.name === 'Messages') {
            iconName = 'message-square';
          } else if (route.name === 'Resources') {
            iconName = 'folder';
          }

          return <Feather name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: RoleColors.student,
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen 
        name="Dashboard" 
        component={StudentDashboardScreen} 
        options={{ headerShown: false }}
      />
      <Tab.Screen 
        name="Assignments" 
        component={AssignmentsScreen} 
        options={{ headerShown: false }}
      />
      <Tab.Screen 
        name="Messages" 
        component={MessagesScreen} 
        options={{ headerShown: false }}
      />
      <Tab.Screen 
        name="Resources" 
        component={ResourcesScreen} 
        options={{ headerShown: false }}
      />
    </Tab.Navigator>
  );
};

// Tab Navigator for Parents
const ParentTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Feather.glyphMap = 'home';
          
          if (route.name === 'Dashboard') {
            iconName = 'home';
          } else if (route.name === 'Attendance') {
            iconName = 'check-square';
          } else if (route.name === 'Messages') {
            iconName = 'message-square';
          }

          return <Feather name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: RoleColors.parent,
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen 
        name="Dashboard" 
        component={ParentDashboardScreen} 
        options={{ headerShown: false }}
      />
      <Tab.Screen 
        name="Attendance" 
        component={AttendanceScreen} 
        options={{ headerShown: false }}
      />
      <Tab.Screen 
        name="Messages" 
        component={MessagesScreen} 
        options={{ headerShown: false }}
      />
    </Tab.Navigator>
  );
};

// Stack Navigator for Director/Admin
const DirectorNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="DirectorDashboard" component={DirectorDashboardScreen} />
    </Stack.Navigator>
  );
};

// Stack Navigator for Super Admin
const SuperAdminNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="SuperAdminDashboard" component={SuperAdminScreen} />
    </Stack.Navigator>
  );
};

// Export the AppNavigator component
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

  // Create drawer navigators with proper typing
  const TeacherDrawer = createRoleDrawer(TeacherTabs, RoleColors.teacher);
  const StudentDrawer = createRoleDrawer(StudentTabs, RoleColors.student);
  const ParentDrawer = createRoleDrawer(ParentTabs, RoleColors.parent);
  const DirectorDrawer = createRoleDrawer(DirectorNavigator, RoleColors.director);
  const SuperAdminDrawer = createRoleDrawer(SuperAdminNavigator, RoleColors.superAdmin);

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