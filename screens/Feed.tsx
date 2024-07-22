import React from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import {NavigationProp, RouteProp} from '@react-navigation/native';
import PhotoDisplay from './components/PhotoDisplay';

type Props = {
  navigation: NavigationProp<any>;
  route: RouteProp<any>;
};

function FeedScreen({navigation, route}: Props) {
  const photosArr = route.params?.photosArr;
  return (
    <View style={styles.container}>
      <Text style={[styles.text, styles.heading]}>Feed</Text>

      <PhotoDisplay photosArr={photosArr} />

      <Pressable style={styles.modeBtn} onPress={() => navigation.goBack()}>
        <Text style={styles.text}>{'Camera'}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F5F0E6',
  },
  cameraContainer: {
    alignSelf: 'center',
    position: 'absolute',
    width: '85%',
    height: '60%',
    overflow: 'hidden',
    borderRadius: 15,
    elevation: 3,
    borderColor: 'grey',
    borderWidth: 1.5,
  },
  displayPicture: {
    position: 'absolute',
    top: 50,
    width: 50,
    height: 50,
  },
  modeBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    backgroundColor: 'black',
    bottom: 55,
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 15,
  },
  text: {
    fontFamily: 'Montserrat',
    fontSize: 22,
    lineHeight: 29.26,
    fontWeight: 'medium',
    color: 'white',
  },
  heading: {
    position: 'absolute',
    top: 80,
    color: 'black',
    fontWeight: 'bold',
  },
});

export default FeedScreen;
