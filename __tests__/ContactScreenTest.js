import React from 'react';
import renderer from 'react-test-renderer';

import Contact from '../screens/passenger/ContactScreen';

it('renders correctly when contact screen loaded', () => {
    const tree = renderer.create(<Contact/>).toJSON();
    expect(tree).toMatchSnapshot();
})
it('should render the contacts screen page without crashing', () => {
    const rendered = renderer.create(<Contact/>).toJSON();
    expect(rendered).toBeTruthy();
});