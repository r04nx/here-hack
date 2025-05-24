import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, View, TouchableOpacity, Platform, Alert, Image, Text } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE, Region, Polyline } from 'react-native-maps';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { theme } from '../theme/theme';
import { RootStackParamList } from '../navigation/AppNavigator';

// Assuming the logo is placed in RoadFusionV1/assets
import Logo from '../../assets/logo-no-bg.png';

// Custom map style for dark grayscale with colored roads
const customMapStyle = [
  {
    elementType: 'geometry',
    stylers: [{
      color: '#242f3e'
    }], // Dark grey
  },
  {
    elementType: 'labels.text.fill',
    stylers: [{
      color: '#746855'
    }], // Lighter grey/brown for text
  },
  {
    elementType: 'labels.text.stroke',
    stylers: [{
      color: '#242f3e'
    }], // Matching background for stroke
  },
  {
    featureType: 'administrative.locality',
    elementType: 'labels.text.fill',
    stylers: [{
      color: '#FFA500'  // Orange color for city/locality names
    }],
  },
  {
    featureType: 'poi',
    elementType: 'labels.text.fill',
    stylers: [{
      color: '#FFA500'  // Orange color for points of interest
    }],
  },
  {
    featureType: 'poi.park',
    elementType: 'geometry',
    stylers: [{
      color: '#263c3f'
    }], // Dark blue/grey for parks
  },
  {
    featureType: 'poi.park',
    elementType: 'labels.text.fill',
    stylers: [{
      color: '#6b9a76'
    }], // Greenish grey for park labels
  },
  {
    featureType: 'road',
    elementType: 'geometry.fill',
    stylers: [{
      color: '#f5f5f5'  // Light white
    }],
  },
  {
    featureType: 'road',
    elementType: 'geometry.stroke',
    stylers: [{
      color: '#e0e0e0'  // Slightly darker white
    }],
  },
  {
    featureType: 'road',
    elementType: 'labels.text.fill',
    stylers: [{
      color: '#9ca5b3'
    }],
  },
  {
    featureType: 'road.highway',
    elementType: 'geometry.fill',
    stylers: [{
      color: '#ffffff'  // Bright white for highways
    }],
  },
  {
    featureType: 'road.highway',
    elementType: 'geometry.stroke',
    stylers: [{
      color: '#f0f0f0'  // Slightly off-white for highway strokes
    }],
  },
  {
    featureType: 'road.arterial',
    elementType: 'geometry.fill',
    stylers: [{
      color: '#fafafa'  // Very light white for arterial roads
    }],
  },
  {
    featureType: 'road.arterial',
    elementType: 'geometry.stroke',
    stylers: [{
      color: '#e8e8e8'  // Slightly darker white for arterial strokes
    }],
  },
  {
    featureType: 'transit',
    elementType: 'geometry.fill',
    stylers: [{
      color: '#2f3948'
    }], // Dark grey for transit
  },
  {
    featureType: 'transit.station',
    elementType: 'labels.text.fill',
    stylers: [{
      color: '#FFA500'  // Orange color for transit stations
    }],
  },
  {
    featureType: 'water',
    elementType: 'geometry.fill',
    stylers: [{
      color: '#17263c'
    }], // Dark blue for water
  },
  {
    featureType: 'water',
    elementType: 'labels.text.fill',
    stylers: [{
      color: '#515c6d'
    }], // Grey/blue for water labels
  },
  {
    featureType: 'water',
    elementType: 'labels.text.stroke',
    stylers: [{
      color: '#17263c'
    }],
  },
];

type MapScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Map'>;

// Component for the user icon in the header
const UserIconHeader = () => {
  const navigation = useNavigation(); // Use useNavigation if you need to navigate from here
  return (
    <View style={{ width: 40, justifyContent: 'center', alignItems: 'center' }}>
      <TouchableOpacity 
        onPress={() => { /* Handle user icon press, e.g., navigate to profile */ }}
        style={{ width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center' }}
        >
        <Ionicons name="person-circle-outline" size={30} color="white" />
      </TouchableOpacity>
    </View>
  );
};

const MapScreen = () => {
  const navigation = useNavigation<MapScreenNavigationProp>();
  const mapRef = useRef<MapView>(null);
  const [currentLocation, setCurrentLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [mapRegion, setMapRegion] = useState<Region>({
    latitude: 50.110924,
    longitude: 8.682127,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });
  const [selectedPoints, setSelectedPoints] = useState<{
    latitude: number;
    longitude: number;
  }[]>([]); // State to store multiple selected points

  const handleMapRegionChange = (region: Region) => {
    setMapRegion(region);
  };

  const handleReportPress = () => {
    // Pass all selected points to the ReportForm
    if (selectedPoints.length > 0) {
      navigation.navigate('ReportForm', { 
        locations: selectedPoints // Changed from location to locations (array)
      });
    } else {
       // If no points are selected, maybe use the crosshair location or show an alert
       Alert.alert('No points selected', 'Please add at least one point to report.');
    }
  };

  const handleCurrentLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Permission Denied',
          'Please allow location access to use this feature.'
        );
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;
      
      setCurrentLocation({ latitude, longitude });
      
      mapRef.current?.animateToRegion({
        latitude,
        longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      }, 1000);
    } catch (error) {
      Alert.alert(
        'Error',
        'Unable to get your current location. Please try again.'
      );
    }
  };

  const handleAddPoint = () => {
    // Add the current crosshair location to the selectedPoints array
    const newPoint = { latitude: mapRegion.latitude, longitude: mapRegion.longitude };
    setSelectedPoints([...selectedPoints, newPoint]);
  };

  const handleResetPoints = () => {
    setSelectedPoints([]); // Clear all selected points
  };

  useEffect(() => {
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
      headerRight: () => <UserIconHeader />,
    });
  }, [navigation]);

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        initialRegion={mapRegion}
        onRegionChangeComplete={handleMapRegionChange}
        customMapStyle={customMapStyle}
      >
        {currentLocation && (
          <Marker
            coordinate={currentLocation}
            pinColor="red"
          />
        )}
        {/* Display markers for selected points */}
        {selectedPoints.map((point, index) => (
          <Marker
            key={index}
            coordinate={point}
            pinColor="yellow" // Changed to yellow
          />
        ))}

        {/* Draw lines between selected points */}
        {selectedPoints.length > 1 && (
          <Polyline
            coordinates={selectedPoints} // Use the selected points for the line
            strokeColor="yellow" // Color of the line
            strokeWidth={3} // Thickness of the line
          />
        )}
      </MapView>

      {/* Fixed Crosshair */}
      <View style={styles.crosshairContainer}>
        <View style={styles.crosshair}>
          <View style={styles.crosshairVertical} />
          <View style={styles.crosshairHorizontal} />
        </View>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.locationButton}
          onPress={handleCurrentLocation}
        >
          <Ionicons
            name="locate"
            size={24}
            color={theme.colors.background}
          />
        </TouchableOpacity>

        {/* New Add Point Button */}
        <TouchableOpacity
          style={styles.addPointButton} // Define this style
          onPress={handleAddPoint}
        >
           <Ionicons
            name="add"
            size={24}
            color={theme.colors.background}
          />
        </TouchableOpacity>

        {/* New Reset Button */}
        {selectedPoints.length > 0 && (
          <TouchableOpacity
            style={styles.resetButton} // Define this style
            onPress={handleResetPoints}
          >
            <Ionicons
              name="refresh"
              size={24}
              color={theme.colors.background}
            />
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={styles.reportButton}
          onPress={handleReportPress}
        >
          <Ionicons
            name="alert-circle-outline"
            size={24}
            color={theme.colors.background}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  map: {
    flex: 1,
  },
  crosshairContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    pointerEvents: 'none',
  },
  crosshair: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  crosshairVertical: {
    position: 'absolute',
    width: 2,
    height: 40,
    backgroundColor: 'rgba(255, 0, 0, 0.7)',
  },
  crosshairHorizontal: {
    position: 'absolute',
    width: 40,
    height: 2,
    backgroundColor: 'rgba(255, 0, 0, 0.7)',
  },
  buttonContainer: {
    position: 'absolute',
    bottom: theme.spacing.xl,
    right: theme.spacing.xl,
    gap: theme.spacing.md,
  },
  locationButton: {
    backgroundColor: theme.colors.secondary,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 5,
  },
  addPointButton: { // Style for the new button
    backgroundColor: theme.colors.secondary, // Example color
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 5,
  },
  resetButton: { // Style for the new reset button
    backgroundColor: theme.colors.secondary, // Example color, can be different
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 5,
  },
  reportButton: {
    backgroundColor: theme.colors.primary,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 5,
  },
});

export default MapScreen; 