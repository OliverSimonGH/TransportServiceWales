import React from 'react';
import {StyleSheet, View } from 'react-native';
import {Container, Content, Text } from 'native-base';
import GlobalHeader from '../../components/GlobalHeader';

import WalletBalance from './WalletBalance'
import WalletTransaction from './WalletTransaction'
import WalletHeader from './WalletHeader'

export default class WalletScreen extends React.Component {

	static navigationOptions = {
		header: null
	};

	onSubmit = () => {
		this.props.navigation.navigate('AddFunds');
	}
	
	render() {
		return (
			<Container>
				<GlobalHeader type={1} />
				<Content>
					<WalletHeader title="WALLET" />
					<WalletBalance type={1} onSubmit={this.onSubmit}/>
					<WalletTransaction />
				</Content>
			</Container>
		);
	}
}

