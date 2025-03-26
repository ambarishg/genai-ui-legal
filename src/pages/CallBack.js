import { useHandleSignInCallback } from '@logto/react';


const Callback = () => {
  const { isLoading } = useHandleSignInCallback(() => {
    // Navigate to root path when finished
    window.location.href = '/';
  });

  // When it's working in progress
  if (isLoading) {
    return <div>Redirecting...</div>;
  }

  return null;
};

export default Callback;