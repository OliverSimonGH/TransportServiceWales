import React from 'react';
import renderer from 'react-test-renderer';
import ChangeDetails from '../screens/passenger/ChangeDetailsScreen';
import {shallow, mount, render} from 'enzyme';

it('renders correctly when change details page loaded', () => {
    const tree = renderer.create(<ChangeDetails/>).toJSON();
    expect(tree).toMatchSnapshot();
})
it('should render the change details page without crashing', () => {
    const rendered = renderer.create(<ChangeDetails/>).toJSON();
    expect(rendered).toBeTruthy();
});
