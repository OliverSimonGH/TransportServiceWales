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
import uuid from 'uuid/v4'

import { connect } from 'react-redux';
import { addTransaction } from '../redux/actions/transactionAction'
import { userPayForTicket } from '../redux/actions/userAction'

class TicketDetail extends React.Component {
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

	cancelTicketPopupYes = (ticketDate) => {

		// Cancellation fee applied
		if (this.cancellationFeeApplied(ticketDate)) {
			this.props.addTransaction({
				current_funds: parseFloat(this.props.user.funds).toFixed(2),
				date: new Date(),
				fk_transaction_type_id: 4,
				fk_user_id: this.props.user.id,
				spent_funds: 0.00,
				transaction_id: uuid(),
				type: 'Ticket Cancelled',
				cancellation_fee: 1
			})
			// this.props.userPayForTicket(cancellation fee cost);
		}

		// Cancellation fee not applied
		else {
			this.props.addTransaction({
				current_funds: parseFloat(this.props.user.funds).toFixed(2),
				date: new Date(),
				fk_transaction_type_id: 4,
				fk_user_id: this.props.user.id,
				spent_funds: 0.00,
				transaction_id: uuid(),
				type: 'Ticket Cancelled',
				cancellation_fee: 0
			})
		}

		this.cancelTicketPopupNo();
	}

	navigateTo = () => {
		this.props.navigation.navigate('Ticket');
	};

	cancellationFeeApplied = (ticketDate) => {
		//Mock date at the moment, until we can get a journey time
		const journeytime = moment(ticketDate).add(1, 'hour');
		const timeDiff = moment(journeytime).unix() - moment(ticketDate).unix()

		if (timeDiff <= 7200 && timeDiff >= 0) return true;
		return false;
	}

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
												onPress={this.cancelTicketPopupYes(this.state.ticketData[0].start_time)}
											/>
										</DialogFooter>
									}
									onTouchOutside={this.cancelTicketPopupNo}
								>
									<DialogContent>
										<Text>Are you sure you want to cancel your journey from <Text style={{fontWeight: 'bold'}}>{this.state.ticketData[0].city}, {this.state.ticketData[0].street}</Text> to <Text style={{fontWeight: 'bold'}}>{this.state.ticketData[1].city}, {this.state.ticketData[1].street}</Text>?</Text>
									</DialogContent>
								</Dialog>
								
							</React.Fragment>
							}
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

const mapStateToProps = state => ({
	user: state.userReducer.user
})

const mapDispatchToProps = dispatch => {
	return {
		userPayForTicket: amount => dispatch(userPayForTicket(amount)),
		addTransaction: transaction => dispatch(addTransaction(transaction))
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(TicketDetail)