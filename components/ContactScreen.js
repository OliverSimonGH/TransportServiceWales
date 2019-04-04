import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Container, Text, Content, Accordion } from 'native-base';
import colors from '../constants/Colors';
import GlobalHeader from './GlobalHeader';
const dataArray = [
	{
		title: 'City of Cardiff Council',
		content: 'Website: www.cardiff.gov.uk' + '\n' + 'Contact Number:029 2087 2087'
	},
	{
		title: 'Bridgeend County Borough Council',
		content: 'Website: www.bridgend.gov.uk' + '\n' + 'Contact Number:01656 643643'
	},
	{
		title: 'Blaenau Gwent Council',
		content: 'Website: www.blaenau-gwent.gov.uk' + '\n' + 'Contact Number:01495 311556'
	},
	{
		title: 'Carmarthenshire Council',
		content: 'Website: www.carmarthenshire.gov.wales' + '\n' + 'Contact Number:01267 234567'
	},
	{
		title: 'Ceredigion Council',
		content: 'Website: www.ceredigion.gov.uk' + '\n' + 'Contact Number:01545 570881'
	},
	{
		title: 'Conwy Council',
		content: 'Website: www.conwy.gov.uk' + '\n' + 'Contact Number:01492 574000'
	},
	{
		title: 'Denbighshire Council',
		content: 'Website: www.denbighshire.gov.uk' + '\n' + 'Contact Number:01824 706000'
	},
	{
		title: 'Pembrokeshire Council',
		content: 'Website: www.pembrokeshire.gov.uk/' + '\n' + 'Contact Number:(01437) 764551'
	},
	{
		title: 'Merthyr Tydfil Council',
		content: 'Website: www.merthyr.gov.uk/' + '\n' + 'Contact Number:01685 725000'
	},
	{
		title: 'Newport Council',
		content: 'Website:www.newport.gov.uk/_dc/index.cfm' + '\n' + 'Contact Number:01633 656656'
	},
	{
		title: 'Monmouthshire Council',
		content: 'Website: http://www.monmouthshire.gov.uk' + '\n' + 'Contact Number:01633 644644'
	}
];

export default class ContactScreen extends Component {
	static navigationOptions = {
		header: null
	};

	navigateTo = () => {
		this.props.navigation.navigate('');
	};

	settings = () => {
		this.props.navigation.navigate('Settings');
	};

	render() {
		return (
			<Container>
				<GlobalHeader
					type={1}
					navigateTo={this.navigateTo}
					isBackButtonActive={1}
				/>
				<Content style={styles.contentContainer} padder>
					<View style={styles.secondaryButtonContainer}>
						<Button bordered danger style={styles.secondaryButton} onPress={this.settings}>
							<Text style={styles.secondaryButtontext}>Settings</Text>
						</Button>
					</View>

					<Accordion
						dataArray={dataArray}
						icon="add"
						expandedIcon="remove"
						iconStyle={{ color: 'white' }}
						expandedIconStyle={{ color: 'red' }}
						headerStyle={{ backgroundColor: 'red' }}
						contentStyle={{ backgroundColor: colors.emphasisTextColor }}
					/>
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
		marginTop: 25,
		marginBottom: 25
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
