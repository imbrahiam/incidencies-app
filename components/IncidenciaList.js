import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { getIncidencias, deleteAllIncidencias } from './database';

const IncidenciaList = () => {
  const [incidencias, setIncidencias] = useState([]);
  const navigation = useNavigation();

  const fetchIncidencias = useCallback(async () => {
    try {
      const data = await getIncidencias();
      // Sort the data by fecha in descending order
      const sortedData = data.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
      setIncidencias(sortedData);
    } catch (error) {
      console.error('Error fetching incidencias:', error);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchIncidencias();
    }, [fetchIncidencias])
  );

  const handleDeleteAllIncidencias = async () => {
    Alert.alert(
      "Confirmación",
      "¿Está seguro de que desea eliminar todas las incidencias?",
      [
        {
          text: "Cancelar",
          style: "cancel"
        },
        {
          text: "Eliminar",
          onPress: async () => {
            try {
              await deleteAllIncidencias();
              setIncidencias([]);
            } catch (error) {
              console.error('Error deleting all incidencias:', error);
            }
          },
          style: "destructive"
        }
      ]
    );
  };

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

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.item}
      onPress={() => navigation.navigate('IncidenciaDetail', { incidencia: item })}
    >
      <Text style={styles.title}>{item.titulo}</Text>
      <Text>{formatDate(item.fecha)}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate('AddIncidencia')}
      >
        <Text style={styles.addButtonText}>Agregar Incidencia</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={handleDeleteAllIncidencias}
      >
        <Text style={styles.deleteButtonText}>Eliminar Todas las Incidencias</Text>
      </TouchableOpacity>
      {incidencias.length === 0 ? (
        <Text style={styles.noIncidenciasText}>No hay incidencias registradas</Text>
      ) : (
        <FlatList
          data={incidencias}
          renderItem={renderItem}
          keyExtractor={item => item.id.toString()}
          style={styles.list}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  list: {
    width: '100%',
    marginTop: 20,
  },
  item: {
    backgroundColor: '#fff',
    padding: 20,
    marginVertical: 8,
    borderRadius: 10,
    borderColor: '#ccc',
    borderWidth: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  addButton: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  deleteButton: {
    backgroundColor: '#FF6347',
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  noIncidenciasText: {
    marginTop: 20,
    fontSize: 18,
    color: '#999',
  },
});

export default IncidenciaList;
