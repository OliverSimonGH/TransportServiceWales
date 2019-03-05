import React, { Component } from 'react';
import {
    Dimensions,
    Image,
    ImageBackground,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { Container, Header, Content, Card, CardItem, Thumbnail, Button, Icon, Left, Body, Right } from 'native-base';
import ip from '../ip';
import moment from 'moment';

const { width, height } = Dimensions.get('window');
const cols = 3, rows = 3;

export default class TicketLayout extends Component {

    static navigationOptions = {
        header: null
    };

    state = {
        expansionIsOpen: false,
        isLoadingComplete: false,
        ticketData: []
    };

    componentDidMount() {
        const id = this.props.ticketId;

        fetch(`http://${ip}:3000/ticketsQuery?id=${id}`).then((response) => response.json()).then((response) => {
            console.log(response.ticket);
            this.setState({
                ticketData: response.ticket
            });
        });
    }

    render() {
        return (
            <View style={{ backgroundColor: 'transparent', paddingBottom: 10}}>
                <Content>
                    <ImageBackground source={require('../assets/images/active-tickets.png')} style={{ width: 300, height: 250, justifyContent: 'center' }}>


                        <Left>
                            <Body>
                                <TouchableOpacity style={styles.container} onPress={this.props.onOpen}>

                                    {this.state.ticketData.length >= 1 && (
                                        <View style={styles.container}>
                                            <React.Fragment>
                                                <Text>
                                                    City From:
											{this.state.ticketData[0].city}
                                                </Text>
                                                <Text>
                                                    {' '}
                                                    Departure:
											{moment(this.state.ticketData[0].start_time).format("dddd Do h:mm a")}
                                                </Text>
                                                <View style={styles.imageContainer}>
                                                    <Image
                                                        source={require('../assets/images/qrcode.jpg')}
                                                        style={{
                                                            width: 150,
                                                            height: 150,
                                                            borderRadius: 10,
                                                            alignSelf: 'center',
                                                            backgroundColor: 'transparent',
                                                        }}
                                                    />
                                                </View>
                                                <Text>
                                                    To City:
											{this.state.ticketData[1].city}
                                                </Text>
                                                <Text>
                                                    {' '}
                                                    Arrival:
											{moment(this.state.ticketData[1].end_time).format("dddd Do h:mm a")}
                                                </Text>
                                            </React.Fragment>
                                        </View>
                                    )}
                                </TouchableOpacity>
                            </Body>

                        </Left>

                    </ImageBackground>

                </Content>
            </View>


        );
    }
}

const styles = StyleSheet.create({
    container: {
        marginLeft: 10,
        marginBottom: 10,
        height: (height - 20 - 18) / rows - 9,
        width: 300,
        alignSelf: 'center',
        alignItems: 'center',
        backgroundColor: 'transparent',

    },
    imageContainer: {
        flex: 1,

    },
    image: {
        ...StyleSheet.absoluteFillObject,
        width: 10,
        height: 10,
    },
    To: {

        fontSize: 20,
        marginTop: 4,
    },
    From: {
        backgroundColor: 'transparent',

        fontSize: 15,
        lineHeight: 14,
    },
});