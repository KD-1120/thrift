// Video Call Screen - Video calling interface

import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { Camera, CameraView } from 'expo-camera';
import { Avatar } from '../../../components/Avatar';
import { colors } from '../../../design-system/colors';
import { spacing, radius } from '../../../design-system/spacing';
import { textStyles } from '../../../design-system/typography';

const { width, height } = Dimensions.get('window');

type RouteParams = {
  VideoCall: {
    tailorId: string;
    tailorName: string;
  };
};

type NavigationProp = StackNavigationProp<any>;

export default function VideoCallScreen() {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteProp<RouteParams, 'VideoCall'>>();
  const { tailorId, tailorName } = route.params;

  const [callStatus, setCallStatus] = useState<'connecting' | 'connected' | 'ended'>('connecting');
  const [callDuration, setCallDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isFrontCamera, setIsFrontCamera] = useState(true);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);

  const cameraRef = useRef<CameraView>(null);

  // Request camera permissions
  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  // Mock call timer
  useEffect(() => {
    if (callStatus === 'connected') {
      const timer = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [callStatus]);

  // Simulate call connection
  useEffect(() => {
    const timer = setTimeout(() => {
      setCallStatus('connected');
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleEndCall = () => {
    setCallStatus('ended');
    setTimeout(() => {
      navigation.goBack();
    }, 1000);
  };

  const handleMuteToggle = () => {
    setIsMuted(!isMuted);
    // In real app, this would control microphone
  };

  const handleVideoToggle = () => {
    setIsVideoOn(!isVideoOn);
    // In real app, this would control camera
  };

  const handleCameraSwitch = () => {
    setIsFrontCamera(!isFrontCamera);
    // In real app, this would switch camera
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.callContainer}>
        {/* Video Area */}
        <View style={styles.videoContainer}>
          {callStatus === 'connecting' ? (
            <View style={styles.connectingContainer}>
              <Avatar
                uri="https://via.placeholder.com/120x120/FF6B6B/FFFFFF?text=AS"
                name={tailorName}
                size={120}
              />
              <Text style={styles.connectingText}>Connecting...</Text>
            </View>
          ) : callStatus === 'connected' && isVideoOn ? (
            // Real camera feed
            hasPermission === null ? (
              <View style={styles.videoFeed}>
                <Text style={styles.permissionText}>Requesting camera permission...</Text>
              </View>
            ) : hasPermission === false ? (
              <View style={styles.videoFeed}>
                <Text style={styles.permissionText}>Camera permission denied</Text>
                <TouchableOpacity
                  style={styles.permissionButton}
                  onPress={async () => {
                    const { status } = await Camera.requestCameraPermissionsAsync();
                    setHasPermission(status === 'granted');
                  }}
                >
                  <Text style={styles.permissionButtonText}>Grant Permission</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <CameraView
                ref={cameraRef}
                style={styles.camera}
                facing={isFrontCamera ? 'front' : 'back'}
                mode="video"
              />
            )
          ) : (
            <View style={styles.noVideoContainer}>
              <Avatar
                uri="https://via.placeholder.com/120x120/FF6B6B/FFFFFF?text=AS"
                name={tailorName}
                size={120}
              />
              <Text style={styles.noVideoText}>
                {!isVideoOn ? 'Video Paused' : 'Call Ended'}
              </Text>
            </View>
          )}

          {/* Self video thumbnail */}
          {callStatus === 'connected' && isVideoOn && (
            <View style={styles.selfVideoThumbnail}>
              <View style={styles.selfVideoPlaceholder}>
                <Ionicons name="person" size={24} color={colors.text.secondary} />
              </View>
            </View>
          )}
        </View>

        {/* Call Info */}
        <View style={styles.callInfoContainer}>
          <Text style={styles.callerName}>{tailorName}</Text>
          <Text style={styles.callDuration}>
            {callStatus === 'connecting' ? 'Connecting...' :
             callStatus === 'connected' ? formatDuration(callDuration) :
             'Call Ended'}
          </Text>
        </View>

        {/* Call Controls */}
        {callStatus !== 'ended' && (
          <View style={styles.controlsContainer}>
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
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.controlButton, !isVideoOn && styles.controlButtonActive]}
              onPress={handleVideoToggle}
              activeOpacity={0.8}
            >
              <Ionicons
                name={isVideoOn ? "videocam" : "videocam-off"}
                size={24}
                color={!isVideoOn ? '#FFFFFF' : colors.text.primary}
              />
            </TouchableOpacity>

            {isVideoOn && (
              <TouchableOpacity
                style={styles.controlButton}
                onPress={handleCameraSwitch}
                activeOpacity={0.8}
              >
                <Ionicons
                  name="camera-reverse"
                  size={24}
                  color={colors.text.primary}
                />
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={styles.endCallButton}
              onPress={handleEndCall}
              activeOpacity={0.8}
            >
              <Ionicons
                name="call"
                size={28}
                color="#FFFFFF"
                style={{ transform: [{ rotate: '135deg' }] }}
              />
            </TouchableOpacity>
          </View>
        )}

        {/* End call button for ended state */}
        {callStatus === 'ended' && (
          <View style={styles.endedControlsContainer}>
            <TouchableOpacity
              style={styles.endCallButtonEnded}
              onPress={() => navigation.goBack()}
              activeOpacity={0.8}
            >
              <Ionicons name="close" size={28} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        )}
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
  },

  // Video Area
  videoContainer: {
    flex: 1,
    backgroundColor: colors.background.secondary,
    position: 'relative',
  },
  videoFeed: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  videoPlaceholder: {
    alignItems: 'center',
    gap: spacing.md,
  },
  videoPlaceholderText: {
    ...textStyles.body,
    color: colors.text.secondary,
  },
  permissionText: {
    ...textStyles.body,
    color: colors.text.secondary,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  permissionButton: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    backgroundColor: colors.primary[600],
    borderRadius: radius.lg,
  },
  permissionButtonText: {
    ...textStyles.bodyMedium,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  camera: {
    flex: 1,
  },
  connectingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing.lg,
  },
  connectingText: {
    ...textStyles.h3,
    color: colors.text.primary,
  },
  noVideoContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing.lg,
  },
  noVideoText: {
    ...textStyles.body,
    color: colors.text.secondary,
  },

  // Self video thumbnail
  selfVideoThumbnail: {
    position: 'absolute',
    top: spacing.xl,
    right: spacing.xl,
    width: 100,
    height: 140,
    borderRadius: radius.md,
    backgroundColor: colors.background.primary,
    borderWidth: 2,
    borderColor: colors.border.light,
    overflow: 'hidden',
  },
  selfVideoPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background.secondary,
  },

  // Call Info
  callInfoContainer: {
    paddingHorizontal: spacing.xxxl,
    paddingVertical: spacing.lg,
    alignItems: 'center',
  },
  callerName: {
    ...textStyles.h3,
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  callDuration: {
    ...textStyles.body,
    color: colors.text.secondary,
  },

  // Controls
  controlsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing.xl,
    paddingHorizontal: spacing.xxxl,
    paddingVertical: spacing.lg,
    paddingBottom: spacing.xxxl,
  },
  controlButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
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
  endCallButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.error.main,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.error.main,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },

  // Ended state
  endedControlsContainer: {
    paddingHorizontal: spacing.xxxl,
    paddingBottom: spacing.xxxl,
    alignItems: 'center',
  },
  endCallButtonEnded: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.success.main,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.success.main,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
});