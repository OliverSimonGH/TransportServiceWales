import React, { Component } from 'react';
import { Platform, View, StyleSheet, Button, Image, Dimensions } from 'react-native';
import { Location, Permissions, Notifications } from 'expo';
import MapView, { Polyline, Marker } from 'react-native-maps';
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
		lat: null,
		long: null,
		withinRadius: '',
		Distance: '',
		driverLocation: null,
		mapCoords: null,
		isDriverOnTheWay: false,
		pointCoords: [],
		deviceToken: '',
		pickupLocation: '55 Mary Street'
	};

	componentDidMount() {
		this._getLocationAsync();
		this.checkDriver();
		// Channel for popup notifications
		if (Platform.OS === 'android') {
			Expo.Notifications.createChannelAndroidAsync('reminders', {
				name: 'Reminders',
				priority: 'max',
				vibrate: [ 0, 250, 250, 250 ]
			});
		}
	}

	async componentWillMount() {
		await this.registerForPushNotificationsAsync();
	}

	registerForPushNotificationsAsync = async () => {
		const { status: existingStatus } = await Permissions.getAsync(Permissions.NOTIFICATIONS);
		let finalStatus = existingStatus;

		// only ask if permissions have not already been determined, because
		// iOS won't necessarily prompt the user a second time.
		if (existingStatus !== 'granted') {
			// Android remote notification permissions are granted during the app
			// install, so this will only ask on iOS
			const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
			finalStatus = status;
		}

		// Stop here if the user did not grant permissions
		if (finalStatus !== 'granted') {
			return;
		}

		// Get the token that uniquely identifies this device
		let token = await Notifications.getExpoPushTokenAsync();
		this.setState({
			deviceToken: token
		});
		console.log(token);
	};

	sendPushNotification = () => {
		let response = fetch('https://exp.host/--/api/v2/push/send', {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				to: `${this.state.deviceToken}`,
				sound: 'default',
				title: 'Your transport is nearby!',
				priority: 'high',
				body: `Service 43 will be at ${this.state.pickupLocation} in ${this.state.Distance} meters`, // insert service number, pickup location
				sound: 'default', // android 7.0 , 6, 5 , 4
				channelId: 'reminders', // android 8.0 later
				icon: '../../assets/images/Notification_Icon_3.png'
			})
		});
		console.log(response);
	};

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
			this.setState({
				isDriverOnTheWay: true,
				driverLocation: driverLocation
			});

			// Check if the driver's (point) position is within x amount of metre from user's position
			let isNearby = geolib.isPointInCircle(
				// Vehicle Position
				{ latitude: driverLocation.latitude, longitude: driverLocation.longitude },
				// Point/User Position (checking if above has entered region below)
				{ latitude: this.state.lat, longitude: this.state.long },
				// Radius in metre
				20
			);
			// If if it's true or false, set state and distance
			if (isNearby === true) {
				let distance = geolib.getDistance(
					// User Position
					{ latitude: driverLocation.latitude, longitude: driverLocation.longitude },
					// Point Position
					{ latitude: this.state.lat, longitude: this.state.long }
				);
				this.setState({
					withinRadius: 'Yes',
					Distance: distance
				});
				console.log('ENTERED REGION', distance);
				this.sendPushNotification();
			} else {
				this.setState({
					withinRadius: 'No',
					Distance: 'Unknown'
				});
			}
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
			long: location.coords.longitude
		});
	};

	render() {
		let driverMarker = null;
		if (this.state.isDriverOnTheWay) {
			driverMarker = (
				<Marker coordinate={this.state.driverLocation} title={'Service XX'} description={'Bus Location'}>
					<Image source={require('../../assets/images/bus-icon.png')} style={{ width: 40, height: 40 }} />
				</Marker>
			);
		}
		return (
			<View style={StyleSheet.absoluteFill}>
				<MapView
					ref={(map) => {
						this.map = map;
					}}
					style={StyleSheet.absoluteFill}
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
				<View style={styles.calloutView}>
					<Button
						onPress={() => {
							this.sendPushNotification();
						}}
						title="Press Me"
					/>
				</View>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		...StyleSheet.absoluteFillObject
	},
	map: {
		...StyleSheet.absoluteFillObject
	},
	journeyInfo: {
		color: 'black'
	},
	journeyInfoContainer: {
		backgroundColor: 'white',
		borderColor: 'rgba(46, 49, 50, 0.5)',

		borderWidth: 1
	},
	calloutView: {
		flexDirection: 'row',
		marginLeft: '5%',
		marginTop: 50
	}
});
