import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackHeaderProps } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../theme/theme';

// Assuming the logo is placed in RoadFusionV1/assets
import Logo from '../../assets/logo-no-bg.png';

const MapScreenHeader = ({ navigation, route, options }: NativeStackHeaderProps) => {
  return (
    <View style={styles.headerContainer}>
      {/* Left side: Logo and App Name */}
      <View style={styles.leftContainer}>
        <Image
          source={Logo}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.appName}>RoadFusion</Text>
      </View>

      {/* Right side: User Icon */}
      <View style={styles.rightContainer}>
        <TouchableOpacity onPress={() => navigation.navigate('UserProfile')}>
          <Ionicons name="person-circle-outline" size={30} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: theme.colors.primary, // Use your theme's primary color
    height: 100, // Increased header height
    paddingHorizontal: 25, // Increased horizontal padding
    paddingTop: 35, // Added top padding to shift content down
  },
  leftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    width: 30, // Adjust size as needed
    height: 30, // Adjust size as needed
    marginRight: theme.spacing.sm,
  },
  appName: {
    fontSize: 18, // Adjust font size as needed
    fontWeight: 'bold',
    color: 'white', // App name color
  },
  rightContainer: {
    // Additional styling for the right container if needed
  },
});

export default MapScreenHeader; 