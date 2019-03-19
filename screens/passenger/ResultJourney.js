import React, { Component } from 'react'
import { Text, View } from 'react-native'
import ip from '../../ipstore'
import key from '../../google_api_key'
import moment from 'moment';

import Icon from 'react-native-vector-icons/Ionicons';

export default class ResultJourney extends Component {

  state = {
    startDate: null,
    endDate: null
  }

  componentDidMount() {
    const id = this.props.id;

    fetch(`http://${ip}:3000/journey?journeyId=${id}`)
      .then(response => response.json())
      .then(response => {
        var start = '', end = '', waypoints = '51.4769026,-3.1805965%7C51.4816,-3.17909'

        this.setState({
          startDate: response.start_time,
          endDate: response.end_time
        })

        for (let i = 0; i < response.results.length; i++) {
          const element = response.results[i];
          // console.log(response)
          switch (element.fk_coordinate_type_id) {
            //Start
            case 1:
              start = element.place_id;
              break;

            //End
            case 2:
              end = element.place_id;
              break;

            //Virtual bus Stop
            case 3:
              waypoints !== '' ? waypoints += `%7C${way1},${way2}` : waypoints += `${way1},${way2}`
              break
          }

        }

        fetch(`https://maps.googleapis.com/maps/api/directions/json?key=${key}&origin=place_id:${start}&destination=place_id:${end}&waypoints=${waypoints}`)
          .then(response => response.json())
          .then(response => {

            // console.log(response.routes[0].legs)
          })
      })
  }

  render() {

    var startDate = moment(this.state.startDate).toISOString();
    var endDate = moment(this.state.endDate).toISOString();
    var nowDate = moment(new Date()).toISOString();
    
    var duration = moment.duration(moment(endDate).diff(startDate))
    var departDuration = moment.duration(moment(endDate).diff(nowDate))
  
    var totalHours = parseInt(duration.asHours());
    var totalMinutes = parseInt(duration.asMinutes())%60;

    var departDays = parseInt(departDuration.asDays());
    var departHours = parseInt(departDuration.asHours());
    var departMinutes = parseInt(departDuration.asMinutes())%60;

    return (
      <View style={{ padding: 10, borderBottomColor: '#dfdfdf', borderBottomWidth: 1, flexDirection: "row", alignItems: 'center' }}>
        <View style={{ flex: 1 }}><Text style={{fontWeight: 'bold' }}>{`${departDays} days \n ${departHours} hours \n ${departMinutes} mins`}</Text></View>
        <View style={{ flexDirection: 'row', flex: 5 }}>
          <View style={{ flexDirection: 'column', flex: 1, marginLeft: 20, marginRight: 20 }}>
            <View style={{ flexDirection: "row", justifyContent: 'flex-start' }}><Icon name="md-walk" size={25} style={{ marginRight: 20 }} /><Icon name="md-bus" size={25} /></View>

            <View style={{ flexDirection: "row", justifyContent: 'space-between' }}>
              <Text>{moment(this.state.startDate).format('hh:mm a')} - {moment(this.state.endDate).format('hh:mm a')}</Text>
              <Text>{`${totalHours} hr ${totalMinutes} min`}</Text>
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