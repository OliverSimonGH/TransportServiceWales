import * as React from 'react';
import { ActivityIndicator, FlatList, View, Text, StyleSheet } from 'react-native';

class VehicleSearchResults extends React.Component {

    render() {
        return (
            <>
                {this.props.isLoading ?
                    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                        <ActivityIndicator />
                        <Text style={{ marginTop: 16 }}>Loading...</Text>
                    </View>
                    :
                    <>
                        {this.props.data.length < 1 ?
                            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                                <Text>No results</Text>
                            </View>
                            :
                            <FlatList
                                data={props.data}
                                renderItem={({ item: make }) => (
                                    <TouchableOpacity style={styles.wrapper} onPress={props.onPress}>
                                        <Image source={props.imageSource} style={styles.thumbnail} />
                                        <Text style={styles.title}>{props.title}</Text>
                                    </TouchableOpacity>
                                )}
                                ItemSeparatorComponent={() => {
                                    <View style={{ height: 1, backgroundColor: '#dfdfdf', marginLeft: 16 }} />
                                }}
                                keyExtractor={make => make.data[0]["nasa_id"]}
                            />
                        }
                    </>
                }
            </>
        );
    }
}

const styles = StyleSheet.create({
    wrapper: {
      height: 56,
      flexDirection: "row",
      alignItems: 'center',
      paddingHorizontal: 16,
    },
    thumbnail: {
      width: 40,
      height: 40,
      borderRadius: 8
    },
    title: {
      marginLeft: 16,
      fontSize: 16,
    },
  });

export default VehicleSearchResults;