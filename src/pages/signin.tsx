'use client';
import * as React from 'react';
import Alert from '@mui/material/Alert';
import LinearProgress from '@mui/material/LinearProgress';
import { SignInPage } from '@toolpad/core/SignInPage';
import { Navigate, useNavigate } from 'react-router';
import { useSession, type Session } from '../SessionContext';
import { signInWithGoogle, signInWithCredentials } from '../firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';

export default function SignIn() {
  const { session, setSession, loading } = useSession();
  const navigate = useNavigate();

  if (loading) {
    return <LinearProgress />;
  }

  if (session) {
    return <Navigate to="/" />;
  }

  return (
    <SignInPage
      providers={[
        { id: 'google', name: 'Google' },
        { id: 'credentials', name: 'Credentials' },
      ]}
      signIn={async (provider, formData, callbackUrl) => {
        let result;
        try {
          if (provider.id === 'google') {
            result = await signInWithGoogle();
          }

          if (provider.id === 'credentials') {
            const email = formData?.get('email') as string;
            const password = formData?.get('password') as string;

            if (!email || !password) {
              return { error: 'Email and password are required' };
            }

            result = await signInWithCredentials(email, password);
          }

          if (result?.success && result?.user) {
            const userDocRef = doc(getFirestore(), 'roles', result.user.uid);
            const userDocSnap = await getDoc(userDocRef);
            let userRole = '';
            if (userDocSnap.exists()) {
              const userData = userDocSnap.data();
              userRole = userData.name;
              console.log('User document:', userData);
              // You can now use userData.role, etc.
            } else {
              console.log('User document not found in Firestore.');
            }

            const userSession: Session = {
              user: {
                name: result.user.displayName || '',
                email: result.user.email || '',
                image: result.user.photoURL || '',
                role: userRole ?? '',
              },
            };
            setSession(userSession);
            navigate(callbackUrl || '/', { replace: true });
            return {};
          }
          return { error: result?.error || 'Failed to sign in' };
        } catch (error) {
          return {
            error: error instanceof Error ? error.message : 'An error occurred',
          };
        }
      }}
    />
  );
}
