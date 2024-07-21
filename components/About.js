import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const About = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Acerca de la App</Text>
      <Text>Esta aplicación fue desarrollada por Brahiam Montero.</Text>
      <Text></Text>
      <Text>Versión 1.0.0</Text>
      <Text>[2022-2034]</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f0f0f0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
});

export default About;
