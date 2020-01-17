import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  TouchableOpacity
} from 'react-native';
import MapView, { Marker, Callout } from 'react-native-maps';
import {
  requestPermissionsAsync,
  getCurrentPositionAsync
} from 'expo-location';
import { MaterialIcons } from '@expo/vector-icons';
import api from '../services/api';

export default function Main({ navigation }) {
  const [location, setLocation] = useState(null);
  const [devs, setDevs] = useState([]);
  const [stacks, setStacks] = useState('');

  useEffect(() => {
    async function loadInitPosition() {
      const { granted } = await requestPermissionsAsync();
      if (granted) {
        const { coords } = await getCurrentPositionAsync({
          enableHighAccuracy: true
        });
        const { latitude, longitude } = coords;
        setLocation({
          latitude,
          longitude,
          latitudeDelta: 0.04,
          longitudeDelta: 0.04
        });
      }
    }
    loadInitPosition();
  }, []);

  const handleLocationChanged = region => {
    setLocation(region);
  };

  const loadDevs = async () => {
    const { latitude, longitude } = location;

    const response = await api.get('/search', {
      params: {
        latitude,
        longitude,
        stacks
      }
    });
    console.log(response.data);
    setDevs(response.data);
  };

  if (!location) {
    return null;
  }

  return (
    <>
      <MapView
        onRegionChangeComplete={handleLocationChanged}
        style={styles.map}
        initialRegion={location}
      >
        {devs.map(dev => (
          <Marker
            key={dev._id}
            coordinate={{
              latitude: dev.location.coordinates[1],
              longitude: dev.location.coordinates[0]
            }}
          >
            <Image
              style={styles.avatar}
              source={{
                uri: dev.avatar_url
              }}
            />
            <Callout
              onPress={() => {
                navigation.navigate('Profile', {
                  github_username: dev.github_username
                });
              }}
            >
              <View style={styles.callout}>
                <Text style={styles.devName}>{dev.name}</Text>
                <Text style={styles.devBio}>{dev.bio}</Text>
                <Text style={styles.devStacks}>{dev.stacks.join(', ')}</Text>
              </View>
            </Callout>
          </Marker>
        ))}
      </MapView>
      <View style={styles.searchForm}>
        <TextInput
          style={styles.searchInput}
          placeholder='Buscar devs por Stacks'
          placeholderTextColor='#999'
          autoCapitalize='words'
          autoCorrect={false}
          value={stacks}
          onChangeText={setStacks}
        />
        <TouchableOpacity
          onPress={() => {
            loadDevs();
          }}
          style={styles.loadButton}
        >
          <MaterialIcons name='my-location' size={20} color='#fff' />
        </TouchableOpacity>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  map: {
    flex: 1
  },
  avatar: {
    width: 54,
    height: 54,
    borderColor: '#fff',
    borderWidth: 4,
    borderRadius: 4
  },
  callout: {
    width: 260
  },
  devName: {
    fontWeight: 'bold',
    fontSize: 16
  },
  devBio: {
    color: '#666',
    marginTop: 5
  },
  devStacks: {
    marginTop: 5
  },
  searchForm: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    zIndex: 5,
    flexDirection: 'row'
  },
  searchInput: {
    flex: 1,
    height: 50,
    backgroundColor: '#fff',
    color: '#333',
    borderRadius: 25,
    paddingHorizontal: 20,
    fontSize: 16,
    elevation: 1
  },
  loadButton: {
    width: 50,
    height: 50,
    backgroundColor: '#8e4dff',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 15
  }
});
