import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const MovieListHeader = ({ size }) => {

  return (
    <View>
      <Text style={styles.text} >Found {size} Movies</Text>
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

export default MovieListHeader;