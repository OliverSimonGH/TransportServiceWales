import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Container, Content, Text } from 'native-base';
import GlobalHeader from '../../components/GlobalHeader';

export default class AccountsScreen extends Component {

	static navigationOptions = {
		header: null
	};

	logout = () => {
		this.props.navigation.navigate('Login')
	}

	render() {
		return (
			<Container>
				<GlobalHeader type={1} />
				<Content contentContainerStyle={styles.contentContainer}>
				<View>
					<Button style={styles.logoutButton} onPress={this.logout}>
						<Text>Log Out</Text>
					</Button>
				</View>
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
