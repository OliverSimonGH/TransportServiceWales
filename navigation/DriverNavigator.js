import React from 'react';
import { Platform } from 'react-native';
import { createStackNavigator, createBottomTabNavigator } from 'react-navigation';

import TabBarIcon from '../components/TabBarIcon';
import MySchedule from '../screens/driver/MySchedule';
import RouteScreen from '../screens/driver/RouteScreen';
import DriverSchedule from '../screens/driver/DriverSchedule';

const MyScheduleStack = createStackNavigator(
	{
		Home: DriverSchedule,
		SelectedJourney: MySchedule,
		Route: RouteScreen
	},
	{
		initialRouteName: 'Home'
	}
);

MyScheduleStack.navigationOptions = {
	tabBarLabel: 'Schedule',
	tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} name={Platform.OS === 'ios' ? 'ios-bus' : 'md-bus'} />
};

export default createBottomTabNavigator({
	MyScheduleStack
});
