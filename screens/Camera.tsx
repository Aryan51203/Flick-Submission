import React, {useEffect, useRef, useState} from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {
  Camera,
  runAtTargetFps,
  useCameraDevice,
  useCameraPermission,
  useFrameProcessor,
  useSkiaFrameProcessor,
  type CameraPosition,
} from 'react-native-vision-camera';

import {NavigationProp} from '@react-navigation/native';
import {Skia} from '@shopify/react-native-skia';
import {
  Face,
  FaceDetectionOptions,
  useFaceDetector,
} from 'react-native-vision-camera-face-detector';
import {Worklets} from 'react-native-worklets-core';

type Props = {
  navigation: NavigationProp<any>;
};

function CameraScreen({navigation}: Props) {
  const {hasPermission, requestPermission} = useCameraPermission();
  const camera = useRef<Camera>(null);
  const [currentMode, setCurrentMode] = useState<'Camera' | 'posting'>(
    'Camera',
  );
  const [flash, setFlash] = useState(false);
  const [cameraMode, setCameraMode] = useState<CameraPosition>('front');
  const [photosArr, setPhotosArr] = useState<Array<any>>([]);

  const device = useCameraDevice(cameraMode);

  const faceDetectionOptions = useRef<FaceDetectionOptions>({
    // detection options
  }).current;

  const {detectFaces} = useFaceDetector(faceDetectionOptions);

  useEffect(() => {
    (async () => {
      const status = await Camera.requestCameraPermission();
      console.log({status});
    })();
  }, [device]);

  const handleDetectedFaces = Worklets.createRunOnJS((faces: Face[]) => {
    console.log('faces detected', faces);
  });

  const frameProcessor = useSkiaFrameProcessor(frame => {
    'worklet';

    const faces = detectFaces(frame);
    frame.render();
    for (const face of faces) {
      // console.log('face detecte', face);
      const paint = Skia.Paint();
      // console.log(face?.bounds);
      paint.setColor(Skia.Color('red'));
      const rect = Skia.XYWHRect(
        face.bounds.x - face.bounds.width / 2,
        face.bounds.y - face.bounds.height / 2,
        face.bounds.width,
        face.bounds.height,
      );
      const centerX = frame.width / 2;
      const centerY = frame.height / 2;
      // const rect = Skia.XYWHRect(centerX, centerY, 10, 100);
      console.log(frame.width, frame.height);
      frame.drawRect(rect, paint);
    }
    // handleDetectedFaces(faces);
  }, []);

  useEffect(() => {
    if (!hasPermission) {
      requestPermission();
    }
  }, [hasPermission, requestPermission]);

  if (!hasPermission) {
    return (
      <View style={styles.container}>
        <Text>Permission not granted</Text>
      </View>
    );
  }

  async function handleTakePicturePress() {
    setCurrentMode('posting');
    const photo = await camera.current?.takePhoto({
      flash: flash ? 'on' : 'off',
    });
    setPhotosArr([...photosArr, photo]);
    setCurrentMode('Camera');
  }

  function handleFlash() {
    setFlash(prev => !prev);
  }

  function handleChangeCamera() {
    setCameraMode(prev => (prev === 'front' ? 'back' : 'front'));
  }

  if (device === undefined) {
    return (
      <View style={styles.container}>
        <Text>Device not found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={[styles.text, styles.heading]}>Camera</Text>

      <View style={styles.cameraContainer}>
        <Camera
          ref={camera}
          frameProcessor={frameProcessor}
          device={device}
          photo={true}
          style={StyleSheet.absoluteFill}
          isActive={true}
          outputOrientation="preview"
        />
        <View style={styles.controls}>
          <Ionicons
            name="camera-reverse"
            size={24}
            color="white"
            style={styles.icons}
            onPress={handleChangeCamera}
          />
          <Pressable
            style={styles.takePhotoBtn}
            onPress={handleTakePicturePress}
          />
          <Pressable onPress={handleFlash}>
            {flash ? (
              <Ionicons
                name="flash"
                size={24}
                color="white"
                style={styles.icons}
              />
            ) : (
              <Ionicons
                name="flash-off"
                size={24}
                color="white"
                style={styles.icons}
              />
            )}
          </Pressable>
        </View>
      </View>

      <Pressable
        style={styles.modeBtn}
        onPress={() => navigation.navigate('Feed', {photosArr})}>
        <Text style={styles.text}>
          {currentMode === 'posting' ? 'Posting flick...' : 'Feed'}
        </Text>
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
  takePhotoBtn: {
    width: 72,
    height: 72,
    borderRadius: 40,
    backgroundColor: 'transparent',
    borderWidth: 5.4,
    borderColor: 'white',
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
  controls: {
    position: 'absolute',
    alignSelf: 'center',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    flexDirection: 'row',
    bottom: 45,
    width: '100%',
    height: 72,
  },
  icons: {
    padding: 10,
    borderRadius: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
});

export default CameraScreen;
