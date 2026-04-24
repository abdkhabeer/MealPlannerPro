import { ImageBackground, StyleSheet } from 'react-native';

export function WallpaperBackground({ children }: { children: React.ReactNode }) {
  return (
    <ImageBackground source={require('../assets/mealPlannerProWallpaper.jpeg')} style={styles.root} imageStyle={styles.image}>
      {children}
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  image: { opacity: 0.17, resizeMode: 'cover' },
});
