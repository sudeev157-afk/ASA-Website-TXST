"use client";

import ActionButton from "@/components/ui/ActionButton";
import LineRise from "@/components/ui/LineRise";
import { Cadence, CalendarFill } from "@/components/graphics/Motifs";
import Reveal from "@/components/ui/Reveal";
import SectionLabel from "@/components/ui/SectionLabel";
import { JOIN_FORM_URL } from "@/lib/links";
import { ADD_TO_CALENDAR_URL, FIRST_MEETING } from "@/lib/meeting";
import styles from "./EventsView.module.css";

const DETAILS = [
  { key: "Time", value: `${FIRST_MEETING.start} to ${FIRST_MEETING.end}` },
  { key: "Place", value: FIRST_MEETING.place },
  { key: "Then", value: FIRST_MEETING.cadence },
];

export default function EventsView() {
  return (
    <main className={styles.page}>
      {/* ══ 1 — the first meeting ═══════════════════════ */}
      <section className={`${styles.stage} tone-pine`} data-header-theme="dark">
        <div className={styles.inner}>
          <div className={styles.col}>
            <SectionLabel onLoad>First meeting</SectionLabel>

            <LineRise
              as="h1"
              onLoad
              className={styles.display}
              lines={[
                `${FIRST_MEETING.weekday},`,
                <>
                  <span className={styles.accent}>{FIRST_MEETING.date}</span>
                </>,
              ]}
            />

            <Reveal delay={0.35}>
              <dl className={styles.details}>
                {DETAILS.map(({ key, value }) => (
                  <div key={key} className={styles.detail}>
                    <dt className={styles.detailKey}>{key}</dt>
                    <dd className={styles.detailValue}>{value}</dd>
                  </div>
                ))}
              </dl>
            </Reveal>

            <Reveal delay={0.45} className={styles.actions}>
              <ActionButton href={ADD_TO_CALENDAR_URL} external>
                Add to calendar
              </ActionButton>
            </Reveal>
          </div>

          <div className={styles.motif}>
            <CalendarFill />
          </div>
        </div>
      </section>

      {/* ══ 2 — the rhythm after it ═════════════════════ */}
      <section
        className={`${styles.stage} tone-paper`}
        data-header-theme="light"
      >
        <div className={styles.inner}>
          <div className={styles.col}>
            <SectionLabel>The rest</SectionLabel>

            <LineRise
              className={styles.display}
              lines={["Every two weeks", "after that."]}
            />

            <Reveal delay={0.3}>
              <p className={styles.sub}>
                Workshops, guest speakers, and projects. We&rsquo;ll
                post the full schedule here once it&rsquo;s set. Join now and
                you&rsquo;ll hear about each one first.
              </p>
            </Reveal>

            <Reveal delay={0.4} className={styles.actions}>
              <ActionButton href={JOIN_FORM_URL} external>
                Join ASA
              </ActionButton>
            </Reveal>
          </div>

          <div className={styles.motif}>
            <Cadence />
          </div>
        </div>
      </section>
    </main>
  );
}
