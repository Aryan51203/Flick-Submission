import { Image, StyleSheet, Text, View } from "react-native";

function PhotoCards({ photosArr }) {
  return (
    <View style={styles.cameraContainer}>
      {photosArr.length === 0 && <Text>No photos to display</Text>}
      {photosArr.map((photo, index) => (
        <Image
          key={index}
          source={{ uri: "file://" + photo.path }}
          style={[StyleSheet.absoluteFill, { zIndex: index }]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  cameraContainer: {
    alignSelf: "center",
    position: "absolute",
    width: "85%",
    height: "60%",
    overflow: "hidden",
    borderRadius: 15,
    elevation: 3,
    borderColor: "grey",
    borderWidth: 1.5,
  },
});

export default PhotoCards;
