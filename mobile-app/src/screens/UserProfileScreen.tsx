import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView } from 'react-native';
import { theme } from '../theme/theme';

const UserProfileScreen = () => {
  // More extensive dummy user data
  const dummyUser = {
    username: 'RoadExplorer',
    email: 'road.explorer@roadfusion.com',
    memberSince: 'January 15, 2023',
    location: 'Frankfurt, Germany',
    reportsSubmitted: 42,
    bio: 'Passionate about improving road data accuracy and contributing to better navigation for everyone.',
    profilePicture: 'https://images.unsplash.com/photo-1539571696357-ec7ffa5696f7?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80', // Sample image from Unsplash
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.profileHeader}>
        <Image
          source={{ uri: dummyUser.profilePicture }}
          style={styles.profileImage}
        />
        <Text style={styles.username}>{dummyUser.username}</Text>
        <Text style={styles.email}>{dummyUser.email}</Text>
      </View>

      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>About</Text>
        <Text style={styles.bio}>{dummyUser.bio}</Text>
      </View>

      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Stats</Text>
        <View style={styles.statItem}>
          <Text style={styles.label}>Member Since:</Text>
          <Text style={styles.value}>{dummyUser.memberSince}</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.label}>Location:</Text>
          <Text style={styles.value}>{dummyUser.location}</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.label}>Reports Submitted:</Text>
          <Text style={styles.value}>{dummyUser.reportsSubmitted}</Text>
        </View>
      </View>

      {/* Add more sections or data here */}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  contentContainer: {
    padding: theme.spacing.lg,
    alignItems: 'center',
  },
  profileHeader: {
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: theme.spacing.md,
    borderWidth: 2,
    borderColor: theme.colors.primary,
  },
  username: {
    fontSize: theme.typography.h1.fontSize,
    fontWeight: theme.typography.h1.fontWeight as '700',
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  email: {
    fontSize: theme.typography.body.fontSize,
    color: theme.colors.gray,
  },
  sectionContainer: {
    width: '100%',
    marginBottom: theme.spacing.xl,
    padding: theme.spacing.md,
    backgroundColor: theme.colors.gray,
    borderRadius: theme.borderRadius.md,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  sectionTitle: {
    fontSize: theme.typography.h2.fontSize,
    fontWeight: theme.typography.h2.fontWeight as '700',
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.lightGray,
    paddingBottom: theme.spacing.sm,
  },
  bio: {
    fontSize: theme.typography.body.fontSize,
    color: theme.colors.text,
  },
  statItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.sm,
  },
  label: {
    fontSize: theme.typography.body.fontSize,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginRight: theme.spacing.sm,
  },
  value: {
    fontSize: theme.typography.body.fontSize,
    color: theme.colors.text,
  },
});

export default UserProfileScreen; 