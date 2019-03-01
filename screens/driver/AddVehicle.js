import { Ionicons } from '@expo/vector-icons';
import { Accordion, Button, Container, Content, Text } from 'native-base';
import React, { Component } from 'react';
import { Dimensions, Picker, StyleSheet, TextInput, View } from 'react-native';
import GlobalHeader from '../components/GlobalHeader';
import ip from '../ipstore';

class AddVehicleScreen extends Component {
	state = {
		registration: '',
		make: '',
		model: '',
		year: '',
        passanger_seats: '',
        wheelchair_access: '',
        currently_driven: '',
		errors: []
	};

	onSubmit = () => {
		//Send data to the server
		const data = {
			registration: this.state.registration,
			make: this.state.make,
			model: this.state.model,
			year: this.state.year,
			passenger_seats: this.state.passenger_seats,
            wheelchair_access: this.state.wheelchair_access,
            currently_driven: this.state.currently_driven,
            type: this.state.type
        };

		fetch(`http://${ip}:3000/addvehicle`, {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(data)
        })
    };
};