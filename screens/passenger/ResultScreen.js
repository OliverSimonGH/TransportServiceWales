import React, { Component } from 'react'
import { Text, View } from 'react-native'
import { Container, Content } from 'native-base';
import Icon from 'react-native-vector-icons/Entypo';
import ip from '../../ipstore'

import GlobalHeader from '../../components/GlobalHeader';
import ResultJourney from './ResultJourney'

class ResultScreen extends Component {

    static navigationOptions = {
        header: null
    };
   
    state = {
        journey: []
    }

    removeOverTimeLimitJourneys = (id) => {
        this.setState({
            journey: this.state.journey.filter(journey => journey.props.id !== id)
        })
    }

    onJourneyPress = (id) => {
        this.props.navigation.navigate('Summary', { jData: this.props.navigation.state.params, jId: id});
    }

    componentDidMount(){
        const { lat, lng, endCity, endStreet, numPassenger } = this.props.navigation.state.params;

        fetch(`http://${ip}:3000/journeyResults?street=${endStreet}&city=${endCity}`)
        .then(response => response.json())
        .then(response => {
            if  (response.results.length < 1) return;
            for (let i = 0; i < response.results.length; i++) {
                const id = response.results[i].journey_id;
                this.setState({
                    journey: [...this.state.journey, <ResultJourney key={id} id={id} lat={lat} lng={lng} remove={() => this.removeOverTimeLimitJourneys(id)} onClick={() => this.onJourneyPress(id)} passengers={numPassenger}/>]
                })
            }
        })
	}

    navigateTo = () => {
        this.props.navigation.navigate('Home');
    };

    render() {
        const { city, street, endCity, endStreet } = this.props.navigation.state.params;
        return (
            <Container>
                <GlobalHeader type={1} navigateTo={this.navigateTo} isBackButtonActive={1} />
                <Content>
                    <View style={{ padding: 25, flexDirection: 'column', borderBottomColor: '#dfdfdf', borderBottomWidth: 1 }}>
                        <Text style={{ fontSize: 25 }}>SELECT A JOURNEY</Text>
                        <View style={{ flexDirection: 'column', marginTop: 20 }}>
                            <View style={{ flexDirection: 'row' }}>
                                <Icon name="location-pin" size={20} style={{ flex: 1 }} />
                                <Text style={{ flex: 11, fontSize: 15 }}>{`${street}, ${city}`}</Text>
                            </View>
                            <View>
                                <Icon name="dots-two-vertical" size={20} />
                            </View>
                            <View style={{ flexDirection: 'row' }}>
                                <Icon name="flag" size={20} style={{ flex: 1 }} />
                                <Text style={{ flex: 11, fontSize: 15 }}>{`${endStreet}, ${endCity}`}</Text>
                            </View>
                        </View>
                    </View>
                    {this.state.journey.length > 0 ? this.state.journey : <Text style={{ padding: 15, borderBottomColor: '#dfdfdf', borderBottomWidth: 1 , width: '100%'}}>No journeys' available</Text>}
                    <View style={{ alignItems: "center", padding: 25 }}>
                        <Text>Nothing Available?</Text>
                        <Text style={{ color: '#ff0000', marginTop: 5 }}>CONTACT US</Text>
                    </View>
                </Content>
            </Container>
        )
    }
}

export default ResultScreen