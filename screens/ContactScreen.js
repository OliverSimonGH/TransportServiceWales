import React, { Component } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import {Platform, Stylesheet, Text, View, TextInput, Button} from 'react-native';
import { Constants, MapView, Location, Permissions } from 'expo';


export default class Contact extends Component {
  static navigationOptions = {
    title: 'Contact',
  }

  constructor() {
    super();
    this.state = {
      data: []
    }
  }

  compomentDidMount() {
    fetch("////////////////////////////")
    .then((result)=>result.json())
    .then((res)=>{
      console.warn("data from api" ,res)
        this.setState({
          data:res
        })
    })
  }


  render() {
    return (
      <View>
        <Text>
        "contacts"
        </Text>
        <Flatlist>
        data={this.state.data}
        renderItem={ ({item}) =>
        <View>
        <Text>{item.name}</Text>
        <Text>{item.surname}</Text>
        <Text>{item.number}</Text>
        <Text>{item.email}</Text>
          </View>
        }
        </Flatlist>
      </View>
    )
  }

    };
