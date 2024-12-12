import { useState } from 'react';
import MapContext from '../context/MapContext';

const MapProvider = ({children}) => {

    const [gettingSkillsData, setGettingSkillsData] = useState(null);
    const [getTitle, setGetTitle] = useState(null);
    const [getDescription, setGetDescription] = useState(null);
    const [nextRole, setNextRole] = useState(null);

    const [checkSubscription, setCheckSubscription] = useState(null);

    const [checkingPlanStatus, setCheckingPlanStatus] = useState(true);

  return (

    <MapContext.Provider
      value={{
        setGettingSkillsData,
        gettingSkillsData,
        getTitle,
        setGetTitle,
        getDescription,
        setGetDescription,
        setNextRole,
        nextRole,
        checkSubscription, 
        setCheckSubscription,
        setCheckingPlanStatus,
        checkingPlanStatus
      }}
    >
        {children}
    </MapContext.Provider>
  )
}

export default MapProvider