import { useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

const UniqueIdComponent = () => {
  useEffect(() => {
    // Check if an ID is already stored in session storage.
    const sessionStorageId = window.sessionStorage.getItem('uniqueId');

    if (!sessionStorageId) {
      // If no ID exists, generate a new UUID and store it in session storage.
      const newId = uuidv4();
      window.sessionStorage.setItem('uniqueId', newId);
    }
  }, []); // Empty dependency array to run only on mount

  // Component doesn't render anything visible
  return null;
};

export default UniqueIdComponent;

