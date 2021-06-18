import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';

const MovieListFooter = ({ isLoading, pageInfo }) => {

  return (
    <View>
      {isLoading && (<ActivityIndicator size='large' color='#90712C' />
      )}
      {(!isLoading && pageInfo.totalPages === pageInfo.lastPage) && (<Text style={styles.text}>End of search resaults</Text>)}
    </View>
  );
};

const styles = StyleSheet.create({
  text: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#D5A021',
    padding: 10,
  },
});

export default MovieListFooter;
