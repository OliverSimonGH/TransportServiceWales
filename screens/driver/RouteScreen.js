import { Button, Text } from 'native-base';
import React, { Component } from 'react';
import { Dimensions, StyleSheet, View, TextInput } from 'react-native';

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

	componentDidMount() {
		this.fetchData();
		this.openDriverSocket();
	}

	async openDriverSocket() {
		this.socket = socketIO.connect(`http://${ip}:3000`);
		this.socket.on('connect', () => {
			console.log('driver client connected');
			this.socket.emit('connectDriver');
		});
	}

	startRoute() {
		this.socket.emit('driverLocation', {
			latitude: this.state.busStartingLocationLat,
			longitude: this.state.busStartingLocationLong
		});

		// Return location of specific start place
		// ...
		// Start Maps
	}

	TestStates = () => {
		const data = {
			check: this.state.xMapCoords
		};
		//console.log(data);
	};

	render() {
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
