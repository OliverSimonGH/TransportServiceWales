import { Container, Text } from 'native-base';
import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import GlobalHeader from '../../components/GlobalHeader';
import { FloatingAction } from 'react-native-floating-action';
import colors from '../../constants/Colors';
import addIcon from '../../assets/images/add.png';
import uuid from 'uuid/v4';

import { connect } from 'react-redux';
import VehicleRow from './VehicleRow';
import { fetchVehicles } from '../../redux/actions/vehicleAction';

class VehiclesScreen extends React.Component {
	static navigationOptions = {
		header: null
	};
	state = {

	};

	navigateToAddVehicle = () => {
		this.props.navigation.navigate('AddVehicle');
	};

	navigateTo = () => {
		this.props.navigation.navigate('');
	};

	selectedVehicle = () => {
		var selectedVehicle;
		if (this.props.vehicles.length > 0) {
			this.props.vehicles.forEach(vehicle => {
				if (vehicle.currently_driven === 1) {
					selectedVehicle = vehicle;
				}
			})
		}
		return selectedVehicle;
	}

	onDelete = () => {
		this.props.fetchVehicles();
	}

	render() {
		const actions = [{
			icon: addIcon,
			name: 'add_vehicle',
			position: 1
		}];
		return (
			<Container>
				<GlobalHeader type={1} navigateTo={this.navigateTo} />
				<ScrollView style={styles.container}>
					<View style={{
						borderBottomColor: this.selectedVehicle() && colors.lightBorder,
						borderBottomWidth: this.selectedVehicle() && 0.75
					}}>
						<Text style={styles.header}>CURRENTLY DRIVING</Text>
					</View>
					{this.selectedVehicle() ?
						<VehicleRow vehicle={this.selectedVehicle()} /> :
						<Text style={styles.body}>No vehicle currently selected</Text>
					}
					<View style={{
						borderBottomColor: this.props.vehicles && colors.lightBorder,
						borderBottomWidth: this.props.vehicles && 0.75
					}}>
						<Text style={styles.header}>YOUR VEHICLES</Text>
					</View>
					{(this.props.vehicles && this.props.vehicles.length > 0) ?
						this.props.vehicles.map((vehicle) => {
							return (
								<VehicleRow vehicle={vehicle} key={uuid()} onDelete={this.onDelete}/>
							)
						}) :
						<Text style={styles.body}>No saved vehicles to show</Text>
					}
				</ScrollView>
				<FloatingAction
					actions={actions}
					overrideWithAction={true}
					listenKeyboard={true}
					onPressItem={this.navigateToAddVehicle}
					color={colors.brandColor}
				/>
			</Container>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1
	},
	header: {
		width: '100%',
		marginBottom: 10,
		marginTop: 20,
		paddingLeft: 25,
		color: colors.emphasisTextColor
	},
	body: {
		marginLeft: 25,
		color: colors.bodyTextColor,
	},
});

const mapStateToProps = state => ({
	vehicles: state.vehicleReducer.vehicles,
});

const mapDispatchToProps = (dispatch) => {
	return {
		fetchVehicles: () => dispatch(fetchVehicles()),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(VehiclesScreen);