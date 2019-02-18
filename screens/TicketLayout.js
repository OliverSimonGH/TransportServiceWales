import React, {Component} from 'react';
import{
    Dimensions,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

const {width, height} = Dimensions.get('window');
const cols = 3, rows = 3;

export default class TicketLayout extends Component{


    
    render(){
        const {ticket:{To, From, qr, date, time}, onOpen}= this.props;
        return(
            <TouchableOpacity style={styles.container} onPress={() => onOpen(ticket)}>
            <View style = {styles.imageContainer}>
            <Image source={{uri: qr}}style={styles.Image}/>
            </View>
            <Text style={styles.To} numberOfLines={1}>{To}</Text>
            <Text style={styles.From} numberOfLines={1}>{From}</Text>
            </TouchableOpacity>

        );
    }
}

const styles = StyleSheet.create({
    container:{
        marginLeft: 10,
        marginBottom: 10,
        height: (height -20 -20) / rows -10,
        width: (width - 10) / cols - 10,
    },
    imageContainer:{
        flex: 1,
    },
    image: {
        borderRadius: 10,
        ...StyleSheet.absoluteFillObject,
    },
    To:{
        fontSize:14,
        marginTop: 4,
    },
    From:{
        fontSize: 12,
        lineHeight: 14,
    },
});