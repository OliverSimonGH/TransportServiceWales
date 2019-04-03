import React from 'react';
import { StyleSheet, Text, View, Picker, Button, Modal, TouchableHighlight } from 'react-native';

export default class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      pickerSelection: 'Default Vehicle!',
      pickerDisplayed: false
    }
  }

  setPickerVehicle(newVehicle) {
    this.setState({
      pickerSelection: newVehicle
    })

    this.togglePicker();
  }

  togglePicker() {
    this.setState({
      pickerDisplayed: !this.state.pickerDisplayed
    })
  }

  render() {
    const pickerVehicles = [
      {
        title: 'Vehicle1',
        Vehicle: 'Vehicle1'
      },
      {
        title: 'Vehicle2',
        Vehicle: 'Vehicle2'
      },
      {
        title: 'Vehicle2',
        Vehicle: 'Vehicle2'
      }
    ]

    return (
      <View style={styles.container}>
        <Text>The default Vehicle is { this.state.pickerSelection }</Text>
        <Button onPress={() => this.togglePicker()} title={ "Select a Vehicle!" } />


        <Modal visible={this.state.pickerDisplayed} animationType={"slide"} transparent={true}>
          <View style={{ margin: 20, padding: 20,
            backgroundColor: '#efefef',
            bottom: 20,
            left: 20,
            right: 20,
            alignItems: 'center',
            position: 'absolute' }}>
            <Text>Please pick a Vehicle</Text>
            { pickerVehicles.map((Vehicle, index) => {
              return <TouchableHighlight key={index} onPress={() => this.setPickerVehicle(Vehicle.Vehicle)} style={{ paddingTop: 4, paddingBottom: 4 }}>
                  <Text>{ Vehicle.title }</Text>
                </TouchableHighlight>
            })}


            <TouchableHighlight onPress={() => this.togglePicker()} style={{ paddingTop: 4, paddingBottom: 4 }}>
              <Text style={{ color: '#999' }}>Cancel</Text>
            </TouchableHighlight>
          </View>
        </Modal>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
