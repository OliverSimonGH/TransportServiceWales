import React, { Component } from 'react';
import { StyleSheet, View, TouchableOpacity, Dimensions, TextInput } from 'react-native';
import {
	Button,
	Container,
	Text,
	Header,
	Content,
	Left,
	Right,
} from 'native-base';
import GlobalHeader from '../../components/GlobalHeader';
import ip from '../../ipstore';
import { Icon } from 'react-native-elements';
import { Ionicons } from '@expo/vector-icons';



export default class AccountsScreen extends Component {
	static navigationOptions = {
		header: null
	};

	state = {
		userDetails: null,
		forename: '',
		surname:'',
		email:'',
		phoneNumber:''
	};

	componentDidMount() {
		const id = this.props.userId;
		fetch(`http://${ip}:3000/userDetails?id=${id}`).then((response) => response.json()).then((response) => {
		this.setState({
				userDetails: response.details,
				forename: response.details.forename,
				surname: response.details.surname,
				email: response.details.email,
				phoneNumber: response.details.phone_number,
			});
		});
	}


	navigateTo = () => {
		this.props.navigation.navigate('');
	};

	settings = () => {
		this.props.navigation.navigate('Settings');
	};


	onChangePassword = () => {
		this.props.navigation.navigate('ChangePassword')
	}

	onSubmit = () => {
		const {forename, surname, email, phoneNumber} = this.state;
		console.log("1")
		fetch(`http://${ip}:3000/userChangeDetails`, {
			method: 'POST',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({forename, surname, email, phoneNumber})
		}).then((response) => response.json())
		.then((responseJSON) => {
			switch (responseJSON.status) {
				//Success
				case 10:
					alert('Updated')
					break;
				//If email exist
					case 1:
					alert('Could not update as email already exist')
					break;
			}
		})
			.catch(err => {
				console.log(err)

			})
	};

	render() {
		return (
			<Container>
				<GlobalHeader type={1} navigateTo={this.navigateTo} />
				<Content style={styles.contentContainer} padder>
				<View style={styles.buttonContainer}>
						<Button danger style={styles.button} onPress={this.onChangePassword}>
							<Text>UPDATE</Text>
						</Button>
					</View>
					<View style={styles.secondaryButtonContainer}>
						<Button bordered danger style={styles.secondaryButton} onPress={this.settings}>
							<Text style={styles.secondaryButtontext}>Settings</Text>
						</Button>
					</View>

					<View>
						<Text style={styles.title}>
							Current details
								</Text>
					</View>
					{this.state.userDetails !== null && (
						<View style={styles.container}>
							<React.Fragment>
								<View style={styles.forenameContainer}>
									<Text style={styles.detailView}>
										Forename: {this.state.userDetails.forename}
									</Text>
									<TouchableOpacity onPress={this.forename}>
										<Icon
											name='update'
											style={styles.updateIcon}>
										</Icon>
									</TouchableOpacity>
								</View>
								<View style={styles.forenameContainer}>
									<Text style={styles.detailView}>
										Surname: {this.state.userDetails.surname}
									</Text>
									<Icon
										name='update'
										style={styles.updateIcon}>
									</Icon>
								</View>
								<View style={styles.forenameContainer}>
									<Text style={styles.detailView}>
										Email: {this.state.userDetails.email}
									</Text>
									<Icon
										name='update'
										style={styles.updateIcon}>
									</Icon>
								</View>
								<View style={styles.forenameContainer}>
									<Text style={styles.detailView}>
										Phone Number: {this.state.userDetails.phone_number}
									</Text>
									<Icon
										name='update'
										style={styles.updateIcon}>
									</Icon>
								</View>
							</React.Fragment>
						</View>

					)}

					<View>
						<Text style={styles.title}>
							Update Details
								</Text>
					</View>
					{this.state.userDetails !== null && (
					<React.Fragment>
					<View style={styles.inputContainer}>
						<Ionicons name="md-person" size={32} style={styles.inputIcons} />
						<TextInput
							onChangeText={(text) => this.setState({forename: text})}
							placeholder="First Name"
							style={styles.input}
							value={this.state.forename}
						/>
					</View>
					<View style={styles.inputContainer}>
						<Ionicons name="md-person" size={32} style={styles.inputIcons} />
						<TextInput
							onChangeText={(text) => this.setState({surname: text})}
							placeholder="Last Name"
							style={styles.input}
							value={this.state.surname}
						/>
					</View>
					<View style={styles.inputContainer}>
						<Ionicons name="md-mail" size={32} style={styles.inputIcons} />
						<TextInput
							onChangeText={(text) => this.setState({email: text})}
							placeholder="Email"
							style={styles.input}
							value={this.state.email}
						/>
					</View>
					<View style={styles.inputContainer}>
						<Ionicons name="md-phone-portrait" size={32} style={styles.inputIcons} />
						<TextInput
							onChangeText={(text) => this.setState({phoneNumber: text})}
							placeholder="Phone Number"
							style={styles.input}
							value={this.state.phoneNumber}
						/>
					</View>
					</React.Fragment>
					)}
					
					<View style={styles.buttonContainer}>
						<Button danger style={styles.button} onPress={this.onSubmit}>
							<Text>UPDATE</Text>
						</Button>
					</View>
					

				</Content>

			</Container>
		);
	}
}

const width = '80%';
const window = Dimensions.get('window');

const styles = StyleSheet.create({
	contentContainer: {
		width: '80%',
		flex: 1,
		flexDirection: 'column',
		alignSelf: 'center'
	},
	buttonContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		marginTop: 30,
		justifyContent: 'center',

	},
	button: {
		width: '40%',
		justifyContent: 'center',
		backgroundColor: '#ff0000'
	},
	buttontext: {
		color: '#000000'
	},
	input: {
		flex: 1,
		padding: 10
	},
	inputIcons: {
		width: 50,
		padding: 10,
		textAlign: 'center'
	},
	inputContainer: {
		flexDirection: 'row',
		borderBottomWidth: 2,
		borderBottomColor: '#ff0000',
		alignItems: 'center',
		width,
		alignSelf: 'center',
		justifyContent: 'center'
	},
	logoutButton: {
		backgroundColor: '#ff0000',
		justifyContent: 'center',
		marginTop: 25,
		alignSelf: 'center'
	},
	secondaryButtonContainer: {
		flexDirection: 'row',
		marginTop: 25,
		marginBottom: 25
	},
	title: {
		textAlign: 'left',
		fontSize: 30,
		fontWeight: 'bold',
		color: 'gray'
	},
	secondaryButton: {
		width: '100%',
		justifyContent: 'center',
		backgroundColor: '#fff'
	},
	secondaryButtontext: {
		color: '#ff0000'
	},
	forenameContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		width: window.width * 0.75,
		margin: 10
	},
	detailView: {
		flex: 1,
		paddingLeft: 10,
		fontSize: 16
	},
	updateIcon: {
		padding: 6,
		color: 'gray'
	},
});
