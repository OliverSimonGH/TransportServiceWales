import React from 'react';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';

import PassengerNavigator from './PassengerNavigator';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegistrationScreen';

export default createAppContainer(createSwitchNavigator({
  // You could add another route here for authentication.
  // Read more at https://reactnavigation.org/docs/en/auth-flow.html
  Login: LoginScreen,
  Register: RegisterScreen,
  Passenger: PassengerNavigator,

}));