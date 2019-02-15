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
    fetch("https://gitlab.cs.cf.ac.uk/c1633899/transport-service-wales/blob/contact_page/contacts.json")
    .then((result)=>result.json())
    .then((res)=>{
      console.warn("data from api" ,res.contacts)
        this.setState({
          data:res
        })
    })
  }


  render() {
    return (
      <View>
        <Text>
        style={{fontSize:20}}>
        Contacts
        </Text>
        <FlatList>
        data={this.state.data}
        renderItem={({item}) =>
        <View>
        <Text>style={{fontSize:20}}>
        {"Name:"+item.name}
        {"surname:"+item.surname}
        {"Email:"+item.email}
        </Text>
          </View>
        }
        </Flatlist>
      </View>
    )
  }

    };
