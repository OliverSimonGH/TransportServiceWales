import React, { Component } from 'react'
import { Text, View, TouchableOpacity } from 'react-native'
import ip from '../../ipstore'
import key from '../../google_api_key'
import moment from 'moment';
import { getRequestAuthorized } from '../../API' 

import Icon from 'react-native-vector-icons/Ionicons';

export default class ResultJourney extends Component {

  state = {
    startDate: null,
    endDate: null,
    newTotalTime: 0,
    departDays: '',
    departHours: '',
    departMinutes: '',
    totalHours: 0,
    totalMinutes: 0
  }

  componentDidMount() {
    const { id, lat, lng } = this.props;

    getRequestAuthorized(`http://${ip}:3000/journey?journeyId=${id}`)
      .then(response => {
        var start = '', end = '', waypoints = [{ latitude: lat, longitude: lng }]

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
              waypoints.push({ latitude: element.latitude, longitude: element.longitude })
              break
          }

        }

        fetch(`https://maps.googleapis.com/maps/api/directions/json?key=${key}&origin=place_id:${start}&destination=place_id:${end}&waypoints=${this.waypointArrayToString(waypoints)}`)
          .then(response => response.json())
          .then(response => {
            response.routes[0].legs.map(leg => {
              this.setState({
                newTotalTime: parseInt(this.state.newTotalTime) + parseInt(leg.duration.value)
              })
            })
          })
          .then(() => {
            var startDate = moment(this.state.startDate).toISOString();
            var endDate = moment(this.state.endDate).toISOString();
            var nowDate = moment(new Date()).toISOString();

            var duration = moment.duration(moment(endDate).diff(startDate))
            var departDuration = moment.duration(moment(endDate).diff(nowDate))
            console.log(departDuration.asSeconds())

            var totalHours = parseInt(duration.asHours());
            var totalMinutes = parseInt(duration.asMinutes()) % 60;
            var totalTotalMinutes = parseInt(duration.asMinutes());

            var departDays = parseInt(departDuration.asDays());
            var departHours = parseInt(departDuration.asHours());
            var departMinutes = parseInt(departDuration.asMinutes()) % 60;

            var newTotalTime = parseInt(this.state.newTotalTime / 60);

            if (newTotalTime >= totalTotalMinutes || departDuration.asSeconds() <= 0) {
              this.props.remove()
            }
            else {
              this.setState({
                departDays: departDays,
                departHours: departHours,
                departMinutes: departMinutes,
                totalHours: totalHours,
                totalMinutes: totalMinutes
              })
            }
          })
      })
  }

  waypointArrayToString = (waypointArray) => {
    var waypoints = ''

    for (let i = 0; i < waypointArray.length; i++) {
      const element = waypointArray[i];

      if (i >= 1) {
        waypoints += `%7C${element.latitude},${element.longitude}`;
        continue;
      }

      waypoints += `${element.latitude},${element.longitude}`
    }

    return waypoints
  }

  render() {
    return (
      <TouchableOpacity style={{ padding: 10, borderBottomColor: '#dfdfdf', borderBottomWidth: 1, flexDirection: "row", alignItems: 'center' }} onPress={this.props.onClick}>
        <View style={{ flex: 1 }}><Text style={{ fontWeight: 'bold' }}>{`${this.state.departDays} days \n ${this.state.departHours} hours \n ${this.state.departMinutes} mins`}</Text></View>
        <View style={{ flexDirection: 'row', flex: 5 }}>
          <View style={{ flexDirection: 'column', flex: 1, marginLeft: 20, marginRight: 20 }}>
            <View style={{ flexDirection: "row", justifyContent: 'flex-start' }}><Icon name="md-walk" size={25} style={{ marginRight: 20 }} /><Icon name="md-bus" size={25} /></View>

            <View style={{ flexDirection: "row", justifyContent: 'space-between' }}>
              <Text>{moment(this.state.startDate).format('hh:mm a')} - {moment(this.state.endDate).format('hh:mm a')}</Text>
              <Text>{`${this.state.totalHours} hr ${this.state.totalMinutes} min`}</Text>
            </View>
          </View>
        </View>
        <View style={{ flex: 1, alignItems: "center" }}>
          <Text style={{ fontWeight: 'bold', fontSize: 20 }}>£{3 * this.props.passengers}.00</Text>
          <Text></Text>
        </View>
      </TouchableOpacity>
    )
  }
}