import React, { Component } from 'react';
import { StyleSheet, View, TouchableHighlight, Keyboard, ScrollView, TouchableOpacity } from 'react-native';
// import API_KEY from '../google_api_key';
import _ from 'lodash';
import { Content, Container, Button, Text, Item, Input, StyleProvider } from 'native-base';
import getTheme from '../native-base-theme/components';
import platform from '../native-base-theme/variables/platform';
import GlobalHeader from '../components/GlobalHeader';
import ip from '../ipstore';
import TicketLayout from './TicketLayout';
import uuid from 'uuid/v4';

import { connect } from 'react-redux';
import { fetchTickets } from '../redux/actions/ticketAction';

class TicketsScreen extends React.Component {
	static navigationOptions = {
		header: null
	};

	state = {
		showActive: 0
	};

	componentDidMount() {
		this.props.fetchTickets()
	}

	openTicket = (ticketData) => {
		this.props.navigation.navigate('Details', { ticket: ticketData });
	};

	showActive = () => {
		this.setState({ showActive: 0 })
	}

	showExpired = () => {
		this.setState({ showActive: 1 })
	}

	navigateTo = () => {
		this.props.navigation.navigate('Ticket');
	};

	render() {
		return (
			<StyleProvider style={getTheme(platform)}>
				<ScrollView showsHorizontalScrollIndicator={false} showsVerticalScrollIndicator={false}>
					<GlobalHeader type={1} navigateTo={this.navigateTo}/>
					<Container style={styles.contentContainer}>
						<Content>
							<View style={styles.titleContainer}>
								<Text style={styles.title}>My Tickets</Text>
							</View>
							<View style={{ flex: 1, flexDirection: 'row', paddingTop: 25, paddingBottom: 25 }}>
								<Button bordered danger style={styles.secondaryButton} onPress={this.showActive}>
									<Text style={styles.secondaryButtontext}>Active Tickets</Text>
								</Button>
								<Button bordered danger style={styles.secondaryButton} onPress={this.showExpired}>
									<Text style={styles.secondaryButtontext}>Expired Tickets</Text>
								</Button>
							</View>
							<View>
							{this.props.tickets !== 'undefined' && this.state.showActive === 0 && this.props.tickets.length > 0 && this.props.tickets.map((ticket) => {
								if (ticket.expired === 0){
									return(
										<TicketLayout onOpen={() => this.openTicket(ticket)} key={uuid()} ticket={ticket}/>
									)
								}
							})}
							{this.props.tickets !== 'undefined' && this.state.showActive === 1 && this.props.tickets.length > 0 && this.props.tickets.map((ticket) => {
								if (ticket.expired === 1){
									return(
										<TicketLayout onOpen={() => this.openTicket(ticket)} key={uuid()} ticket={ticket}/>
									)
								}
							})}
							</View>
						</Content>
					</Container>
				</ScrollView>
			</StyleProvider>
		);
	}
}

const styles = StyleSheet.create({
	dateTimeContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		marginTop: 10,
		borderBottomWidth: 0.5,
		borderBottomColor: '#d3d3d3',
		height: 50
	},
	dateTime: {
		marginLeft: 6,
		color: '#bcbcbc',
		fontSize: 17
	},
	iconWithInput: {
		marginTop: 10
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
		alignSelf: 'center',
		backgroundColor: 'transparent',
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
		width: '50%%',
		color: '#ff6666'
	},
	buttontext: {
		color: '#000000'
	},
	secondaryButton: {
		flex: 1,
		flexDirection: 'row',
		width: '50%',
	},
	secondaryButtontext: {
		color: '#ff0000'
	},
	Container: {
		paddingTop: 20,
		backgroundColor: 'transparent',
	},
	title: {
		textAlign: 'center',
		fontSize: 30,
		fontWeight: 'bold',
		color: 'gray',
		paddingTop: 10
	}
});

const mapStateToProps = state => ({
	tickets: state.ticketReducer.tickets
})

export default connect (mapStateToProps, {fetchTickets})(TicketsScreen)