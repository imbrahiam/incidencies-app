import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { FontAwesome } from '@expo/vector-icons';
import IncidenciaList from './components/IncidenciaList';
import IncidenciaDetails from './components/IncidenciaDetails';
import AddIncidencia from './components/AddIncidencia';
import About from './components/About';
import { setupDatabase } from './components/database';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function IncidenciaStack() {
  return (
    <Stack.Navigator initialRouteName="IncidenciasList">
      <Stack.Screen name="IncidenciasList" component={IncidenciaList} options={{ title: 'Incidencias' }} />
      <Stack.Screen name="AddIncidencia" component={AddIncidencia} options={{ title: 'Agregar Incidencia' }} />
      <Stack.Screen name="IncidenciaDetail" component={IncidenciaDetails} options={{ title: 'Detalle de Incidencia' }} />
      <Stack.Screen name="About" component={About} options={{ title: 'Acerca de' }} />
    </Stack.Navigator>
  );
}

export default function App() {
  React.useEffect(() => {
    setupDatabase();
  }, []);

  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen 
          name="Home" 
          component={IncidenciaStack} 
          options={{
            tabBarIcon: ({ color }) => <FontAwesome name="list" color={color} size={24} />,
          }}
        />
        <Tab.Screen 
          name="About" 
          component={About} 
          options={{
            tabBarIcon: ({ color }) => <FontAwesome name="info-circle" color={color} size={24} />,
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
