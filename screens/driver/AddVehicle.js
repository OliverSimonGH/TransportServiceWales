import { Ionicons } from '@expo/vector-icons';
import { Accordion, Button, Container, Content, Text } from 'native-base';
import React, { Component } from 'react';
import { Dimensions, Picker, StyleSheet, TextInput, View } from 'react-native';
import GlobalHeader from '../components/GlobalHeader';
import ip from '../ipstore';

class AddVehicleScreen extends Component {
	state = {
		registration: '',
		make: '',
		model: '',
		year: '',
        passanger_seats: '',
        wheelchair_access: '',
        currently_driven: '',
		errors: []
	};

	onSubmit = () => {
		//Send data to the server
		const data = {
			registration: this.state.registration,
			make: this.state.make,
			model: this.state.model,
			year: this.state.year,
			passenger_seats: this.state.passenger_seats,
            wheelchair_access: this.state.wheelchair_access,
            currently_driven: this.state.currently_driven,
            type: this.state.type
        };

		fetch(`http://${ip}:3000/addvehicle`, {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(data)
        })
	};
	
	render() {
		return (
			<Container>
				<Content>
					<GlobalHeader type={1} />
					{this.state.errors &&
					!!this.state.errors.length && (
						<Accordion
							dataArray={this.state.errors}
							icon="add"
							expandedIcon="remove"
							contentStyle={styles.errorStyle}
							expanded={0}
						/>
					)}
					{this.state.error && (
						<Accordion
							dataArray={this.state.error}
							icon="add"
							expandedIcon="remove"
							contentStyle={styles.errorStyle}
							expanded={0}
						/>
					)}

					<View style={styles.contentContainer}>
						<View style={styles.titleContainer}>
							<Text style={styles.title}>Add Vehicle</Text>
						</View>
						<View style={styles.inputContainer}>
							<Ionicons name="md-person" size={32} style={styles.inputIcons} />
							<TextInput
								placeholder="registration"
								style={styles.input}
								onChangeText={(text) => this.setState({ registration: text })}
								value={this.state.registration}
							/>
						</View>
						<View style={styles.inputContainer}>
							<Ionicons name="md-person" size={32} style={styles.inputIcons} />
							<TextInput
								placeholder="make"
								style={styles.input}
								onChangeText={(text) => this.setState({ make: text })}
								value={this.state.make}
							/>
						</View>
						<View style={styles.inputContainer}>
							<Ionicons name="md-phone-portrait" size={32} style={styles.inputIcons} />
							<TextInput
								placeholder="model"
								style={styles.input}
								onChangeText={(text) => this.setState({ model: text })}
								value={this.state.model}
							/>
						</View>
						<View style={styles.inputContainer}>
							<Ionicons name="md-mail" size={32} style={styles.inputIcons} />
							<TextInput
								placeholder="year"
								style={styles.input}
								onChangeText={(text) => this.setState({ year: text })}
								value={this.state.year}
							/>
						</View>
						<View style={styles.inputContainer}>
							<Ionicons name="md-lock" size={32} style={styles.inputIcons} />
							<TextInput
								placeholder="passanger_seats"
								style={styles.input}
								onChangeText={(text) => this.setState({ passanger_seats: text })}
								value={this.state.passanger_seats}
							/>
						</View>
						<View style={styles.inputContainer}>
							<Ionicons name="md-lock" size={32} style={styles.inputIcons} />
							<TextInput
								placeholder="wheelchair_access"
								style={styles.input}
								onChangeText={(text) => this.setState({ wheelchair_access: text })}
								value={this.state.wheelchair_access}
							/>
						</View>
						<View style={styles.inputContainer}>
							<Ionicons name="md-lock" size={32} style={styles.inputIcons} />
							<TextInput
								placeholder="currently_driven"
								style={styles.input}
								onChangeText={(text) => this.setState({ currently_driven: text })}
								value={this.state.currently_driven}
							/>
						</View>
						<View style={styles.buttonContainer}>
							<Button danger style={styles.button} onPress={this.onSubmit}>
								<Text>Add vehicle</Text>
							</Button>
						</View>
					</View>
				</Content>
			</Container>
		);
	}
}

const width = '70%';
const buttonWidth = '40%';
const window = Dimensions.get('window');

const styles = StyleSheet.create({
	inputContainer: {
		flexDirection: 'row',
		borderBottomWidth: 2,
		borderBottomColor: '#ff0000',
		alignItems: 'center',
		width
	},
	errorStyle: {
		fontWeight: 'bold',
		backgroundColor: '#f4f4f4'
	},
	input: {
		flex: 1,
		padding: 10
	},
	registerContainer: {
		flexDirection: 'column',
		alignItems: 'center',
		width,
		marginTop: 25,
		marginBottom: 20
	},
	registerText: {
		color: '#ff0000'
	},
	inputIcons: {
		width: 50,
		padding: 10,
		textAlign: 'center'
	},
	flex_1: {
		flex: 1,
		alignItems: 'center'
	},
	contentContainer: {
		flex: 1,
		flexDirection: 'column',
		alignItems: 'center'
	},
	titleContainer: {
		paddingTop: 30,
		paddingBottom: 5,
		width
	},
	title: {
		textAlign: 'left',
		fontSize: 30,
		fontWeight: 'bold',
		color: 'gray'
	},
	inputPicker: {
		borderWidth: 2,
		borderColor: '#ff0000'
	},
	inputContainerPicker: {
		flexDirection: 'row',
		alignItems: 'center'
	},
	inputPicker: {
		height: 50,
		width: 350
	},
	buttonContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		marginTop: 30
	},
	button: {
		width: buttonWidth,
		justifyContent: 'center',
		backgroundColor: '#ff0000'
	},
	buttontext: {
		color: '#000000'
	},
	error: {
		color: '#ff0000'
	},
	imageContainer: {
		height: 120,
		backgroundColor: '#ff0000',
		width: window.width,
		alignItems: 'center'
	},
	image: {
		flex: 1,
		alignSelf: 'stretch',
		width: window.width,
		height: window.height
	}
});

export default AddVehicle;
