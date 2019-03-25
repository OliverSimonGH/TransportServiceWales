import { Container, Content, List, ListItem } from 'native-base';
import React from 'react';
import { StyleSheet, View, FlatList, Text } from 'react-native';
import GlobalHeader from '../../components/GlobalHeader';
import colors from '../../constants/Colors';
import { connect } from 'react-redux';
import { addMake } from './../../redux/actions/vehicleAction';


class MakeSelect extends React.Component {
	static navigationOptions = {
		header: null
	};
	state = {
		makeId: null,
		make: null,
		dividers: []
	};

	navigateTo = () => {
		this.props.navigation.navigate('');
	};

	componentWillMount() {
		this.setDividers();
	}

	setDividers = () => {
		const data = this.props.navigation.state.params;
		var previousDivider = 'Z';
		data.forEach(item => {
			let firstCharacter = item.make.substring(0, 1)
			if (firstCharacter !== previousDivider) {
				previousDivider = firstCharacter;
				this.state.dividers.push(item.make);
			}
		});
	}

	handleSelect = (makeId, make) => {
		this.setState({
			makeId: makeId,
			make: make,
		});
	};

	async onSelect(makeId, make) {
		await this.handleSelect(makeId, make);
		const data = {
			makeId: this.state.makeId,
			make: this.state.make
		}
		console.log(data);
		this.props.addMake(data);
		this.props.navigation.navigate('AddVehicle');
	}

	render() {
		const data = this.props.navigation.state.params;
		return (
			<Container>
				<GlobalHeader type={3} navigateTo={this.navigateTo} header="Select Car Make" isBackButtonActive={1} />
				<Content>
					<Content style={styles.content}>
						<View style={styles.contentContainer}>
							<List
								dataArray={data}
								renderRow={(item) =>
									<>
										{
											this.state.dividers.includes(item.make) &&
												<ListItem itemDivider>
													<Text>{item.make.substring(0, 1)}</Text>
												</ListItem>
										}
										<ListItem
											noIndent
											onPress={() => { this.onSelect(item.make_id, item.make) }}
										>
											<Text>{item.make}</Text>
										</ListItem>
									</>
								}
							/>
						</View>
					</Content>
				</Content>
			</Container >
		);
	}
}

const styles = StyleSheet.create({
	content: {
		flex: 1,
	},
	inputContainer: {
		flexDirection: 'row',
		borderBottomWidth: 0.75,
		alignItems: 'center',
	},
	contentContainer: {
		width: '100%',
		flex: 1,
		flexDirection: 'column',
		alignSelf: 'center',
		justifyContent: "flex-end",
	},
});

const mapDispatchToProps = (dispatch) => {
	return {
		addMake: (data) => dispatch(addMake(data))
	};
};

export default connect(null, mapDispatchToProps)(MakeSelect);