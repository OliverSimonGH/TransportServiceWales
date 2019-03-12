import { Button, Text } from 'native-base';
import React, { Component } from 'react';
import { Dimensions, StyleSheet, View, TextInput, Image } from 'react-native';
import { Constants, Location, Permissions, TaskManager } from 'expo';
import Icon from 'react-native-vector-icons/MaterialIcons';
import MapView, { Marker, Callout } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import API_KEY from '../../google_api_key';
import ip from '../../ipstore';
import socketIO from 'socket.io-client';

const { width, height } = Dimensions.get('window');
const ASPECT_RATIO = width / height;
const LATITUDE = 51.481583;
const LONGITUDE = -3.17909;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

class RouteScreen extends Component {
	static navigationOptions = {
		header: null
	};
	constructor(props) {
		super(props);

		// Start / End location
		this.state = {
			busStartingLocationLat: 51.47667946,
			busStartingLocationLong: -3.180427374,
			latDriver: null,
			longDriver: null,
			locationResult: null,
			driverStartedRoute: false,
			coordinates: [
				{
					latitude: 51.47667946,
					longitude: -3.180427374
				},
				{
					latitude: 51.48530001,
					longitude: -3.178014415
				}
			],
			data: [],
			distance: '',
			duration: '',
			xMapCoords: []
		};

		this.mapView = null;
		this.socket = null;
	}

	fetchData = async () => {
		const response = await fetch(`http://${ip}:3000/driver/schedule`);
		const coordinate = await response.json();
		this.setState({ data: coordinate });
	};

	componentDidMount = async () => {
		this.fetchData();
		this.openDriverSocket();
		this._getLocationAsync();

		await Location.startLocationUpdatesAsync('firstTask', {
			accuracy: Location.Accuracy.High
		});
	};

	// Get location permission
	_getLocationAsync = async () => {
		let { status } = await Permissions.askAsync(Permissions.LOCATION);
		if (status !== 'granted') {
			this.setState({
				locationResult: 'Permission to access location was denied'
			});
		}
		// Get driver location
		let location = await Location.getCurrentPositionAsync({});
		this.setState({
			locationResult: location,
			latDriver: location.coords.latitude,
			longDriver: location.coords.longitude,
			hasData: true
		});
		console.log(location);
	};

	async openDriverSocket() {
		this.socket = socketIO.connect(`http://${ip}:3000`);
		this.socket.on('connect', () => {
			console.log('driver client connected');
			this.socket.emit('connectDriver');
		});
	}

	startRoute() {
		this.socket.emit('driverLocation', {
			latitude: this.state.latDriver,
			longitude: this.state.longDriver
		});

		this.setState({
			driverStartedRoute: true
		});

		// Return location of specific start place
		// ...
		// Start Maps
	}

	TestStates = () => {
		const data = {
			check: this.state.longDriver
		};
		console.log(data);
	};

	testLocation = async () => {
		await Location.startLocationUpdatesAsync('firstTask', {
			accuracy: Location.Accuracy.High,
			timeInterval: 15000,
			distanceInterval: 5
		});

		console.log('Tracking?');
	};

	render() {
		//if (this.state.longDriver == null) return null;

		let driverMarker = null;

		if (this.state.driverStartedRoute) {
			driverMarker = (
				<Marker
					coordinate={{ longitude: this.state.longDriver, latitude: this.state.latDriver }}
					title={'Service XX'}
					description={'Bus Location'}
				>
					<Image source={require('../../assets/images/bus-icon.png')} style={{ width: 40, height: 40 }} />
				</Marker>
			);
		}
		return (
			<View style={StyleSheet.absoluteFill}>
				<View style={styles.bottom}>
					<Button style={styles.journeyInfoContainer}>
						<View>
							<Text style={styles.journeyInfo}>
								<Icon name="schedule" size={15} /> {parseInt(this.state.duration)} Min
							</Text>
						</View>
						<View>
							<Text style={styles.journeyInfo}>
								<Icon name="directions-bus" size={15} /> {this.state.distance.toString().slice(0, -1)}{' '}
								Miles
							</Text>
						</View>
					</Button>
				</View>

				<MapView
					initialRegion={{
						latitude: LATITUDE,
						longitude: LONGITUDE,
						latitudeDelta: LATITUDE_DELTA,
						longitudeDelta: LONGITUDE_DELTA
					}}
					style={StyleSheet.absoluteFill}
					ref={(c) => (this.mapView = c)}
					onPress={this.onMapPress}
				>
					{this.state.coordinates.map((coordinate, index) => (
						<MapView.Marker
							pinColor="rgba(46, 49, 50, 0.5)"
							key={`coordinate_${index}`}
							coordinate={coordinate}
							title={'Predefined Stop'}
							description={'start/end destination of the service'}
						/>
					))}
					{this.state.data.map((marker, index) => (
						<Marker
							pinColor={'green'}
							key={index}
							coordinate={{ longitude: marker.longitude, latitude: marker.latitude }}
							title={marker.street}
							description={`Passengers: ${marker.no_of_passengers.toString()}`}
						/>
					))}

					{this.state.data.length >= 1 && (
						<MapViewDirections
							origin={this.state.coordinates[0]}
							//	waypoints={this.state.coordinates.length > 2 ? this.state.coordinates.slice(1, -1) : null}
							waypoints={this.state.data}
							destination={this.state.coordinates[this.state.coordinates.length - 1]}
							apikey={API_KEY}
							strokeWidth={4}
							strokeColor="rgba(253, 113, 103, 1)"
							optimizeWaypoints={true}
							onStart={(params) => {
								console.log(`Started routing between "${params.origin}" and "${params.destination}"`);
							}}
							onReady={(result) => {
								this.setState({
									distance: result.distance,
									duration: result.duration,
									xMapCoords: result.coordinates
								});

								this.mapView.fitToCoordinates(result.coordinates, {
									edgePadding: {
										right: width / 20,
										bottom: height / 20,
										left: width / 20,
										top: height / 20
									}
								});
							}}
							onError={(errorMessage) => {
								// console.log('GOT AN ERROR');
							}}
						/>
					)}
					{driverMarker}
				</MapView>
				<Callout>
					<View style={styles.calloutView}>
						<Button
							style={styles.journeyInfoContainer}
							onPress={() => {
								this.props.navigation.navigate('SelectedJourney');
							}}
						>
							<View>
								<Text style={styles.journeyInfo}>
									<Icon name="arrow-back" size={15} /> Back
								</Text>
							</View>
						</Button>
					</View>
					<View style={styles.calloutView}>
						<Button
							style={styles.journeyInfoContainer}
							onPress={() => {
								this.startRoute();
								this.TestStates();
								this.testLocation();
							}}
						>
							<View>
								<Text style={styles.journeyInfo}>Start Route</Text>
							</View>
						</Button>
					</View>
				</Callout>
			</View>
		);
	}
}
const styles = StyleSheet.create({
	buttonStyle: {
		fontWeight: 'bold',
		backgroundColor: '#f4f4f4'
	},
	bottom: {
		flex: 1,
		justifyContent: 'flex-end',
		marginBottom: 5,
		marginLeft: 2
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
		marginTop: 30
	},
	calloutSearch: {
		borderColor: 'transparent',
		textAlign: 'center',
		height: 40,
		width: '90%'
	}
});

export default RouteScreen;

TaskManager.defineTask('firstTask', ({ data, error }) => {
	console.log('location update');
	if (error) {
		console.log(error);
		return;
	}
	if (data) {
		const { locations } = data;
		// do something with the locations captured in the background
		console.log('locations XXXXXXXXXXX', locations);
	}
});

// export const BACKGROUND_LOCATION_UPDATES_TASK = 'background-location-updates'

// TaskManager.defineTask(BACKGROUND_LOCATION_UPDATES_TASK, handleLocationUpdate)

// export async function handleLocationUpdate({ data, error }) {
//     console.log('location update')
//     if (error) {
// 		return
// 	}
//      if (data) {
//         try {
//             const { locations } = data
//             console.log('locations',locations)
//         } catch (error) {
//             console.log('the error',error)
//         }
//     }
// }

// export async function initializeBackgroundLocation(){
//     let isRegistered = await TaskManager.isTaskRegisteredAsync(BACKGROUND_LOCATION_UPDATES_TASK)
//     if (!isRegistered) await Location.startLocationUpdatesAsync(BACKGROUND_LOCATION_UPDATES_TASK, {
//         accuracy: Location.Accuracy.High,
//         /* after edit */
//         timeInterval: 2500,
//         distanceInterval: 5,
//     })
// }
