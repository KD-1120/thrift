// Audio Call Screen - Voice calling interface with Stream Video SDK

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { useAppSelector } from '../../../store/hooks';
import {
  initializeStreamClient,
  createCall,
  joinCall,
  leaveCall,
  toggleMicrophone,
  toggleSpeaker,
  isCallingAvailable,
  CallTokenData,
} from '../../../services/stream-video';
import { Avatar } from '../../../components/Avatar';
import { Button } from '../../../components/Button';
import { colors } from '../../../design-system/colors';
import { spacing } from '../../../design-system/spacing';
import { textStyles } from '../../../design-system/typography';

type RouteParams = {
  AudioCall: {
    callId?: string;
    tailorId: string;
    tailorName: string;
    isInitiator?: boolean;
  };
};

type NavigationProp = StackNavigationProp<any>;

export default function AudioCallScreen() {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteProp<RouteParams, 'AudioCall'>>();
  const { callId: routeCallId, tailorId, tailorName, isInitiator = true } = route.params;
  const currentUser = useAppSelector((state) => state.auth.user);

  const [callStatus, setCallStatus] = useState<'connecting' | 'ringing' | 'connected' | 'ended'>('connecting');
  const [callDuration, setCallDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeakerOn, setIsSpeakerOn] = useState(true);
  const [callingSupported, setCallingSupported] = useState(true);
  
  const callId = routeCallId || `call-${tailorId}-${Date.now()}`;

  // Check if calling is available on this platform
  useEffect(() => {
    const supported = isCallingAvailable();
    setCallingSupported(supported);
    
    if (!supported) {
      Alert.alert(
        'Calling Not Available',
        Platform.OS === 'web' 
          ? 'Web calling will be available soon!'
          : 'Audio/video calling requires a development build. Please use the Expo development client or build the app natively.',
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
    }
  }, [navigation]);

  const handleEndCall = React.useCallback(async () => {
    try {
      await leaveCall();
      setCallStatus('ended');
      setTimeout(() => navigation.goBack(), 500);
    } catch (error) {
      console.error('Failed to end call:', error);
      navigation.goBack();
    }
  }, [navigation]);

  const initializeCall = React.useCallback(async () => {
    try {
      setCallStatus('connecting');
      
      // Check if user is authenticated
      if (!currentUser) {
        throw new Error('User not authenticated');
      }

      // Get token from backend
      const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3001';
      const userId = currentUser.id;
      const userName = currentUser.name;
      const response = await fetch(`${API_URL}/api/calls/token?userId=${encodeURIComponent(userId)}&userName=${encodeURIComponent(userName)}`);
      
      if (!response.ok) {
        throw new Error('Failed to get call token');
      }
      
      const tokenData: CallTokenData = await response.json();

      // Initialize Stream client
      await initializeStreamClient(
        tokenData.apiKey,
        tokenData.token,
        {
          id: tokenData.userId,
          name: tokenData.userName,
        }
      );

      // Create or join call
      const newCall = isInitiator
        ? await createCall(callId, 'audio')
        : await joinCall(callId, 'audio');

      setCallStatus(isInitiator ? 'ringing' : 'connected');

      // Listen for call state changes
      newCall.state.callingState$.subscribe((state: string) => {
        if (state === 'joined') {
          setCallStatus('connected');
        } else if (state === 'left') {
          setCallStatus('ended');
          setTimeout(() => navigation.goBack(), 1000);
        }
      });

    } catch (error) {
      console.error('Failed to initialize call:', error);
      Alert.alert('Error', 'Failed to connect to call. Please check your network connection.');
      navigation.goBack();
    }
  }, [callId, isInitiator, navigation, currentUser]);

  useEffect(() => {
    initializeCall();
    return () => {
      handleEndCall();
    };
  }, [initializeCall, handleEndCall]);

  // Call duration timer
  useEffect(() => {
    if (callStatus === 'connected') {
      const timer = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [callStatus]);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleMuteToggle = async () => {
    try {
      const newMutedState = await toggleMicrophone();
      setIsMuted(newMutedState);
    } catch (error) {
      console.error('Failed to toggle microphone:', error);
      Alert.alert('Error', 'Failed to toggle microphone');
    }
  };

  const handleSpeakerToggle = async () => {
    try {
      const newSpeakerState = await toggleSpeaker();
      setIsSpeakerOn(newSpeakerState);
    } catch (error) {
      console.error('Failed to toggle speaker:', error);
      Alert.alert('Error', 'Failed to toggle speaker');
    }
  };

  const handleVideoCall = () => {
    navigation.navigate('VideoCall', {
      callId,
      tailorId,
      tailorName,
      isInitiator: true,
    });
  };

  // Show fallback UI if calling not supported
  if (!callingSupported) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.callContainer}>
          <View style={styles.fallbackContainer}>
            <Text style={styles.fallbackTitle}>Calling Not Available</Text>
            <Text style={styles.fallbackMessage}>
              {Platform.OS === 'web'
                ? 'Web-based calling will be available in a future update. Please use the mobile app for now.'
                : 'Audio and video calling require a development build with native modules.\n\nTo use calling features:\n• Build with Expo Development Client (EAS)\n• Use expo prebuild and build natively\n• Or use the web version'}
            </Text>
            <Button
              title="Go Back"
              onPress={() => navigation.goBack()}
              variant="primary"
              style={styles.fallbackButton}
            />
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.callContainer}>
        {/* Call Status */}
        <View style={styles.statusContainer}>
          <Text style={styles.callStatus}>
            {callStatus === 'connecting' ? 'Connecting...' :
             callStatus === 'ringing' ? 'Ringing...' :
             callStatus === 'connected' ? formatDuration(callDuration) :
             'Call Ended'}
          </Text>
        </View>

        {/* Avatar */}
        <View style={styles.avatarContainer}>
          <Avatar
            uri="https://via.placeholder.com/120x120/FF6B6B/FFFFFF?text=AS"
            name={tailorName}
            size={120}
          />
        </View>

        {/* Name */}
        <View style={styles.nameContainer}>
          <Text style={styles.callerName}>{tailorName}</Text>
          <Text style={styles.callType}>Voice Call</Text>
        </View>

        {/* Call Controls */}
        {callStatus !== 'ended' && (
          <View style={styles.controlsContainer}>
            <TouchableOpacity
              style={styles.controlButton}
              onPress={handleVideoCall}
              activeOpacity={0.8}
            >
              <Ionicons
                name="videocam-outline"
                size={24}
                color={colors.text.primary}
              />
              <Text style={styles.controlLabel}>
                Video
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.controlButton, isMuted && styles.controlButtonActive]}
              onPress={handleMuteToggle}
              activeOpacity={0.8}
            >
              <Ionicons
                name={isMuted ? "mic-off" : "mic"}
                size={24}
                color={isMuted ? '#FFFFFF' : colors.text.primary}
              />
              <Text style={[styles.controlLabel, isMuted && styles.controlLabelActive]}>
                Mute
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.controlButton, isSpeakerOn && styles.controlButtonActive]}
              onPress={handleSpeakerToggle}
              activeOpacity={0.8}
            >
              <Ionicons
                name={isSpeakerOn ? "volume-high" : "volume-low"}
                size={24}
                color={isSpeakerOn ? '#FFFFFF' : colors.text.primary}
              />
              <Text style={[styles.controlLabel, isSpeakerOn && styles.controlLabelActive]}>
                Speaker
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* End Call Button */}
        <View style={styles.endCallContainer}>
          <TouchableOpacity
            style={[styles.endCallButton, callStatus === 'ended' && styles.endCallButtonEnded]}
            onPress={handleEndCall}
            activeOpacity={0.8}
            disabled={callStatus === 'ended'}
          >
            <Ionicons
              name="call"
              size={28}
              color="#FFFFFF"
              style={{ transform: [{ rotate: '135deg' }] }}
            />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  callContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.xxxl,
    paddingVertical: spacing.xxxl,
  },

  // Status
  statusContainer: {
    marginBottom: spacing.xxxl,
  },
  callStatus: {
    ...textStyles.body,
    color: colors.text.secondary,
    textAlign: 'center',
  },

  // Avatar
  avatarContainer: {
    marginBottom: spacing.xxxl,
  },

  // Name
  nameContainer: {
    alignItems: 'center',
    marginBottom: spacing.xxxl,
  },
  callerName: {
    ...textStyles.h2,
    color: colors.text.primary,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  callType: {
    ...textStyles.body,
    color: colors.text.secondary,
    textAlign: 'center',
  },

  // Controls
  controlsContainer: {
    flexDirection: 'row',
    gap: spacing.xl,
    marginBottom: spacing.xxxl,
  },
  controlButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.background.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.border.light,
  },
  controlButtonActive: {
    backgroundColor: colors.primary[600],
    borderColor: colors.primary[600],
  },
  controlLabel: {
    ...textStyles.small,
    color: colors.text.secondary,
    marginTop: spacing.xs,
  },
  controlLabelActive: {
    color: '#FFFFFF',
  },

  // End Call
  endCallContainer: {
    marginTop: spacing.xxxl,
  },
  endCallButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.error.main,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.error.main,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  endCallButtonEnded: {
    backgroundColor: colors.success.main,
    shadowColor: colors.success.main,
  },

  // Fallback UI
  fallbackContainer: {
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
  },
  fallbackTitle: {
    ...textStyles.h2,
    color: colors.text.primary,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  fallbackMessage: {
    ...textStyles.body,
    color: colors.text.secondary,
    textAlign: 'center',
    marginBottom: spacing.xxxl,
    lineHeight: 24,
  },
  fallbackButton: {
    minWidth: 200,
  },
});