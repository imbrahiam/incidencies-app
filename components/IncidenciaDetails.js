import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Audio } from 'expo-av';
import Slider from '@react-native-community/slider';

const IncidenciaDetail = ({ route }) => {
  const { incidencia } = route.params;
  const [sound, setSound] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1.0);

  const playPauseAudio = async () => {
    if (sound) {
      if (isPlaying) {
        await sound.pauseAsync();
      } else {
        await sound.playAsync();
      }
      setIsPlaying(!isPlaying);
    } else {
      const { sound } = await Audio.Sound.createAsync({ uri: incidencia.audio });
      setSound(sound);
      await sound.playAsync();
      setIsPlaying(true);
    }
  };

  const changeVolume = async (value) => {
    setVolume(value);
    if (sound) {
      await sound.setVolumeAsync(value);
    }
  };

  useEffect(() => {
    return sound
      ? () => {
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    }).format(date);
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Image source={{ uri: incidencia.foto }} style={styles.image} />
        <Text style={styles.title}>{incidencia.titulo}</Text>
        <Text style={styles.date}>{formatDate(incidencia.fecha)}</Text>
        <Text style={styles.description}>{incidencia.descripcion}</Text>

        {incidencia.audio ? (
          <>
            <TouchableOpacity onPress={playPauseAudio} style={styles.button}>
              <Text style={styles.buttonText}>
                {isPlaying ? 'Pausar Audio' : 'Reproducir Audio'}
              </Text>
            </TouchableOpacity>
            <View style={styles.volumeContainer}>
              <Text style={styles.volumeText}>Volumen</Text>
              <Slider
                style={styles.slider}
                minimumValue={0}
                maximumValue={1}
                value={volume}
                onValueChange={changeVolume}
              />
            </View>
          </>
        ) : null}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f8f8f8',
  },
  card: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 20,
    marginVertical: 10,
    backgroundColor: '#fff',
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  date: {
    fontSize: 18,
    color: '#666',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    color: '#444',
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    marginVertical: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  volumeContainer: {
    width: '100%',
    alignItems: 'center',
    marginVertical: 20,
  },
  volumeText: {
    fontSize: 18,
    color: '#333',
    marginBottom: 10,
  },
  slider: {
    width: '80%',
    height: 40,
  },
});

export default IncidenciaDetail;
