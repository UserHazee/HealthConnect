// src/components/button/Button.jsx
import styles from './Button.module.css'
export function PrimaryButton({ children, ...props }) {
  return (
    <button className={styles.button1} {...props}>
      {children}
    </button>
  );
}

export function SecondaryButton({ children, ...props }) {
  return (
    <button className={styles.button2} {...props}>
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
