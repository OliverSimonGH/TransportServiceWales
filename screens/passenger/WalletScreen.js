import React from 'react';
import { Image, Platform, ScrollView, StyleSheet, TouchableOpacity, View, Dimensions } from 'react-native';
import { WebBrowser } from 'expo';

import { MonoText } from '../../components/StyledText';
import { Button, Text } from 'native-base';

const window = Dimensions.get('window');

export default class WalletScreen extends React.Component {
	static navigationOptions = {
		header: null
	};

	onSubmit = () => {
		this.props.navigation.navigate('Login');
	};

	render() {
		return (
			<View style={styles.container}>
				<Button
					style={{
						height: window.height,
						width: window.width,
						justifyContent: 'center',
						alignItems: 'center',
						textAlign: 'center'
					}}
					onPress={this.onSubmit}
				>
					<Text>Login</Text>
				</Button>
			</View>
		);
	}

	_maybeRenderDevelopmentModeWarning() {
		if (__DEV__) {
			const learnMoreButton = (
				<Text onPress={this._handleLearnMorePress} style={styles.helpLinkText}>
					Learn more
				</Text>
			);

			return (
				<Text style={styles.developmentModeText}>
					Development mode is enabled, your app will be slower but you can use useful development tools.{' '}
					{learnMoreButton}
				</Text>
			);
		} else {
			return (
				<Text style={styles.developmentModeText}>
					You are not in development mode, your app will run at full speed.
				</Text>
			);
		}
	}

	_handleLearnMorePress = () => {
		WebBrowser.openBrowserAsync('https://docs.expo.io/versions/latest/guides/development-mode');
	};

	_handleHelpPress = () => {
		WebBrowser.openBrowserAsync(
			'https://docs.expo.io/versions/latest/guides/up-and-running.html#can-t-see-your-changes'
		);
	};
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#fff'
	},
	developmentModeText: {
		marginBottom: 20,
		color: 'rgba(0,0,0,0.4)',
		fontSize: 14,
		lineHeight: 19,
		textAlign: 'center'
	},
	contentContainer: {
		paddingTop: 30
	},
	welcomeContainer: {
		alignItems: 'center',
		marginTop: 10,
		marginBottom: 20
	},
	welcomeImage: {
		width: 100,
		height: 80,
		resizeMode: 'contain',
		marginTop: 3,
		marginLeft: -10
	},
	getStartedContainer: {
		alignItems: 'center',
		marginHorizontal: 50
	},
	homeScreenFilename: {
		marginVertical: 7
	},
	codeHighlightText: {
		color: 'rgba(96,100,109, 0.8)'
	},
	codeHighlightContainer: {
		backgroundColor: 'rgba(0,0,0,0.05)',
		borderRadius: 3,
		paddingHorizontal: 4
	},
	getStartedText: {
		fontSize: 17,
		color: 'rgba(96,100,109, 1)',
		lineHeight: 24,
		textAlign: 'center'
	},
	tabBarInfoContainer: {
		position: 'absolute',
		bottom: 0,
		left: 0,
		right: 0,
		...Platform.select({
			ios: {
				shadowColor: 'black',
				shadowOffset: { height: -3 },
				shadowOpacity: 0.1,
				shadowRadius: 3
			},
			android: {
				elevation: 20
			}
		}),
		alignItems: 'center',
		backgroundColor: '#fbfbfb',
		paddingVertical: 20
	},
	tabBarInfoText: {
		fontSize: 17,
		color: 'rgba(96,100,109, 1)',
		textAlign: 'center'
	},
	navigationFilename: {
		marginTop: 5
	},
	helpContainer: {
		marginTop: 15,
		alignItems: 'center'
	},
	helpLink: {
		paddingVertical: 15
	},
	helpLinkText: {
		fontSize: 14,
		color: '#2e78b7'
	}
});
