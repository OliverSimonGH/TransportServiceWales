import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';

class VehicleSearch extends React.Component {
    render() {
        return (
            <View style={styles.searchContainer}>
                <TextInput
                    style={styles.searchInput}
                    placeholder={this.props.placeholder}
                    onChangeText={this.props.onSearchChange}
                    value={this.props.value}
                    onSubmitEditing={this.props.onSubmit}
                    clearButtonMode="always"
                    returnKeyType="search"
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    searchContainer: {
        flexDirection: 'row',
        padding: 8,
        paddingTop: 8,
        backgroundColor: '#273872',
    },
    searchInput: {
        height: 36,
        flex: 1,
        backgroundColor: '#f7f7f7',
        borderRadius: 8,
        paddingHorizontal: 12,
    },
});

export default VehicleSearch;
