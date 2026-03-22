import React from 'react';
import { Navigate } from 'react-router-dom';

/**
 * Legacy path: worksheets launch from the Assignments page (embed or new tab), not an in-app player.
 */
const AssignmentPlayer: React.FC = () => <Navigate to="/" replace />;

export default AssignmentPlayer;
