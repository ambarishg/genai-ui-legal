import { Navigate,Outlet} from 'react-router-dom';

import { useUser } from '../contexts/UserContext';

function ProtectedRoute({ children }) {
  const user = useUser();
  let isAuthenticated2 =false

  if (user) {
    if(user.claims?.email) {
      console.log('User authenticated as:', user.claims.email);
      isAuthenticated2 = true
    }
    else {
      console.log('User authenticated but no email claim');
      
    }
  }
  else {
    console.log('User not authenticated');
  }

  return isAuthenticated2 ? <Outlet /> : <Navigate to="/login" />;
}

export default ProtectedRoute;
