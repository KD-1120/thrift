// Stream Video SDK Service - Cross-Platform (Web + Native)
import { Platform } from 'react-native';

// Type imports only (no runtime impact)
type StreamVideoClient = any;
type Call = any;

let client: StreamVideoClient | null = null;
let currentCall: Call | null = null;

export interface CallTokenData {
  token: string;
  apiKey: string;
  userId: string;
  userName: string;
}

/**
 * Check if calling is available on current platform
 */
export function isCallingAvailable(): boolean {
  // Web always works
  if (Platform.OS === 'web') {
    return true;
  }
  
  // Native: works in dev client or bare app (not Expo Go)
  // In production builds, this is always true
  // In Expo Go, native modules won't be available
  return Platform.OS === 'ios' || Platform.OS === 'android';
}

/**
 * Get the appropriate Stream SDK for current platform
 */
function getStreamSDK() {
  if (Platform.OS === 'web') {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    return require('@stream-io/video-react-sdk');
  } else {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    return require('@stream-io/video-react-native-sdk');
  }
}

/**
 * Initialize Stream Video Client
 */
export async function initializeStreamClient(
  apiKey: string,
  token: string,
  user: { id: string; name: string }
): Promise<StreamVideoClient> {
  if (client) {
    return client;
  }

  try {
    const SDK = getStreamSDK();
    const { StreamVideoClient } = SDK;
    
    client = new StreamVideoClient({
      apiKey,
      token,
      user,
    });

    return client;
  } catch (error) {
    console.error('Failed to initialize Stream client:', error);
    throw new Error('Calling not available. Make sure you are using a development build (not Expo Go) for native platforms.');
  }
}

/**
 * Get current Stream client instance
 */
export function getStreamClient(): StreamVideoClient | null {
  return client;
}

/**
 * Create or join a call
 */
export async function createCall(
  callId: string,
  callType: 'default' | 'audio' | 'video' = 'default'
): Promise<Call> {
  if (!client) {
    throw new Error('Stream client not initialized');
  }

  const call = client.call(callType, callId);
  await call.join({ create: true });
  
  currentCall = call;
  return call;
}

/**
 * Join an existing call
 */
export async function joinCall(
  callId: string,
  callType: 'default' | 'audio' | 'video' = 'default'
): Promise<Call> {
  if (!client) {
    throw new Error('Stream client not initialized');
  }

  const call = client.call(callType, callId);
  await call.join();
  
  currentCall = call;
  return call;
}

/**
 * Leave current call
 */
export async function leaveCall(): Promise<void> {
  if (currentCall) {
    await currentCall.leave();
    currentCall = null;
  }
}

/**
 * End current call (host only)
 */
export async function endCall(): Promise<void> {
  if (currentCall) {
    await currentCall.endCall();
    currentCall = null;
  }
}

/**
 * Get current call instance
 */
export function getCurrentCall(): Call | null {
  return currentCall;
}

/**
 * Disconnect Stream client
 */
export async function disconnectStream(): Promise<void> {
  if (currentCall) {
    await leaveCall();
  }
  
  if (client) {
    // Clean up client resources
    client = null;
  }
}

/**
 * Toggle microphone
 */
export async function toggleMicrophone(): Promise<boolean> {
  if (!currentCall) {
    throw new Error('No active call');
  }

  const isEnabled = currentCall.microphone.state.status === 'enabled';
  
  if (isEnabled) {
    await currentCall.microphone.disable();
  } else {
    await currentCall.microphone.enable();
  }

  return !isEnabled;
}

/**
 * Toggle camera
 */
export async function toggleCamera(): Promise<boolean> {
  if (!currentCall) {
    throw new Error('No active call');
  }

  const isEnabled = currentCall.camera.state.status === 'enabled';
  
  if (isEnabled) {
    await currentCall.camera.disable();
  } else {
    await currentCall.camera.enable();
  }

  return !isEnabled;
}

/**
 * Toggle speaker
 */
export async function toggleSpeaker(): Promise<boolean> {
  if (!currentCall) {
    throw new Error('No active call');
  }

  // Speaker toggle implementation
  // This depends on the device's audio routing
  // Native: use device audio APIs
  // Web: toggles between speaker/earpiece if supported
  return true;
}
