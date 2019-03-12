import React, { Component } from 'react';
import { Platform, Text, View, StyleSheet, Button } from 'react-native';
import { Constants, Location, Permissions } from 'expo';
import GlobalHeader from '../../components/GlobalHeader';
import MapView, { Polyline, Marker } from 'react-native-maps';
import PolyLine from '@mapbox/polyline';
import _ from 'lodash';
import API_KEY from '../../google_api_key';
import ip from '../../ipstore';
import geolib from 'geolib';
import socketIO from 'socket.io-client';

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
		isDriverOnTheWay: false,
		hasData: false
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
			this.setState({
				check: 'Yes you are getting data from driver side',
				isDriverOnTheWay: true,
				driverLocation: driverLocation
			});
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
		console.log(location.coords.latitude);

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
			driverMarker = <Marker coordinate={this.state.driverLocation} />;
		}
		return (
			// <View style={styles.container}>
			// 	<Text style={styles.paragraph}>Location:</Text>
			// 	<Text>Ending position: Cardiff Bay</Text>
			// 	<Text>{this.state.check}</Text>
			// 	<Text>Distance: {this.state.Distance}</Text>
			// 	<Text>Within radius?: {this.state.withinRadius}</Text>
			// 	<View>
			// 		{/* <Button onPress={() => this.checkDriver()}> */}
			// 		<Text onPress={() => this.checkDriver()}>Test</Text>
			// 		{/* </Button> */}
			// 	</View>
			// </View>

			<View style={styles.container}>
				{/* {this.state.hasData === true && ( */}

				<MapView
					ref={(map) => {
						this.map = map;
					}}
					style={styles.map}
					initialRegion={{
						latitude: this.state.lat,
						longitude: this.state.long,
						latitudeDelta: 0.015,
						longitudeDelta: 0.0121
					}}
					showsUserLocation={true}
				>
					{driverMarker}
				</MapView>
				{/* )}; */}
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
