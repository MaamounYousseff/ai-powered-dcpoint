import { useEffect, useState } from "react"
import  { getScheduleViewList } from "../../logic/ScheduleViewService";
import type { ScheduleViewModelList } from "../../logic/ScheduleViewModel";
import ScheduleTableLS from "../components/ScheduleTableLS";
import ScheduleViewCardSM from "../components/ScheduleViewCardSM";
import Box from "@mui/material/Box";
import { Autocomplete, TextField } from "@mui/material";
import { DateFilter } from "../../logic/DateFilter";
import { TypeFilter } from"../../logic/TypeFilter"
import { CalendarIcon } from "@radix-ui/react-icons";
import './ScheduleViewPage.css'


export default function SchedulingViewPage() {    

    const [scheduleViewList, setScheduleViewList] = useState<ScheduleViewModelList>();
    const [dateRangeFilter, setDateRangeFilter] = useState<string>();
    const [typeFilter, setTypeFilter] = useState<string>();


    useEffect(()=>{
        console.log("i am called")
        getScheduleViewList(dateRangeFilter,typeFilter).then(response =>{ 
            setScheduleViewList(response);
        });
    },[]);


    useEffect(()=>{
        getScheduleViewList(dateRangeFilter, typeFilter).then(response =>{ 
            setScheduleViewList(response);
        });
    },[dateRangeFilter,typeFilter])


    const handleDateFilterChange = (value: string)=>{
        setDateRangeFilter(value);
    }

    const handleTypeFilter = (value: string)=>{
        setTypeFilter(value);
    }

    return (
        <div className="sch-view-header">
            <div className="sch-header">
                <div className="sch-view-title">
                    <CalendarIcon width={25} height={25}/>    
                    View Scheduling
                </div>
                <div className="sch-view-filters">
                    <Autocomplete
                        disablePortal
                        sx={{ width: 128 }}
                        options={Object.values(DateFilter)}
                        renderInput={(params) => (
                            <TextField {...params} label="Date Filter" sx={{height: 50}}/>
                        )}
                        onChange={(_ , value) => {
                            handleDateFilterChange(value);
                        }}
                    />            
                    <Autocomplete
                        disablePortal
                        sx={{ width: 128 }}
                        options={Object.values(TypeFilter)}
                        renderInput={(params) => (
                            <TextField {...params} label="Type Filter" sx={{height: 50}}/>
                        )}
                        onChange={(_ , value) => {
                            handleTypeFilter(value);
                        }}
                    />
                </div>
            </div>
            <Box sx={{ display: { xs: 'none', md: 'block' } }}>
                <ScheduleTableLS scheduleViewList={scheduleViewList} />
            </Box>
            <Box sx={{ display: { xs: 'block', md: 'none' } }}>
                <ScheduleViewCardSM
                    appointmentsList={scheduleViewList}
                    additionalClasses="appointment-card-grid"
                />
            </Box>
        </div>
    )
}