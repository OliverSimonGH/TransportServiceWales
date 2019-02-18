import React, { Component } from 'react';
import { StyleSheet, View, TouchableHighlight, Keyboard, ScrollView, TouchableOpacity } from 'react-native';
// import API_KEY from '../google_api_key';
import _ from 'lodash';
import { Content, Container, Button, Text, Item, Input, StyleProvider } from 'native-base';
import getTheme from '../native-base-theme/components';
import platform from '../native-base-theme/variables/platform';
import GlobalHeader from '../components/GlobalHeader';
import { tickets } from './data';
import TicketLayout from './TicketLayout';
import { ACTION_ZEN_MODE_EVENT_RULE_SETTINGS } from 'expo/build/IntentLauncherAndroid/IntentLauncherAndroid';


  export default class LinksScreen extends React.Component {
    static navigationOptions = {
      header: null,
    };
    state = {
			expansionIsOpen: false,
      isLoadingComplete: false,
      data:[]
    };
  
    fetchData= async() =>{
      const response = await fetch('http://10.22.199:3000/users');
      const users = await response.json();
      this.setState({data: users});
    }
  
    componentDidMount(){
      this.fetchData();
		}
		
		openTicket = (ticket) => {
			this.setState({
				expansionIsOpen: true,
				ticket,
			});
		}

		closeTicket = () => {
			this.setState({
				expansionIsOpen:false,
			});
		}

    render() {
		return (
			<StyleProvider style={getTheme(platform)}>
				<ScrollView>
				
					<GlobalHeader type={1} />
					<Container style={styles.contentContainer}>
						<Content>
							<View style={styles.secondaryButtonContainer}>
								<Button bordered danger style={styles.secondaryButton}>
									<Text style={styles.secondaryButtontext}>Active Tickets</Text>
								</Button>
								</View>
									<View style={styles.Container}>
										<ScrollView
										showsHorizontalScrollIndicator={false}
										showsVerticalScrollIndicator={false}
										>
									{tickets.map((ticket, index) => <TicketLayout
										ticket={ticket}
										onOpen={this.openTicket}
										key={index}
										/>)}
								</ScrollView>
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
	Container:{
		paddingTop:20,
	},

});
