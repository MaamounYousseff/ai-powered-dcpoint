import Typography from '@mui/material/Typography';
import { red } from '@mui/material/colors';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import TimerIcon from '@mui/icons-material/Timer';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Collapse from '@mui/material/Collapse';
import Avatar from '@mui/material/Avatar';
import CardSlot from './CardSlot';
import { styled } from '@mui/material/styles';
import React from 'react';

import IconButton from '@mui/material/IconButton';
import type {IconButtonProps} from '@mui/material/IconButton'
import {getDayName,minutesToTime} from './ScheduleViewDataHelper'
import './ScheduleCard.css'

interface ScheduleCardProps {
  Date: string;
  Time: string;
  TimeInMinutes: number;
  PatientName: string;
  Type: string;
  Fees: string;
  Notes: string;
  Duration: number;
}



// this is a single ui component
interface ExpandMoreProps extends IconButtonProps {
  expand: boolean;
}

const ExpandMore = styled((props: ExpandMoreProps) => {
  const {  ...other } = props;
  return <IconButton {...other} />;
})(({ theme }) => ({
  marginLeft: 'auto',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest,
  }),
  variants: [
    {
      props: ({ expand }) => !expand,
      style: {
        transform: 'rotate(0deg)',
      },
    },
    {
      props: ({ expand }) => !!expand,
      style: {
        transform: 'rotate(180deg)',
      },
    },
  ],
}));



export default function ScheduleCard(scheduleCardProps: ScheduleCardProps) {
  const [expanded, setExpanded] = React.useState(false);
    const handleDelete = (patientName) => {
    console.log(patientName);
    };

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  return (
    <Card className="schedule-card" >
      <CardHeader
        avatar={
          <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe">
            <LocalHospitalIcon />
          </Avatar>
        }
        action={
          <DeleteOutlineIcon
            onClick={() => handleDelete(scheduleCardProps.PatientName)} // TODO this should be replaced by Id
          ></DeleteOutlineIcon>
        }
        title={scheduleCardProps.PatientName}
        subheader={scheduleCardProps.Type}
      />
      <CardContent>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          {/* Date */}
          {/* Date */}
          <CardSlot
            icon={<CalendarTodayIcon />}
            text={`${scheduleCardProps.Date} — ${getDayName(
              scheduleCardProps.Date
            )}`}
            additionalClasses="card-slot card-slot--date"
          />

          {/* Time from → to */}
          <CardSlot
            icon={<AccessTimeIcon />}
            text={`${minutesToTime(
              scheduleCardProps.TimeInMinutes
            )} → ${minutesToTime(
              scheduleCardProps.TimeInMinutes + scheduleCardProps.Duration
            )}`}
             additionalClasses="card-slot card-slot--time"
          />

          {/* Duration */}
          <CardSlot
            icon={<TimerIcon />}
            text={`${scheduleCardProps.Duration} min`}
            additionalClasses="card-slot card-slot--duration"
          />

          {/* Fees */}
          <CardSlot
            icon={<AttachMoneyIcon />}
            text={scheduleCardProps.Fees ? `$${scheduleCardProps.Fees}` : '—'}
            additionalClasses="card-slot card-slot--fees"
          />
        </Typography>
      </CardContent>
      <CardActions disableSpacing>
        <ExpandMore
          expand={expanded}
          onClick={handleExpandClick}
          aria-expanded={expanded}
          aria-label="show more"
        >
          <ExpandMoreIcon />
        </ExpandMore>
      </CardActions>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent>
          <Typography sx={{ marginBottom: 2 }}>Notes:</Typography>
          <Typography> {scheduleCardProps.Notes} </Typography>
        </CardContent>
      </Collapse>
    </Card>
  );
}