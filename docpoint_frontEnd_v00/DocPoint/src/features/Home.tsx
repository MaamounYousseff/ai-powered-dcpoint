import './Home.css';
import { AddCircleOutline, LocalHospital } from '@mui/icons-material';
import SchedulingViewPage from './scheduleView/ui/page/ScheduleViewPage';
import { SchedulingProvider } from './scheduling/ui/context/SchedulingProvider';
import { SchedulingResponseProvider } from './scheduling/ui/context/SchedulingResponseProvider';
import { useScheduleVisibility } from './scheduling/ui/context/SchedulingVisibilityProvider';
import SchedulingPage from './scheduling/ui/page/SchedulingPage';
import { CalendarIcon } from '@radix-ui/react-icons';

export function Home() {
    const { isScheduleVisible, showSchedulePage } = useScheduleVisibility();

    return (
        <>
            {/* Navbar */}
            <header className="navbar">

                {/* Brand */}
                <div className="navbar__brand">
                    <LocalHospital className="navbar__brand-icon" />
                    <div>
                        <div className="navbar__brand-name">Doctor Clinic</div>
                        <div className="navbar__brand-subtitle">Scheduling &amp; Management System</div>
                    </div>
                </div>

                {/* New Appointment Button */}
                <button className="btn-new-appointment" onClick={showSchedulePage}>
                    <AddCircleOutline className="btn-new-appointment__icon" />
                    New Appointment
                </button>

            </header>

            {/* Page Content */}
            <div className="page-wrapper">
                {isScheduleVisible &&
                    <SchedulingProvider>
                        <SchedulingResponseProvider>
                            <div className="container">
                                <div className="container__header">
                                    <div className="container__header-icon"><CalendarIcon width={25} height={25} /></div>
                                    <div className="container__header-title">Schedule New Appointment</div>
                                </div>
                                <SchedulingPage additionalClasses="px-24 py-10" />
                            </div>
                        </SchedulingResponseProvider>
                    </SchedulingProvider>
                }
                <SchedulingViewPage />
            </div>
        </>
    );
}