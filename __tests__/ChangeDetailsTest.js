import React from 'react';
import renderer from 'react-test-renderer';
import ChangeDetails from '../screens/passenger/ChangeDetailsScreen';
import {shallow, mount, render} from 'enzyme';

it('should render the change details page without crashing', () => {
    const rendered = renderer.create(<ChangeDetails/>).toJSON();
    expect(rendered).toBeTruthy();
});