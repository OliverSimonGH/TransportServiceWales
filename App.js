import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View} from 'react-native';
import MapView, { Marker } from 'react-native-maps';

const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' + 'Cmd+D or shake for dev menu',
  android:
    'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});

type Props = {};
export default class App extends Component<Props> {
  constructor(props) {
    super(props);

    this.state = {
      latitude: 0,
      longtitude: 0
    }
  }
compomentDidMount() {
  this.watchId = navigator.geolocation.watchPosition(
    (position) => {
      this.setState({
        latitude: position.coords.latitude,
        longtitude: position.coords.longtitide
      });
    },
    (error) => {
      this.setState({ error: error.message })
    },
    { enableHighAccuracy: false, timeout: 1, maximunAge: 1, distanceFilter: 1 }
  )
}

  render() {
    let initialRegion = {
      latitude:51.589803,
      longtitude: -2.998024,
      latitudeDelta: 0.01,
      longtitudeDelta: 0.01
    }
    let myCoordinate = {latitude:51.589803, longtitude: -2.998024}
    let myLocation = {latitude: this.state.latitude, longtitude: this.state.longtitude }
    return (
      <View style={styles.container}>
        <MapView> style={styles.map} 
        <Marker coordinate={ myCoordinate } />
        <Marker pinColor={ 'green'} coordinate={ myLocation } />
        </MapView>
      </View>   
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  map: {
    position: 'absolute',
    left: 0,
    top: 0,
    right: 0,
    bottom: 0
  }
});
