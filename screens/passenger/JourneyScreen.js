import PolyLine from '@mapbox/polyline';
import _ from 'lodash';
import moment from 'moment';
import { Button, Container, Content, StyleProvider, Text, ListItem, CheckBox, Body } from 'native-base';
import React, { Component } from 'react';
import {
	Keyboard,
	StyleSheet,
	TouchableHighlight,
	TouchableOpacity,
	View,
	TextInput,
	Platform,
	KeyboardAvoidingView
} from 'react-native';
import Collapsible from 'react-native-collapsible';
import DateTimePicker from 'react-native-modal-datetime-picker';
import Icon from 'react-native-vector-icons/MaterialIcons';
import GlobalHeader from '../../components/GlobalHeader';
import API_KEY from '../../google_api_key';
import getTheme from '../../native-base-theme/components';
import platform from '../../native-base-theme/variables/platform';
import colors from '../../constants/Colors';
import { Location, Permissions, Notifications } from 'expo';
import { connect } from 'react-redux';
import { fetchTickets } from '../../redux/actions/ticketAction';
import CustomInput from '../../components/CustomInput';
import CustomDateTimePicker from './../../components/CustomDateTimePicker';

class JourneyScreen extends Component {
	static navigationOptions = {
		header: null
	};

	// Temporary states --> These should be in app.js
	constructor(props) {
		super(props);
		this.state = {
			//Input focus states
			fromFocused: false,
			toFocused: false,
			groupFocused: false,
			wheelchairFocused: false,

			switchValue: false,
			error: '',
			latitude: 0,
			longitude: 0,
			locationPredictions: [],

			//Toggable states
			isCollapsed: true,
			isDatePickerVisible: false,
			isTimePickerVisible: false,

			//Inputs
			from: null,
			to: null,
			date: null,
			time: null,
			numPassenger: null,
			numWheelchair: null,
			returnTicket: false,

			//StartLocation
			locationPredictions: [],
			placeID:
				'EhxTb3V0aCBQYXJrIFJvYWQsIENhcmRpZmYsIFVLIi4qLAoUChIJpatKxdccbkgRQ2yDFI_iUzESFAoSCamRx0IRO1oCEXoliDJDoPjE',
			street: 'South Park Road',
			city: 'Cardiff',
			country: 'UK',
			lat: 51.4816575,
			lng: -3.1458798,
			startType: 3,

			//EndLocation
			endLocationPredictions: [],
			endPlaceID:
				'Eh9Tb3V0aCBDbGl2ZSBTdHJlZXQsIENhcmRpZmYsIFVLIi4qLAoUChIJpSXnPloDbkgRaZvKffcCrskSFAoSCfVT7DTUAm5IEQ5nhmXbBjQU',
			endStreet: 'South Clive Street',
			endCity: 'Cardiff',
			endCountry: 'UK',
			endLat: 51.4599197,
			endLng: -3.1844829,
			endType: 2,

			destination: '',
			endDestination: ''
		};
		this.startPositionDebounced = _.debounce(this.startPosition, 500);
		this.endLocationDebounced = _.debounce(this.endLocation, 500);
	}

	componentDidMount() {
		this.props.fetchTickets();
		// Channel for popup notifications
		if (Platform.OS === 'android') {
			Expo.Notifications.createChannelAndroidAsync('reminders', {
				name: 'Reminders',
				priority: 'max',
				vibrate: [0, 250, 250, 250]
			});
		}
	}

	// Functionality to show/hide the date picker and to set the state
	_showDatePicker = () => this.setState({ isDatePickerVisible: true });
	_hideDatePicker = () => this.setState({ isDatePickerVisible: false });

	_handleDatePicked = (newDate) => {
		this.setState({ date: moment(newDate).format('YYYY-MM-DD HH:mm:ss') });
		this._hideDatePicker();
	};

	// Functionality to show/hide the time picker and to set the state
	_showTimePicker = () => this.setState({ isTimePickerVisible: true });
	_hideTimePicker = () => this.setState({ isTimePickerVisible: false });

	_handleTimePicked = (newTime) => {
		this.setState({ time: moment(newTime).format('YYYY-MM-DD HH:mm:ss') });
		this._hideTimePicker();
	};

	// Toggles advanced search inputs
	toggleAdvanced = () => {
		this.setState({
			isCollapsed: !this.state.isCollapsed
		});
	};

	// Restricited search to cardiff - Check Coords
	// Radius of search is 3000 meters from location coords
	// Strictbounds ensures that no suggestions appear that are not within these paramaters
	getRouteDirections = async () => {
		const { placeID, endPlaceID, date, time } = this.state;

		if (placeID.length === 0 || endPlaceID.length === 0) {
			return console.log('Waiting for second input');
		}

		try {
			const response = await fetch(
				`https://maps.googleapis.com/maps/api/directions/json?origin=place_id:${placeID}&destination=place_id:${endPlaceID}&key=${API_KEY}`
			);
			// const startLoc = "EhlRdWVlbiBTdHJlZXQsIENhcmRpZmYsIFVLIi4qLAoUChIJd_pfUbccbkgR8GM8fGAnzNYSFAoSCamRx0IRO1oCEXoliDJDoPjE";
			const json = await response.json();
			const points = PolyLine.decode(json.routes[0].overview_polyline.points);
			iStartLat = json.routes[0].legs[0].start_location.lat;
			const iStartLng = json.routes[0].legs[0].start_location.lng;
			const iEndLat = json.routes[0].legs[0].end_location.lat;
			const iEndLng = json.routes[0].legs[0].end_location.lng;
			const pointCoords = points.map((point) => {
				return { latitude: point[0], longitude: point[1] };
			});
			this.setState({
				lat: iStartLat,
				lng: iStartLng,
				endLat: iEndLat,
				endLng: iEndLng,
				predictions: [],
				// destination: destinationName,
				routeResponse: json
			});
			Keyboard.dismiss();
			//  this.map.fitToCoordinates(pointCoords);
		} catch (error) {
			console.error(error);
		}
	};

	// Get Start Location
	async startPosition(destination) {
		this.setState({ destination });
		const apiUrl = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${destination}&types=geocode&location=51.481583,-3.179090&radius=3000&key=${API_KEY}&strictbounds`;
		const result = await fetch(apiUrl);
		const jsonResult = await result.json();
		this.setState({
			locationPredictions: jsonResult.predictions
		});
	}

	// Get End Location
	async endLocation(endDestination) {
		this.setState({ endDestination });
		const apiUrl = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${endDestination}&types=geocode&location=51.481583,-3.179090&radius=3000&key=${API_KEY}&strictbounds`;
		const result = await fetch(apiUrl);
		const jsonResult = await result.json();
		this.setState({
			endLocationPredictions: jsonResult.predictions
		});
	}

	// Populate the input field with selected prediction
	// Start Location Prediction
	pressedPrediction(
		prediction,
		selectedPredictionID,
		selectedPredictionStreet,
		selectedPredictionCity,
		selectedPredictionCountry
	) {
		new Promise((resolve, reject) => {
			Keyboard.dismiss();
			this.setState({
				locationPredictions: [],
				destination: prediction.description,
				placeID: selectedPredictionID,
				street: selectedPredictionStreet,
				city: selectedPredictionCity,
				country: selectedPredictionCountry
			});
			Keyboard;
			resolve();
		}).then(() => {
			this.getRouteDirections();
		});
	}

	// Populate the input field with selected prediction
	// End Location Prediction
	pressedEndPrediction(
		prediction,
		selectedEndPredictionID,
		selectedEndPredictionStreet,
		selectedEndPredictionCity,
		selectedEndPredictionCountry
	) {
		new Promise((resolve, reject) => {
			Keyboard.dismiss();
			this.setState({
				endLocationPredictions: [],
				endDestination: prediction.description,
				endPlaceID: selectedEndPredictionID,
				endStreet: selectedEndPredictionStreet,
				endCity: selectedEndPredictionCity,
				endCountry: selectedEndPredictionCountry
			});
			Keyboard;
			resolve();
		}).then(() => {
			this.getRouteDirections();
		});
	}
	navigateTo = () => {
		this.props.navigation.navigate('');
	};

	async onSubmit() {
		await this.checkPassengerState();
		const { placeID, endPlaceID, date, time, numPassenger, numWheelchair } = this.state;

		if (
			placeID.length === 0 ||
			endPlaceID.length === 0 ||
			date == null ||
			time == null ||
			numWheelchair > numPassenger
		) {
			return console.log('no');
		}

		const data = {
			place_id: this.state.placeID,
			street: this.state.street,
			city: this.state.city,
			country: this.state.country,
			lat: this.state.lat,
			lng: this.state.lng,
			startType: this.state.startType,
			endPlaceID: this.state.endPlaceID,
			endStreet: this.state.endStreet,
			endCity: this.state.endCity,
			endCountry: this.state.endCountry,
			endLat: this.state.endLat,
			endLng: this.state.endLng,
			endType: this.state.endType,
			date: this.state.date,
			time: this.state.time,
			numPassenger: this.state.numPassenger,
			numWheelchair: this.state.numWheelchair,
			returnTicket: this.state.returnTicket === true ? 1 : 0
		};

		this.props.navigation.navigate('Results', data);
		this.textInputFrom.clear();
		this.textInputTo.clear();
		this.textInputGroupSize.clear();
		this.textInputWheelChair.clear();

		this.setState({
			from: null,
			to: null,
			date: null,
			time: null,
			numPassenger: null,
			numWheelchair: null,
			returnTicket: false,
			destination: '',
			endDestination: '',
			isCollapsed: true,
		});
	}

	checkPassengerState = () => {
		if (this.state.isCollapsed) {
			this.setState({ numPassenger: 1, numWheelchair: 0 });
		} else if (!this.state.isCollapsed && this.state.numPassenger === null) {
			this.setState({ numWheelchair: 0, numPassenger: 1 });
		} else if (!this.state.isCollapsed && this.state.numWheelchair === (null || 0)) {
			this.setState({ numWheelchair: 0 });
		}
	};

	journey = () => {
		this.props.navigation.navigate('RecentFav');
	};

	render() {
		// Start Location Predictions - Suggestion List
		const locationPredictions = this.state.locationPredictions.map((prediction) => (
			<TouchableHighlight
				onPress={() => {
					this.pressedPrediction(
						prediction,
						prediction.place_id,
						prediction.terms[0].value,
						prediction.terms[1].value,
						prediction.terms[2].value
					);
				}}
				key={prediction.id}
				style={styles.suggestionContainer}
			>
				<Text style={styles.locationSuggestion}>{prediction.description}</Text>
			</TouchableHighlight>
		));
		// End Location Predictions - Suggestion Lis
		const endLocationPredictions = this.state.endLocationPredictions.map((prediction) => (
			<TouchableHighlight
				onPress={() => {
					this.pressedEndPrediction(
						prediction,
						prediction.place_id,
						prediction.terms[0].value,
						prediction.terms[1].value,
						prediction.terms[2].value
					);
				}}
				key={prediction.id}
			>
				<Text style={styles.locationSuggestion}>{prediction.description}</Text>
			</TouchableHighlight>
		));

		return (
			<StyleProvider style={getTheme(platform)}>
				<Container>
					<GlobalHeader type={1} navigateTo={this.navigateTo} />
					<KeyboardAvoidingView behavior="padding" style={{ flex: 1 }}>
						<Content style={styles.content}>
							<View style={styles.contentContainer}>
								{/* Favourite recent journeys button */}
								<View style={styles.secondaryButtonContainer}>
									<Button bordered danger style={styles.secondaryButton} onPress={this.journey}>
										<Text>Favourite/Recent Journeys</Text>
									</Button>
								</View>

								{/* Starting location field */}
								<CustomInput
									focused={this.state.fromFocused}
									iconName="my-location"
									placeholder={"From"}
									value={this.state.destination}
									onFocus={() => this.setState({ fromFocused: true })}
									onBlur={() => this.setState({ fromFocused: false })}
									onChangeText={(destination) => {
										this.setState({ destination });
										this.startPositionDebounced(destination);
									}}
									onRef={(ref) => (this.textInputFrom = ref)}
								/>
								{locationPredictions}

								{/* Destination field */}
								<CustomInput
									focused={this.state.toFocused}
									iconName="location-on"
									placeholder={"To"}
									value={this.state.endDestination}
									onFocus={() => this.setState({ toFocused: true })}
									onBlur={() => this.setState({ toFocused: false })}
									onChangeText={(endDestination) => {
										this.setState({ endDestination });
										this.endLocationDebounced(endDestination);
									}}
									onRef={(ref) => (this.textInputTo = ref)}
								/>
								{endLocationPredictions}

								{/* Date picker */}
								<CustomDateTimePicker
									placeholder="Date"
									onPress={this._showDatePicker}
									mode="date"
									isVisible={this.state.isDatePickerVisible}
									onConfirm={(value) => this._handleDatePicked(value)}
									onCancel={this._hideDatePicker}
									iconName="date-range"
									format='Do MMM YY'
									value={this.state.date}
								/>

								{/* Time picker */}
								<CustomDateTimePicker
									placeholder="Time"
									onPress={this._showTimePicker}
									mode="time"
									isVisible={this.state.isTimePickerVisible}
									onConfirm={(value) => this._handleTimePicked(value)}
									onCancel={this._hideTimePicker}
									iconName="access-time"
									format='LT'
									value={this.state.time}
								/>

								{/* Return journey option */}
								<ListItem style={styles.listItem}>
									<CheckBox
										checked={this.state.returnTicket}
										onPress={() => this.setState({ returnTicket: !this.state.returnTicket })}
										color={colors.bodyTextColor}
									/>
									<Body><Text style={styles.body}>Return journey</Text></Body>
								</ListItem>

								{/* Advanced search fields, expands and collapses on button click. */}
								<Collapsible collapsed={this.state.isCollapsed}>
									<View>
										<CustomInput
											focused={this.state.groupFocused}
											iconName="people"
											placeholder={"Group size"}
											value={this.state.numPassenger ? this.state.numPassenger.toString() : null}
											onFocus={() => this.setState({ groupFocused: true })}
											onBlur={() => this.setState({ groupFocused: false })}
											onChangeText={(value) => this.setState({ numPassenger: value })}
											onRef={(ref) => (this.textInputGroupSize = ref)}
										/>

										<CustomInput
											focused={this.state.wheelchairFocused}
											iconName="accessible"
											placeholder={"No. of wheelchairs"}
											value={this.state.numWheelchair ? this.state.numWheelchair.toString() : null}
											onFocus={() => this.setState({ wheelchairFocused: true })}
											onBlur={() => this.setState({ wheelchairFocused: false })}
											onChangeText={(value) => this.setState({ numWheelchair: value })}
											onRef={(ref) => (this.textInputWheelChair = ref)}
										/>
									</View>
								</Collapsible>

								{/* Advanced search button, toggles advanced fields */}
								<View style={styles.secondaryButtonContainer}>
									<Button
										bordered
										danger
										style={styles.secondaryButton}
										onPress={this.toggleAdvanced}
									>
										<Text style={styles.secondaryButtontext}>
											{this.state.isCollapsed ? 'Advanced Search' : 'Basic Search'}
										</Text>
									</Button>
								</View>

								{/* Submit search */}
								<View style={styles.buttonContainer}>
									<Button
										danger
										style={styles.button}
										onPress={() => {
											this.onSubmit();
										}}
									>
										<Text>Search</Text>
									</Button>
								</View>
							</View>
						</Content>
					</KeyboardAvoidingView>
				</Container>
			</StyleProvider>
		);
	}
}

const styles = StyleSheet.create({
	content: {
		flex: 1
	},
	locationSuggestion: {
		color: colors.emphasisTextColor,
		backgroundColor: 'white',
		padding: 5,
		borderBottomWidth: 0.5,
		borderBottomColor: colors.emphasisTextColor
	},
	contentContainer: {
		width: '80%',
		flex: 1,
		flexDirection: 'column',
		alignSelf: 'center',
		justifyContent: 'flex-end'
	},
	buttonContainer: {
		flexDirection: 'row',
		alignSelf: 'center',
		alignItems: 'center',
		marginBottom: 15
	},
	button: {
		width: '100%',
		justifyContent: 'center',
		backgroundColor: colors.brandColor
	},
	secondaryButtonContainer: {
		flexDirection: 'row',
		marginTop: 25,
		marginBottom: 20
	},
	secondaryButton: {
		width: '100%',
		justifyContent: 'center'
	},
	secondaryButtontext: {
		color: colors.brandColor
	},
	body: {
		color: colors.bodyTextColor,
		fontSize: 14
	},
	listItem: {
		marginLeft: 0,
		borderBottomWidth: 0.75,
		borderBottomColor: colors.lightBorder
	},
});

export default connect(null, { fetchTickets })(JourneyScreen);
