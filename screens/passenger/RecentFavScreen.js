import React, { Component } from 'react'
import { Text, View, Dimensions } from 'react-native'
import { Container, Content } from 'native-base';
import GlobalHeader from '../../components/GlobalHeader'
import Icon from 'react-native-vector-icons/AntDesign';
import uuid from 'uuid/v4'

import { connect } from 'react-redux'

const {width} = Dimensions.get('window')
class RecentFavScreen extends Component {
    static navigationOptions = {
        header: null
    };

    navigateTo = () => {
        this.props.navigation.navigate('Home');
    };

    render() {
        return (
            <Container>
                <Content>
                    <GlobalHeader
                        type={1}
                        navigateTo={this.navigateTo}
                        isBackButtonActive={1}
                    />
                    <View style={{ flexDirection: 'column', marginTop: 30, marginRight: width * 0.1, marginLeft: width * 0.1 }}>
                        <Text style={{ marginBottom: 10 }}>RECENT JOURNEYS</Text>
                        {this.props.tickets.map((ticket) => {
                            if(ticket.completed === 1){
                                return (
                                    <View style={{ flexDirection: 'row', borderColor: '#000', borderWidth: 1, padding: 10, justifyContent: 'space-between', marginBottom: 5}} key={uuid()}>
                                        <View style={{ flexDirection: 'column', flex: 5 }}>
                                            <View style={{ flexDirection: 'row' }}><Text style={{ color: '#ff0000', flex: 1 }}>FROM:</Text><Text style={{ flex: 4 }}>{ticket.toStreet}, {ticket.toCity}</Text></View>
                                            <View style={{ flexDirection: 'row' }}><Text style={{ color: '#ff0000', flex: 1 }}>TO:</Text><Text style={{ flex: 4 }}>{ticket.fromStreet}, {ticket.fromCity}</Text></View>
                                        </View>
                                        <View style={{ justifyContent: 'center' }}>
                                            <Icon name="staro" size={35} color="#ff0000" />
                                            {/* if journey is favourited */}
                                            {/* <Icon name="star" size={35} color="#ff0000"/> */}
                                        </View>
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