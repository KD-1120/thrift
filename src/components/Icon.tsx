// Icon Component - Reusable vector icon wrapper

import React from 'react';
import { Ionicons, MaterialIcons, Feather, FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '../design-system/colors';

type IconLibrary = 'ionicons' | 'material' | 'feather' | 'fontawesome' | 'materialcommunity';

interface IconProps {
  name: string;
  library?: IconLibrary;
  size?: number;
  color?: string;
  style?: any;
}

export function Icon({
  name,
  library = 'ionicons',
  size = 24,
  color = colors.text.primary,
  style,
}: IconProps) {
  const IconComponent = 
    library === 'material' ? MaterialIcons :
    library === 'feather' ? Feather :
    library === 'fontawesome' ? FontAwesome :
    library === 'materialcommunity' ? MaterialCommunityIcons :
    Ionicons;

  return <IconComponent name={name as any} size={size} color={color} style={style} />;
}
