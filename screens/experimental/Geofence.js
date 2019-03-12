import React, { Component } from 'react';
import { Platform, Text, View, StyleSheet, Button } from 'react-native';
import { Constants, Location, Permissions } from 'expo';
import GlobalHeader from '../../components/GlobalHeader';
import ip from '../../ipstore';
import geolib from 'geolib';
import socketIO from 'socket.io-client';

export default class Geofence extends Component {
	state = {
		locationResult: null,
		// Cardiff Bay
		lat: 51.464143,
		long: -3.164009,
		withinRadius: '',
		Distance: ''
	};

	componentDidMount() {
		this._getLocationAsync();
		this.checkDriver();
	}

	async checkDriver() {
		const socket = socketIO.connect(`http://${ip}:3000`);
		socket.on('connect', () => {
			console.log('client connected');
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
			locationResult: location
		});

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
		if (this.state.locationResult == null) return null;
		return (
			<View style={styles.container}>
				<Text style={styles.paragraph}>Location:</Text>
				<Text>Ending position: Cardiff Bay</Text>
				<Text>Distance: {this.state.Distance}</Text>
				<Text>Within radius?: {this.state.withinRadius}</Text>
				<View>
					{/* <Button onPress={() => this.checkDriver()}> */}
					<Text onPress={() => this.checkDriver()}>Test</Text>
					{/* </Button> */}
				</View>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
		paddingTop: Constants.statusBarHeight,
		backgroundColor: '#ecf0f1'
	},
	paragraph: {
		margin: 24,
		fontSize: 18,
		fontWeight: 'bold',
		textAlign: 'center',
		color: '#34495e'
	}
});
