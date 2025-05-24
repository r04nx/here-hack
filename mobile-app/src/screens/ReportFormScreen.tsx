import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  Platform,
  Alert,
} from 'react-native';
import { TextInput, Button, Text, SegmentedButtons } from 'react-native-paper';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import * as ImagePicker from 'expo-image-picker';
import { theme } from '../theme/theme';
import Logo from '../../assets/logo-no-bg.png';
import { RootStackParamList } from '../navigation/AppNavigator';

type ReportFormScreenRouteProp = RouteProp<RootStackParamList, 'ReportForm'>;

const ReportFormScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList, 'ReportForm'>>();
  const route = useRoute<ReportFormScreenRouteProp>();
  const { locations } = route.params;

  const [formData, setFormData] = useState({
    issueType: 'geometry',
    description: '',
    severity: 'medium',
    currentRoadName: '',
    currentSpeedLimit: '',
    currentLanes: '',
    suggestedCorrection: '',
  });

  const [images, setImages] = useState<string[]>([]);

  React.useEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Image
            source={Logo}
            style={{ width: 40, height: 40, marginRight: 10 }}
            resizeMode="contain"
          />
          <Text style={{ fontSize: 20, fontWeight: 'bold', color: 'white' }}>RoadFusion</Text>
        </View>
      ),
      headerRight: () => null,
    });
  }, [navigation]);

  const handleImagePicker = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 0.8,
        allowsMultipleSelection: true,
        selectionLimit: 3,
      });

      if (!result.canceled && result.assets) {
        const newImages = result.assets.map(asset => asset.uri);
        setImages([...images, ...newImages]);
      }
    } catch (error) {
      console.error('Error picking image:', error);
    }
  };

  const handleSubmit = () => {
    if (!formData.issueType || !formData.description) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }

    // Format the report data in a structured way
    const reportData = {
      metadata: {
        timestamp: new Date().toISOString(),
        reportId: Math.random().toString(36).substring(7), // Generate a random report ID
      },
      issue: {
        type: formData.issueType,
        description: formData.description,
        severity: formData.severity,
      },
      location: {
        points: locations.map((point, index) => ({
          id: index + 1,
          coordinates: {
            latitude: point.latitude,
            longitude: point.longitude
          }
        })),
        roadDetails: {
          name: formData.currentRoadName,
          speedLimit: formData.currentSpeedLimit,
          lanes: formData.currentLanes
        }
      },
      suggestedCorrection: formData.suggestedCorrection,
      attachments: {
        images: images
      }
    };

    // Log the structured report data
    console.log('Report Submitted:');
    console.log(JSON.stringify(reportData, null, 2));

    Alert.alert('Success', 'Report submitted successfully!');
    navigation.goBack();
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Report Map Issue</Text>

        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Issue Type</Text>
          <SegmentedButtons
            value={formData.issueType}
            onValueChange={(value: string) => {
              console.log('Issue type changed to:', value);
              setFormData({ ...formData, issueType: value });
            }}
            buttons={[
              { value: 'geometry', label: 'Geometry' },
              { value: 'connectivity', label: 'Connectivity' },
              { value: 'attributes', label: 'Attributes' },
            ]}
            style={styles.segmentedButtons}
          />
        </View>

        <View style={styles.sectionContainer}>
           <Text style={styles.sectionTitle}>Details</Text>
          <TextInput
            label="Description"
            value={formData.description}
            onChangeText={(text: string) => setFormData({ ...formData, description: text })}
            multiline
            numberOfLines={4}
            style={styles.input}
            mode="outlined"
            activeOutlineColor={theme.colors.primary}
          />

          <TextInput
            label="Current Road Name"
            value={formData.currentRoadName}
            onChangeText={(text: string) => setFormData({ ...formData, currentRoadName: text })}
            style={styles.input}
             mode="outlined"
             activeOutlineColor={theme.colors.primary}
          />

          <TextInput
            label="Current Speed Limit"
            value={formData.currentSpeedLimit}
            onChangeText={(text: string) => setFormData({ ...formData, currentSpeedLimit: text })}
            keyboardType="numeric"
            style={styles.input}
             mode="outlined"
             activeOutlineColor={theme.colors.primary}
          />

          <TextInput
            label="Number of Lanes"
            value={formData.currentLanes}
            onChangeText={(text: string) => setFormData({ ...formData, currentLanes: text })}
            keyboardType="numeric"
            style={styles.input}
             mode="outlined"
             activeOutlineColor={theme.colors.primary}
          />

          <TextInput
            label="Suggested Correction"
            value={formData.suggestedCorrection}
            onChangeText={(text: string) => setFormData({ ...formData, suggestedCorrection: text })}
            multiline
            numberOfLines={3}
            style={styles.input}
             mode="outlined"
             activeOutlineColor={theme.colors.primary}
          />
        </View>

        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Add Photos</Text>
          <TouchableOpacity style={styles.imagePickerButton} onPress={handleImagePicker}>
            <Text style={styles.imagePickerText}>Select Photos</Text>
          </TouchableOpacity>
          <View style={styles.imagePreviewContainer}>
            {images.map((uri, index) => (
              <Image key={index} source={{ uri }} style={styles.imagePreview} />
            ))}
          </View>
        </View>

        <Button
          mode="contained"
          onPress={handleSubmit}
          style={styles.submitButton}
          buttonColor={theme.colors.primary}
        >
          Submit Report
        </Button>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    padding: theme.spacing.lg,
  },
  title: {
    fontSize: theme.typography.h1.fontSize,
    fontWeight: theme.typography.h1.fontWeight as '700',
    marginBottom: theme.spacing.lg,
    color: theme.colors.text,
    textAlign: 'center',
  },
  sectionContainer: {
    marginBottom: theme.spacing.xl,
  },
  sectionTitle: {
    fontSize: theme.typography.h2.fontSize,
    fontWeight: theme.typography.h2.fontWeight as '700',
    marginBottom: theme.spacing.md,
    color: theme.colors.text,
  },
  segmentedButtons: {
    marginBottom: theme.spacing.md,
  },
  input: {
    marginBottom: theme.spacing.md,
    backgroundColor: theme.colors.background,
  },
  imageSection: {
    marginVertical: theme.spacing.lg,
  },
  imagePickerButton: {
    backgroundColor: theme.colors.secondary,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
  },
  imagePickerText: {
    color: theme.colors.background,
    fontSize: theme.typography.body.fontSize,
    fontWeight: 'bold',
  },
  imagePreviewContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: theme.spacing.md,
  },
  imagePreview: {
    width: 100,
    height: 100,
    margin: theme.spacing.xs,
    borderRadius: theme.borderRadius.sm,
    borderWidth: 1,
    borderColor: theme.colors.lightGray,
  },
  submitButton: {
    marginTop: theme.spacing.xl,
    marginBottom: theme.spacing.xl,
    paddingVertical: theme.spacing.sm,
  },
});

export default ReportFormScreen; 