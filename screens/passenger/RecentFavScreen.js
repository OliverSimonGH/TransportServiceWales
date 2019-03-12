import React, { Component } from 'react'
import { Text, View, Dimensions, TouchableOpacity } from 'react-native'
import { Container, Content, Icon } from 'native-base';
import GlobalHeader from '../../components/GlobalHeader'
import ip from '../../ipstore';
// import Icon from 'react-native-vector-icons/AntDesign';
import uuid from 'uuid/v4'

import { connect } from 'react-redux'

const { width } = Dimensions.get('window')
class RecentFavScreen extends Component {
    static navigationOptions = {
        header: null
    };

    state = {
        ticketId: null,
        favourited: null,
    };

    navigateTo = () => {
        this.props.navigation.navigate('Home');
    };

    toggleFavouriteJourney = () => {
        const data = {
            ticketId: this.state.ticketId,
            favourited: this.state.favourited,
        }

        fetch(`http://${ip}:3000/toggleFavourite`, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
            .then((response) => response.json())
            .then((responseJSON) => {
                switch (responseJSON.status) {
                    //Success
                    case 10:
                        break;
                    //User Exists
                    case 1:
                        this.setState({
                            errors: [{ title: 'Errors', content: 'There was an error when favouriting this ticket' }]
                        });
                        break;
                }
            })
            .catch((error) => console.log(error));
    }

    render() {
        return (
            <Container>
                <GlobalHeader
                    type={1}
                    navigateTo={this.navigateTo}
                    isBackButtonActive={1}
                />
                <Content>
                    <View style={{ flexDirection: 'column', marginTop: 30, marginRight: width * 0.1, marginLeft: width * 0.1 }}>
                        <Text style={{ marginBottom: 10 }}>FAVOURITE JOURNEYS</Text>
                        {this.props.tickets.map((ticket) => {
                            if (ticket.favourited === 1) {
                                return (
                                    <View style={{ flexDirection: 'row', borderColor: '#000', borderWidth: 1, padding: 10, justifyContent: 'space-between', marginBottom: 5 }} key={uuid()}>
                                        <View style={{ flexDirection: 'column', flex: 5 }}>
                                            <View style={{ flexDirection: 'row' }}><Text style={{ color: '#ff0000', flex: 1 }}>FROM:</Text><Text style={{ flex: 4 }}>{ticket.toStreet}, {ticket.toCity}</Text></View>
                                            <View style={{ flexDirection: 'row' }}><Text style={{ color: '#ff0000', flex: 1 }}>TO:</Text><Text style={{ flex: 4 }}>{ticket.fromStreet}, {ticket.fromCity}</Text></View>
                                        </View>
                                        <TouchableOpacity onPress={() => {
                                            this.setState({ favourited: 0, ticketId: ticket.id });
                                            this.toggleFavouriteJourney();
                                        }} >
                                            <View style={{ justifyContent: 'center' }}>
                                                <Icon name="star" style={{ fontSize: 35, color: "#ff0000" }} />
                                            </View>
                                        </TouchableOpacity>
                                    </View>
                                )
                            }
                        })}

                        <Text style={{ marginTop: 30, marginBottom: 10 }}>RECENT JOURNEYS</Text>
                        {this.props.tickets.map((ticket) => {
                            if (ticket.completed === 1) {
                                return (
                                    <View style={{ flexDirection: 'row', borderColor: '#000', borderWidth: 1, padding: 10, justifyContent: 'space-between', marginBottom: 5 }} key={uuid()}>
                                        <View style={{ flexDirection: 'column', flex: 5 }}>
                                            <View style={{ flexDirection: 'row' }}><Text style={{ color: '#ff0000', flex: 1 }}>FROM:</Text><Text style={{ flex: 4 }}>{ticket.toStreet}, {ticket.toCity}</Text></View>
                                            <View style={{ flexDirection: 'row' }}><Text style={{ color: '#ff0000', flex: 1 }}>TO:</Text><Text style={{ flex: 4 }}>{ticket.fromStreet}, {ticket.fromCity}</Text></View>
                                        </View>
                                        <TouchableOpacity onPress={() => {
                                            this.setState({ favourited: 1, ticketId: ticket.id });
                                            this.toggleFavouriteJourney();
                                        }} >
                                            <View style={{ justifyContent: 'center' }}>
                                                <Icon name="star-outline" style={{ fontSize: 35, color: "#ff0000" }} />
                                            </View>
                                        </TouchableOpacity>
                                    </View>
                                )
                            }
                        })}
                    </View>
                </Content>
            </Container>
        )
    }
}

const mapStateToProps = state => ({
    tickets: state.ticketReducer.tickets,
    user: state.userReducer.user
})

export default connect(mapStateToProps)(RecentFavScreen)