import { useState, useEffect } from 'react';
import { useLocation, useHistory } from 'react-router-dom';

type LocationState = {
  isBurned: number;
};

const useIsJustBurned = () => {
  const [isJustBurned, setIsJustBurned] = useState<number>(0);
  const location = useLocation<LocationState>();
  let history = useHistory();

  useEffect(() => {
    if (
      history.action === 'PUSH' &&
      location.state !== undefined &&
      location.state !== null &&
      location.state.isBurned !== undefined &&
      location.state.isBurned
    )
      setIsJustBurned(location.state.isBurned);
  }, [history.action, location.state]);

  return isJustBurned;
};

export default useIsJustBurned;
