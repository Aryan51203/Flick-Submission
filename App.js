import Ionicons from "@expo/vector-icons/Ionicons";
import { StatusBar } from "expo-status-bar";
import { useEffect, useRef, useState } from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { Camera, useCameraDevice, useCameraPermission } from "react-native-vision-camera";

export default function App() {
  const { hasPermission, requestPermission } = useCameraPermission();
  const camera = useRef(null);
  const [photo, setPhoto] = useState(null);
  const [currentMode, setCurrentMode] = useState("Camera");
  const [flash, setFlash] = useState("false");
  const [cameraMode, setCameraMode] = useState("front");

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

  const device = useCameraDevice(cameraMode);

  async function handleTakePicturePress() {
    const photo = await camera.current?.takePhoto({ flash: flash ? "on" : "off" });
    console.log("Photo taken", photo);
    setPhoto(photo);
  }

  function handleFlash() {
    setFlash((prev) => !prev);
  }

  function handleChangeCamera() {
    setCameraMode((prev) => (prev === "front" ? "back" : "front"));
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
      <StatusBar style="auto" />
      <Text style={[styles.text, styles.heading]}>{currentMode === "Camera" ? currentMode : "Camera"}</Text>
      {photo ? (
        <Image source={{ uri: "file://" + photo.path }} style={StyleSheet.absoluteFill} />
      ) : (
        <View style={styles.cameraContainer}>
          <Camera ref={camera} device={device} photo={true} style={StyleSheet.absoluteFill} isActive={true} />
          <View style={styles.controls}>
            <Ionicons name="camera-reverse" size={24} color="white" style={styles.icons} onPress={handleChangeCamera} />
            <Pressable style={styles.takePhotoBtn} onPress={handleTakePicturePress} />
            <Pressable onPress={handleFlash}>
              {flash ? (
                <Ionicons name="flash" size={24} color="white" style={styles.icons} />
              ) : (
                <Ionicons name="flash-off" size={24} color="white" style={styles.icons} />
              )}
            </Pressable>
          </View>
        </View>
      )}

      <Pressable style={styles.modeBtn}>
        <Text style={styles.text}>
          {currentMode === "posting" ? "Posting flick..." : currentMode === "Camera" ? "Feed" : "Camera"}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F5F0E6",
  },
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
  takePhotoBtn: {
    width: 72,
    height: 72,
    borderRadius: 40,
    backgroundColor: "transparent",
    borderWidth: 5.4,
    borderColor: "white",
  },
  displayPicture: {
    position: "absolute",
    top: 50,
    width: 50,
    height: 50,
  },
  modeBtn: {
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    backgroundColor: "black",
    bottom: 55,
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 15,
  },
  text: {
    fontFamily: "Montserrat",
    fontSize: 22,
    lineHeight: 29.26,
    fontWeight: "medium",
    color: "white",
  },
  heading: {
    position: "absolute",
    top: 80,
    color: "black",
    fontWeight: "bold",
  },
  controls: {
    position: "absolute",
    alignSelf: "center",
    justifyContent: "space-evenly",
    alignItems: "center",
    flexDirection: "row",
    bottom: 45,
    width: "100%",
    height: 72,
  },
  icons: {
    padding: 10,
    borderRadius: 10,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
});
