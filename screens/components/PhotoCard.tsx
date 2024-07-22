import React from 'react';
import {Animated, Image, StyleSheet} from 'react-native';

type Props = {
  index: number;
  photo: any;
  swipe: any;
  tiltSign: number;
  isFirst: boolean;
  dragHandlers: any;
};

function PhotoCard({
  index,
  photo,
  swipe,
  tiltSign,
  isFirst,
  ...dragHandlers
}: Props) {
  const rotate = Animated.multiply(swipe.x, tiltSign).interpolate({
    inputRange: [-100, 0, 100],
    outputRange: ['-8deg', '0deg', '8deg'],
  });

  const animatedCardStyle = {
    transform: [...swipe.getTranslateTransform(), {rotate}],
  };

  return (
    <Animated.View
      style={[
        StyleSheet.absoluteFill,
        isFirst && animatedCardStyle,
        styles.animate,
      ]}
      {...dragHandlers}>
      <Image
        key={index}
        source={{uri: 'file://' + photo.path}}
        style={[StyleSheet.absoluteFill]}
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  animate: {
    backgroundColor: 'white',
  },
});

export default PhotoCard;
