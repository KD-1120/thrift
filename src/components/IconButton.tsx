// Icon Button Component - Reusable button with vector icons

import React from 'react';
import { TouchableOpacity, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { Ionicons, MaterialIcons, Feather } from '@expo/vector-icons';
import { colors } from '../design-system/colors';
import { spacing } from '../design-system/spacing';

type IconLibrary = 'ionicons' | 'material' | 'feather';

interface IconButtonProps {
  icon: string;
  library?: IconLibrary;
  size?: number;
  color?: string;
  backgroundColor?: string;
  onPress?: () => void;
  style?: ViewStyle;
  disabled?: boolean;
  badge?: number;
}

export function IconButton({
  icon,
  library = 'ionicons',
  size = 24,
  color = colors.text.primary,
  backgroundColor,
  onPress,
  style,
  disabled = false,
  badge,
}: IconButtonProps) {
  const IconComponent = library === 'material' 
    ? MaterialIcons 
    : library === 'feather' 
    ? Feather 
    : Ionicons;

  const containerStyle: ViewStyle = {
    width: size + spacing.md * 2,
    height: size + spacing.md * 2,
    borderRadius: (size + spacing.md * 2) / 2,
    backgroundColor: backgroundColor || 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
    opacity: disabled ? 0.5 : 1,
  };

  return (
    <TouchableOpacity
      style={[containerStyle, style]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.7}
    >
      <IconComponent name={icon as any} size={size} color={color} />
      {badge !== undefined && badge > 0 && (
        <div style={styles.badge as any}>
          <span style={styles.badgeText as any}>{badge > 99 ? '99+' : badge}</span>
        </div>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  badge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: colors.error.main,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  } as ViewStyle,
  badgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  } as TextStyle,
});
