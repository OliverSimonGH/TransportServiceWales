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
			<Content padder>
					<Accordion 
					dataArray={dataArray}
					icon="add"
					expandedIcon="remove"
					iconStyle={{ color: "green" }}
					expandedIconStyle={{ color: "red" }}
					headerStyle={{backgroundColor: "#fe0b1b"}}
					contentStyle={{ backgroundColor: "#e5dddd" }}
					/>						
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
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center'
	},
	logoutButton: {
		backgroundColor: '#ff0000'
	}
});
