import React, { useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { AuthContext } from './AuthContext';
import { getStudentPeriods } from '../libs/apiEndpoints';

export interface IPeriod {
  availablePeriods?: any;
  setAvailablePeriods?: any;
  chosenPeriod?: any;
  setChosenPeriod?: any;
  refreshPeriods?: any;
  /** When true, student shell (e.g. navbar) hides for full-screen embedded worksheet */
  embeddedAssignmentOpen?: boolean;
  setEmbeddedAssignmentOpen?: (open: boolean) => void;
}

const defaultState: IPeriod = {
  availablePeriods: [],
  chosenPeriod: null,
  setEmbeddedAssignmentOpen: () => {},
};

type Props = {
  children?: React.ReactNode;
};

export const StudentContext = React.createContext(defaultState);

const StudentProvider = ({ children }: Props) => {
  const [chosenPeriod, setChosenPeriod] = useState(null);
  const [availablePeriods, setAvailablePeriods] = useState([]);
  const [embeddedAssignmentOpen, setEmbeddedAssignmentOpen] = useState(false);

  const authContext = useContext(AuthContext);

  // useEffect(() => {

  //   const fetchClasses = async () => {
  //       await getStudentPeriods(authContext.attrInfo['custom:userId'], authContext.sessionInfo?.accessToken)
  //           .then(data => {
  //               setAvailablePeriods(data);
  //           });
  //   };

  //   fetchClasses();
  // }, []);

  const studentId =
    authContext.sessionInfo?.user_type === 'students' && authContext.sessionInfo?.profile
      ? (authContext.sessionInfo.profile as { id: string }).id
      : null;

  const fetchClasses = useCallback(async () => {
    if (!studentId || !authContext.sessionInfo?.accessToken) return;
    try {
      const data = await getStudentPeriods(
        studentId,
        authContext.sessionInfo.accessToken,
        authContext.sessionInfo.idToken
      );
      setAvailablePeriods(data);
    } catch (error) {
      console.error('Error fetching classes:', error);
    }
  }, [authContext.sessionInfo?.accessToken, authContext.sessionInfo?.idToken, studentId]);

  useEffect(() => {
    fetchClasses();
  }, [fetchClasses]);

  const refreshPeriods = useCallback(async () => {
    await fetchClasses();
  }, [fetchClasses]);

  const contextValue = useMemo(
    () => ({
      chosenPeriod,
      setChosenPeriod,
      availablePeriods,
      refreshPeriods,
      embeddedAssignmentOpen,
      setEmbeddedAssignmentOpen,
    }),
    [chosenPeriod, availablePeriods, refreshPeriods, embeddedAssignmentOpen]
  );

  return (
    <StudentContext.Provider value={contextValue}>
      {children}
    </StudentContext.Provider>
  );
};

export default StudentProvider;
