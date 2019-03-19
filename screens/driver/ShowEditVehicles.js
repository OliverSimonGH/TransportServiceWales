import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
    Container, Header, Title, Content, Text,
    Button, Icon, Left, Right, Body, Badge,
    List, ListItem, CheckBox, Segment
} from 'native-base';
import { Animated, View, ListView } from 'react-native';

import styles from './styles/styles';

var VehicleArray = [];

class ShowEditVehicles extends React.Component {
    constructor(props) {
        super(props);

        var dataSource = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1.Id != r2.Id });
        this.state = {
            Vehicles: VehicleArray,
            dataSource: dataSource.cloneWithRows(VehicleArray),
            isLoading: true,
            editMode: false,
            controlHeight: new Animated.Value(0),
            controlOpacity: new Animated.Value(0),
            controlWidth: new Animated.Value(0)
        }
    }

    componentDidMount() {
        this.getVehicleList();
    }

    findVehicleIndex(VehicleId) {
        let { Vehicles } = this.state;
        for (var i = 0; i < Vehicles.length; i++) {
            if (Vehicles[i].Id === VehicleId) {
                return i;
            }
        }

        return -1;
    }

    async getVehicleList() {
        try {
          this.fetchData(function (json) {
              VehicleArray = json.Vehicles;
              this.setState({
                  Vehicles: VehicleArray,
                  dataSource: this.state.dataSource.cloneWithRows(VehicleArray),
                  isLoading: false
              })
          }.bind(this));
            
        } catch (error) {
            console.log("There was an error getting the Vehicles");
        }
    }

    fetchData = async () => {
        const response = await fetch("/driver/Myvehicles");
        const json = await response.json();
        this.setState({ data: json.Vehicles });
      };

    toggleEditMode() {
        if (!this.state.editMode) {
            Animated.sequence([
                Animated.parallel([
                    Animated.timing(this.state.controlOpacity, { toValue: 1, duration: 300 }),
                    Animated.timing(this.state.controlHeight, { toValue: 40, duration: 300}),
                    Animated.timing(this.state.controlWidth, { toValue: 20, duration: 300})
                ])
            ]).start();
        } else {
            Animated.sequence([
                Animated.parallel([
                    Animated.timing(this.state.controlOpacity, { toValue: 0, duration: 300 }),
                    Animated.timing(this.state.controlHeight, { toValue: 0, duration: 300}),
                    Animated.timing(this.state.controlWidth, { toValue: 0, duration: 300})
                ])
            ]).start();
        }

        this.setState({
            editMode: !this.state.editMode
        });
    }

    findVehicleIndex(VehicleId) {
        let { Vehicles } = this.state;
        for (var i = 0; i < Vehicles.length; i++) {
            if (Vehicles[i].Id == VehicleId) {
                return i;
            }
        }

        return -1;
    }

    toggleCheckForVehicles(VehicleId) {
        var foundIndex = this.findVehicleIndex(VehicleId);

        // the ischecked value will be set for that Vehicle in the vehicles array
        var newVehicles = this.state.vehicles;
        newVehicles[foundIndex].isChecked = !newVehicles[foundIndex].isChecked;

        // the list is updated with the new Vehicle array
        var newDataSource = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1.Id != r2.Id });

        this.setState({
            Vehicles: newVehicles,
            dataSource: newDataSource.cloneWithRows(newVehicles)
        });

        console.log('Index of this Vehicle is ', foundIndex);
    }

    renderRow(rowData, sectionId, rowId) {
        return (
            <ListItem>
                <Animated.View style={{opacity: this.state.controlOpacity, 
                    width: this.state.controlWidth}}>
                    <CheckBox checked={rowData.isChecked} onPress={() => this.toggleCheckForVehicle(rowData.Id)} />
                </Animated.View>
                <Body>
                    <Text>{rowData.model}</Text>
                    <View>
                        <Text style={styles.year}>{rowData.registration}</Text>
                    </View>
                </Body>
            </ListItem>
        );
    }

    render() {
        let currentView = <View />;
        if (this.state.isLoading) {
            currentView = <View />;
        } else {
            currentView = <ListView style={styles.VehicleListView}
                dataSource={this.state.dataSource} renderRow={this.renderRow.bind(this)}
                enableEmptySections={true}
            />;
        }

        return (
            <Container style={styles.container}>
                <Header>
                    <Left>
                        </Left>
                    <Body>
                        <Title>My Vehicles</Title>
                    </Body>
                    <Right>
                        <Button onPress={() => this.toggleEditMode()} transparent><Text>Edit</Text></Button>
                    </Right>
                </Header>
                <Animated.View style={{...styles.controlStyles, opacity: this.state.controlOpacity, 
                height: this.state.controlHeight}}>
                    <Button small transparent><Text>Delete</Text></Button>
                </Animated.View>
                <Content>
                    {currentView}
                </Content>
            </Container>
        );
    }
}
