import React, { Component } from 'react';
import{
    View, Text, Animated, Image
} from "react-natve";

export default class Loading extends Component {
    constuctor(props) {
        super(props);

        this.loadingSpin = new Animated.Value(0);
    }

    SpinAnimation() {
        this.loadingSpin.setValue(0);
        Animated.sequence([
            Animated.timing(
                //loading animation is going from 0 to 1
                This.loadingSpin,
                {
                    toValue: 1,
                    duration: 1000
                }
            )
            //loading animation is going from 1 to 0
            // we can use the animation 1 to 0 for text that flashes loading.
           // animated.timing(
             //   this.loadingSpin,
               // {
                 //   toValue: 0,
                   // duration: 500
               // }
           // )

        ]).start(() => this.SpinAnimation());
    }

    componentDidMount() {
        this.SpinAnimation();
    }

    render() {
        // 0 -> 1
        // 0 -> 360
        // image is rotating from 0 to 360 degrees and then its going back and repeating.
        const spin = this.loadingSpin.interpolate({
            inputRange: [0,1],
            outputrange: ['0deg', '360deg']
        });

        return (<View style={{ opacity: (this.props.show || true) ? 1 : 0 }}>
            <Animated.Image style={{ transform: [{rotate: spin }] }} source={require('./../images/triangle.png')} />
            
        
        </View>);


    }


}
