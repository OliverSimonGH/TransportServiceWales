import React, { Component } from 'react';
import { Platform, Text, View, StyleSheet, Button, Image, Dimensions, Alert } from 'react-native';
import { Constants, Location, Permissions, TaskManager } from 'expo';
import GlobalHeader from '../../components/GlobalHeader';
import MapView, { Polyline, Marker } from 'react-native-maps';
import PolyLine from '@mapbox/polyline';
import _ from 'lodash';
import API_KEY from '../../google_api_key';
import ip from '../../ipstore';
import geolib from 'geolib';
import socketIO from 'socket.io-client';

let { width, height } = Dimensions.get('window');
const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

export default class Geofence extends Component {
	static navigationOptions = {
		header: null
	};
	state = {
		locationResult: null,
		// Cardiff Bay
		lat: null,
		long: null,
		withinRadius: '',
		Distance: '',
		check: '',
		driverLocation: null,
		mapCoords: null,
		isDriverOnTheWay: false,
		hasData: false,
		pointCoords: []
	};

	componentDidMount() {
		this._getLocationAsync();
		this.checkDriver();
	}

	// Socket connection -- connecting passengers to a vehicle tracking socket in the server
	// Retrieving data from the driver side via the driver to passenger socket
	async checkDriver() {
		const socket = socketIO.connect(`http://${ip}:3000`);
		socket.on('connect', () => {
			console.log('client connected');
			socket.emit('trackVehicle');
		});

		socket.on('driverLocation', (driverLocation) => {
			const pointCoords = [ ...this.state.pointCoords, driverLocation ];
			this.map.fitToCoordinates(pointCoords, {
				edgePadding: { top: 20, bottom: 20, left: 20, right: 20 }
			});

			this.setState({
				check: 'Yes you are getting data from driver side',
				isDriverOnTheWay: true,
				driverLocation: driverLocation
			});

			//console.log(pointCoords);
		});
	}

	// Get location permission
	_getLocationAsync = async () => {
		let { status } = await Permissions.askAsync(Permissions.LOCATION);
		if (status !== 'granted') {
			this.setState({
				locationResult: 'Permission to access location was denied'
			});
		}
		// Get user's location
		let location = await Location.getCurrentPositionAsync({});
		this.setState({
			locationResult: location,
			lat: location.coords.latitude,
			long: location.coords.longitude,

			hasData: true
		});
		console.log(location);

		// Check if the driver's (point) position is within x amount of Kilometers from user's position
		let isNearby = await geolib.isPointInCircle(
			// User Position
			{ latitude: location.coords.latitude, longitude: location.coords.longitude },
			// Point Position
			{ latitude: this.state.lat, longitude: this.state.long },
			// Radius in KM
			5000
		);
		// If if it's true or false, set state and distance
		if (isNearby === true) {
			let c = geolib.getDistance(
				// User Position
				{ latitude: location.coords.latitude, longitude: location.coords.longitude },
				// Point Position
				{ latitude: this.state.lat, longitude: this.state.long }
			);
			this.setState({
				withinRadius: 'Yes',
				Distance: c
			});
		} else {
			this.setState({
				withinRadius: 'No',
				Distance: 'Unknown'
			});
		}
	};

	render() {
		// Check content of the data before rendereing
		//if (this.state.lat == null) return null;

		let marker = null;
		let driverMarker = null;

		if (this.state.isDriverOnTheWay) {
			driverMarker = (
				<Marker coordinate={this.state.driverLocation} title={'Service XX'} description={'Bus Location'}>
					<Image source={require('../../assets/images/bus-icon.png')} style={{ width: 40, height: 40 }} />
				</Marker>
			);
		}
		return (
			<View style={styles.container}>
				<MapView
					ref={(map) => {
						this.map = map;
					}}
					style={styles.map}
					initialRegion={{
						latitude: this.state.lat,
						longitude: this.state.long,
						latitudeDelta: LATITUDE_DELTA,
						longitudeDelta: LONGITUDE_DELTA
					}}
					showsUserLocation={true}
				>
					{driverMarker}
				</MapView>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	findDriver: {
		backgroundColor: 'black',
		marginTop: 'auto',
		margin: 20,
		padding: 15,
		paddingLeft: 30,
		paddingRight: 30,
		alignSelf: 'center'
	},
	findDriverText: {
		fontSize: 20,
		color: 'white',
		fontWeight: '600'
	},
	suggestions: {
		backgroundColor: 'white',
		padding: 5,
		fontSize: 18,
		borderWidth: 0.5,
		marginLeft: 5,
		marginRight: 5
	},
	destinationInput: {
		height: 40,
		borderWidth: 0.5,
		marginTop: 50,
		marginLeft: 5,
		marginRight: 5,
		padding: 5,
		backgroundColor: 'white'
	},
	container: {
		...StyleSheet.absoluteFillObject
	},
	map: {
		...StyleSheet.absoluteFillObject
	}
});
