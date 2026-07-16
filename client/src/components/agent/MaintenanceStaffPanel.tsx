"use client";

import {
	useCreateRepairStaffMutation,
	useGetRepairStaffQuery,
} from "@/lib/redux/features/agents/agentsApiSlice";
import { Button } from "@/components/ui/button";
import Spinner from "@/components/shared/Spinner";
import { extractErrorMessage } from "@/utils";
import { useState } from "react";
import { toast } from "react-toastify";

const BUILDINGS = ["North Tower", "South Tower", "East Wing"];
const OCCUPATIONS = [
	"plumber",
	"electrician",
	"hvac",
	"painter",
	"carpenter",
	"mason",
	"roofer",
];

export default function MaintenanceStaffPanel() {
	const { data, isLoading, refetch } = useGetRepairStaffQuery();
	const [createStaff, { isLoading: isCreating }] = useCreateRepairStaffMutation();
	const [form, setForm] = useState({
		email: "",
		username: "",
		first_name: "",
		last_name: "",
		password: "Demo123!",
		occupation: "plumber",
		assigned_building: BUILDINGS[0],
	});

	const staff = data?.repair_staff ?? [];

	const handleSubmit = async (event: React.FormEvent) => {
		event.preventDefault();
		try {
			await createStaff(form).unwrap();
			toast.success("Maintenance staff account created.");
			setForm((prev) => ({
				...prev,
				email: "",
				username: "",
				first_name: "",
				last_name: "",
			}));
			refetch();
		} catch (error) {
			toast.error(extractErrorMessage(error));
		}
	};

	return (
		<div className="grid gap-8 lg:grid-cols-2">
			<form
				onSubmit={handleSubmit}
				className="space-y-4 rounded-xl border border-surface-border bg-surface p-6 shadow-card dark:border-slate-700 dark:bg-slate-900/60"
			>
				<h2 className="font-display text-lg font-semibold text-ink dark:text-slate-100">
					Add maintenance staff
				</h2>
				<div className="grid gap-3 sm:grid-cols-2">
					<input
						className="rounded-lg border px-3 py-2 text-sm dark:bg-slate-950"
						placeholder="First name"
						value={form.first_name}
						onChange={(e) =>
							setForm({ ...form, first_name: e.target.value })
						}
						required
					/>
					<input
						className="rounded-lg border px-3 py-2 text-sm dark:bg-slate-950"
						placeholder="Last name"
						value={form.last_name}
						onChange={(e) => setForm({ ...form, last_name: e.target.value })}
						required
					/>
					<input
						className="rounded-lg border px-3 py-2 text-sm dark:bg-slate-950 sm:col-span-2"
						placeholder="Email"
						type="email"
						value={form.email}
						onChange={(e) => setForm({ ...form, email: e.target.value })}
						required
					/>
					<input
						className="rounded-lg border px-3 py-2 text-sm dark:bg-slate-950 sm:col-span-2"
						placeholder="Username"
						value={form.username}
						onChange={(e) => setForm({ ...form, username: e.target.value })}
						required
					/>
					<select
						className="rounded-lg border px-3 py-2 text-sm dark:bg-slate-950"
						value={form.occupation}
						onChange={(e) =>
							setForm({ ...form, occupation: e.target.value })
						}
					>
						{OCCUPATIONS.map((item) => (
							<option key={item} value={item}>
								{item}
							</option>
						))}
					</select>
					<select
						className="rounded-lg border px-3 py-2 text-sm dark:bg-slate-950"
						value={form.assigned_building}
						onChange={(e) =>
							setForm({ ...form, assigned_building: e.target.value })
						}
					>
						{BUILDINGS.map((building) => (
							<option key={building} value={building}>
								{building}
							</option>
						))}
					</select>
				</div>
				<Button type="submit" disabled={isCreating} className="electricIndigo-gradient">
					Create account
				</Button>
			</form>

			<div className="rounded-xl border border-surface-border bg-surface p-6 shadow-card dark:border-slate-700 dark:bg-slate-900/60">
				<h2 className="font-display text-lg font-semibold text-ink dark:text-slate-100">
					Maintenance roster
				</h2>
				{isLoading ? (
					<div className="flex justify-center py-10">
						<Spinner size="lg" />
					</div>
				) : staff.length === 0 ? (
					<p className="mt-4 text-sm text-ink-muted dark:text-slate-400">
						No maintenance staff yet.
					</p>
				) : (
					<ul className="mt-4 space-y-3">
						{staff.map((member) => (
							<li
								key={member.id}
								className="flex items-center justify-between rounded-lg border border-surface-border px-4 py-3 dark:border-slate-700"
							>
								<div>
									<p className="font-medium text-ink dark:text-slate-100">
										{member.full_name}
									</p>
									<p className="text-xs text-ink-muted dark:text-slate-500">
										{member.occupation} · {member.assigned_building}
									</p>
								</div>
								<span className="text-xs text-ink-subtle">@{member.username}</span>
							</li>
						))}
					</ul>
				)}
			</div>
		</div>
	);
}
