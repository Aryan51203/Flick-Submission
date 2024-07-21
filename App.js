import { StatusBar } from "expo-status-bar";
import { useEffect, useRef, useState } from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { Camera, useCameraDevice, useCameraPermission } from "react-native-vision-camera";

export default function App() {
  const { hasPermission, requestPermission } = useCameraPermission();
  const camera = useRef(null);
  const [photo, setPhoto] = useState(null);

  useEffect(() => {
    if (!hasPermission) {
      requestPermission();
    }
  }, []);

  if (!hasPermission) {
    return (
      <View style={styles.container}>
        <Text>Permission not granted</Text>
        <StatusBar style="auto" />
      </View>
    );
  }

  const device = useCameraDevice("front");

  async function handleTakePicturePress() {
    const photo = await camera.current?.takePhoto();
    console.log("Photo taken", photo);
    setPhoto(photo);
  }

  if (device === null) {
    return (
      <View style={styles.container}>
        <Text>Device not found</Text>
        <StatusBar style="auto" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {photo ? (
        <Image source={{ uri: "file://" + photo.path }} style={StyleSheet.absoluteFill} />
      ) : (
        <View style={styles.cameraContainer}>
          <Camera
            ref={camera}
            device={device}
            photo={true}
            style={{ position: "absolute", top: 0, height: "100%", width: "100%", borderRadius: 100 }}
            isActive={true}
          />
          <Pressable style={styles.takePhotoBtn} onPress={handleTakePicturePress} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F5F0E6",
  },
  cameraContainer: {
    alignSelf: "center",
    position: "absolute",
    width: "85%",
    height: "60%",
    borderRadius: 100,
  },
  takePhotoBtn: {
    position: "absolute",
    alignSelf: "center",
    bottom: 45,
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "transparent",
    borderWidth: 5,
    borderColor: "white",
  },
  displayPicture: {
    position: "absolute",
    top: 50,
    width: 50,
    height: 50,
  },
});
