import React from 'react';
import { Platform } from 'react-native';
import { createStackNavigator, createBottomTabNavigator } from 'react-navigation';
import colors from '../constants/Colors';

import TabBarIcon from '../components/TabBarIcon';
import MySchedule from '../screens/driver/MySchedule';
import RouteScreen from '../screens/driver/RouteScreen';
import DriverSchedule from '../screens/driver/DriverSchedule';
import VehiclesScreen from './../screens/driver/VehiclesScreen';
import AccountsScreen from './../screens/driver/AccountsScreen';
import AddVehicle from './../screens/driver/AddVehicle';
import MakeSelect from './../screens/driver/MakeSelect';

const MyScheduleStack = createStackNavigator(
	{
		DailySchedule: DriverSchedule,
		SelectedJourney: MySchedule,
		Route: RouteScreen,
	},
	{
		initialRouteName: 'DailySchedule'
	}
);

MyScheduleStack.navigationOptions = {
	tabBarLabel: 'My Schedule',
	tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} name={Platform.OS === 'ios' ? 'ios-calendar' : 'md-calendar'} />
};

const VehiclesStack = createStackNavigator(
	{
		MyVehicles: VehiclesScreen,
		AddVehicle: AddVehicle,
		MakeSelect: MakeSelect,
	},
	{
		initialRouteName: 'AddVehicle'
	}
);

VehiclesStack.navigationOptions = {
	tabBarLabel: 'My Vehicles',
	tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} name={Platform.OS === 'ios' ? 'ios-car' : 'md-car'} />
};

const AccountStack = createStackNavigator({
	Account: AccountsScreen
});

AccountStack.navigationOptions = {
	tabBarLabel: 'Settings',
	tabBarIcon: ({ focused }) => (
		<TabBarIcon focused={focused} name={Platform.OS === 'ios' ? 'ios-settings' : 'md-settings'} />
	)
};

export default createBottomTabNavigator(
	{
		MyScheduleStack,
		VehiclesStack,
		AccountStack
	},
	{
		tabBarOptions: {
			activeTintColor: colors.tabIconSelected,
			inactiveTintColor: colors.tabIconDefault,
			style: {
				backgroundColor: colors.brandColor
			}
		}
	}
);
