import React, { Component } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import ip from '../../ipstore';
import moment from 'moment';

export default class WalletTransaction extends Component {

    state = {
		transactions: []
	}

	componentDidMount(){
		fetch(`http://${ip}:3000/user/transactions`)
		.then((response) => response.json())
		.then((response) => {
			this.setState({
				transactions: response
			});
		});
    }
    
  render() {
    return (
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
    )
  }
}

const styles = StyleSheet.create({
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