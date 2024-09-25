// src/components/auth/GoogleSignIn.jsx
import { useState } from 'react';

export default function GoogleSignIn({ onSignIn }) {
  const [isSignedIn, setIsSignedIn] = useState(false);

  const handleSignIn = () => {
    // Dummy user data for testing
    const dummyUser = {
      email: 'test@test.test',
      id: '1',
    };

    // Simulate the sign-in process
    setIsSignedIn(true);
    // Pass the dummy user data to the parent component
    onSignIn(dummyUser);
  };

  return (
    <div>
      {!isSignedIn ? (
        <button
          onClick={handleSignIn}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
        >
          Sign in with Google
        </button>
      ) : (
        <p>You are signed in as test@test.test</p>
      )}
    </div>
  );
}
