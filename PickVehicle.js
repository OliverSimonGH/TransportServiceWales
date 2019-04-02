import React, {Component} from 'react';
import { StyleSheet, Text, View, Picker} from 'react-native';

export default class PickVehicle extends React.Component {


    constructor(props) {
        super (props);

        this.state = {
            pickerSelection: 'Selected Vehicle'
        }
    }

    render() {
        return (
            <View style={styles.container}>
                <Text>The Vehicle you selected is {this.setState.pickerSelection }</Text>
                <Picker>
                    style={{ position: 'absolute', bottom: 0, left: 0, right:0 }}
                    selectedValue={this.state.PickerSelection}
                    onValueChange={(itemValue, ItemIndex) => this.setState({pickerSelection: itemValue})}
                    <Picker.Item label="Vehicle1" value="Vehicle1" />
                    <Picker.Item label="Vehicle2" value="Vehicle2" />
                    <Picker.Item label="Vehicle3" value="Vehicle3" /> 
                </Picker>
            </View>
        );
    }
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        JustifyContent: 'center',
    },
});