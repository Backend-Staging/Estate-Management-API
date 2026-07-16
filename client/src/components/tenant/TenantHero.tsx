"use client";

import { TENANT_APP, TENANT_HERO_PILLARS } from "@/constants/tenant";
import Link from "next/link";
import { ArrowRight, ChevronDown } from "lucide-react";

export default function TenantHero() {
	return (
		<section className="relative -mx-4 overflow-hidden bg-brand-gradient text-white sm:-mx-6 lg:-mx-8">
			<div className="pointer-events-none absolute inset-0 bg-brand-mesh opacity-60" />
			<div className="relative px-6 py-16 sm:px-8 sm:py-20 lg:px-10 lg:py-24">
				<div className="mx-auto max-w-3xl text-center lg:text-left">
					<p className="text-sm font-semibold uppercase tracking-widest text-brand-300">
						{TENANT_APP.tagline}
					</p>
					<h1 className="mt-4 font-display text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
						{TENANT_APP.name}
					</h1>
					<p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-slate-200 sm:text-xl lg:mx-0">
						Connect with neighbors, share what's happening in your building, and
						get maintenance help — without leaving home.
					</p>

					<div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center lg:justify-start">
						<Link
							href="/register"
							className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-white px-6 py-3.5 text-sm font-semibold text-slate-900 shadow-elevated transition hover:bg-slate-100 sm:w-auto"
						>
							Join your building
							<ArrowRight className="size-4" />
						</Link>
						<Link
							href="/login"
							className="inline-flex w-full items-center justify-center rounded-lg border border-white/30 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-white/10 sm:w-auto"
						>
							Sign in
						</Link>
					</div>

					<a
						href="#building-board"
						className="mt-8 inline-flex items-center gap-2 text-sm font-medium text-slate-300 transition hover:text-white"
					>
						Browse the board first
						<ChevronDown className="size-4" />
					</a>
				</div>

				<div className="mx-auto mt-14 grid max-w-6xl gap-4 sm:grid-cols-2 lg:grid-cols-4">
					{TENANT_HERO_PILLARS.map((pillar) => (
						<div
							key={pillar.title}
							className="rounded-xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm"
						>
							<pillar.icon className="mb-3 size-6 text-brand-300" />
							<h3 className="font-semibold text-white">{pillar.title}</h3>
							<p className="mt-1 text-sm leading-relaxed text-slate-300">
								{pillar.description}
							</p>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}
