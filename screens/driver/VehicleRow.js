import { Text } from 'native-base';
import React from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import Dialog, { DialogFooter, DialogButton, DialogContent, DialogTitle, SlideAnimation } from 'react-native-popup-dialog';
import colors from '../../constants/Colors';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import ip from '../../ipstore';

import { connect } from 'react-redux';
import { removeVehicle } from '../../redux/actions/vehicleAction';

class VehicleRow extends React.Component {
	static navigationOptions = {
		header: null
	};

	state = {
		deleteDialog: false,
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
	};

	showDeleteConfirmDialog = () => {
		this.setState({
			deleteDialog: true
		});
	};

	hideDeleteConfirmDialog = () => {
		this.setState({
			deleteDialog: false
		});
	};

	async deleteVehicle (id) {
		data = {
			id: id,
		}
		fetch(`http://${ip}:3000/driver/vehicles/removeVehicle`, {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(data)
		})
			.then((response) => response.json())
			.then((responseJSON) => {
				switch (responseJSON.status) {
					//Success
					case 10:
						this.props.removeVehicle(id);
						this.hideDeleteConfirmDialog();
						this.props.onReRender();
				}
			})
			.catch((error) => console.log(error));
	};

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
					<Text style={{ color: colors.emphasisTextColor }}>{vehicle.make} {vehicle.model}</Text>
					<Text style={{ color: colors.emphasisTextColor }}>Registration: <Text style={{ color: colors.bodyTextColor }}>{vehicle.registration}</Text></Text>
				</View>
				<TouchableOpacity style={styles.removeIcon} onPress={this.showDeleteConfirmDialog}>
					<Icon name="delete" color={colors.bodyTextColor} size={25} />
				</TouchableOpacity>
				<Dialog
					dialogAnimation={new SlideAnimation}
					width={0.8}
					visible={this.state.deleteDialog}
					dialogTitle={
						<DialogTitle textStyle={styles.dialogTitle} color={colors.emphasisTextColor} title="DELETE VEHICLE" />
					}
					footer={
						<DialogFooter>
							<DialogButton
								textStyle={{ color: colors.brandColor }}
								text="REMOVE"
								onPress={async () => {
									await this.props.onDelete;
									this.deleteVehicle(vehicle.id);
									}} />
							<DialogButton
								textStyle={{ color: colors.bodyTextColor }}
								text="CANCEL"
								onPress={this.hideDeleteConfirmDialog}
							/>
						</DialogFooter>
					}
					onTouchOutside={this.hideDeleteConfirmDialog}
				>
					<DialogContent>
						<Text style={styles.body}>Are you sure you want to delete this vehicle? </Text>
					</DialogContent>
				</Dialog>
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
		width: '70%'
	},
	removeIcon: {
		width: '10%'
	},
	dialogTitle: {
		color: colors.emphasisTextColor,
	},
	body: {
		marginTop: 20,
		color: colors.bodyTextColor,
	}
});

const mapDispatchToProps = (dispatch) => {
	return {
		removeVehicle: (vehicleId) => dispatch(removeVehicle(vehicleId)),
	};
};

const mapStateToProps = state => ({
	vehicles: state.vehicleReducer.vehicles,
});

export default connect(mapStateToProps, mapDispatchToProps)(VehicleRow);