import { Dimensions } from 'react-native';

export const MUTE_PREF_PREFIX = 'media_mute_pref_v1:';
export const DOUBLE_TAP_DELAY = 300;
export const CONTROLS_HIDE_DELAY = 2500;

export const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Per-session mute preferences (persist for duration of app run)
export const sessionMuteMap: Map<string, boolean> = new Map();
