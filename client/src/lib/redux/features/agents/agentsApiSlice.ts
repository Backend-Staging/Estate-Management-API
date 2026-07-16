import {
	ManagedApartmentUpdateData,
	ManagedApartmentsResponse,
	RepairStaffCreateData,
	RepairStaffCreateResponse,
	RepairStaffListResponse,
} from "@/types";
import { baseApiSlice } from "../api/baseApiSlice";

export const agentsApiSlice = baseApiSlice.injectEndpoints({
	endpoints: (builder) => ({
		getManagedApartments: builder.query<ManagedApartmentsResponse, void>({
			query: () => "/apartments/managed/",
			providesTags: ["Apartment"],
		}),
		updateManagedApartment: builder.mutation<
			ManagedApartmentsResponse,
			{ id: string; data: ManagedApartmentUpdateData }
		>({
			query: ({ id, data }) => ({
				url: `/apartments/managed/${id}/`,
				method: "PATCH",
				body: data,
			}),
			invalidatesTags: ["Apartment", "User"],
		}),
		createRepairStaff: builder.mutation<
			RepairStaffCreateResponse,
			RepairStaffCreateData
		>({
			query: (body) => ({
				url: "/agents/repair-staff/",
				method: "POST",
				body,
			}),
			invalidatesTags: ["User"],
		}),
		getRepairStaff: builder.query<
			RepairStaffListResponse,
			{ building?: string } | void
		>({
			query: (params = {}) => {
				const query = params?.building
					? `?building=${encodeURIComponent(params.building)}`
					: "";
				return `/agents/repair-staff/list${query}`;
			},
			providesTags: ["User"],
		}),
	}),
});

export const {
	useGetManagedApartmentsQuery,
	useUpdateManagedApartmentMutation,
	useCreateRepairStaffMutation,
	useGetRepairStaffQuery,
} = agentsApiSlice;
