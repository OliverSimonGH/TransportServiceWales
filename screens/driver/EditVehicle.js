import { Ionicons } from '@expo/vector-icons';
import { Accordion, Button, Container, Content, Text } from 'native-base';
import React, { Component } from 'react';
import { Dimensions, Picker, StyleSheet, TextInput, View } from 'react-native';
import GlobalHeader from '../components/GlobalHeader';
import ip from '../ipstore';

class EditVehicle extends Component {
	constructor(props) {
        super(props)
        this.state = {
		registration: '',
		make: '',
		model: '',
		year: '',
        passanger_seats: '',
        wheelchair_access: '',
        currently_driven: '',
		errors: []
		}
	};

	// Initialize the states
    componentWillMount() {
        const { registration, make, model, year, passanger_seats,
            wheelchair_access, currently_driven } = this.props

        this.setState({ registration, make, model, year, passanger_seats,
            wheelchair_access, currently_driven })
    }

    componentWillReceiveProps(nextProps) {
        const { registration, make, model, year, passanger_seats,
            wheelchair_access, currently_driven } = nextProps

        this.setState({ registration, make, model, year, passanger_seats,
            wheelchair_access, currently_driven })
	}
	
	// This determines whether a rendered post should get updated
    // Look at the states here, what could be changing as time goes by?
    // Only 2 properties: "liked" and "likeCount", if the person seeing
    // this post ever presses the "like" button
    shouldComponentUpdate(nextProps, nextState) {
        const {registration, make, model, year, passanger_seats,
            wheelchair_access, currently_driven } = nextState
        const { liked: oldLiked, likeCount: oldLikeCount } = this.state

        // If "liked" or "likeCount" is different, then update
        return liked !== oldLiked || likeCount !== oldLikeCount
	}
	
	render() {
        return(
            <View>
                ...    // render other properties
                // render the "like" button
                // "onLikePost" is a function passed down to this component
                <TouchableOpacity
                    onPress={() => this.props.onLikePost({ postId: this.state.postId })}
                >
                    <Icon
                        name='heart'
                        color={this.state.liked ? "gray" : "red"}
                    />
                </TouchableOpacity>
            </View>
        )
    }


};