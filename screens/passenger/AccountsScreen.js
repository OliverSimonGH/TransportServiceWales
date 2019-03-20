import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import {
	Button,
	Container,
	Text,
	Header,
	Content,
	List,
	ListItem,
	Left,
	Right,
	Icon,
	Accordion
} from 'native-base';
import GlobalHeader from '../../components/GlobalHeader';
const dataArray = [
	{title: "My Details", content: "User Details will be shown here"},
	{title: "Settings", content: "Settings will be shown here"},
	{title: "My Theme", content: "Theme will be shown here"},
	{title: "Emergency Contacts", content: "Emergency Contact"},
];



export default class AccountsScreen extends Component {
	static navigationOptions = {
		header: null
	};

	logout = () => {
		this.props.navigation.navigate('Login');
	};

	navigateTo = () => {
		this.props.navigation.navigate('');
	};


	render() {
		return (
			<Container>
				<GlobalHeader type={1} navigateTo={this.navigateTo} />
			<Content style={styles.contentContainer}>
					{/* <Accordion 
					dataArray={dataArray}
					icon="add"
					expandedIcon="remove"
					iconStyle={{ color: "green" }}
					expandedIconStyle={{ color: "red" }}
					headerStyle={{backgroundColor: "#fe0b1b"}}
					contentStyle={{ backgroundColor: "#e5dddd" }}
					/>	 */}
					<View style={styles.secondaryButtonContainer}>
								<Button bordered danger style={styles.secondaryButton}>
									<Text style={styles.secondaryButtontext}>My Details</Text>
								</Button>
							</View>		
							<View style={styles.secondaryButtonContainer}>
								<Button bordered danger style={styles.secondaryButton}>
									<Text style={styles.secondaryButtontext}>Emergency Contacts</Text>
								</Button>
							</View>	
							<View style={styles.secondaryButtonContainer}>
								<Button bordered danger style={styles.secondaryButton}>
									<Text style={styles.secondaryButtontext}>My Theme</Text>
								</Button>
							</View>	
										
					<Button style={styles.logoutButton} onPress={this.logout}>
							<Text>Log Out</Text>
						</Button>
					</Content>

			</Container>
		);
	}
}

const styles = StyleSheet.create({
	contentContainer: {
		width: '80%',
		flex: 1,
		flexDirection: 'column',
		alignSelf: 'center'
	},
	logoutButton: {
		backgroundColor: '#ff0000',
		justifyContent: 'center',
		marginTop: 25,
		alignSelf: 'center'
	},
	secondaryButtonContainer: {
		flexDirection: 'row',
		marginTop: 25
	},
	secondaryButton: {
		width: '100%',
		justifyContent: 'center',
		backgroundColor: '#fff'
	},
	secondaryButtontext: {
		color: '#ff0000'
	}
});
