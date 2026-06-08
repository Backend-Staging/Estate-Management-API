"use client";

import { TabsContent } from "@/components/ui/tabs";
import { ProfileItem } from "./ProfileItem";
import {
	BadgeCheck,
	Briefcase,
	CalendarDays,
	Contact,
	Home,
	Hotel,
	Map,
	MapPinnedIcon,
	Shield,
	Star,
	UserRoundCheck,
} from "lucide-react";
import { capitalizeFirstLetter, formatDate } from "@/utils";
import { Profile } from "@/types";

function formatFloor(floor: number | undefined | null): string {
	if (floor === undefined || floor === null) {
		return "None";
	}
	return String(floor);
}

function formatAverageRating(rating: number | undefined | null): string {
	if (rating == null || rating <= 0) {
		return "No ratings yet";
	}
	return rating.toString();
}

interface AboutProps {
	profile?: Profile;
}

export default function About({ profile }: AboutProps) {
	const isTenant = profile?.role === "tenant";

	return (
		<TabsContent value="about" className="p-4">
			<div className="grid grid-cols-1 gap-6 md:grid-cols-2">
				<div className="space-y-3">
					<ProfileItem
						icon={<Contact className="tab-icon" />}
						label="Name"
						value={profile?.full_name || "—"}
					/>
					<ProfileItem
						icon={<Shield className="tab-icon" />}
						label="Role"
						value={capitalizeFirstLetter(profile?.role || "") || "—"}
					/>
					<ProfileItem
						icon={<UserRoundCheck className="tab-icon" />}
						label="Gender"
						value={capitalizeFirstLetter(profile?.gender || "") || "—"}
					/>
					<ProfileItem
						icon={<CalendarDays className="tab-icon" />}
						label="Joined"
						value={
							profile?.date_joined
								? formatDate(profile.date_joined).toString()
								: "—"
						}
					/>
					<ProfileItem
						icon={<BadgeCheck className="tab-icon" />}
						label="Reputation"
						value={`${profile?.reputation ?? 0} out of 100`}
					/>
					<ProfileItem
						icon={<Map className="tab-icon" />}
						label="Country"
						value={profile?.country_of_origin || "—"}
					/>
					<ProfileItem
						icon={<MapPinnedIcon className="tab-icon" />}
						label="City"
						value={profile?.city_of_origin || "—"}
					/>
				</div>

				<div className="space-y-3">
					{!isTenant && (
						<ProfileItem
							icon={<Briefcase className="tab-icon" />}
							label="Occupation"
							value={capitalizeFirstLetter(profile?.occupation || "") || "—"}
						/>
					)}
					<ProfileItem
						icon={<Home className="tab-icon" />}
						label="Apartment"
						value={profile?.apartment?.unit_number || "None"}
					/>
					<ProfileItem
						icon={<Hotel className="tab-icon" />}
						label="Building"
						value={
							profile?.apartment
								? `${profile.apartment.building}, Floor: ${formatFloor(profile.apartment.floor)}`
								: "None"
						}
					/>
					<ProfileItem
						icon={<Star className="tab-icon" />}
						label="Average Rating"
						value={formatAverageRating(profile?.average_rating)}
					/>

					<div className="pt-1">
						<p className="tab-font">Bio:</p>
						<p className="dark:text-babyPowder mt-1 text-sm leading-relaxed">
							{profile?.bio || "You have not added any bio info yet!"}
						</p>
					</div>
				</div>
			</div>
		</TabsContent>
	);
}
