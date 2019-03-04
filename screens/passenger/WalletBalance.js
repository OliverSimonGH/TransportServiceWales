import React, { Component } from 'react'
import { StyleSheet, View } from 'react-native';
import { Button, Text } from 'native-base';
import ip from '../../ipstore';

export default class WalletBalance extends Component {

    state = {
        funds: 0.00
    }

    componentDidMount() {
        fetch(`http://${ip}:3000/user/amount`)
            .then((response) => response.json())
            .then((response) => {
                this.setState({
                    funds: parseFloat(response.funds).toFixed(2)
                });
            });
    }

    render() {
        return (
            <View style={styles.balanceContainer}>
                <Text>Your Balance</Text>
                <Text style={styles.balanceSpacing}>{`£${this.state.funds}`}</Text>
                <View>
                    <Button danger style={styles.button} onPress={this.props.onSubmit}>
                        <Text>Add Funds</Text>
                    </Button>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    balanceContainer: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 25,
        shadowOffset: { width: 0, height: -20 },
        shadowColor: 'black',
        shadowOpacity: 1,
        elevation: 10,
        backgroundColor: '#fff',
        marginBottom: 15
    },
    balanceSpacing: {
        margin: 25
    },
    button: {
        width: 175,
        justifyContent: 'center',
        backgroundColor: '#ff0000',
        borderRadius: 5
    }
});