import { StyleSheet, View } from 'react-native';

import { colors } from '../theme';

export function CameraGlyph({ size = 54 }: { size?: number }) {
  const body = size * 0.72;
  const lens = size * 0.34;
  const flash = size * 0.1;
  return (
    <View style={{ width: size, height: size * 0.78, alignItems: 'center', justifyContent: 'flex-end' }}>
      <View
        style={[
          styles.flash,
          {
            width: flash * 1.6,
            height: flash,
            borderRadius: flash / 3,
            marginBottom: -flash / 3,
          },
        ]}
      />
      <View
        style={[
          styles.body,
          {
            width: body,
            height: body * 0.72,
            borderRadius: body * 0.18,
          },
        ]}
      >
        <View
          style={[
            styles.lens,
            {
              width: lens,
              height: lens,
              borderRadius: lens / 2,
            },
          ]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  flash: {
    backgroundColor: colors.terracotta,
    opacity: 0.85,
  },
  body: {
    backgroundColor: colors.terracotta,
    alignItems: 'center',
    justifyContent: 'center',
  },
  lens: {
    borderWidth: 3,
    borderColor: colors.cream,
    backgroundColor: colors.terracottaDeep,
  },
});
