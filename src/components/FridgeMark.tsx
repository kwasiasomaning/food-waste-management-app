import { StyleSheet, View } from 'react-native';

import { colors } from '../theme';

export function FridgeMark({ size = 26 }: { size?: number }) {
  const width = size * 0.7;
  const height = size;
  const seam = height * 0.34;
  const handleW = Math.max(2, size * 0.08);
  const handleH = size * 0.11;

  return (
    <View style={{ width: size * 0.78, height, alignItems: 'center', justifyContent: 'center' }}>
      <View
        style={[
          styles.body,
          {
            width,
            height: height * 0.94,
            borderRadius: size * 0.16,
          },
        ]}
      >
        <View style={[styles.seam, { top: seam }]} />
        <View
          style={[
            styles.handle,
            {
              top: seam * 0.4,
              width: handleW,
              height: handleH,
              right: size * 0.07,
            },
          ]}
        />
        <View
          style={[
            styles.handle,
            {
              top: seam + height * 0.18,
              width: handleW,
              height: handleH * 1.2,
              right: size * 0.07,
            },
          ]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  body: {
    backgroundColor: colors.terracotta,
    overflow: 'hidden',
  },
  seam: {
    position: 'absolute',
    left: '14%',
    right: '14%',
    height: 1.5,
    backgroundColor: colors.terracottaDeep,
  },
  handle: {
    position: 'absolute',
    borderRadius: 2,
    backgroundColor: colors.terracottaDeep,
  },
});
