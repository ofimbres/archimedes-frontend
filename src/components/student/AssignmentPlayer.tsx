import React from 'react';
import { Navigate } from 'react-router-dom';

/**
 * Legacy path: worksheets open from the Assignments page in a new tab, not an in-app player.
 */
const AssignmentPlayer: React.FC = () => <Navigate to="/" replace />;

export default AssignmentPlayer;
