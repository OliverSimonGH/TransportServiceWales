import React, { Component } from 'react';
import { StyleSheet, View, TouchableHighlight, Keyboard, ScrollView, TouchableOpacity, Image } from 'react-native';
// import API_KEY from '../google_api_key';
import _ from 'lodash';
import { Content, Container, Button, Text, Item, Input, StyleProvider } from 'native-base';
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
		expansionIsOpen: false,
		isLoadingComplete: false,
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

	openTicket = () => {
		this.setState({
			expansionIsOpen: true
		});
	};

	closeTicket = () => {
		console.log('hello');
		this.setState({
			expansionIsOpen: false
		});
	};

	navigateTo = () => {
		this.props.navigation.navigate('Ticket');
	};

	amendTicket = () => {
		data = {
			ticketId: this.state.ticketData[0].ticket_id,
			street: this.state.ticketData[0].street,
			city: this.state.ticketData[0].city,
			endStreet: this.state.ticketData[1].street,
			endCity: this.state.ticketData[1].city,
			date: this.state.ticketData[0].date_of_journey,
			time: this.state.ticketData[0].time_of_journey,
			numPassenger: this.state.ticketData[0].no_of_passengers,
			numWheelchair: this.state.ticketData[0].no_of_wheelchairs,
		}
		this.props.navigation.navigate('Amend', data);
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

							{this.state.ticketData.length >= 1 && (
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
									</React.Fragment>
								</View>
							)}
							<View style={styles.buttonContainer}>
								<Button
									danger
									style={[styles.button, { backgroundColor: '#ff0000' }]}
									onPress={this.amendTicket}
								>
									<Text style={styles.buttonText}>AMEND TICKET</Text>
								</Button>
							</View>
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
		height: 300,
		width: 300,
		borderRadius: 0.5,
		borderWidth: 1,
		borderColor: '#d6d7da'
	},
	imageContainer: {
		flex: 1
	},
	contentContainer: {
		width: '80%',
		flex: 1,
		flexDirection: 'column',
		alignSelf: 'center'
	},
	buttonContainer: {
		flex: 1,
		flexDirection: 'row',
		width: '100%',
		marginTop: 15,
		justifyContent: 'space-evenly',
	},
	button: {
		width: '45%',
		justifyContent: 'center'
	},
	title: {
		textAlign: 'center',
		fontSize: 30,
		fontWeight: 'bold',
		color: 'gray',
		paddingTop: 10
	}
});
