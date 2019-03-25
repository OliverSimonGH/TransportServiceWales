import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import {
	Button,
	Container,
	Text,
	Header,
	Content,
	Left,
	Right,
} from 'native-base';
import GlobalHeader from '../../components/GlobalHeader';
import ip from '../../ipstore';
import { Icon } from 'react-native-elements';



export default class AccountsScreen extends Component {
	static navigationOptions = {
		header: null
    };

    state = {
		userDetails: []
	};
	
	componentDidMount() {
		const id = this.props.userId;
		fetch(`http://${ip}:3000/userDetails?id=${id}`).then((response) => response.json()).then((response) => {
			console.log(response);
			this.setState({
				userDetails: response.details
			});
		});

	
	}
    
    navigateTo = () => {
		this.props.navigation.navigate('');
	};

    settings = () => {
		this.props.navigation.navigate('Settings');
	};

	render() {
		return (
			<Container>
				<GlobalHeader type={1} navigateTo={this.navigateTo} />
			<Content style={styles.contentContainer} padder>
					
					<View style={styles.secondaryButtonContainer}>
								<Button bordered danger style={styles.secondaryButton} onPress={this.settings}>
									<Text style={styles.secondaryButtontext}>Settings</Text>
								</Button>
							</View>	
                            {this.state.userDetails.length >= 1 && (
								<View style={styles.container}>
									<React.Fragment>
								<View style={styles.forenameContainer}>
									<Text style={styles.detailView}> 
										Forename: {this.state.userDetails[0].forename}
									</Text>
									<Icon 
									name= 'update'
									style={styles.updateIcon}>
									</Icon>
									</View>	
									<View style={styles.forenameContainer}>
									<Text style={styles.detailView}> 
									Surname: {this.state.userDetails[0].surname}
									</Text>
									<Icon 
									name= 'update'
									style={styles.updateIcon}>
									</Icon>
									</View>	
									<View style={styles.forenameContainer}>
									<Text style={styles.detailView}> 
									Email: {this.state.userDetails[0].email}
									</Text>
									<Icon 
									name= 'update'
									style={styles.updateIcon}>
									</Icon>
									</View>	
								</React.Fragment>
								</View>
								
							)}

										
					
					</Content>

			</Container>
		);
	}
}

const styles = StyleSheet.create({
	contentContainer: {
		width: '80%',
		flex: 1,
		flexDirection: 'column',
		alignSelf: 'center'
	},
	logoutButton: {
		backgroundColor: '#ff0000',
		justifyContent: 'center',
		marginTop: 25,
		alignSelf: 'center'
	},
	secondaryButtonContainer: {
		flexDirection: 'row',
        marginTop: 25,
        marginBottom: 25
	},
	secondaryButton: {
		width: '100%',
		justifyContent: 'center',
		backgroundColor: '#fff'
	},
	secondaryButtontext: {
		color: '#ff0000'
	},
	forenameContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		width: window.width * 0.75,
		margin: 15
	},
	detailView: {
		flex: 1,
		paddingLeft: 10,
		fontSize: 16
	},
	updateIcon: {
		padding: 6,
		color: 'gray'
	},
});
