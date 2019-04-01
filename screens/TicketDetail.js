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
import { addTransaction } from '../redux/actions/transactionAction';
import { userPayForTicket } from '../redux/actions/userAction';
import { cancelTicket, fetchTickets } from '../redux/actions/ticketAction';
import { postRequestAuthorized, getRequestAuthorized } from '../API'

class TicketDetail extends React.Component {
	static navigationOptions = {
		header: null
	}

	state = {
		cancelTicketPopup: false
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
		this.cancellationFeeApplied(ticketDate)
		.then((cancellationFeeApplied) => {
			if (cancellationFeeApplied) {
					this.ticketCancelledPost(1, 1)

					this.props.userPayForTicket(1);
					this.props.addTransaction({
						current_funds: parseFloat(this.props.user.funds).toFixed(2),
						date: new Date(),
						fk_transaction_type_id: 4,
						fk_user_id: this.props.user.id,
						spent_funds: 1,
						transaction_id: uuid(),
						type: 'Ticket Cancelled',
						cancellation_fee: 1
					})
			}
	
			// Cancellation fee not applied
			else {
				this.ticketCancelledPost(0, 0)
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
			
			this.props.ticketCancelRedux(this.props.navigation.state.params.ticket.id)
			this.cancelTicketPopupNo();
			this.navigateTo()
		})

	}

	cancellationFeeApplied = (ticketDate) => {
		return getRequestAuthorized(`http://${ip}:3000/user/cancelTicket/journey?ticketId=${this.props.navigation.state.params.ticket.id}`)
		.then((endTime) => {
			const timeDiff = moment(endTime).unix() - moment(ticketDate).unix();

			if (timeDiff <= 7200 && timeDiff >= 0) return Promise.resolve(true);
			return Promise.resolve(false);
		})
	
	}

	ticketCancelledPost = (amount, cancellationFeeApplied) => {
		const data = {
			ticketId: this.props.navigation.state.params.ticket.id,
			amount: amount,
			cancellationFeeApplied: cancellationFeeApplied
		};

		return postRequestAuthorized(`http://${ip}:3000/user/cancelTicket`, data)
	}

	navigateTo = () => {
		this.props.navigation.navigate('Ticket');
	};

	render() {
		const ticket = this.props.navigation.state.params.ticket;
		return (
			<StyleProvider style={getTheme(platform)}>
				<ScrollView showsHorizontalScrollIndicator={false} showsVerticalScrollIndicator={false}>
					<GlobalHeader type={1} navigateTo={this.navigateTo} isBackButtonActive={1} />
					<Container style={styles.contentContainer}>
						<Content>
							<View style={styles.titleContainer}>
								<Text style={styles.title}>Ticket Details</Text>
							</View>
							
								<View style={styles.container}>
								
										<Text>
											From City: {ticket.fromCity}
										</Text>
										<Text>
											From Street: {ticket.fromStreet}
										</Text>
										<Text>
											Date of Departure: {moment(ticket.startTime).format('Do MMMM YY')}
										</Text>
										<Text>
											Departure Time: {moment(ticket.startTime).format('h:mm a')}
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
											To City: {ticket.toCity}
										</Text>
										<Text>
											To Street: {ticket.toStreet}
										</Text>
										<Text>
											Date of Arrival: {moment(ticket.endTime).format('Do MMMM YY')}
										</Text>
										<Text>
											Arrival Time: {moment(ticket.endTime).format('h:mm a')}
										</Text>
										{ticket.expired === 0 && ticket.cancelled === 0 && 
										<View style={styles.buttonContainer}>
											<Button danger style={styles.button} onPress={this.cancelTicketPopup}>
												<Text>Cancel</Text>
											</Button>
										</View>}
								
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
												onPress={() => this.cancelTicketPopupYes(ticket.startTime)}
											/>
										</DialogFooter>
									}
									onTouchOutside={this.cancelTicketPopupNo}
								>
									<DialogContent>
										<Text>Are you sure you want to cancel your journey from <Text style={{fontWeight: 'bold'}}>{ticket.fromCity}, {ticket.fromStreet}</Text> to <Text style={{fontWeight: 'bold'}}>{ticket.toCity}, {ticket.toStreet}</Text>?</Text>
									</DialogContent>
								</Dialog>
								
						
							
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
		addTransaction: transaction => dispatch(addTransaction(transaction)),
		ticketCancelRedux: ticketId => dispatch(cancelTicket(ticketId))
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(TicketDetail)