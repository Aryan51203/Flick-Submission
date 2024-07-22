import React, {useEffect, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import SwipeCards from './SwipeCards';

type Props = {
  photosArr: Array<any>;
};

function PhotoDisplay({photosArr}: Props) {
  const [photos, setPhotos] = useState(photosArr);

  useEffect(() => {
    if (photos.length > 0) {
      return;
    }

    setPhotos(photosArr);
  }, [photos.length, photosArr]);

  return (
    <View style={styles.cameraContainer}>
      <SwipeCards photos={photos} setPhotos={setPhotos} />
    </View>
  );
}

const styles = StyleSheet.create({
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
});

export default PhotoDisplay;
