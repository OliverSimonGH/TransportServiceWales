import React, { Component } from 'react';
import { StyleSheet, View, TouchableHighlight, Keyboard, ScrollView, TouchableOpacity } from 'react-native';
// import API_KEY from '../google_api_key';
import _ from 'lodash';
import { Content, Container, Button, Text, Item, Input, StyleProvider } from 'native-base';
import getTheme from '../native-base-theme/components';
import platform from '../native-base-theme/variables/platform';
import GlobalHeader from '../components/GlobalHeader';

export default class LinksScreen extends React.Component {
    static navigationOptions = {
        header: null,
    };

    state = {
        expansionIsOpen: false,
        isLoadingComplete: false,
        ticketData: []
    };


    componentDidMount() {
        const { id } = this.props.navigation.state.params;

        fetch(`http://10.22.199.206:3000/ticketsQuery?id=${id}`)
            .then(response => response.json())
            .then(response => {
                console.log(response.ticket)
                this.setState({

                    ticketData: response.ticket

                })
            })
    }

    openTicket = () => {
        this.setState({
            expansionIsOpen: true
        });
    }

    closeTicket = () => {
        console.log("hello")
        this.setState({
            expansionIsOpen: false,
        });
    }

    render() {
        return (
            <StyleProvider style={getTheme(platform)}>
                <ScrollView
                    showsHorizontalScrollIndicator={false}
                    showsVerticalScrollIndicator={false}
                >
                    <GlobalHeader type={1} />
                    <Container style={styles.contentContainer}>
                        <Content>
                            <View style={styles.titleContainer}>
                                <Text style={styles.title}>Ticket Details</Text>
                            </View>
                            
                                   

                            {this.state.ticketData.length >= 1 &&
                                <React.Fragment>
                                    <Text>
                                        {this.state.ticketData[0].accessibility_required}
                                    </Text>
                                    <Text>
                                        {this.state.ticketData[0].paid}
                                    </Text>
                                    <Text>
                                        {this.state.ticketData[0].used}
                                    </Text>
                                    <Text>
                                        {this.state.ticketData[0].expired}
                                    </Text>
                                    <Text>
                                        {this.state.ticketData[0].end_time}
                                    </Text>
                                    <Text>
                                        {this.state.ticketData[0].start_time}
                                    </Text>
                                    <Text>
                                        {this.state.ticketData[0].city}
                                    </Text>
                                    <Text>
                                        {this.state.ticketData[0].street}
                                    </Text>

                                    <Text>
                                        {this.state.ticketData[1].city}
                                    </Text>
                                    <Text>
                                        {this.state.ticketData[1].street}
                                    </Text>
                                </React.Fragment>
                            }

                                    
                             



                        </Content>

                    </Container>
                </ScrollView>
            </StyleProvider>
        );
    }
}

const styles = StyleSheet.create({
    dateTimeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10,
        borderBottomWidth: 0.5,
        borderBottomColor: '#d3d3d3',
        height: 50
    },
    dateTime: {
        marginLeft: 6,
        color: '#bcbcbc',
        fontSize: 17
    },
    iconWithInput: {
        marginTop: 10
    },
    locationSuggestion: {
        backgroundColor: 'white',
        padding: 5,
        fontSize: 18,
        borderWidth: 0.5
    },
    flex_1: {
        flex: 1,
        alignItems: 'center'
    },
    contentContainer: {
        width: '80%',
        flex: 1,
        flexDirection: 'column',
        alignSelf: 'center'
    },
    map: {
        ...StyleSheet.absoluteFillObject
    },
    buttonContainer: {
        flexDirection: 'row',
        alignSelf: 'center',
        marginTop: 15,
        alignItems: 'center'
    },
    button: {
        width: '100%',
        justifyContent: 'center',
        color: '#ff6666'
    },
    buttontext: {
        color: '#000000'
    },
    secondaryButtonContainer: {
        flexDirection: 'row',
        marginTop: 25
    },
    secondaryButton: {
        width: '100%',
        justifyContent: 'center'
    },
    secondaryButtontext: {
        color: '#ff0000'
    },
    Container: {
        paddingTop: 20,
    },
    title: {
        textAlign: 'center',
        fontSize: 30,
        fontWeight: 'bold',
        color: 'gray',
        paddingTop: 10,
    },

});
