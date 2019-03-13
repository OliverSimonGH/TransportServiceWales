import { Ionicons } from '@expo/vector-icons';
import { Accordion, Button, Container, Content, Text } from 'native-base';
import React, { Component } from 'react';
import { Dimensions, FlatList, Picker, StyleSheet, TextInput, View } from 'react-native';
import GlobalHeader from '../components/GlobalHeader';
import ip from '../ipstore';

export default class MyVehicle extends Component {
    state = {
      data: []
    };
  
    componentWillMount() {
      this.fetchData();
    }
  
    fetchData = async () => {
      const response = await fetch("/driver/Myvehicles");
      const json = await response.json();
      this.setState({ data: json.Vehicles });
    };

    deleteVehicle = (Index, e) => {


    }
  
    render() {
      return (
        <View style={styles.container}>

          <FlatList
            data={this.state.data}
            keyExtractor={(x, i) => i.toString()}
            renderItem={({ item }) =>
              <Text>
                {`${item.name.model} ${item.name.year}`}
                <Button>onClick={} </Button>
              </Text>}
          />
        </View>
      );
    }
  }
  
  const styles = StyleSheet.create({
    container: {
      justifyContent: "center",
      alignItems: "center",
    }
  });
