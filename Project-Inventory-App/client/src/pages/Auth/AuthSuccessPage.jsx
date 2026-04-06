import { useEffect } from 'react';
import { useSetAtom } from 'jotai';
import { accessTokenAtom } from '@/state/authAtom';
import { useNavigate, useSearchParams } from 'react-router';

export default function AuthSuccessPage() {
  const [searchParams] = useSearchParams();
  const setAccessToken = useSetAtom(accessTokenAtom);
  const navigate = useNavigate();

  useEffect(() => {
    const token = searchParams.get('token');

    if (token) {
      // 1. Save the token into the Jotai atom
      setAccessToken(token);
      
      // 2. Clear the URL and go to dashboard
      navigate('/', { replace: true });
    } else {
      navigate('/signin');
    }
  }, [searchParams, setAccessToken, navigate]);

  return <div>Finalizing login...</div>;
};