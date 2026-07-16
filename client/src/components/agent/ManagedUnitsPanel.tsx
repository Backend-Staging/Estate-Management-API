"use client";

import {
	useGetManagedApartmentsQuery,
	useUpdateManagedApartmentMutation,
} from "@/lib/redux/features/agents/agentsApiSlice";
import { Button } from "@/components/ui/button";
import Spinner from "@/components/shared/Spinner";
import { extractErrorMessage } from "@/utils";
import { toast } from "react-toastify";

export default function ManagedUnitsPanel() {
	const { data, isLoading } = useGetManagedApartmentsQuery();
	const [updateApartment, { isLoading: isUpdating }] =
		useUpdateManagedApartmentMutation();

	const apartments = data?.apartments ?? [];

	const handleVerify = async (id: string) => {
		try {
			await updateApartment({
				id,
				data: { tenant_verified_at: new Date().toISOString() },
			}).unwrap();
			toast.success("Tenant approved for this unit.");
		} catch (error) {
			toast.error(extractErrorMessage(error));
		}
	};

	if (isLoading) {
		return (
			<div className="flex justify-center py-16">
				<Spinner size="xl" />
			</div>
		);
	}

	return (
		<div className="space-y-4">
			{apartments.length === 0 ? (
				<p className="text-sm text-ink-muted dark:text-slate-400">
					No apartments yet. Tenants register units from the resident portal; approve
					them here.
				</p>
			) : (
				<div className="overflow-x-auto rounded-xl border border-surface-border dark:border-slate-700">
					<table className="min-w-full text-sm">
						<thead className="bg-slate-50 text-left dark:bg-slate-900">
							<tr>
								<th className="px-4 py-3 font-medium">Unit</th>
								<th className="px-4 py-3 font-medium">Building</th>
								<th className="px-4 py-3 font-medium">Tenant</th>
								<th className="px-4 py-3 font-medium">Status</th>
								<th className="px-4 py-3 font-medium">Action</th>
							</tr>
						</thead>
						<tbody>
							{apartments.map((apt) => (
								<tr
									key={apt.id}
									className="border-t border-surface-border dark:border-slate-700"
								>
									<td className="px-4 py-3">{apt.unit_number}</td>
									<td className="px-4 py-3">{apt.building}</td>
									<td className="px-4 py-3">
										{apt.tenant_name || apt.tenant_email || "Vacant"}
									</td>
									<td className="px-4 py-3">
										{apt.tenant_verified_at ? (
											<span className="text-brand-700 dark:text-brand-300">
												Verified
											</span>
										) : apt.tenant ? (
											<span className="text-amber-700 dark:text-amber-300">
												Pending approval
											</span>
										) : (
											<span className="text-ink-muted">Vacant</span>
										)}
									</td>
									<td className="px-4 py-3">
										{apt.tenant && !apt.tenant_verified_at && (
											<Button
												size="sm"
												disabled={isUpdating}
												onClick={() => handleVerify(apt.id)}
											>
												Accept tenant
											</Button>
										)}
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			)}
		</div>
	);
}
