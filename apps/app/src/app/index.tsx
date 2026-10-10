import { useTheme } from 'expo-router';
import { Platform, StyleSheet, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen() {
  const { colors } = useTheme();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text }]}>alchni.bg</Text>
      <Text style={[styles.subtitle, { color: colors.text }]}>
        Колко струва? Реални цени от касови бележки.
      </Text>
      <Text style={[styles.platform, { color: colors.text }]}>{Platform.OS}</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    padding: 24,
  },
  title: {
    fontSize: 40,
    fontWeight: '700',
  },
  subtitle: {
    fontSize: 18,
    textAlign: 'center',
  },
  platform: {
    fontSize: 14,
    opacity: 0.6,
  },
});
