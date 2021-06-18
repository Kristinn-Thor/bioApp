import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';

const MovieDetail = ({ route }) => {
  const API_KEY = '9c693a46';
  const baseURL = 'https://www.omdbapi.com/';

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState({
    isError: false,
    text: '',
  });
  const [detail, setDetail] = useState({
    title: '',
    year: '',
    runtime: '',
    actors: [],
  });

  const getSingleMovie = async (id) => {
    setLoading(true);
    try {
      const res = await fetch(
        `${baseURL}?apikey=${API_KEY}&r=json&i=${id}`
      );
      const searchResults = await res.json();
      setDetail({
        ...detail,
        title: searchResults.Title,
        year: searchResults.Year,
        runtime: searchResults.Runtime,
        actors: [...searchResults.Actors.split(', ')],
      });
    } catch (error) {
      setError({ isError: true, text: error.message });
    } finally {
      setLoading(false);
    };
  };

  useEffect(() => {
    getSingleMovie(route.params.id);
  }, []);

  return (
    <View style={styles.container}>
      {loading && (<ActivityIndicator size='large' color='#90712C' />
      )}
      {error.isError && (
        <View>
          <Text style={styles.error}>{error.text}</Text>
        </View>
      )}
      {!loading && (<>
        <Text style={styles.title} >{detail.title} </Text>
        <Text style={styles.details}>Year | {detail.year} </Text>
        <Text style={styles.details}>Runtime | {detail.runtime} </Text>
        <Text style={styles.castTitle}>Top Cast:</Text>
        {detail.actors.slice(0, 3).map((actor, index) => (
          <Text style={styles.cast} key={index} >{actor}</Text>
        ))}
      </>)}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 25,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4B4237',
  },
  error: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#D5A021',
    padding: 10,
  },
  title: {
    fontSize: 25,
    letterSpacing: -1,
    fontWeight: 'bold',
    color: '#D5A021',
    marginBottom: 15,
  },
  details: {
    fontSize: 15,
    color: '#E1C47D',
    marginBottom: 5,
  },
  castTitle: {
    fontSize: 20,
    letterSpacing: -1,
    fontWeight: 'bold',
    color: '#EDE7D9',
    marginTop: 10,
    marginBottom: 5,
  },
  cast: {
    fontSize: 15,
    color: '#EDE7D9',
    marginBottom: 5,
  },
});

export default MovieDetail;
