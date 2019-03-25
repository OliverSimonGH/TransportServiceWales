import { Card, CardItem, Container, Content, H1, Right, Text } from 'native-base';
import React from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import GlobalHeader from '../../components/GlobalHeader';
import ip from '../../ipstore';

export default class VehiclesScreen extends React.Component {
	static navigationOptions = {
		header: null
	};
	state = {

	};

	navigateTo = () => {
		this.props.navigation.navigate('');
	};

	render() {
		return (
			<Container>
				<GlobalHeader type={1} navigateTo={this.navigateTo} />
				<Content>
					
				</Content>
			</Container>
		);
	}
}

const styles = StyleSheet.create({
	
});
