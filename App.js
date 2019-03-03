import React from 'react';
import { Platform, StatusBar, StyleSheet, View, Linking, Text, FlatList } from 'react-native';
import { AppLoading, Asset, Font, Icon } from 'expo';
import AppNavigator from './navigation/AppNavigator';
import LoginScreen from './screens/LoginScreen';
import RegistrationScreen from './screens/RegistrationScreen';
import store from './redux/store/ReduxStore';
import { Provider } from 'react-redux';
import { Permissions } from 'expo';

export default class App extends React.Component {
	static navigationOptions = {
		header: null
	};
	state = {
		isLoadingComplete: false,
		data: []
	};

	// Asks the user for permission to turn on location
	permissionFlow = async () => {
		const { status } = await Permissions.askAsync(Permissions.LOCATION);

		this.setState({ status });

		if (status !== 'granted') {
			Linking.openURL('app-settings');
			return;
		}
	};

	render() {
		if (!this.state.isLoadingComplete && !this.props.skipLoadingScreen) {
			return (
				//<Provider store={store}>
				<AppLoading
					startAsync={this._loadResourcesAsync}
					onError={this._handleLoadingError}
					onFinish={this._handleFinishLoading}
				/>
			);
		} else {
			return (
				<View style={styles.container}>
					{Platform.OS === 'ios' && <StatusBar barStyle="default" />}

					<AppNavigator />
				</View>
			);
		}
	}

	_loadResourcesAsync = async () => {
		return Promise.all([
			Font.loadAsync({
				// This is the font that we are using for our tab bar
				...Icon.Ionicons.font,
				// We include SpaceMono because we use it in HomeScreen.js. Feel free
				// to remove this if you are not using it in your app
				'space-mono': require('./assets/fonts/SpaceMono-Regular.ttf'),
				Roboto: require('native-base/Fonts/Roboto.ttf'),
				Roboto_medium: require('native-base/Fonts/Roboto_medium.ttf')
			})
		]);
	};

	_handleLoadingError = (error) => {
		// In this case, you might want to report the error to your error
		// reporting service, for example Sentry
		console.warn(error);
	};

	_handleFinishLoading = () => {
		this.setState({ isLoadingComplete: true });
	};
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#fff'
	}
});
