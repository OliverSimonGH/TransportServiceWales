import React, { Component } from 'react'
import { Text, View } from 'react-native'
import { Container, Content } from 'native-base';
import Icon from 'react-native-vector-icons/Entypo';

import GlobalHeader from '../../components/GlobalHeader';
import ResultJourney from './ResultJourney'

class ResultScreen extends Component {

    static navigationOptions = {
		header: null
	};

	navigateTo = () => {
		this.props.navigation.navigate('Home');
    };
    
  render() {
      var journeys = []

    for (let index = 0; index < 5; index++) {
          journeys.push(<ResultJourney />)
    }

    return (
        <Container>
        <GlobalHeader type={1} navigateTo={this.navigateTo} />
        <Content>
           <View style={{padding: 25, flexDirection: 'column', borderBottomColor: '#dfdfdf', borderBottomWidth: 1}}>
                <Text style={{fontSize: 25}}>SELECT A JOURNEY</Text>
                <View style={{flexDirection: 'row', marginTop: 25}}>
                    <View style={{flexDirection: 'row'}}>
                        <Text>Location One (<Icon name="location-pin" size={15}/>)</Text>
                    </View>
                    <View style={{marginLeft: 10, marginRight: 10}}>
                        <Icon name="arrow-long-right" size={20}/>
                    </View>
                    <View style={{flexDirection: 'row'}}>
                        <Text>Location Two (<Icon name="flag" size={15} />)</Text>
                    </View>
                </View>
           </View>
           { journeys }
           <View style={{alignItems: "center", padding: 25}}>
               <Text>Nothing Available?</Text>
               <Text style={{color: '#ff0000', marginTop: 5}}>CONTACT US</Text>
           </View>
        </Content>
    </Container>
    )
  }
}

export default ResultScreen