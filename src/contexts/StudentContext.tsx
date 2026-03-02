import React, { useContext, useState, useEffect, useCallback } from 'react';
import { AuthContext } from './AuthContext';
import { getStudentPeriods } from '../libs/apiEndpoints';

export interface IPeriod {
  availablePeriods?: any;
  setAvailablePeriods?: any;
  chosenPeriod?: any;
  setChosenPeriod?: any;
  refreshPeriods?: any;
}

const defaultState: IPeriod = {
  availablePeriods: [],
  chosenPeriod: null,
};

type Props = {
  children?: React.ReactNode;
};

export const StudentContext = React.createContext(defaultState);

const StudentProvider = ({ children }: Props) => {
  const [chosenPeriod, setChosenPeriod] = useState(null);
  const [availablePeriods, setAvailablePeriods] = useState([]);

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
      const data = await getStudentPeriods(studentId, authContext.sessionInfo.accessToken);
      setAvailablePeriods(data);
    } catch (error) {
      console.error('Error fetching classes:', error);
    }
  }, [authContext.sessionInfo?.accessToken, studentId]);

  useEffect(() => {
    fetchClasses();
  }, [fetchClasses]);

  const refreshPeriods = async () => {
    await fetchClasses();
  };

  return (
    <StudentContext.Provider
      value={{ chosenPeriod, setChosenPeriod, availablePeriods, refreshPeriods }}
    >
      {children}
    </StudentContext.Provider>
  );
};

export default StudentProvider;
