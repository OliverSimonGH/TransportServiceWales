import React from 'react';
import {StyleSheet, View } from 'react-native';
import {Container, Content, Text } from 'native-base';
import GlobalHeader from '../../components/GlobalHeader';

import WalletBalance from './WalletBalance'
import WalletTransaction from './WalletTransaction'

export default class WalletScreen extends React.Component {
	static navigationOptions = {
		header: null
	};

	state = {
		key: 0,
	}

	onSubmit = () => {
		this.props.navigation.navigate('AddFunds');
	}
	
	render() {
		return (
			<Container>
				<GlobalHeader type={1} />
				<Content>
					<View style={styles.headerContainer}>
						<Text>WALLET</Text>
					</View>
					<WalletBalance key={this.state.key} onSubmit={this.onSubmit}/>
					<WalletTransaction key={this.state.key + 1} />
				</Content>
			</Container>
		);
	}
}

const styles = StyleSheet.create({
	headerContainer: {
		padding: 25,
		borderBottomWidth: 1,
		borderBottomColor: '#dfdfdf'
	}
});
