import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import {
	Button,
	Container,
	Text,
	Header,
	Content,
	List,
	ListItem,
	Left,
	Right,
	Icon,
	Accordion
} from 'native-base';
import GlobalHeader from '../../components/GlobalHeader';



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
									<Text>
										Forename: {this.state.userDetails[0].forename}
									</Text>
									<Text>
										Surname: {this.state.userDetails[0].surname}
									</Text>
									<Text>
										Email: {this.state.userDetails[0].email}
									</Text>
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
	}
});
