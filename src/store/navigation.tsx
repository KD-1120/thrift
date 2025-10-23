// Navigation Configuration

import React from 'react';
import { View, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useAppSelector } from './hooks';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../design-system/colors';
import { spacing } from '../design-system/spacing';

// Import screens
import SignInScreen from '../features/auth/screens/SignIn';
import SignUpScreen from '../features/auth/screens/SignUp';
import HomeScreen from '../screens/Home';
import ExploreScreen from '../screens/Explore';
import TailorProfileScreen from '../features/tailors/screens/TailorProfile';
import PortfolioScreen from '../features/tailors/screens/Portfolio';
import CreateOrderScreen from '../features/tailors/screens/CreateOrder';
import OrdersListScreen from '../features/orders/screens/OrdersList';
import OrderDetailScreen from '../features/orders/screens/OrderDetail';
import MessagingScreen from '../features/messaging/screens/Messaging';
import ConversationsScreen from '../features/messaging/screens/Conversations';
import AudioCallScreen from '../features/messaging/screens/AudioCall';
import VideoCallScreen from '../features/messaging/screens/VideoCall';
import SettingsScreen from '../screens/Settings';
import OnboardingScreen from '../screens/Onboarding';
import RoleSelectionScreen from '../screens/RoleSelection';
import MediaViewerScreen from '../screens/MediaViewer';  // Now points to modular index.tsx
import CreatorMediaViewerScreen from '../screens/CreatorMediaViewer';

// New customer journey screens
import TailorGalleryScreen from '../screens/TailorGallery';
import ServiceDetailScreen from '../screens/ServiceDetail';
import CategoryBrowseScreen from '../screens/CategoryBrowse';
import BookingFlowScreen from '../screens/BookingFlow';
import MeasurementsInputScreen from '../screens/MeasurementsInput';
import BookingReviewScreen from '../screens/BookingReview';

// Settings screens
import SavedMeasurementsScreen from '../screens/SavedMeasurements';
import AddressesScreen from '../screens/Addresses';
import PaymentMethodsScreen from '../screens/PaymentMethods';
import LanguageScreen from '../screens/Language';
import CurrencyScreen from '../screens/Currency';
import HelpFAQScreen from '../screens/HelpFAQ';
import TermsScreen from '../screens/Terms';
import PrivacyPolicyScreen from '../screens/PrivacyPolicy';

// New tailor screens
import TailorDashboardScreen from '../features/tailors/screens/TailorDashboard';
import TailorProfileManagementScreen from '../features/tailors/screens/TailorProfileManagement';
import PortfolioManagementScreen from '../features/tailors/screens/PortfolioManagement';
import TailorOrdersManagementScreen from '../features/tailors/screens/TailorOrdersManagement';
import TailorAnalyticsScreen from '../features/tailors/screens/TailorAnalytics';
import ReviewManagementScreen from '../features/tailors/screens/ReviewManagement';
import PortfolioAnalyticsScreen from '../features/tailors/screens/PortfolioAnalytics';
import VerificationStatusScreen from '../features/tailors/screens/VerificationStatus';
import ResponseTimeSettingsScreen from '../features/tailors/screens/ResponseTimeSettings';
import TailorSettingsScreen from '../features/tailors/screens/TailorSettings';

// Navigation types
export type AuthStackParamList = {
  Onboarding: undefined;
  RoleSelection: undefined;
  SignIn: undefined;
  SignUp: { role?: 'customer' | 'tailor' };
};

export type MainStackParamList = {
  HomeTabs: undefined;
  TailorProfile: { tailorId: string };
  Portfolio: { tailorId: string };
  CreateOrder: { tailorId: string };
  OrderDetail: { orderId: string };
  Conversations: undefined;
  Messaging: { tailorId?: string; tailorName?: string; conversationId?: string };
  AudioCall: { tailorId: string; tailorName: string; callType: 'in-app' | 'native' };
  VideoCall: { tailorId: string; tailorName: string };
  MediaViewer: { items: any[]; initialIndex: number };
  CreatorMediaViewer: { items: any[]; initialIndex: number };
  TailorGallery: { tailorId: string; tailorName: string };
  ServiceDetail: { serviceId: string; tailorId: string };
  CategoryBrowse: { category: string };
  BookingFlow: { serviceId: string; tailorId: string };
  MeasurementsInput: { bookingData: any };
  BookingReview: { bookingData: any };
  // Settings screens
  SavedMeasurements: undefined;
  Addresses: undefined;
  PaymentMethods: undefined;
  Language: undefined;
  Currency: undefined;
  HelpFAQ: undefined;
  Terms: undefined;
  PrivacyPolicy: undefined;
  // Tailor screens
  TailorDashboard: undefined;
  TailorProfileManagement: undefined;
  PortfolioManagement: undefined;
  TailorOrdersManagement: undefined;
  VerificationStatus: undefined;
  TailorAnalytics: undefined;
  ReviewManagement: undefined;
  PortfolioAnalytics: undefined;
  ResponseTimeSettings: undefined;
};

export type HomeTabsParamList = {
  Home: undefined;
  Explore: undefined;
  Orders: undefined;
  Messages: undefined;
  Settings: undefined;
};

export type TailorTabsParamList = {
  Dashboard: undefined;
  Orders: undefined;
  Portfolio: undefined;
  Messages: undefined;
  Settings: undefined;
};

const AuthStack = createNativeStackNavigator<AuthStackParamList>();
const MainStack = createNativeStackNavigator<MainStackParamList>();
const CustomerTab = createBottomTabNavigator<HomeTabsParamList>();
const TailorTab = createBottomTabNavigator<TailorTabsParamList>();

// Custom Tab Bar Component
function CustomTabBar({ state, descriptors, navigation, userRole }: any) {
  const getTabConfig = (role: 'customer' | 'tailor') => {
    if (role === 'tailor') {
      return {
        Dashboard: { outline: 'stats-chart-outline', filled: 'stats-chart' },
        Orders: { outline: 'receipt-outline', filled: 'receipt' },
        Portfolio: { outline: 'images-outline', filled: 'images' },
        Messages: { outline: 'chatbubble-ellipses-outline', filled: 'chatbubble-ellipses' },
        Settings: { outline: 'settings-outline', filled: 'settings' },
      };
    }
    return {
      Home: { outline: 'home-outline', filled: 'home' },
      Explore: { outline: 'compass-outline', filled: 'compass' },
      Orders: { outline: 'receipt-outline', filled: 'receipt' },
      Messages: { outline: 'chatbubble-ellipses-outline', filled: 'chatbubble-ellipses' },
      Settings: { outline: 'person-outline', filled: 'person' },
    };
  };

  const iconMap = getTabConfig(userRole);

  return (
    <View style={styles.tabBar}>
      {state.routes.map((route: any, index: number) => {
        const { options } = descriptors[route.key];
        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: 'tabLongPress',
            target: route.key,
          });
        };

        const iconName = isFocused 
          ? (iconMap[route.name as keyof typeof iconMap]?.filled || 'home')
          : (iconMap[route.name as keyof typeof iconMap]?.outline || 'home-outline');

        return (
          <TouchableOpacity
            key={route.key}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarTestID}
            onPress={onPress}
            onLongPress={onLongPress}
            style={styles.tabButton}
            activeOpacity={0.7}
          >
            <View style={[styles.tabIconContainer, isFocused && styles.tabIconContainerActive]}>
              <Ionicons
                name={iconName as any}
                size={24}
                color={isFocused ? colors.primary[700] : colors.text.tertiary}
              />
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

// Bottom Tab Navigator for Customers
function CustomerTabsNavigator() {
  return (
    <CustomerTab.Navigator
      tabBar={(props) => <CustomTabBar {...props} userRole="customer" />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <CustomerTab.Screen name="Home" component={HomeScreen} />
      <CustomerTab.Screen name="Explore" component={ExploreScreen} />
      <CustomerTab.Screen name="Orders" component={OrdersListScreen as React.ComponentType<any>} />
      <CustomerTab.Screen name="Messages" component={ConversationsScreen} />
      <CustomerTab.Screen name="Settings" component={SettingsScreen} />
    </CustomerTab.Navigator>
  );
}

// Bottom Tab Navigator for Tailors
function TailorTabsNavigator() {
  return (
    <TailorTab.Navigator
      tabBar={(props) => <CustomTabBar {...props} userRole="tailor" />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <TailorTab.Screen name="Dashboard" component={TailorDashboardScreen} />
      <TailorTab.Screen name="Orders" component={TailorOrdersManagementScreen} />
      <TailorTab.Screen name="Portfolio" component={PortfolioManagementScreen} />
      <TailorTab.Screen name="Messages" component={ConversationsScreen} />
      <TailorTab.Screen name="Settings" component={TailorSettingsScreen} />
    </TailorTab.Navigator>
  );
}

// Main Stack Navigator (authenticated)
function MainNavigator() {
  const userRole = useAppSelector((state) => state.auth.user?.role || 'customer');

  return (
    <MainStack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
    >
      <MainStack.Screen 
        name="HomeTabs" 
        component={userRole === 'tailor' ? TailorTabsNavigator : CustomerTabsNavigator} 
      />
      <MainStack.Screen name="TailorProfile" component={TailorProfileScreen} />
      <MainStack.Screen name="Portfolio" component={PortfolioScreen} />
      <MainStack.Screen name="CreateOrder" component={CreateOrderScreen} />
      <MainStack.Screen name="OrderDetail" component={OrderDetailScreen} />
      <MainStack.Screen name="Conversations" component={ConversationsScreen} />
      <MainStack.Screen name="Messaging" component={MessagingScreen} />
      <MainStack.Screen 
        name="AudioCall" 
        component={AudioCallScreen}
        options={{
          animation: 'slide_from_bottom',
          presentation: 'fullScreenModal',
        }}
      />
      <MainStack.Screen 
        name="VideoCall" 
        component={VideoCallScreen}
        options={{
          animation: 'slide_from_bottom',
          presentation: 'fullScreenModal',
        }}
      />
      <MainStack.Screen 
        name="MediaViewer" 
        component={MediaViewerScreen}
        options={{
          animation: 'fade',
          presentation: 'fullScreenModal',
          headerShown: false,
        }}
      />
      <MainStack.Screen 
        name="CreatorMediaViewer" 
        component={CreatorMediaViewerScreen}
        options={{
          animation: 'fade',
          presentation: 'fullScreenModal',
          headerShown: false,
        }}
      />
      
      {/* New customer journey screens */}
      <MainStack.Screen name="TailorGallery" component={TailorGalleryScreen} />
      <MainStack.Screen name="ServiceDetail" component={ServiceDetailScreen} />
      <MainStack.Screen name="CategoryBrowse" component={CategoryBrowseScreen} />
      <MainStack.Screen name="BookingFlow" component={BookingFlowScreen} />
      <MainStack.Screen name="MeasurementsInput" component={MeasurementsInputScreen} />
      <MainStack.Screen name="BookingReview" component={BookingReviewScreen} />

      {/* Settings screens */}
      <MainStack.Screen name="SavedMeasurements" component={SavedMeasurementsScreen} />
      <MainStack.Screen name="Addresses" component={AddressesScreen} />
      <MainStack.Screen name="PaymentMethods" component={PaymentMethodsScreen} />
      <MainStack.Screen name="Language" component={LanguageScreen} />
      <MainStack.Screen name="Currency" component={CurrencyScreen} />
      <MainStack.Screen name="HelpFAQ" component={HelpFAQScreen} />
      <MainStack.Screen name="Terms" component={TermsScreen} />
      <MainStack.Screen name="PrivacyPolicy" component={PrivacyPolicyScreen} />

      {/* Tailor screens */}
      <MainStack.Screen name="TailorDashboard" component={TailorDashboardScreen} />
      <MainStack.Screen name="TailorProfileManagement" component={TailorProfileManagementScreen} />
      <MainStack.Screen name="PortfolioManagement" component={PortfolioManagementScreen} />
      <MainStack.Screen name="TailorOrdersManagement" component={TailorOrdersManagementScreen} />
      <MainStack.Screen name="VerificationStatus" component={VerificationStatusScreen} />
      <MainStack.Screen name="TailorAnalytics" component={TailorAnalyticsScreen} />
      <MainStack.Screen name="ReviewManagement" component={ReviewManagementScreen} />
      <MainStack.Screen name="PortfolioAnalytics" component={PortfolioAnalyticsScreen} />
      <MainStack.Screen name="ResponseTimeSettings" component={ResponseTimeSettingsScreen} />
    </MainStack.Navigator>
  );
}

// Auth Stack Navigator (not authenticated)
function AuthNavigator() {
  return (
    <AuthStack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
    >
      <AuthStack.Screen name="Onboarding" component={OnboardingScreen} />
      <AuthStack.Screen name="RoleSelection" component={RoleSelectionScreen} />
      <AuthStack.Screen name="SignIn" component={SignInScreen} />
      <AuthStack.Screen name="SignUp" component={SignUpScreen} />
    </AuthStack.Navigator>
  );
}

// Root Navigator
export function RootNavigator() {
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

  return (
    <NavigationContainer>
      {isAuthenticated ? <MainNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: 'row',
    backgroundColor: colors.background.primary,
    borderTopWidth: 1,
    borderTopColor: colors.border.light,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
    paddingBottom: Platform.OS === 'ios' ? spacing.lg : spacing.sm,
    height: Platform.OS === 'ios' ? 88 : 64,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabIconContainer: {
    width: 56,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  tabIconContainerActive: {
    backgroundColor: colors.primary[100],
  },
});