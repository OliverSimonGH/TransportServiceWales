import { Text } from 'native-base';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import colors from '../../constants/Colors';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export default class VehicleItem extends React.Component {
	static navigationOptions = {
		header: null
	};

	getIconName = (vehicleType) => {
		if (vehicleType === 1) {
			return "bus"
		} else if (vehicleType === 2) {
			return "van-passenger"
		} else if (vehicleType === 3) {
			return "taxi"
		} else if (vehicleType === 4) {
			return "car"
		}
	}

	render() {
		vehicle = this.props.vehicle;
		return (
			<View style={styles.card}>
				<View style={styles.icon}>
					<Icon
						name={this.getIconName(vehicle.vehicleType)}
						color={colors.bodyTextColor}
						size={40} />
				</View>
				<View style={styles.details}>
					<Text style={{color: colors.emphasisTextColor}}>{vehicle.make} {vehicle.model}</Text>
					<Text style={{color: colors.emphasisTextColor}}>Registration: <Text style={{color: colors.bodyTextColor}}>{vehicle.registration}</Text></Text>
				</View>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	card: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		padding: 15,
		borderBottomColor: colors.lightBorder,
		borderBottomWidth: 0.75,
		backgroundColor: colors.backgroundColor,
		marginBottom: 0.5,
	},
	icon: {
		width: '20%',
		alignItems: 'center',
		justifyContent: 'center'
	},
	details: {
		width: '80%'
	}
});