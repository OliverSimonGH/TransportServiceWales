import React from 'react';
import { Platform } from 'react-native';
import { createStackNavigator, createBottomTabNavigator } from 'react-navigation';

import TabBarIcon from '../components/TabBarIcon';
import MySchedule from '../screens/driver/MySchedule';
import RouteScreen from '../screens/driver/RouteScreen';
import DriverSchedule from '../screens/driver/DriverSchedule';
import LoginScreen from '../screens/LoginScreen';
import AccountsScreen from '../screens/driver/DriverAccount';
import EmergencyContact from '../screens/driver/EmergencyContact';
import ChangeDetails from '../screens/driver/ChangeDriverDetails';
import ChangeDriverDetails from '../screens/driver/ChangeDriverDetails';


const MyScheduleStack = createStackNavigator(
	{
		DailySchedule: DriverSchedule,
		SelectedJourney: MySchedule,
		Route: RouteScreen,
		Login: LoginScreen
	},
	{
		initialRouteName: 'DailySchedule'
	}
);

const AccountStack = createStackNavigator({
	Account: AccountsScreen,
	EmergencyContact: EmergencyContact,
	ChangeDetails: ChangeDriverDetails
},
{ initialRouteName: 'Account' }
);

AccountStack.navigationOptions = {
	tabBarLabel: 'Settings',
	tabBarIcon: ({ focused }) => (
		<TabBarIcon focused={focused} name={Platform.OS === 'ios' ? 'ios-settings' : 'md-settings'} />
	)
};

MyScheduleStack.navigationOptions = {
	tabBarLabel: 'Schedule',
	tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} name={Platform.OS === 'ios' ? 'ios-bus' : 'md-bus'} />
};

export default createBottomTabNavigator(
	{
		MyScheduleStack,
		AccountStack
	},
	{
		tabBarOptions: {
			activeTintColor: 'white',
			inactiveTintColor: '#cccccc',
			style: {
				backgroundColor: '#ff0000'
			}
		}
	}
);
