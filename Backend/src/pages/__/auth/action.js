import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { getAuth, verifyPasswordResetCode, confirmPasswordReset } from 'firebase/auth';
import { initializeApp } from 'firebase/app';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export default function PasswordResetPage() {
  const router = useRouter();
  const { oobCode, mode } = router.query;
  const [verifiedEmail, setVerifiedEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmed, setConfirmed] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (mode === 'resetPassword' && oobCode) {
      verifyPasswordResetCode(auth, oobCode)
        .then(email => setVerifiedEmail(email))
        .catch(err => setError('Invalid or expired reset link.'));
    }
  }, [oobCode, mode]);

  const handleReset = async (e) => {
    e.preventDefault();
    try {
      await confirmPasswordReset(auth, oobCode, newPassword);
      setConfirmed(true);
      setTimeout(() => {
        router.push('/login'); // 👈 After reset, redirect to login
      }, 2000);
    } catch (err) {
      setError('Failed to reset password. Please try again.');
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>
        {confirmed ? '✅ Password Set!' : '🔐 Set Your Password'}
      </h2>
      {error && <p style={styles.error}>{error}</p>}
      {!confirmed && verifiedEmail && (
        <form onSubmit={handleReset} style={styles.form}>
          <p style={styles.label}>Setting password for <strong>{verifiedEmail}</strong></p>
          <input
            type="password"
            placeholder="New password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            style={styles.input}
          />
          <button type="submit" style={styles.button}>Set Password</button>
        </form>
      )}
      {confirmed && <p style={styles.success}>Redirecting to login...</p>}
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '400px',
    margin: '60px auto',
    padding: '30px',
    border: '1px solid #ddd',
    borderRadius: '12px',
    boxShadow: '0 2px 12px rgba(0,0,0,0.05)',
    fontFamily: 'Arial',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: '22px',
    marginBottom: '20px',
    textAlign: 'center',
  },
  label: {
    fontSize: '14px',
    marginBottom: '10px',
  },
  input: {
    width: '100%',
    padding: '12px',
    marginBottom: '16px',
    borderRadius: '8px',
    border: '1px solid #ccc',
  },
  button: {
    width: '100%',
    background: '#007bff',
    color: '#fff',
    padding: '12px',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
  },
  success: {
    color: 'green',
    textAlign: 'center',
  },
  error: {
    color: 'red',
    marginBottom: '15px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
  }
};
