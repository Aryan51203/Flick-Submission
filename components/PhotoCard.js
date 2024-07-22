import { Animated, Image, StyleSheet } from "react-native";

function PhotoCard({ index, photo, swipe, tiltSign, isFirst, ...dragHandlers }) {
  const rotate = Animated.multiply(swipe.x, tiltSign).interpolate({
    inputRange: [-100, 0, 100],
    outputRange: ["-8deg", "0deg", "8deg"],
  });

  const animatedCardStyle = { transform: [...swipe.getTranslateTransform(), { rotate }] };

  return (
    <Animated.View
      style={[StyleSheet.absoluteFill, isFirst && animatedCardStyle, { backgroundColor: "white" }]}
      {...dragHandlers}
    >
      <Image key={index} source={{ uri: "file://" + photo.path }} style={[StyleSheet.absoluteFill]} />
    </Animated.View>
  );
}

export default PhotoCard;
