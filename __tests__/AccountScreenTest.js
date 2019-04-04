import React from 'react';
import renderer from 'react-test-renderer';

import AccountScreen from '../screens/passenger/AccountsScreen';

it('renders correctly when account screen loaded', () => {
    const tree = renderer.create(<AccountScreen/>).toJSON();
    expect(tree).toMatchSnapshot();
});