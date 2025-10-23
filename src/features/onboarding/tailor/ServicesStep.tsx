import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { Button } from '../../../components/Button';
import { textStyles } from '../../../design-system/typography';
import { colors } from '../../../design-system/colors';
import { spacing, radius } from '../../../design-system/spacing';
import { Ionicons } from '@expo/vector-icons';
import { useUpdateTailorProfileMutation } from '../../../api/tailors.api';
import { useAppSelector } from '../../../store/hooks';
import { Alert } from 'react-native';

interface ServicesStepProps {
  onNext: () => void;
  onBack: () => void;
}

const ServicesStep: React.FC<ServicesStepProps> = ({ onNext, onBack }) => {
  const [specialties, setSpecialties] = useState<string[]>([]);
  const [newSpecialty, setNewSpecialty] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [turnaroundTime, setTurnaroundTime] = useState('');
  const [updateTailorProfile, { isLoading }] = useUpdateTailorProfileMutation();
  const user = useAppSelector((state) => state.auth.user);

  const addSpecialty = () => {
    if (newSpecialty.trim() && !specialties.includes(newSpecialty.trim())) {
      setSpecialties([...specialties, newSpecialty.trim()]);
      setNewSpecialty('');
    }
  };

  const removeSpecialty = (specialty: string) => {
    setSpecialties(specialties.filter((s) => s !== specialty));
  };

  const handleFinish = async () => {
    if (!user) return;
    try {
      await updateTailorProfile({
        id: user.id,
        data: {
          specialties,
          priceRange: { min: parseInt(minPrice, 10), max: parseInt(maxPrice, 10) },
          turnaroundTime,
        },
      }).unwrap();
      onNext();
    } catch (error) {
      Alert.alert('Error', 'Failed to save services. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Define your services</Text>
      <Text style={styles.subtitle}>
        Let clients know what you specialize in and your price range.
      </Text>
      <View style={styles.specialtiesContainer}>
        {specialties.map((specialty, index) => (
          <View key={index} style={styles.specialtyTag}>
            <Text style={styles.specialtyText}>{specialty}</Text>
            <TouchableOpacity onPress={() => removeSpecialty(specialty)}>
              <Ionicons name="close" size={16} color={colors.primary[700]} />
            </TouchableOpacity>
          </View>
        ))}
      </View>
      <View style={styles.addSpecialtyContainer}>
        <TextInput
          style={styles.addSpecialtyInput}
          value={newSpecialty}
          onChangeText={setNewSpecialty}
          placeholder="Add a specialty (e.g., Wedding Gowns)"
        />
        <TouchableOpacity style={styles.addButton} onPress={addSpecialty}>
          <Ionicons name="add" size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
      <View style={styles.priceRangeContainer}>
        <TextInput
          style={styles.priceInput}
          value={minPrice}
          onChangeText={setMinPrice}
          placeholder="Min Price (GH₵)"
          keyboardType="numeric"
        />
        <TextInput
          style={styles.priceInput}
          value={maxPrice}
          onChangeText={setMaxPrice}
          placeholder="Max Price (GH₵)"
          keyboardType="numeric"
        />
      </View>
      <TextInput
        style={styles.priceInput}
        value={turnaroundTime}
        onChangeText={setTurnaroundTime}
        placeholder="Typical Turnaround Time (e.g., 3-5 days)"
      />
      <View style={styles.buttonContainer}>
        <Button title="Back" onPress={onBack} variant="outline" />
        <Button title="Finish" onPress={handleFinish} loading={isLoading} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    ...textStyles.h3,
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  subtitle: {
    ...textStyles.body,
    color: colors.text.secondary,
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: spacing.xl,
  },
  specialtiesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  specialtyTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.primary[100],
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: radius.full,
  },
  specialtyText: {
    ...textStyles.small,
    color: colors.primary[700],
    fontWeight: '600',
  },
  addSpecialtyContainer: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  addSpecialtyInput: {
    flex: 1,
    ...textStyles.body,
    borderWidth: 1,
    borderColor: colors.border.light,
    borderRadius: radius.md,
    padding: spacing.md,
  },
  addButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primary[600],
    justifyContent: 'center',
    alignItems: 'center',
  },
  priceRangeContainer: {
    flexDirection: 'row',
    gap: spacing.md,
    width: '100%',
  },
  priceInput: {
    flex: 1,
    ...textStyles.body,
    borderWidth: 1,
    borderColor: colors.border.light,
    borderRadius: radius.md,
    padding: spacing.md,
  },
});

export default ServicesStep;
