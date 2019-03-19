import React, { Component } from 'react';
import { Platform, Text, View, StyleSheet, Button, Image, Dimensions, Alert } from 'react-native';
import { Constants, Location, Permissions, TaskManager, Notifications } from 'expo';
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
		pointCoords: [],
		deviceToken: ''
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
				title: 'Demo',
				priority: 'high',
				body: 'Demo Check',
				sound: 'default', // android 7.0 , 6, 5 , 4
				channelId: 'reminders' // android 8.0 later
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
				check: 'Yes you are getting data from driver side',
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
				let c = geolib.getDistance(
					// User Position
					{ latitude: driverLocation.latitude, longitude: driverLocation.longitude },
					// Point Position
					{ latitude: this.state.lat, longitude: this.state.long }
				);
				this.setState({
					withinRadius: 'Yes',
					Distance: c
				});

				//Alert.alert(`Driver is ${c} metre's away`);
				console.log('ENTERED REGION', c);
				this.sendPushNotification();

				// insert send text-notifcation
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
			long: location.coords.longitude,
			hasData: true
		});
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
		// backgroundColor: 'rgba(255, 255, 255, 0.9)',
		// borderRadius: 10,
		// width: '40%',
		marginLeft: '5%',
		// marginRight: '30%',
		marginTop: 50
	}
});
