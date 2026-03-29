import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import './ScheduleTableLS.css';
import { minutesToTime, getDayName } from './ScheduleViewDataHelper';
import type { ScheduleViewModelList } from '../../logic/ScheduleViewModel';
import { v4 as uuidv4 } from 'uuid';

interface ScheduleTableLSProps {
  scheduleViewList: ScheduleViewModelList;
}

export default function ScheduleTableLS({ scheduleViewList }: ScheduleTableLSProps) {

  const handleDelete = (index: number) => {
    console.log(index);
  };

  return (
    <div className="table-wrapper">
      <div className="sched-table-container">
        <TableContainer component={Paper} elevation={0} sx={{ borderRadius: 0 }}>
          <Table sx={{ minWidth: 650 }} aria-label="appointments table">
            <TableHead>
              <TableRow>
                <TableCell className="sched-th">Date</TableCell>
                <TableCell className="sched-th">Time</TableCell>
                <TableCell className="sched-th">Patient</TableCell>
                <TableCell className="sched-th">Type</TableCell>
                <TableCell className="sched-th">Fees</TableCell>
                <TableCell className="sched-th">Notes</TableCell>
                <TableCell className="sched-th sched-th--center">Actions</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {scheduleViewList?.map((row, index) => (
                <TableRow
                  key={uuidv4()}
                  className="sched-row"
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell className="td-date">
                    <div className="date-main">{row.Date}</div>
                    <div className="date-day">{getDayName(row.Date)}</div>
                  </TableCell>

                  <TableCell className="td-time">
                    <div className="time-start">{minutesToTime(row.TimeInMinutes)}</div>
                    <div className="time-end">{minutesToTime(row.TimeInMinutes + row.Duration)}</div>
                    <span className="time-duration">{row.Duration} min</span>
                  </TableCell>

                  <TableCell>
                    <span className="patient-name">{row.Patient}</span>
                  </TableCell>

                  <TableCell>
                    <span className="type-badge">{row.Type}</span>
                  </TableCell>

                  <TableCell className="fees-cell">
                    <span className="currency">$</span>
                    {row.Fees}
                  </TableCell>

                  <TableCell className="notes-cell">
                    {row.Notes || <span className="notes-empty">—</span>}
                  </TableCell>

                  <TableCell className="actions-cell">
                    <button
                      className="btn-delete"
                      onClick={() => handleDelete(index)}
                      aria-label={`Delete appointment for ${row.Patient}`}
                    >
                      <DeleteOutlineIcon style={{ width: 16, height: 16 }} />
                      Delete
                    </button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </div>
  );
}