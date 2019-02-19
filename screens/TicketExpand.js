import React, { Component } from 'react';
import {
    Animated,
    Easing,
    Image,
    Dimensions,
    StyleSheet,
    Text,
    TouchableWithoutFeedback,
    View
} from 'react-native';

const { width, height } = Dimensions.get('window');

export default class TicketExpand extends Component {

    state = {
        position: new Animated.Value(0),
        visible: this.props.isOpen,
    };

    // componentDidMount(){
    //     this.setState({
    //         position: new Animated.Value(this.props.isOpen ? height : 0)
    //     })
    //     console.log(this.state.position)

    // }

    componentWillUpdate(nextProps){
        if(this.props.isOpen === true && this.props.isOpen !== nextProps.isOpen){
            this.animateOpen();
        }
    }

    componentWillReceiveProps(nextProps) {
        if (!this.props.isOpen && nextProps.isOpen) {
            this.animateOpen();
        } 
    }

    animateOpen = () => {
        this.setState({ visible: true, position: height })
        // Animated.timing(
        //     this.state.position,
        //     { 
        //         toValue: height,
        //         duration: 1000,
        //         easing: Easing.linear
        // },
        // ).start();
    }

    animateClose = () => {
        this.setState({ 
            visible: false,
            position: 0 
        })
    }

    render() {
        if (!this.state.visible) {
            return null;
        }

        return (
            <View style={styles.container}>
                <TouchableWithoutFeedback onPress={this.animateClose}>
                    <Animated.View style={styles.backdrop} />
                </TouchableWithoutFeedback>
                <Animated.View
                    style={[styles.modal, {
                        transform: [{ translateY: this.state.position }, { translateX: 0 }]
                    }]}
                >
                    <Text>Expansion of Ticket</Text>
                </Animated.View>

            </View>
        );
    }

}

const styles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'flex-end',
        backgroundColor: 'transparent',
    },
    backdrop: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'black',
        opacity: 0.5,
    },
    modal: {
        height: height / 2,
        backgroundColor: 'white',
    },
});
