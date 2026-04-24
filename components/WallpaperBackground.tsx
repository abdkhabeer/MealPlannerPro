import { ImageBackground, StyleSheet } from 'react-native';

const WALLPAPER = 'https://images.unsplash.com/photo-1576398289164-c48dc021b4e1?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D';

export function WallpaperBackground({ children }: { children: React.ReactNode }) {
  return (
    <ImageBackground source={{ uri: WALLPAPER }} style={styles.root} imageStyle={styles.image}>
      {children}
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  image: { opacity: 0.17, resizeMode: 'cover' },
});
