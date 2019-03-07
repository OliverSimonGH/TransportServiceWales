import React, { Component } from 'react';
import { StyleSheet, View, TouchableHighlight, Keyboard, ScrollView, TouchableOpacity, Image, Dimensions} from 'react-native';
import Dialog, { DialogFooter, DialogButton, DialogContent, DialogTitle} from 'react-native-popup-dialog';
// import API_KEY from '../google_api_key';
import _ from 'lodash';
import { Content, Container, Button, Text, StyleProvider } from 'native-base';
import getTheme from '../native-base-theme/components';
import platform from '../native-base-theme/variables/platform';
import GlobalHeader from '../components/GlobalHeader';
import ip from '../ipstore';
import moment from 'moment';

export default class TicketDetail extends React.Component {
	static navigationOptions = {
		header: null
	};

	state = {
		cancelTicketPopup: false,
		ticketData: []
	};

	componentDidMount() {
		const { id } = this.props.navigation.state.params;
		fetch(`http://${ip}:3000/ticketsQuery1?id=${id}`).then((response) => response.json()).then((response) => {
			console.log(response);
			this.setState({
				ticketData: response.ticket
			});
		});
	}

	cancelTicketPopup = () => {
		this.setState({
			cancelTicketPopup: true
		})
	}

	cancelTicketPopupNo = () => {
		this.setState({
			cancelTicketPopup: false
		})
	}

	cancelTicketPopupYes = () => {
		this.setState({
			cancelTicketPopup: true
		})
	}

	cancelTicket = () => {
		
	}

	navigateTo = () => {
		this.props.navigation.navigate('Ticket');
	};

	render() {
		return (
			<StyleProvider style={getTheme(platform)}>
				<ScrollView showsHorizontalScrollIndicator={false} showsVerticalScrollIndicator={false}>
					<GlobalHeader type={1} navigateTo={this.navigateTo} isBackButtonActive={1} />
					<Container style={styles.contentContainer}>
						<Content>
							<View style={styles.titleContainer}>
								<Text style={styles.title}>Ticket Details</Text>
							</View>

							{this.state.ticketData.length >= 1 && 
							<React.Fragment>
								<View style={styles.container}>
									<React.Fragment>
										<Text>
											City From:
											{this.state.ticketData[0].city}
										</Text>
										<Text>
											{' '}
											Street From:
											{this.state.ticketData[0].street}
										</Text>
										<Text>
											{' '}
											Date of Departure:
											{moment(this.state.ticketData[0].start_time).format('Do MMMM YY')}
										</Text>
										<Text>
											{' '}
											Departure Time:
											{moment(this.state.ticketData[0].start_time).format('h:mm a')}
										</Text>
										<View style={styles.imageContainer}>
											<Image
												source={require('../assets/images/qrcode.jpg')}
												style={{
													width: 150,
													height: 150,
													borderRadius: 10,
													alignSelf: 'center'
												}}
											/>
										</View>
										<Text>
											To City:
											{this.state.ticketData[1].city}
										</Text>
										<Text>
											{' '}
											To Street:
											{this.state.ticketData[1].street}
										</Text>
										<Text>
											{' '}
											Date of Arrival:
											{moment(this.state.ticketData[1].end_time).format('Do MMMM YY')}
										</Text>
										<Text>
											{' '}
											Arrival Time:
											{moment(this.state.ticketData[1].end_time).format('h:mm a')}
										</Text>
										<View style={styles.buttonContainer}>
											<Button danger style={styles.button} onPress={this.cancelTicketPopup}>
												<Text>Cancel</Text>
											</Button>
										</View>
									</React.Fragment>
								</View>
							
								
								<Dialog
									width={0.8}
									visible={this.state.cancelTicketPopup}
									dialogTitle={<DialogTitle title="Ticket Cancellation" />}
									footer={
										<DialogFooter>
											<DialogButton
												text="No"
												onPress={this.cancelTicketPopupNo}
											/>
											<DialogButton
												text="Yes"
												onPress={this.cancelTicketPopupYes}
											/>
										</DialogFooter>
									}
									onTouchOutside={this.cancelTicketPopupNo}
								>
									<DialogContent>
										<Text>Are you sure you want to cancel your journey from {this.state.ticketData[0].city}, {this.state.ticketData[0].street} to {this.state.ticketData[1].city}, {this.state.ticketData[1].street}?</Text>
									</DialogContent>
								</Dialog>
								
							</React.Fragment>
							}

							{/* <Card >
								<CardItem>
									<Body>
										<Text>
											Are you sure you want to cancel your journey from {this.state.ticketData[0].city}, {this.state.ticketData[0].city} to {this.state.ticketData[1].city}, {this.state.ticketData[1].city}?
								 				</Text>
									</Body>
								</CardItem>
							</Card> */}

						</Content>
					</Container>
				</ScrollView>
			</StyleProvider>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		marginLeft: 10,
		marginBottom: 10,
		width: 300,
		borderRadius: 0.5,
		borderWidth: 1,
		borderColor: '#d6d7da'
	},
	iconWithInput: {
		marginTop: 10
	},
	imageContainer: {
		flex: 1
	},
	image: {
		borderRadius: 10,
		...StyleSheet.absoluteFillObject,
		width: 10,
		height: 10
	},
	locationSuggestion: {
		backgroundColor: 'white',
		padding: 5,
		fontSize: 18,
		borderWidth: 0.5
	},
	flex_1: {
		flex: 1,
		alignItems: 'center'
	},
	contentContainer: {
		width: '80%',
		flex: 1,
		flexDirection: 'column',
		alignSelf: 'center'
	},
	map: {
		...StyleSheet.absoluteFillObject
	},
	buttonContainer: {
		flexDirection: 'row',
		alignSelf: 'center',
		marginTop: 15,
		alignItems: 'center'
	},
	button: {
		width: '100%',
		justifyContent: 'center',
		color: '#ff6666'
	},
	buttontext: {
		color: '#000000'
	},
	secondaryButtonContainer: {
		flexDirection: 'row',
		marginTop: 25
	},
	secondaryButton: {
		width: '100%',
		justifyContent: 'center'
	},
	secondaryButtontext: {
		color: '#ff0000'
	},
	Container: {
		paddingTop: 20
	},
	title: {
		textAlign: 'center',
		fontSize: 30,
		fontWeight: 'bold',
		color: 'gray',
		paddingTop: 10
	},
	buttonContainer: {
		flexDirection: 'row',
		alignSelf: 'center',
		marginTop: 15,
		alignItems: 'center'
	},
	button: {
		width: '100%',
		justifyContent: 'center',
		backgroundColor: '#ff0000'
	}
});
