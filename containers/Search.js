import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import MovieListFooter from '../components/MovieListFooter';
import MovieListHeader from '../components/MovieListHeader';

const Search = ({ navigation }) => {
  //############### WEB API INFO #####################
  const API_KEY = '9c693a46';
  const baseURL = 'https://www.omdbapi.com/';

  //############### STATE MANAGEMENT #################
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({
    isMessage: false,
    text: '',
  });
  const [error, setError] = useState({
    isError: false,
    text: '',
  });
  const [serachParam, setSearchParam] = useState('');
  const [movieList, setmovieList] = useState([]);
  const [pageInfo, setPageInfo] = useState({
    lastPage: 1,
    totalPages: 1,
    totalResults: 0,
  });

  useEffect(() => {
    if (serachParam.length > 0) {
      // Clear movieList on every new search query
      setmovieList([]);
      setPageInfo({
        lastPage: 1,
        totalPages: 1,
        totalResults: 0,
      });
      getMovies();
    }
  }, [serachParam]);

  // Async function that queries the API for the first batch of movies (max 30 movies per batch, if any)
  // and adds to the empthy movieList
  const getMovies = async () => {
    try {
      if (message.isMessage) {
        setMessage({ isMessage: false, text: '' });
      };
      setIsLoading(true);
      let firstBatchOfMovies = [];
      let batch = 1; // 10 Movies per batch (API only returns Max 10 movies)
      let totalNumberOfPages = 1;
      let totalNumberOfResaults = 0;

      while (batch <= 3) {
        const res = await fetch(
          `${baseURL}?apikey=${API_KEY}&type=movie&r=json&s=${serachParam}&page=${batch}`
        );
        const searchResults = await res.json();
        if (searchResults.Response !== 'True') {
          setMessage({ isMessage: true, text: searchResults.Error });
          break; // Break from the while loop
        }
        // Set totalNumberOfPages only in the first API call
        if (batch === 1) {
          totalNumberOfResaults = searchResults.totalResults;
          if (totalNumberOfResaults > 30) {
            totalNumberOfPages = Math.ceil(totalNumberOfResaults / 30);
          };
        };
        firstBatchOfMovies = [...firstBatchOfMovies, ...searchResults.Search];
        batch++;
      };

      setmovieList([...firstBatchOfMovies]);
      setPageInfo({
        ...pageInfo,
        totalPages: totalNumberOfPages,
        totalResults: totalNumberOfResaults,
        lastPage: 1
      });
      setIsLoading(false);
    } catch (error) {
      setError({ isError: true, text: error.message });
    };
  };

  // Async function that queries the API for the next batch of movies if there are more 
  // and adds to the movieList
  const getMoreMovies = async () => {
    if ((pageInfo.lastPage < pageInfo.totalPages)) {
      if (message.isMessage) {
        setMessage({ isMessage: false, text: '' });
      };
      setIsLoading(true);
      try {
        let nextBatchOfMovies = [];
        let batch = pageInfo.lastPage * 3 + 1;
        let lastBatch = batch + 2;

        while (batch <= lastBatch) {
          const res = await fetch(
            `${baseURL}?apikey=${API_KEY}&type=movie&r=json&s=${serachParam}&page=${batch}`
          );
          const moreResults = await res.json();
          if (moreResults.Response !== 'True') {
            setMessage({ isMessage: true, text: moreResults.Error });
            break; // Break from the while loop
          }
          nextBatchOfMovies = [...nextBatchOfMovies, ...moreResults.Search];
          batch++;
        };

        setmovieList([...movieList, ...nextBatchOfMovies]);
        setPageInfo({ ...pageInfo, lastPage: Math.floor(lastBatch / 3) });
        setIsLoading(false);
      } catch (error) {
        setError({ isError: true, text: error.message });
      };
    };
  };

  // Render function for FlatList component that renders each movie item in the movieList
  const renderItem = ({ item, index }) => (
    <TouchableOpacity
      style={styles.listItem}
      onPress={() =>
        navigation.navigate('Movie Detail', { id: item.imdbID })
      }
    >
      <View style={styles.listItemView} >
        <Text style={styles.listItemIndex}>{index + 1 + '.'}</Text>
        <Text style={styles.listItemText}>{item.Title} ({item.Year})</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.textInput}
        placeholder='Search for movie'
        placeholderTextColor='#6A5E4E'
        onChangeText={text => setSearchParam(text)}
      />
      {(message.isMessage && movieList.length < 1) && (
        <View>
          <Text style={styles.message}>{message.text}</Text>
        </View>
      )}
      {error.isError && (
        <View>
          <Text style={styles.error}>{error.text}</Text>
        </View>
      )}
      {(movieList.length >= 1) && (
        <FlatList
          style={styles.flatList}
          data={movieList}
          renderItem={renderItem}
          keyExtractor={(item, index) => item.imdbID + index}
          onEndReached={getMoreMovies}
          onEndReachedThreshold={1}
          contentContainerStyle={{ flexGrow: 2 }}
          ListHeaderComponent={<MovieListHeader size={pageInfo.totalResults} />}
          ListHeaderComponentStyle={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
          }}
          ListFooterComponent={<MovieListFooter isLoading={isLoading} pageInfo={pageInfo} />}
          ListFooterComponentStyle={{
            flex: 1,
            padding: 20,
            justifyContent: 'center',
            alignItems: 'center',
            fontSize: '20',
            color: '#D5A021',
          }}
          updateCellsBatchingPeriod={50}
          maxToRenderPerBatch={10}
          windowSize={11}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#4B4237',
  },
  message: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#D5A021',
    padding: 10,
  },
  error: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#D5A021',
    padding: 10,
  },
  textInput: {
    width: '100%',
    backgroundColor: '#383229',
    fontSize: 20,
    color: '#EDE7D9',
    borderWidth: 0,
    padding: 10,
  },
  flatList: {
    width: '100%',
  },
  listItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#90712C',
  },
  listItemView: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  listItemIndex: {
    fontSize: 12,
    marginBottom: 10,
    color: '#E1C47D',
    marginEnd: 10,
  },
  listItemText: {
    fontSize: 12,
    marginBottom: 10,
    color: '#E1C47D',
  },
});

export default Search;
