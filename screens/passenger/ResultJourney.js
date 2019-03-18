import React, { Component } from 'react'
import { Text, View } from 'react-native'

import Icon from 'react-native-vector-icons/Ionicons';


export default class ResultJourney extends Component {
  render() {
    return (
      <View style={{ padding: 10, borderBottomColor: '#dfdfdf', borderBottomWidth: 1, flexDirection: "row", alignItems: 'center' }}>
        <View style={{ flex: 1 }}><Text style={{ fontSize: 15, fontWeight: 'bold' }}>{"Depart \n 45 min"}</Text></View>
        <View style={{ flexDirection: 'row', flex: 5}}>
          <View style={{ flexDirection: 'column', flex: 1, marginLeft: 20, marginRight: 20}}>
            <View style={{ flexDirection: "row", justifyContent: 'flex-start' }}><Icon name="md-walk" size={25} style={{ marginRight: 20 }} /><Icon name="md-bus" size={25} /></View>

            <View style={{ flexDirection: "row", justifyContent: 'space-between' }}>
              <Text>11:00pm - 12: 30pm</Text>
              <Text>1 hr 30 mins</Text>
            </View>
          </View>
        </View>
        <View style={{ flex: 1, alignItems: "center" }}>
          <Text style={{ fontWeight: 'bold', fontSize: 20 }}>£3.00</Text>
        </View>
      </View>
    )
  }
}