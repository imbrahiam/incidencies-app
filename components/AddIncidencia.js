import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Alert, ScrollView, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard, Platform } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Audio } from 'expo-av';
import Slider from '@react-native-community/slider';
import { addIncidencia } from './database';

const AddIncidencia = ({ navigation }) => {
  const [titulo, setTitulo] = useState('');
  const [fecha, setFecha] = useState(new Date());
  const [descripcion, setDescripcion] = useState('');
  const [foto, setFoto] = useState(null);
  const [audio, setAudio] = useState(null);
  const [sound, setSound] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1.0);
  const [showDatePicker, setShowDatePicker] = useState(false);

const handleAddIncidencia = async () => {
  if (!titulo || !foto) { // Removed descripcion and audio from the check
    Alert.alert('Error', 'El título y la foto son obligatorios');
    return;
  }

  const newIncidencia = {
    id: Date.now().toString(),
    titulo,
    fecha: new Date().toISOString(), // Store full datetime
    descripcion,
    foto,
    audio,
  };

  await addIncidencia(titulo, new Date().toISOString(), descripcion, foto, audio);
  navigation.goBack();
};

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setFoto(result.assets[0].uri);
    }
  };

  const pickAudio = async () => {
    let result = await DocumentPicker.getDocumentAsync({
      type: 'audio/*',
      copyToCacheDirectory: true,
    });

    if (result.type !== 'cancel') {
      setAudio(result.assets[0].uri);
    }
  };

  const playPauseAudio = async () => {
    if (sound) {
      if (isPlaying) {
        await sound.pauseAsync();
      } else {
        await sound.playAsync();
      }
      setIsPlaying(!isPlaying);
    } else {
      const { sound } = await Audio.Sound.createAsync({ uri: audio });
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

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.card}>
            <TextInput
              placeholder="Ingrese el título"
              value={titulo}
              onChangeText={setTitulo}
              style={styles.input}
              placeholderTextColor="#ccc"
            />
            <View style={styles.datePickerContainer}>
              {Platform.OS === 'ios' ? (
                <DateTimePicker
                  value={fecha}
                  mode="date"
                  display="default"
                  style={styles.datePicker}
                  onChange={(event, selectedDate) => {
                    if (selectedDate) {
                      setFecha(selectedDate);
                    }
                  }}
                />
              ) : (
                <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.datePickerButton}>
                  <Text style={styles.datePickerButtonText}>
                    {fecha.toISOString().split('T')[0]}
                  </Text>
                </TouchableOpacity>
              )}
              {showDatePicker && Platform.OS !== 'ios' && (
                <DateTimePicker
                  value={fecha}
                  mode="date"
                  display="default"
                  onChange={(event, selectedDate) => {
                    setShowDatePicker(false);
                    if (selectedDate) {
                      setFecha(selectedDate);
                    }
                  }}
                />
              )}
            </View>
            <TextInput
              placeholder="Ingrese la descripción (opcional)"
              value={descripcion}
              onChangeText={setDescripcion}
              style={styles.input}
              placeholderTextColor="#ccc"
            />
            <TouchableOpacity onPress={pickImage} style={styles.imagePickerButton}>
              <Text style={styles.imagePickerButtonText}>Seleccionar Foto</Text>
            </TouchableOpacity>
            <View style={styles.mediaCard}>
              {foto ? (
                <Image source={{ uri: foto }} style={styles.image} />
              ) : (
                <Text style={styles.placeholderText}>Foto no seleccionada</Text>
              )}
            </View>
            <TouchableOpacity onPress={pickAudio} style={styles.audioPickerButton}>
              <Text style={styles.audioPickerButtonText}>Seleccionar Audio (opcional)</Text>
            </TouchableOpacity>
            <View style={styles.mediaCard}>
              {audio ? (
                <>
                  <Text style={styles.audioText}>{audio.split('/').pop()}</Text>
                  <TouchableOpacity onPress={playPauseAudio} style={styles.playAudioButton}>
                    <Text style={styles.playAudioButtonText}>{isPlaying ? 'Pausar Audio' : 'Reproducir Audio'}</Text>
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
              ) : (
                <Text style={styles.placeholderText}>Audio no seleccionado</Text>
              )}
            </View>
            <TouchableOpacity onPress={handleAddIncidencia} style={styles.submitButton}>
              <Text style={styles.submitButtonText}>Agregar Incidencia</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  card: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 20,
    width: '100%',
    backgroundColor: '#fff',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 10,
    borderRadius: 10,
    backgroundColor: '#fff',
    fontSize: 16,
  },
  datePickerContainer: {
    alignItems: 'center',
    marginBottom: 10,
  },
  datePicker: {
    width: '100%',
    marginVertical: 10,
  },
  datePickerButton: {
    backgroundColor: '#007AFF',
    padding: 10,
    marginVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  datePickerButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  imagePickerButton: {
    backgroundColor: '#007AFF',
    padding: 10,
    marginVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  imagePickerButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  audioPickerButton: {
    backgroundColor: '#007AFF',
    padding: 10,
    marginVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  audioPickerButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  submitButton: {
    backgroundColor: '#007AFF',
    padding: 10,
    marginVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  mediaCard: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 10,
    marginVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    height: 200,
    width: '100%',
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
  },
  placeholderText: {
    color: '#ccc',
    fontStyle: 'italic',
  },
  audioText: {
    marginTop: 10,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  playAudioButton: {
    backgroundColor: '#007AFF',
    padding: 10,
    marginVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  playAudioButtonText: {
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

export default AddIncidencia;
