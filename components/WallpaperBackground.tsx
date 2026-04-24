import { ImageBackground, StyleSheet } from 'react-native';

const WALLPAPER = 'https://images.unsplash.com/photo-1543353071-873f17a7a088?w=1200&q=80';

export function WallpaperBackground({ children }: { children: React.ReactNode }) {
  return (
    <ImageBackground source={{ uri: WALLPAPER }} style={styles.root} imageStyle={styles.image}>
      {children}
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  image: { opacity: 0.25, resizeMode: 'cover' },
});
