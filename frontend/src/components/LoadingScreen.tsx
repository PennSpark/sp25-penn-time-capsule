import styles from './LoadingScreen.module.css';
import GradientBackground from "./GradientBackground";

interface LoadingScreenProps {
  progress?: number; // not using 
}

export default function LoadingScreen({ progress }: LoadingScreenProps) {
  return (
    <div className={styles.loadingContainer}>
      <GradientBackground />
    <div className={styles.spinner}></div>
      <p className={styles.loadingText}>Loading</p>
    </div>
  );
}