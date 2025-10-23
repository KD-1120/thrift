import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image, Alert } from 'react-native';
import { Button } from '../../../components/Button';
import { textStyles } from '../../../design-system/typography';
import { colors } from '../../../design-system/colors';
import { spacing, radius } from '../../../design-system/spacing';
import { cameraService } from '../../../services/camera';
import { useAddPortfolioItemMutation } from '../../../api/tailors.api';
import { useAppSelector } from '../../../store/hooks';

import { TextInput } from 'react-native';

interface PortfolioItem {
  imageUrl: string;
  title: string;
  description: string;
}

interface PortfolioStepProps {
  onNext: () => void;
  onBack: () => void;
}

const PortfolioStep: React.FC<PortfolioStepProps> = ({ onNext, onBack }) => {
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [addPortfolioItem, { isLoading }] = useAddPortfolioItemMutation();
  const user = useAppSelector((state) => state.auth.user);

  const handleAddImage = async () => {
    const result = await cameraService.pickImage();
    if (result) {
      setItems([...items, { imageUrl: result.uri, title: '', description: '' }]);
    }
  };

  const handleUpdateItem = (index: number, field: 'title' | 'description', value: string) => {
    const newItems = [...items];
    newItems[index][field] = value;
    setItems(newItems);
  };

  const handleNext = async () => {
    if (!user) return;
    try {
      await Promise.all(
        items.map((item) =>
          addPortfolioItem({
            tailorId: user.id,
            item,
          }).unwrap()
        )
      );
      onNext();
    } catch (error) {
      Alert.alert('Error', 'Failed to upload images. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Showcase your work</Text>
      <Text style={styles.subtitle}>
        Upload a few images of your best work to attract clients.
      </Text>
      <FlatList
        data={items}
        renderItem={({ item, index }) => (
          <View style={styles.itemContainer}>
            <Image source={{ uri: item.imageUrl }} style={styles.image} />
            <TextInput
              style={styles.input}
              placeholder="Title"
              value={item.title}
              onChangeText={(value) => handleUpdateItem(index, 'title', value)}
            />
            <TextInput
              style={styles.input}
              placeholder="Description"
              value={item.description}
              onChangeText={(value) => handleUpdateItem(index, 'description', value)}
            />
          </View>
        )}
        keyExtractor={(item) => item.imageUrl}
        numColumns={1}
        ListFooterComponent={() => (
          <Button title="Add Image" onPress={handleAddImage} variant="outline" style={{ margin: spacing.sm }} />
        )}
      />
      <View style={styles.buttonContainer}>
        <Button title="Back" onPress={onBack} variant="outline" />
        <Button title="Next" onPress={handleNext} loading={isLoading} />
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
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: radius.md,
    margin: spacing.sm,
  },
  itemContainer: {
    flex: 1,
    margin: spacing.sm,
  },
  input: {
    ...textStyles.body,
    borderWidth: 1,
    borderColor: colors.border.light,
    borderRadius: radius.md,
    padding: spacing.sm,
    marginTop: spacing.sm,
  },
});

export default PortfolioStep;
