// Sign Up Screen

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import { useDispatch } from 'react-redux';
import type { AppDispatch } from '../../../store/store';
import { setCredentials } from '../authSlice';
import { useSignUpMutation } from '../../../api/auth.api';
import { Button } from '../../../components/Button';
import { colors } from '../../../design-system/colors';
import { spacing, radius } from '../../../design-system/spacing';

const MAX_FORM_WIDTH = 480;

type AuthStackParamList = {
  SignIn: undefined;
  SignUp: { role?: 'customer' | 'tailor' };
};

type SignUpRouteProp = RouteProp<AuthStackParamList, 'SignUp'>;

export default function SignUpScreen() {
  const navigation = useNavigation<StackNavigationProp<AuthStackParamList>>();
  const route = useRoute<SignUpRouteProp>();
  const dispatch = useDispatch<AppDispatch>();
  const preSelectedRole = route.params?.role || 'customer';
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  
  const [signUp, { isLoading }] = useSignUpMutation();

  const handleSignUp = async () => {
    // Clear previous errors
    setErrorMessage('');
    
    // Validation
    if (!name.trim()) {
      const error = 'Please enter your full name';
      setErrorMessage(error);
      Alert.alert('Error', error);
      return;
    }
    if (!email.trim()) {
      const error = 'Please enter your email address';
      setErrorMessage(error);
      Alert.alert('Error', error);
      return;
    }
    if (!phone.trim()) {
      const error = 'Please enter your phone number';
      setErrorMessage(error);
      Alert.alert('Error', error);
      return;
    }
    if (password.length < 6) {
      const error = 'Password must be at least 6 characters';
      setErrorMessage(error);
      Alert.alert('Error', error);
      return;
    }

    try {
      // Sign up with Firebase + Backend
      const result = await signUp({
        email: email.trim(),
        password,
        name: name.trim(),
        phone: phone.trim(),
        role: preSelectedRole,
      }).unwrap();

      // Store credentials in Redux
      dispatch(setCredentials({
        user: result.user,
        token: result.token,
      }));

      // Success - user is now logged in and will navigate automatically
      Alert.alert(
        'Success!',
        `Welcome to ThriftAccra, ${result.user.name}!`,
        [{ text: 'OK' }]
      );
    } catch (error: any) {
      console.error('Sign up error (detailed):', error);
      
      // Parse Firebase error messages for better UX
      let userFriendlyMessage = 'Unable to create account. Please try again.';
      const errorString = error?.message || error?.error || String(error);
      
      if (errorString.includes('email-already-in-use') || errorString.includes('EMAIL_EXISTS')) {
        userFriendlyMessage = 'This email is already registered.';
        
        // Set error on screen
        setErrorMessage(userFriendlyMessage);
        
        // Offer to navigate to sign in
        Alert.alert(
          'Email Already Registered',
          'This email is already registered. Would you like to sign in instead?',
          [
            { text: 'Cancel', style: 'cancel' },
            { 
              text: 'Sign In', 
              onPress: () => navigation.navigate('SignIn')
            }
          ]
        );
        return;
      } else if (errorString.includes('weak-password')) {
        userFriendlyMessage = 'Password is too weak. Please use at least 6 characters.';
      } else if (errorString.includes('invalid-email')) {
        userFriendlyMessage = 'Invalid email address. Please check and try again.';
      } else if (errorString.includes('network')) {
        userFriendlyMessage = 'Network error. Please check your internet connection.';
      } else if (errorString.includes('operation-not-allowed')) {
        userFriendlyMessage = 'Sign up is currently disabled. Please contact support.';
      } else if (errorString.includes('not a function')) {
        userFriendlyMessage = 'Technical error. Please try again or restart the app.';
      }
      
      // Set error on screen
      setErrorMessage(userFriendlyMessage);
      
      // Also show alert
      Alert.alert(
        'Sign Up Failed',
        userFriendlyMessage,
        [{ text: 'OK' }]
      );
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.innerContainer}>
            <View style={styles.header}>
              <Text style={styles.title}>Create Account</Text>
              <Text style={styles.subtitle}>
                Join as a {preSelectedRole === 'tailor' ? 'tailor' : 'customer'}
              </Text>
            </View>

            <View style={styles.formSection}>
              {errorMessage ? (
                <View style={styles.errorContainer}>
                  <Text style={styles.errorText}>{errorMessage}</Text>
                </View>
              ) : null}

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Full Name</Text>
                <TextInput
                  style={styles.input}
                  placeholder="John Doe"
                  placeholderTextColor={colors.text.tertiary}
                  value={name}
                  onChangeText={(text) => {
                    setName(text);
                    setErrorMessage('');
                  }}
                  autoCapitalize="words"
                  textContentType="name"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Email</Text>
                <TextInput
                  style={styles.input}
                  placeholder="your@email.com"
                  placeholderTextColor={colors.text.tertiary}
                  value={email}
                  onChangeText={(text) => {
                    setEmail(text);
                    setErrorMessage('');
                  }}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  textContentType="emailAddress"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Phone</Text>
                <TextInput
                  style={styles.input}
                  placeholder="+233 XX XXX XXXX"
                  placeholderTextColor={colors.text.tertiary}
                  value={phone}
                  onChangeText={(text) => {
                    setPhone(text);
                    setErrorMessage('');
                  }}
                  keyboardType="phone-pad"
                  textContentType="telephoneNumber"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Password</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Create a password"
                  placeholderTextColor={colors.text.tertiary}
                  value={password}
                  onChangeText={(text) => {
                    setPassword(text);
                    setErrorMessage('');
                  }}
                  secureTextEntry
                  autoCapitalize="none"
                  textContentType="newPassword"
                />
              </View>

              <Button
                title="Create Account"
                onPress={handleSignUp}
                loading={isLoading}
                fullWidth
                style={styles.signUpButton}
              />

              <View style={styles.footer}>
                <Text style={styles.footerText}>Already have an account? </Text>
                <TouchableOpacity 
                  onPress={() => navigation.navigate('SignIn')}
                  activeOpacity={0.7}
                >
                  <Text style={styles.footerLink}>Sign In</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.xxl,
  },
  innerContainer: {
    flex: 1,
    maxWidth: MAX_FORM_WIDTH,
    width: '100%',
    alignSelf: 'center',
    justifyContent: 'center',
  },
  header: {
    marginBottom: spacing.xxl * 1.5,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.text.primary,
    marginBottom: spacing.xs,
    lineHeight: 38,
  },
  subtitle: {
    fontSize: 16,
    color: colors.text.secondary,
    lineHeight: 22,
  },
  formSection: {
    width: '100%',
  },
  errorContainer: {
    backgroundColor: colors.error[50],
    borderWidth: 1,
    borderColor: colors.error[200],
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.lg,
  },
  errorText: {
    color: colors.error[700],
    fontSize: 14,
    lineHeight: 20,
  },
  inputGroup: {
    marginBottom: spacing.lg + spacing.sm,
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: spacing.sm,
    lineHeight: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border.light,
    borderRadius: radius.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md + spacing.xs,
    fontSize: 16,
    color: colors.text.primary,
    backgroundColor: colors.background.tertiary,
    lineHeight: 22,
  },
  signUpButton: {
    marginTop: spacing.xl,
    marginBottom: spacing.lg,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: spacing.sm,
  },
  footerText: {
    fontSize: 15,
    color: colors.text.secondary,
    lineHeight: 20,
  },
  footerLink: {
    fontSize: 15,
    color: colors.primary[600],
    fontWeight: '600',
    lineHeight: 20,
  },
});