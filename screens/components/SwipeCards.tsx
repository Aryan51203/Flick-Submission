import React, {useCallback, useRef} from 'react';
import {
  Animated,
  Dimensions,
  Image,
  PanResponder,
  StyleSheet,
  View,
} from 'react-native';

const {height} = Dimensions.get('screen');

type Props = {
  photos: Array<any>;
  setPhotos: Function;
};

function SwipeCards({photos, setPhotos}: Props) {
  const swipe = useRef(new Animated.ValueXY()).current;
  const titlSign = useRef(new Animated.Value(1)).current;

  const removeTopCard = useCallback(() => {
    setPhotos((prevState: Array<any>) => prevState.slice(1));
    swipe.setValue({x: 0, y: 0});
  }, [swipe, setPhotos]);

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (_, {dx, dy, y0}) => {
        swipe.setValue({x: dx, y: dy});
        titlSign.setValue(y0 > (height * 0.9) / 2 ? 1 : -1);
      },
      onPanResponderRelease: (_, {dx, dy}) => {
        const direction = Math.sign(dx);
        const isSwipedOffScreen = Math.abs(dx) > 100;

        if (isSwipedOffScreen) {
          Animated.timing(swipe, {
            duration: 100,
            toValue: {
              x: direction * 500,
              y: dy,
            },
            useNativeDriver: true,
          }).start(removeTopCard);
          return;
        }

        Animated.spring(swipe, {
          toValue: {
            x: 0,
            y: 0,
          },
          useNativeDriver: true,
          friction: 5,
        }).start();
      },
    }),
  ).current;

  const rotate = Animated.multiply(swipe.x, titlSign).interpolate({
    inputRange: [-100, 0, 100],
    outputRange: ['8deg', '0deg', '-8deg'],
  });

  const animatedCardStyle = {
    transform: [...swipe.getTranslateTransform(), {rotate}],
  };

  return (
    <View style={StyleSheet.absoluteFill}>
      {photos
        .map((item, index) => (
          <Animated.View
            key={index}
            style={[
              index === 0 ? animatedCardStyle : {},
              StyleSheet.absoluteFill,
            ]}
            {...(index === 0 ? panResponder.panHandlers : {})}>
            <Image
              key={index}
              source={{uri: 'file://' + item.path}}
              style={[StyleSheet.absoluteFill]}
            />
          </Animated.View>
        ))
        .reverse()}
    </View>
  );
}

export default SwipeCards;
