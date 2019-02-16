import React from 'react';
import { Image, Platform, ScrollView, StyleSheet, FlatList, TouchableOpacity, View, Dimensions } from 'react-native';
import { WebBrowser } from 'expo';

import { MonoText } from '../../components/StyledText';
import MapView, { Marker, Polyline, Circle } from 'react-native-maps';
import PolyLine from '@mapbox/polyline';
import GlobalHeader from '../../components/GlobalHeader';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {
	Content,
	Container,
	Button,
	Text,
	Accordion,
	Card,
	CardItem,
	Body,
	Header,
	H1,
	Right,
	H3,
	H2
} from 'native-base';

export default class MySchedule extends React.Component {
	static navigationOptions = {
		header: null
	};

	state = {
		data: [],
		mapRegion: { latitude: 51.481583, longitude: -3.17909, latitudeDelta: 0.0122, longitudeDelta: 0.0121 },
		locationResult: null,
		currentLatitude: null,
		currentLongitude: null,
		location: { coords: { latitude: 51.481583, longitude: -3.17909 } },
		LATLNG: {
			latitude: 51.481583,
			longitude: -3.17909
		}
	};

	fetchData = async () => {
		const response = await fetch('http://192.168.0.10:3000/driver/schedule');
		const coordinate = await response.json();
		this.setState({ data: coordinate });
	};

	componentDidMount() {
		this.fetchData();
	}

	TestStates = () => {
		const data = {
			coordsArray: this.state.data
		};
		console.log(data);
	};

	render() {
		const RADIUS = 200;
		const zoomAmount = 15;
		return (
			<Container>
				<GlobalHeader type={1} />

				<Content padder>
					<View>
						<Card style={styles.card}>
							<CardItem header bordered>
								<H1> YOUR JOURNEY </H1>
								<Right>
									<Icon name="directions-bus" size={40} />
								</Right>
							</CardItem>
							<CardItem>
								<Icon name="schedule" size={20} color="#bcbcbc" />
								<Text style={styles.cardText}># Time</Text>
							</CardItem>
							<CardItem>
								<Icon name="flag" size={20} color="#bcbcbc" />
								<Text style={styles.cardText}># Stops</Text>
							</CardItem>
							<CardItem bordered>
								<Icon name="accessible" size={20} color="#bcbcbc" />
								<Text style={styles.cardText}># Wheelchair Passenger</Text>
							</CardItem>
							<View>
								<Content>
									<CardItem>
										<Icon name="my-location" size={20} color="#bcbcbc" />
										<Text style={styles.cardHeaders}>Cardiff Central</Text>
									</CardItem>
									<View style={styles.middleCard}>
										<FlatList
											data={this.state.data}
											keyExtractor={(item, index) => index.toString()}
											renderItem={({ item }) => (
												<View style={styles.stopsList}>
													<CardItem>
														<Text>
															{item.street} {item.city}
														</Text>
													</CardItem>
													<CardItem>
														<Text style={styles.innerText}>
															<Icon name="person" size={20} color="#bcbcbc" />
															5
														</Text>
													</CardItem>
												</View>
											)}
										/>
									</View>
								</Content>
								<CardItem header bordered>
									<Icon name="location-on" size={20} color="#bcbcbc" />
									<Text style={styles.cardHeaders}>End Destination</Text>
								</CardItem>
							</View>
						</Card>
						<View>
							<H2 style={styles.ViewRoute}>View Route & Directions</H2>
						</View>
						<MapView
							onPress={() => {
								this.props.navigation.navigate('Route');
							}}
							style={styles.map}
							minZoomLevel={zoomAmount}
							region={{
								latitude: this.state.location.coords.latitude,
								longitude: this.state.location.coords.longitude,
								latitudeDelta: 0.0922,
								longitudeDelta: 0.0421
							}}
						>
							<MapView.Circle
								key={(this.state.currentLongitude + this.state.currentLatitude).toString()}
								center={this.state.LATLNG}
								radius={RADIUS}
								strokeWidth={1}
								strokeColor={'#1a66ff'}
								fillColor={'rgba(230,238,255,0.5)'}
							/>
						</MapView>
					</View>
				</Content>
			</Container>
		);
	}
}
const width = '80%';
const buttonWidth = '40%';
const window = Dimensions.get('window');

const styles = StyleSheet.create({
	container: {
		flex: 1,
		flexDirection: 'column',
		alignSelf: 'center',
		width
	},
	map: {
		marginTop: 20,
		height: 200
	},
	innerCard: {
		//	borderLeftWidth: 3.5,
		width,
		alignSelf: 'center'
	},
	middleCard: {
		borderLeftWidth: 3.5,
		borderLeftColor: '#ff3333',
		width,
		alignSelf: 'center'
	},
	stopsList: {
		marginLeft: 30,

		borderBottomColor: '#bcbcbc',
		borderBottomWidth: 0.5
	},
	cardText: {
		margin: 5
	},
	cardHeaders: {
		fontWeight: 'bold',
		color: 'black'
		// margin: 5
	},
	innerText: {
		// margin: 5,
		// padding: 5
	},
	ViewRoute: {
		marginTop: 10
	}
});
