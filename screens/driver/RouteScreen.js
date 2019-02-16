import React, { Component } from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import { Container, Content, Button, Text, Accordion, H2, Right } from 'native-base';
import MapView, { Marker, Polyline, Circle } from 'react-native-maps';
import API_KEY from '../../google_api_key';
import MapViewDirections from 'react-native-maps-directions';

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
			data: []
		};

		this.mapView = null;
	}

	fetchData = async () => {
		const response = await fetch('http://192.168.0.33:3000/driver/schedule');
		const coordinate = await response.json();
		this.setState({ data: coordinate });
	};

	componentDidMount() {
		this.fetchData();
	}

	render() {
		return (
			<View style={StyleSheet.absoluteFill}>
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
						<MapView.Marker pinColor="white" key={`coordinate_${index}`} coordinate={coordinate} />
					))}
					{this.state.data.map((marker, index) => (
						<Marker
							pinColor={'green'}
							key={index}
							coordinate={{ longitude: marker.longitude, latitude: marker.latitude }}
							title="Street Name"
							description="# Passengers"
						/>
					))}
					{this.state.data.length >= 1 && (
						<MapViewDirections
							origin={this.state.coordinates[0]}
							//	waypoints={this.state.coordinates.length > 2 ? this.state.coordinates.slice(1, -1) : null}
							waypoints={this.state.data}
							destination={this.state.coordinates[this.state.coordinates.length - 1]}
							apikey={API_KEY}
							strokeWidth={3}
							strokeColor="hotpink"
							optimizeWaypoints={true}
							onStart={(params) => {
								console.log(`Started routing between "${params.origin}" and "${params.destination}"`);
							}}
							onReady={(result) => {
								console.log(`Distance: ${result.distance} km`);
								console.log(`Duration: ${result.duration} min.`);

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
			</View>
		);
	}
}
const styles = StyleSheet.create({
	buttonStyle: {
		fontWeight: 'bold',
		backgroundColor: '#f4f4f4'
	}
});

export default RouteScreen;
