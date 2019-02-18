import React, {Component} from 'react';
import {
    Animated,
    Dimensions,
    StyleSheet,
    Text,
    TouchableWithoutFeedback,
    View
} from 'react-native';

const {width, height} = Dimensions.get('window');
 
export default class TicketExpand extends Component{

    state= {
        position: new Animated.Value(this.props.isOpen ? 0 :height),
        visible: this.props.isOpen,
    };

    componentWillReceiveProps(nextProps){
        if(!this.props.isOpen && nextProps.isOpen){
            this.animateClose();
        }
    }

    animateOpen(){
        this.setState({visible:true}, () => {
            Animated.timing(
                this.setState.position, {toValue: 0}
            ).start();
        });
        }
        
        animateClose(){
            Animated.timing(
                this.setState.position, {toValue: height}
            ).start(() => this.setState({visible:false}));
        }

        render(){
            if(!this.state.visible){
                return null;
            }

            return(
                <View style = {StyleSheet.container}>
                <Animated.View style={StyleSheet.backdrop}/>
                <Animated.View
                style={[styles.modal, {
                    transform:[{translateY:this.state.position}, {translateX:0}]
                }]}
                >
                <Text>Expansion of Ticket</Text>
                </Animated.View>

                </View>
            );
        }
    
    }

