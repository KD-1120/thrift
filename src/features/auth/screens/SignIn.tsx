// Sign In Screen

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
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import { useDispatch } from 'react-redux';
import type { AppDispatch } from '../../../store/store';
import { setCredentials } from '../authSlice';
import { useSignInMutation } from '../../../api/auth.api';
import { Button } from '../../../components/Button';
import { colors } from '../../../design-system/colors';
import { spacing, radius } from '../../../design-system/spacing';

const MAX_FORM_WIDTH = 480;

type AuthStackParamList = {
  SignUp: { role?: 'customer' | 'tailor' };
  SignIn: undefined;
};

export default function SignInScreen() {
  const navigation = useNavigation<StackNavigationProp<AuthStackParamList>>();
  const dispatch = useDispatch<AppDispatch>();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState<'customer' | 'tailor'>('customer');
  const [errorMessage, setErrorMessage] = useState('');
  
  const [signIn, { isLoading }] = useSignInMutation();

  const handleSignIn = async () => {
    // Clear previous errors
    setErrorMessage('');
    
    // Validation
    if (!email.trim()) {
      const error = 'Please enter your email address';
      setErrorMessage(error);
      Alert.alert('Error', error);
      return;
    }
    if (!password) {
      const error = 'Please enter your password';
      setErrorMessage(error);
      Alert.alert('Error', error);
      return;
    }

    try {
      // Sign in with Firebase + Backend
      const result = await signIn({
        email: email.trim(),
        password,
        role: selectedRole, // Pass the selected role
      }).unwrap();

      // Validate role matches
      if (result.user.role !== selectedRole) {
        const roleText = selectedRole === 'customer' ? 'customer' : 'tailor';
        const actualRoleText = result.user.role === 'customer' ? 'customer' : 'tailor';
        
        const errorMsg = `This account is registered as a ${actualRoleText}, but you're trying to sign in as a ${roleText}. Please select the correct role or create a new account.`;
        setErrorMessage(errorMsg);
        
        Alert.alert(
          'Role Mismatch',
          errorMsg,
          [{ text: 'OK' }]
        );
        return;
      }

      // Store credentials in Redux
      dispatch(setCredentials({
        user: result.user,
        token: result.token,
      }));

      // Success - user is now logged in and will navigate automatically
      Alert.alert(
        'Welcome Back!',
        `Good to see you, ${result.user.name}!`,
        [{ text: 'OK' }]
      );
    } catch (error: any) {
      console.error('Sign in error (detailed):', error);
      
      // Parse Firebase error messages for better UX
      let userFriendlyMessage = 'Invalid email or password. Please try again.';
      const errorString = error?.message || error?.error || String(error);
      
      if (errorString.includes('user-not-found') || errorString.includes('EMAIL_NOT_FOUND')) {
        userFriendlyMessage = 'No account found with this email. Please sign up first.';
      } else if (errorString.includes('wrong-password') || errorString.includes('INVALID_PASSWORD')) {
        userFriendlyMessage = 'Incorrect password. Please try again or reset your password.';
      } else if (errorString.includes('invalid-email')) {
        userFriendlyMessage = 'Invalid email address. Please check and try again.';
      } else if (errorString.includes('user-disabled')) {
        userFriendlyMessage = 'This account has been disabled. Please contact support.';
      } else if (errorString.includes('too-many-requests')) {
        userFriendlyMessage = 'Too many failed attempts. Please try again later or reset your password.';
      } else if (errorString.includes('network')) {
        userFriendlyMessage = 'Network error. Please check your internet connection.';
      } else if (errorString.includes('invalid-credential')) {
        userFriendlyMessage = 'Invalid credentials. Please check your email and password.';
      } else if (errorString.includes('not a function')) {
        userFriendlyMessage = 'Technical error. Please try again or restart the app.';
      }
      
      // Set error on screen
      setErrorMessage(userFriendlyMessage);
      
      // Also show alert
      Alert.alert(
        'Sign In Failed',
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
              <Text style={styles.title}>Welcome Back</Text>
              <Text style={styles.subtitle}>Sign in to continue</Text>
            </View>

            <View style={styles.formSection}>
              {/* Error Message Display */}
              {errorMessage ? (
                <View style={styles.errorContainer}>
                  <Text style={styles.errorText}>{errorMessage}</Text>
                </View>
              ) : null}

              {/* Role Selection */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>I am signing in as</Text>
                <View style={styles.roleSelector}>
                  <TouchableOpacity
                    style={[
                      styles.roleOption,
                      selectedRole === 'customer' && styles.roleOptionActive
                    ]}
                    onPress={() => {
                      setSelectedRole('customer');
                      setErrorMessage('');
                    }}
                    activeOpacity={0.7}
                  >
                    <Text style={[
                      styles.roleOptionText,
                      selectedRole === 'customer' && styles.roleOptionTextActive
                    ]}>
                      🛍️ Customer
                    </Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    style={[
                      styles.roleOption,
                      selectedRole === 'tailor' && styles.roleOptionActive
                    ]}
                    onPress={() => {
                      setSelectedRole('tailor');
                      setErrorMessage('');
                    }}
                    activeOpacity={0.7}
                  >
                    <Text style={[
                      styles.roleOptionText,
                      selectedRole === 'tailor' && styles.roleOptionTextActive
                    ]}>
                      ✂️ Tailor
                    </Text>
                  </TouchableOpacity>
                </View>
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
                    setErrorMessage(''); // Clear error on input change
                  }}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  textContentType="emailAddress"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Password</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter your password"
                  placeholderTextColor={colors.text.tertiary}
                  value={password}
                  onChangeText={(text) => {
                    setPassword(text);
                    setErrorMessage(''); // Clear error on input change
                  }}
                  secureTextEntry
                  autoCapitalize="none"
                  textContentType="password"
                />
              </View>

              <TouchableOpacity 
                style={styles.forgotPassword}
                activeOpacity={0.7}
              >
                <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
              </TouchableOpacity>

              <Button
                title="Sign In"
                onPress={handleSignIn}
                loading={isLoading}
                fullWidth
                style={styles.signInButton}
              />

              <View style={styles.divider}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>OR</Text>
                <View style={styles.dividerLine} />
              </View>

              <Button
                title="Create Account"
                onPress={() => navigation.navigate('SignUp', {})}
                variant="outline"
                fullWidth
              />
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
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    marginBottom: spacing.lg,
  },
  errorText: {
    fontSize: 14,
    color: colors.error[700],
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
  roleSelector: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  roleOption: {
    flex: 1,
    paddingVertical: spacing.md + spacing.xs,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.md,
    borderWidth: 2,
    borderColor: colors.border.light,
    backgroundColor: colors.background.tertiary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  roleOptionActive: {
    borderColor: colors.primary[600],
    backgroundColor: colors.primary[50],
  },
  roleOptionText: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text.secondary,
    lineHeight: 20,
  },
  roleOptionTextActive: {
    color: colors.primary[700],
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
  forgotPassword: {
    alignSelf: 'flex-end',
    marginTop: -spacing.sm,
    marginBottom: spacing.xl + spacing.sm,
    paddingVertical: spacing.xs,
  },
  forgotPasswordText: {
    fontSize: 14,
    color: colors.primary[600],
    fontWeight: '600',
    lineHeight: 18,
  },
  signInButton: {
    marginBottom: spacing.lg + spacing.sm,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: spacing.lg + spacing.sm,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.border.light,
  },
  dividerText: {
    fontSize: 13,
    color: colors.text.tertiary,
    marginHorizontal: spacing.md,
    fontWeight: '500',
    lineHeight: 16,
  },
});