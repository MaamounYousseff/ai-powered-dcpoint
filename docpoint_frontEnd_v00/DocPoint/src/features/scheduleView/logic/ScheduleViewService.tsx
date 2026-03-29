import type AclModel from "../../../core/security/AclModel";
import type { ScheduleViewDto, ScheduleViewDtoList } from "../data/ScheduleViewDto";
import { getScheduleViewListByFilters } from "../data/ScheduleRepo";
import type { ScheduleViewModelList } from "./ScheduleViewModel";
import { DateFilter } from "./DateFilter";
import { TypeFilter } from "./TypeFilter";

export  async function getScheduleViewList(dateFilter:string, typeFilter:string):Promise<ScheduleViewModelList>
{
    try{
        const today = new Date();
        const formatDate = (date: Date): string => {
            return date.toISOString().split('T')[0]; 
        };

        let startDate: string = formatDate(today);
        let endDate: string | null = formatDate(today);

        dateFilter = dateFilter ?? DateFilter.alldays;
        typeFilter = typeFilter ?? null ;
        typeFilter = (typeFilter == TypeFilter.ALL) ? null : typeFilter;

        switch (dateFilter.toLowerCase()) {
            case DateFilter.today:
                // startDate and endDate remain today
                endDate = null;
                break;

            case DateFilter.week: {
                const weekDate = new Date(today);
                weekDate.setDate(today.getDate() + 7);
                endDate = formatDate(weekDate);
                break;
            }

            case DateFilter.month: {
                const monthDate = new Date(today);
                monthDate.setMonth(today.getMonth() + 1);
                endDate = formatDate(monthDate);
                break;
            }

            case DateFilter.alldays:
                startDate = null;
                endDate = null; // no end date
                break;


            default: throw new Error("Invalid date filter");
        }

       

        const response:AclModel = await getScheduleViewListByFilters(startDate, endDate, typeFilter);

        const scheduleDtoList:ScheduleViewDtoList = response.data;

        const scheduleViewModelList:ScheduleViewModelList = scheduleDtoList.map((dto:ScheduleViewDto) => {
          
                const dateObj = new Date(dto.datetime);
                const hours = dateObj.getHours();
                const minutes = dateObj.getMinutes();

                const timeInMinutes = hours * 60 + minutes;

                const time = dateObj.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit"
                });

                const date = dateObj.toLocaleDateString();

                return {
                    Date: date,
                    Time: time,
                    TimeInMinutes: timeInMinutes,
                    Patient: `${dto.first_name} ${dto.last_name}`,
                    Type: dto.appointment_type,
                    Fees: dto.fees.toString(),
                    Notes: dto.notes,
                    Duration: dto.duration
                };
        })

        return scheduleViewModelList;
        
    }catch(error:any){
        console.log(error);
    }
    
}