import { createElement, useEffect, useRef, useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, fonts, radius } from '../theme';

export function WebFridgeCamera({
  visible,
  onCancel,
  onCapture,
}: {
  visible: boolean;
  onCancel: () => void;
  onCapture: (uri: string) => void;
}) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!visible) return undefined;
    let cancelled = false;
    setError(null);

    const start = async () => {
      try {
        const stream = await openCamera();
        if (cancelled) {
          stopStream(stream);
          return;
        }
        streamRef.current = stream;
        const node = videoRef.current;
        if (node) {
          node.srcObject = stream;
          await node.play().catch(() => undefined);
        }
      } catch {
        if (!cancelled) setError('Could not open the camera. Check the browser permission, or upload a photo instead.');
      }
    };

    void start();
    return () => {
      cancelled = true;
      stopStream(streamRef.current);
      streamRef.current = null;
    };
  }, [visible]);

  const capture = () => {
    const video = videoRef.current;
    if (!video || !video.videoWidth) return;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d')?.drawImage(video, 0, 0);
    onCapture(canvas.toDataURL('image/jpeg', 0.8));
  };

  if (!visible) return null;

  return (
    <Modal visible transparent animationType="fade" onRequestClose={onCancel}>
      <View style={styles.backdrop}>
        <View style={styles.sheet}>
          <Text style={styles.title}>What's inside your fridge Tonight</Text>
          <Text style={styles.sub}>Point the camera at the shelves, then capture.</Text>
          <View style={styles.frame}>
            {createElement('video', {
              ref: videoRef,
              autoPlay: true,
              muted: true,
              playsInline: true,
              style: { width: '100%', height: 260, objectFit: 'cover' },
            })}
          </View>
          {error ? <Text style={styles.error}>{error}</Text> : null}
          <Pressable style={styles.capture} onPress={capture} disabled={!!error}>
            <Text style={styles.captureText}>Capture</Text>
          </Pressable>
          <Pressable onPress={onCancel} style={styles.cancel}>
            <Text style={styles.cancelText}>Cancel</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

async function openCamera(): Promise<MediaStream> {
  try {
    return await navigator.mediaDevices.getUserMedia({
      video: { facingMode: { ideal: 'environment' } },
      audio: false,
    });
  } catch {
    return navigator.mediaDevices.getUserMedia({ video: true, audio: false });
  }
}

function stopStream(stream: MediaStream | null) {
  stream?.getTracks().forEach((track) => track.stop());
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(27, 23, 19, 0.5)',
    justifyContent: 'center',
    padding: 20,
  },
  sheet: {
    backgroundColor: colors.cream,
    borderRadius: radius.lg,
    padding: 18,
  },
  title: { fontFamily: fonts.display, fontSize: 26, color: colors.ink },
  sub: { fontFamily: fonts.sans, color: colors.inkSoft, marginTop: 6, marginBottom: 12 },
  frame: {
    borderRadius: radius.md,
    overflow: 'hidden',
    backgroundColor: colors.ink,
  },
  error: { fontFamily: fonts.sans, color: colors.terracotta, marginTop: 10 },
  capture: {
    marginTop: 14,
    backgroundColor: colors.terracotta,
    borderRadius: radius.pill,
    paddingVertical: 14,
    alignItems: 'center',
  },
  captureText: { fontFamily: fonts.sansBold, color: colors.cream, fontSize: 16 },
  cancel: { alignItems: 'center', paddingTop: 12 },
  cancelText: { fontFamily: fonts.sansSemi, color: colors.inkSoft },
});
