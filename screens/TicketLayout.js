import React, { Component } from 'react';
import {
    Dimensions,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import tickets from './data'

const { width, height } = Dimensions.get('window');
const cols = 3, rows = 3;

export default class TicketLayout extends Component {

    render() {
        return (
            <TouchableOpacity style={styles.container} onPress={this.props.onOpen}>
                <Text style={styles.To} numberOfLines={1}></Text>
                <View style={styles.imageContainer}>
                    <Image source={require('../assets/images/qrcode.jpg')} style={{ width: 150, height: 150, borderRadius: 10 }} />
                </View>
                <Text style={styles.From} numberOfLines={1}></Text>
            </TouchableOpacity>

        );
    }
}

const styles = StyleSheet.create({
    container: {
        marginLeft: 10,
        marginBottom: 10,
        height: (height - 20 - 20) / rows - 10,
        width: 300,
        alignSelf: 'center',
        alignItems: 'center',
        borderRadius: 0.5,
        borderWidth: 1,
        borderColor: '#d6d7da',
    },
    imageContainer: {
        flex: 1,
    },
    image: {
        borderRadius: 10,
        ...StyleSheet.absoluteFillObject,
        width: 10,
        height: 10,
    },
    To: {
        fontSize: 14,
        marginTop: 4,
    },
    From: {
        fontSize: 12,
        lineHeight: 14,
    },
});