import { Button, Container, Content, Text, ListItem, CheckBox, Body } from 'native-base';
import React from 'react';
import { StyleSheet, TouchableOpacity, View, TextInput, KeyboardAvoidingView } from 'react-native';
import GlobalHeader from '../../components/GlobalHeader';
import colors from '../../constants/Colors';
var vehicleData = require('../../vehicleData.json');


export default class AddVehicle extends React.Component {
	static navigationOptions = {
		header: null
	};
	state = {
		makeId: null,
		make: null,
		model: null,
		year: null,
		registration: null,
		numSeats: null,
		wheelchairAccess: false,
		numWheelchairs: null,
		currentlyDriven: null,
		vehicleType: null,

		makeFocused: false,
		modelFocused: false,
		yearFocused: false,
		registrationFocused: false,
		numSeatsFocused: false,
		wheelchairAccessFocused: false,
		currentlyDrivenFocused: false,
		vehicleTypeFocused: false,

		models: []
	};

	onMakeSelect = (itemId, itemMake) => {
		this.setState({
			makeId: itemId,
			make: itemMake,
		})
		this.props.navigation.navigate('AddVehicle');
	}

	onModelSelect = (itemModel) => {
		this.setState({
			model: itemModel,
		})
		this.setState({ models: [] });
		this.props.navigation.navigate('AddVehicle');
	}

	navigateToMakeSelect = () => {
		this.setState({ makeId: null, model: null, models: [] });
		const data = {
			vehicleData: vehicleData.car_makes,
			selectType: "make",
			header: "Select a Make",
			dividers: true,
		}
		this.props.navigation.navigate('MakeSelect', { onMakeSelect: this.onMakeSelect, onNavigateBack: this.onNavigateBack, data: data });
	};

	navigateToModelSelect = () => {
		this.determineModels();
		const data = {
			vehicleData: this.state.models,
			selectType: "model",
			header: "Select a Model",
			dividers: false,
			makeId: this.state.makeId
		}
		this.props.navigation.navigate('MakeSelect', { onModelSelect: this.onModelSelect, onNavigateBack: this.onNavigateBack, data: data });
	};

	determineModels = () => {
		vehicleData.car_models.forEach(item => {
			if (this.state.makeId === item.make_id) {
				this.setState({
					models: this.state.models.push(item)
				})
			}
		});
	}

	onNavigateBack = () => {
		this.setState({ models: [] });
		this.props.navigation.navigate('AddVehicle');
	}

	navigateTo = () => {
		this.props.navigation.navigate('');
	};

	render() {
		return (
			<Container>
				<GlobalHeader type={1} navigateTo={this.navigateTo} />
				<Content>
					<KeyboardAvoidingView behavior="padding" style={{ flex: 1 }}>
						<Content style={styles.content}>
							<View style={styles.contentContainer}>
								{/* Car make */}
								<TouchableOpacity
									onPress={this.navigateToMakeSelect}
									style={[styles.inputContainer, { borderBottomColor: colors.lightBorder }]}
								>
									<Text style={[styles.input, { color: colors.bodyTextColor }]}>
										{this.state.make ? this.state.make : 'Make'}
									</Text>
								</TouchableOpacity>

								{/* Car model */}
								<TouchableOpacity
									onPress={this.navigateToModelSelect}
									style={[styles.inputContainer, { borderBottomColor: colors.lightBorder }]}
								>
									<Text style={[styles.input, { color: colors.bodyTextColor }]}>
										{this.state.model ? this.state.model : 'Model'}
									</Text>
								</TouchableOpacity>

								{/* Car year */}
								<View style={[styles.inputContainer, {
									borderBottomColor: this.state.yearFocused ? colors.brandColor : colors.lightBorder
								}]}>
									<TextInput
										placeholder="Year"
										placeholderTextColor={this.state.yearFocused ? colors.emphasisTextColor : colors.bodyTextColor}
										style={[styles.input, {
											color: this.state.yearFocused ? colors.emphasisTextColor : colors.bodyTextColor
										}]}
										onChangeText={(year) => {
											this.setState({ year });
										}}
										value={this.state.year ? this.state.year.toString() : null}
										onFocus={() => { this.setState({ yearFocused: true }) }}
										onBlur={() => { this.setState({ yearFocused: false }) }}
									/>
								</View>

								{/* Car registration */}
								<View style={[styles.inputContainer, {
									borderBottomColor: this.state.registrationFocused ? colors.brandColor : colors.lightBorder
								}]}>
									<TextInput
										placeholder="Registration"
										placeholderTextColor={this.state.registrationFocused ? colors.emphasisTextColor : colors.bodyTextColor}
										style={[styles.input, {
											color: this.state.registrationFocused ? colors.emphasisTextColor : colors.bodyTextColor
										}]}
										onChangeText={(registration) => {
											this.setState({ registration });
										}}
										value={this.state.registration ? this.state.registration.toString() : null}
										onFocus={() => { this.setState({ registrationFocused: true }) }}
										onBlur={() => { this.setState({ registrationFocused: false }) }}
									/>
								</View>

								{/* Car number of seats */}
								<View style={[styles.inputContainer, {
									borderBottomColor: this.state.numSeatsFocused ? colors.brandColor : colors.lightBorder
								}]}>
									<TextInput
										placeholder="No. of seats"
										placeholderTextColor={this.state.numSeatsFocused ? colors.emphasisTextColor : colors.bodyTextColor}
										style={[styles.input, {
											color: this.state.numSeatsFocused ? colors.emphasisTextColor : colors.bodyTextColor
										}]}
										onChangeText={(numSeats) => {
											this.setState({ numSeats });
										}}
										value={this.state.numSeats ? this.state.numSeats.toString() : null}
										onFocus={() => { this.setState({ numSeatsFocused: true }) }}
										onBlur={() => { this.setState({ numSeatsFocused: false }) }}
									/>
								</View>

								{/* Return journey option */}
								<ListItem style={{ marginLeft: 5 }}>
									<CheckBox
										checked={this.state.wheelchairAccess}
										onPress={() => this.setState({ wheelchairAccess: !this.state.wheelchairAccess })}
										color={colors.bodyTextColor}
									/>
									<Body>
										<Text style={styles.body}>Wheelchair spaces?</Text>
									</Body>
								</ListItem>

								{/* Car number of wheelchairs */}
								{this.state.wheelchairAccess ?
									<View style={[styles.inputContainer, {
										borderBottomColor: this.state.wheelchairAccessFocused ? colors.brandColor : colors.lightBorder,
										marginLeft: 28
									}]}>
										<TextInput
											placeholder="No. of wheelchair spaces"
											placeholderTextColor={this.state.wheelchairAccessFocused ? colors.emphasisTextColor : colors.bodyTextColor}
											style={[styles.input, {
												color: this.state.wheelchairAccessFocused ? colors.emphasisTextColor : colors.bodyTextColor
											}]}
											onChangeText={(numWheelchairs) => {
												this.setState({ numWheelchairs });
											}}
											value={this.state.numWheelchairs ? this.state.numWheelchairs.toString() : null}
											onFocus={() => { this.setState({ wheelchairAccessFocused: true }) }}
											onBlur={() => { this.setState({ wheelchairAccessFocused: false }) }}
										/>
									</View>
									: null
								}

								{/* Return set as active vehicle option */}
								<ListItem style={{ marginLeft: 5 }}>
									<CheckBox
										checked={this.state.currentlyDriven}
										onPress={() => this.setState({ currentlyDriven: !this.state.currentlyDriven })}
										color={colors.bodyTextColor}
									/>
									<Body>
										<Text style={styles.body}>Set as active vehicle?</Text>
									</Body>
								</ListItem>

								{/* Add vehicle */}
								<View style={styles.buttonContainer}>
									<Button
										danger
										style={styles.button}
										onPress={() => {
										}}
									>
										<Text>Add Vehicle</Text>
									</Button>
								</View>
							</View>
						</Content>
					</KeyboardAvoidingView>
				</Content>
			</Container >
		);
	}
}

const styles = StyleSheet.create({
	content: {
		flex: 1,
	},
	dateTime: {
		marginLeft: 8,
		color: colors.bodyTextColor,
		fontSize: 14
	},
	inputContainer: {
		flexDirection: 'row',
		borderBottomWidth: 0.75,
		alignItems: 'center',
	},
	input: {
		width: '100%',
		padding: 10,
		color: colors.bodyTextColor
	},
	locationSuggestion: {
		color: colors.emphasisTextColor,
		backgroundColor: 'white',
		padding: 5,
		borderBottomWidth: 0.5,
		borderBottomColor: colors.emphasisTextColor,
	},
	contentContainer: {
		width: '80%',
		marginTop: 20,
		marginBottom: 20,
		flex: 1,
		flexDirection: 'column',
		alignSelf: 'center',
		justifyContent: "flex-end",
	},
	map: {
		...StyleSheet.absoluteFillObject
	},
	buttonContainer: {
		flexDirection: 'row',
		alignSelf: 'center',
		alignItems: 'center',
		marginBottom: 15,
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
		justifyContent: 'center',
	},
	secondaryButtontext: {
		color: colors.brandColor
	},
	body: {
		color: colors.bodyTextColor,
		fontSize: 14
	},
	checkboxContainer: {
		justifyContent: 'flex-start',
	}
});