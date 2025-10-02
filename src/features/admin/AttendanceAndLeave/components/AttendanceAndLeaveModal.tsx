import React from 'react';
import TodayAttendanceModal from './TodayAttendance/TodayAttendanceModal';
import { Attendance } from '../types';

interface AttendanceAndLeaveModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  type: 'attendance' | 'leave';
  record?: any | null;
}

const AttendanceAndLeaveModal: React.FC<AttendanceAndLeaveModalProps> = ({
  visible,
  onClose,
  onSave,
  type,
  record
}) => {
  return (
    <TodayAttendanceModal
      visible={visible}
      onClose={onClose}
      onSave={onSave}
      record={record as Attendance}
    />
  );
};

export default AttendanceAndLeaveModal;