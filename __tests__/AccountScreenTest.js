import React from 'react';
import renderer from 'react-test-renderer';

import AccountScreen from '../screens/passenger/AccountsScreen';

it('renders correctly when account screen loaded', () => {
    const tree = renderer.create(<AccountScreen/>).toJSON();
    expect(tree).toMatchSnapshot();
})

it('should render the accounts screen page without crashing', () => {
    const rendered = renderer.create(<AccountScreen/>).toJSON();
    expect(rendered).toBeTruthy();
});