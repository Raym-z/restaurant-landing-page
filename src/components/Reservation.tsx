"use client";

import { useId, useMemo, useState } from "react";

type ReservationPayload = {
	name: string;
	phone: string;
	date: string;
	time: string;
	guests: number;
};

function phoneDigitsCount(phone: string) {
	// Keep validation simple: we only require a plausible count of digits.
	return phone.replace(/\D/g, "").length;
}

function isValid(payload: ReservationPayload) {
	if (!payload.name.trim()) return false;
	if (phoneDigitsCount(payload.phone) < 8) return false;
	if (!payload.date) return false;
	if (!payload.time) return false;
	if (!Number.isFinite(payload.guests) || payload.guests < 1 || payload.guests > 12) return false;
	return true;
}

export function Reservation() {
	const nameId = useId();
	const phoneId = useId();
	const dateId = useId();
	const timeId = useId();
	const guestsId = useId();

	const [payload, setPayload] = useState<ReservationPayload>({
		name: "",
		phone: "",
		date: "",
		time: "",
		guests: 2,
	});
	const [status, setStatus] = useState<"idle" | "success">("idle");

	const canSubmit = useMemo(() => isValid(payload), [payload]);

	return (
		<section id='reservation' className='scroll-mt-24 bg-background' aria-labelledby='reservation-title'>
			<div className='mx-auto w-full max-w-6xl px-4 py-18 sm:px-6'>
				<div className='grid gap-10 md:grid-cols-12 md:items-start'>
					<div className='md:col-span-6'>
						<p className='text-xs uppercase tracking-[0.28em] text-muted-foreground'>Reservations</p>
						<h2 id='reservation-title' className='mt-3 font-serif text-4xl leading-[1.05] tracking-tight text-foreground sm:text-5xl'>
							Reserve your table.
						</h2>
						<p className='mt-4 max-w-prose text-base leading-7 text-muted-foreground'>Submit your details and we will confirm your reservation via WhatsApp. (Mock submission for now.)</p>
					</div>

					<div className='md:col-span-6'>
						<div className='rounded-2xl border border-border bg-surface p-6 shadow-sm'>
							<form
								className='grid gap-4'
								onSubmit={(e) => {
									e.preventDefault();
									if (!canSubmit) return;
									// Mock-submit only (no API/database).
									console.log("Reservation payload", payload);
									setStatus("success");
									setPayload({ name: "", phone: "", date: "", time: "", guests: 2 });
								}}
							>
								<div className='grid gap-2'>
									<label htmlFor={nameId} className='text-sm font-medium text-foreground'>
										Name
									</label>
									<input
										id={nameId}
										value={payload.name}
										onChange={(e) => setPayload((p) => ({ ...p, name: e.target.value }))}
										className='h-11 rounded-xl border border-border bg-background px-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/50'
										placeholder='Your full name'
										autoComplete='name'
										required
									/>
								</div>

								<div className='grid gap-2'>
									<label htmlFor={phoneId} className='text-sm font-medium text-foreground'>
										Phone Number
									</label>
									<input
										id={phoneId}
										type='tel'
										inputMode='tel'
										value={payload.phone}
										onChange={(e) => setPayload((p) => ({ ...p, phone: e.target.value }))}
										className='h-11 rounded-xl border border-border bg-background px-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/50'
										placeholder='+39 02 555 0123'
										autoComplete='tel'
										required
									/>
									<p className='text-xs text-muted-foreground'>We will use this number to confirm your booking on WhatsApp.</p>
								</div>

								<div className='grid gap-4 sm:grid-cols-2'>
									<div className='grid gap-2'>
										<label htmlFor={dateId} className='text-sm font-medium text-foreground'>
											Date
										</label>
										<input
											id={dateId}
											type='date'
											value={payload.date}
											onChange={(e) => setPayload((p) => ({ ...p, date: e.target.value }))}
											className='h-11 w-full min-w-0 rounded-xl border border-border bg-background px-4 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent/50'
										/>
									</div>
									<div className='grid gap-2'>
										<label htmlFor={timeId} className='text-sm font-medium text-foreground'>
											Time
										</label>
										<input
											id={timeId}
											type='time'
											value={payload.time}
											onChange={(e) => setPayload((p) => ({ ...p, time: e.target.value }))}
											className='h-11 w-full min-w-0 rounded-xl border border-border bg-background px-4 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent/50'
										/>
									</div>
								</div>

								<div className='grid gap-2'>
									<label htmlFor={guestsId} className='text-sm font-medium text-foreground'>
										Guests
									</label>
									<select
										id={guestsId}
										value={payload.guests}
										onChange={(e) => setPayload((p) => ({ ...p, guests: Number(e.target.value) }))}
										className='h-11 rounded-xl border border-border bg-background px-4 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent/50'
									>
										{Array.from({ length: 12 }, (_, i) => i + 1).map((n) => (
											<option key={n} value={n}>
												{n}
											</option>
										))}
									</select>
									<p className='text-xs text-muted-foreground'>For parties larger than 6, please call.</p>
								</div>

								<button
									type='submit'
									disabled={!canSubmit}
									className='mt-2 inline-flex h-11 items-center justify-center rounded-full bg-accent px-6 text-sm font-medium text-foreground shadow-sm transition-opacity disabled:opacity-40'
								>
									Reserve Now
								</button>

								{status === "success" ? <div className='rounded-xl border border-border bg-muted px-4 py-3 text-sm text-foreground'>Request received. We will confirm shortly.</div> : null}
							</form>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
