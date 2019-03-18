import React, { Component } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import moment from 'moment';
import Icon from 'react-native-vector-icons/Ionicons';

export default class TicketLayout extends Component {
	render() {
		const ticket = this.props.ticket;
		return (
			<View style={styles.card}>
				<View style={styles.ticketTypeContainer}>
					{ticket.expired ?
						<View style={[styles.ticketType, { backgroundColor: '#bcbcbc' }]}>
							<Text style={styles.ticketTypeText}>SGL</Text>
						</View>
						:
						<View style={styles.ticketType}>
							<Text style={styles.ticketTypeText}>SGL</Text>
						</View>
					}
				</View>
				<TouchableOpacity onPress={this.props.onOpen}>
					<View style={styles.ticket}>
						<View style={styles.ticketDateTime}>
							<Text style={styles.dateText}>{moment(ticket.date).format('Do MMMM YYYY')}</Text>
							<Text style={styles.timeText}>{moment(ticket.time).format('LT')}</Text>
						</View>
						<View style={styles.ticketDetails}>
							<View style={styles.ticketFrom}>
								<Text style={styles.body}>{ticket.fromStreet},</Text>
								<Text style={styles.body}>{ticket.fromCity}</Text>
							</View>
							<View style={styles.ticketTypeIcon}>
								<Icon name="ios-arrow-round-forward" size={30} color="#bcbcbc" />
								{/* <Icon name="ios-swap" size={30} color="#999999" /> */}
							</View>
							<View style={styles.ticketTo}>
								<Text style={styles.body}>{ticket.toStreet},</Text>
								<Text style={styles.body}>{ticket.toCity}</Text>
							</View>
							<View></View>
						</View>
					</View>
				</TouchableOpacity>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	card: {
		flex: 1,
		flexDirection: 'row',
		borderBottomColor: '#dfdfdf',
		borderBottomWidth: 1
	},
	ticketTypeContainer: {
		width: '10%',
		marginRight: 10,
		flexDirection: 'row',
	},
	ticketType: {
		backgroundColor: '#ff0000',
		top: 10,
		flex: 1,
		alignSelf: 'flex-start',
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
		borderTopRightRadius: 5,
		borderBottomRightRadius: 5,
	},
	ticketTypeText: {
		color: '#fff',
		fontWeight: 'bold',
	},
	ticket: {
		width: '90%',
		flex: 1,
		flexDirection: 'column',
	},
	ticketDateTime: {
		marginTop: 10,
	},
	dateText: {
		color: '#999999',
		fontSize: 16,
	},
	timeText: {
		color: '#666666',
		fontSize: 18,
		marginTop: 5,
	},
	ticketDetails: {
		marginTop: 5,
		flex: 1,
		flexDirection: 'row',
		marginBottom: 10,
	},
	ticketFrom: {
		width: '40%',
	},
	ticketTypeIcon: {
		width: '10%',
		marginRight: 10,
	},
	ticketTo: {
		width: '45%',
	},
	body: {
		color: '#999999',
		fontSize: 14,
	},
});
