// src/components/button/Button.jsx
import styles from './Button.module.css'
export function PrimaryButton({ children }) {
  return (
    <button className={styles.button1}>
      {children}
    </button>
  );
}

export function SecondaryButton({ children }) {
  return (
    <button className={styles.button2}>
      {children}
    </button>
  );
}

export function LeastButton({ children, onClick, ...props }) {
  return (
    <button
      onClick={onClick}
      className={styles.leastbtn}
      {...props} // allows passing other props like type="submit"
    >
      {children}
    </button>
  );
}
