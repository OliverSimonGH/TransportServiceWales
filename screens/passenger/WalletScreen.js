import { Button, Container, Content, Text } from 'native-base';
import React from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import moment from 'moment';
import GlobalHeader from '../../components/GlobalHeader';
import ip from '../../ipstore';

export default class WalletScreen extends React.Component {
	static navigationOptions = {
		header: null
	};

	state = {
		funds: 0.00,
		transactions: []
	}

	componentDidMount(){
		fetch(`http://${ip}:3000/user/amount`)
		.then((response) => response.json())
		.then((response) => {
			this.setState({
				funds: parseFloat(response.funds).toFixed(2)
			});
		});

		fetch(`http://${ip}:3000/user/transactions`)
		.then((response) => response.json())
		.then((response) => {
			console.log(response)
			this.setState({
				transactions: response
			});
		});
	}

	onSubmit = () => {
		this.props.navigation.navigate('AddFunds');
	};

	render() {
		return (
			<Container>
				<GlobalHeader type={1} />
				<Content>
					<View style={styles.headerContainer}>
						<Text>WALLET</Text>
					</View>
					<View style={styles.balanceContainer}>
						<Text>Your Balance</Text>
						<Text style={styles.balanceSpacing}>{`£${this.state.funds}`}</Text>
						<View>
							<Button danger style={styles.button} onPress={this.onSubmit}>
								<Text>Add Funds</Text>
							</Button>
						</View>
					</View>
					<View>
						<Text style={styles.transactionHeader}>Recent Transactions</Text>
						{this.state.transactions.length > 0 && this.state.transactions.map((transaction) => {
							return (
								<View style={styles.purchaseContainer} key={transaction.transaction_id}>
									<View style={styles.purchaseRow}>
										<Text style={styles.left}>{moment(transaction.date).format("Do MMM YY")}</Text>
										<Text style={styles.right}>{`£${parseFloat(transaction.current_funds).toFixed(2)}`}</Text>
									</View>
									<View style={styles.purchaseRow}>
										<Text style={styles.purchaseBold}>{transaction.type}</Text>
										<Text style={styles.purchaseBold}>{transaction.fk_transaction_type_id === 2 ? `+ £${parseFloat(transaction.spent_funds).toFixed(2)}` : `- £${parseFloat(transaction.spent_funds).toFixed(2)}`}</Text>
									</View>
								</View>
							)
						})}
					</View>
				</Content>
			</Container>
		);
	}
}

const styles = StyleSheet.create({
	headerContainer: {
		padding: 25,
		borderBottomWidth: 1,
		borderBottomColor: '#dfdfdf'
	},
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
	},
	transactionHeader: {
		paddingLeft: 25,
		paddingRight: 25,
		paddingTop: 10,
		paddingBottom: 10,
		borderBottomColor: '#dfdfdf',
		borderBottomWidth: 1
	},
	purchaseContainer: {
		flex: 1,
		flexDirection: 'column',
		paddingLeft: 25,
		paddingRight: 25,
		paddingTop: 12,
		paddingBottom: 12,
		borderBottomColor: '#dfdfdf',
		borderBottomWidth: 1
	},
	purchaseRow: {
		flexDirection: 'row',
		marginBottom: 3,
		marginTop: 3,
		justifyContent: 'space-between'
	},
	purchaseBold: {
		fontWeight: 'bold'
	}
});
