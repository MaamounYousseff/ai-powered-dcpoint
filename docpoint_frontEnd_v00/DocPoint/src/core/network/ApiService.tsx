const BASE_URL_APPOINTMENT = "http://localhost:8000";

const ApiService = {

  createAppointment: async (body: unknown): Promise<Response> => {
    return await fetch(`${BASE_URL_APPOINTMENT}/appointment/create`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(body),
    });
  },


  fetchAppointments: async (): Promise<Response>=> {
    return await fetch(`${BASE_URL_APPOINTMENT}/appointment/`, {
          method: "GET",
          credentials: "include",
          redirect:"follow",
        });
    },


  fetchAppointmentsByDateRange: async (startDate: string, endDate: string | null, typeFilter: string ): Promise<Response> => {

    const params = new URLSearchParams();

    if (startDate !== null) params.append('start_date', startDate);
    if (endDate !== null) params.append('end_date', endDate);
    if (typeFilter !== null) params.append('appointment_type', typeFilter);

    const url = `${BASE_URL_APPOINTMENT}/appointment/filter?${params.toString()}`;

    return await fetch(url, {
      method: "GET",
      credentials: "include",
      redirect: "follow",
    });
      
  },

  
  login: async (body: unknown): Promise<Response> => {
    return await fetch(`${BASE_URL_APPOINTMENT}/doctor/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(body),
    });
  },

}










export default ApiService;




