import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import PageMeta from "../components/PageMeta";
import diapers from "../assets/3E3D2A9D-5E5F-4CB6-A1A1-8EE0A3E5D78D.jpeg";
import classroom from "../assets/45F86866-96E5-4138-8618-B78B3BB6D5A5.png";
import waterSupplies from "../assets/51D63461-C729-45FD-B988-4A81DD572E59.png";
import waterDistribution from "../assets/647E7D86-87E3-4861-AD0E-6CAB18A7A7DE.png";
import reliefPackages from "../assets/9EC4E8E6-8101-483E-8D6C-170B375FCAB2.jpeg";
import impactFilm from "../assets/VIDEO-2026-11-11-13-07-20.mp4";
import communityFilm from "../assets/VIDEO-2026-11-11-15-29-04.mp4";
import careFilm from "../assets/VIDEO-2026-11-11-15-29-05.mp4";

/* ------------------------------------------------------------
   A tiny "Reveal" component (intersection observer)
   Adds nice on-scroll fade/slide-in with no dependencies.
------------------------------------------------------------ */
const Reveal = ({ children, className = "", delay = 0 }) => {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!('IntersectionObserver' in window)) {
      setVisible(true);
      return;
    }
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setVisible(true), delay);
          obs.unobserve(el);
        }
      },
      { threshold: 0.15 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [delay]);

  return (
    <div
      ref={ref}
      className={[
        "motion-safe:transition-all motion-safe:duration-[900ms]",
        visible
          ? "opacity-100 translate-y-0"
          : "motion-safe:opacity-0 motion-safe:translate-y-6",
        className,
      ].join(" ")}
    >
      {children}
    </div>
  );
};

/* ------------------------------------------------------------
   Data
------------------------------------------------------------ */
const STORIES = [
  {
    img: waterSupplies,
    alt: "Volunteers and neighbors organize cases of drinking water at an outdoor relief point",
    badge: "Water relief",
    title: "A steady supply, shared together",
    detail: "Bottled water is gathered and sorted so people can collect what they need.",
  },
  {
    img: diapers,
    alt: "Boxes of diapers and family care essentials ready for donation",
    badge: "Family essentials",
    title: "Small necessities, meaningful relief",
    detail: "Diapers and daily care items are packed alongside food and household supplies.",
  },
  {
    img: classroom,
    alt: "A group of children sits together in a colorful classroom as a teacher holds a violin",
    badge: "Learning & play",
    title: "A classroom alive with possibility",
    detail: "Children gather in a bright learning space for a shared moment of music.",
  },
  {
    img: reliefPackages,
    alt: "Volunteers prepare rows of packed relief bags and supply boxes for distribution",
    badge: "Community response",
    title: "Many hands make ready help",
    detail: "Every bag and box is another bundle of practical supplies prepared to share.",
  },
];

const IMPACT_FILMS = [
  {
    src: impactFilm,
    title: "Every act of care has a human story.",
    label: "The full story",
    detail: "See neighbors show up for one another with practical support and shared effort.",
  },
  {
    src: communityFilm,
    title: "Care in the everyday.",
    label: "A community moment",
    detail: "A short glimpse of people coming together to support their community.",
  },
  {
    src: careFilm,
    title: "Support, shared together.",
    label: "Everyday care",
    detail: "Small moments of care can make a meaningful difference.",
  },
];

/* ------------------------------------------------------------
   Card with hover overlay
------------------------------------------------------------ */
const StoryCard = ({ s, index }) => (
  <Reveal delay={index * 100}>
    <article tabIndex="0" className="group relative overflow-hidden rounded-xl bg-white dark:bg-gray-800 shadow-sm ring-1 ring-forest/10 hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral transition-shadow">
      {/* Image */}
      <div className="aspect-[4/3] w-full overflow-hidden">
        <img
          src={s.img}
          alt={s.alt}
          className="w-full h-full object-cover motion-safe:transition-transform motion-safe:duration-700 group-hover:scale-[1.05]"
          loading="lazy"
        />
      </div>

      {/* Top-left badge */}
      <div className="absolute top-3 left-3">
        <span className="inline-block rounded-sm bg-forest text-white text-xs font-semibold px-3 py-1.5">
          {s.badge}
        </span>
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-[7.25rem] h-20 bg-gradient-to-t from-black/50 to-transparent opacity-70 transition-opacity group-hover:opacity-100" />

      {/* Static content under image (visible even without hover) */}
      <div className="p-5">
        <h2 className="text-lg font-bold leading-snug text-gray-900 dark:text-gray-100">{s.title}</h2>
        <p className="mt-2 text-sm leading-relaxed text-gray-600 dark:text-gray-300">{s.detail}</p>
      </div>
    </article>
  </Reveal>
);

/* ------------------------------------------------------------
   Page component
------------------------------------------------------------ */
export default function Impact() {
  const [selectedFilmIndex, setSelectedFilmIndex] = useState(0);
  const [autoplayBlocked, setAutoplayBlocked] = useState(false);
  const filmVideoRef = useRef(null);
  const selectedFilm = IMPACT_FILMS[selectedFilmIndex];

  useEffect(() => {
    const video = filmVideoRef.current;
    if (!video) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          video.muted = true;
          setAutoplayBlocked(false);
          video.play().then(
            () => setAutoplayBlocked(false),
            () => setAutoplayBlocked(true)
          );
        } else {
          video.pause();
        }
      },
      { threshold: 0.5 }
    );

    observer.observe(video);
    return () => observer.disconnect();
  }, [selectedFilm.src]);

  return (
    <div className="bg-white dark:bg-gray-950 text-gray-800 dark:text-gray-100">
      <PageMeta
        title="Real Impact Stories — Families Empowered by Crypto Donations"
        description="See community relief in action: neighbors organize drinking water, family essentials, classroom activities, and practical supply packages."
        path="/impact"
      />
  {/* Header */}
  <section className="page-hero px-6 py-24 sm:py-28 text-white text-center">
  <div className="relative z-10 max-w-4xl mx-auto">
    <p className="mb-4 text-xs font-bold uppercase tracking-[0.18em] text-coral-200" data-aos="fade-up">People, showing up for people</p>
    <h1 className="text-4xl sm:text-5xl md:text-6xl leading-tight" data-aos="fade-up">
      Real Impact, Direct to Families
    </h1>
    <p
      className="mt-4 text-lg max-w-2xl mx-auto opacity-90"
      data-aos="fade-up"
      data-aos-delay="100"
    >
      Relief takes many forms: clean water, family essentials, learning spaces, and neighbors ready to help.
    </p>
  </div>
</section>



      {/* Community story film */}
      <section
        aria-labelledby="impact-film-title"
        className="relative isolate overflow-hidden bg-forest py-16 text-white sm:py-24"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_15%_20%,rgba(220,232,218,0.12),transparent_35%),radial-gradient(ellipse_at_90%_85%,rgba(217,119,88,0.12),transparent_32%)]"
        />
        <div className="relative mx-auto max-w-6xl px-5 sm:px-8">
          <Reveal className="mx-auto max-w-3xl text-center">
            <p className="eyebrow text-sage">A closer look at community care</p>
            <h2
              id="impact-film-title"
              className="mt-4 text-3xl leading-tight text-white sm:text-4xl md:text-5xl"
            >
              Every act of care has a human story.
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-white/75 sm:text-lg">
              See neighbors show up for one another with practical support, shared
              effort, and the small moments that make a lasting difference.
            </p>
          </Reveal>

          <Reveal delay={120} className="mx-auto mt-10 max-w-[36rem] sm:mt-14">
            <div className="mb-4 grid grid-cols-1 gap-2 sm:grid-cols-3" role="group" aria-label="Choose a community story video">
              {IMPACT_FILMS.map((film, index) => {
                const isSelected = selectedFilmIndex === index;

                return (
                  <button
                    key={film.src}
                    type="button"
                    aria-pressed={isSelected}
                    onClick={() => setSelectedFilmIndex(index)}
                    className={`rounded-xl border px-4 py-3 text-left transition duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral focus-visible:ring-offset-2 focus-visible:ring-offset-forest ${
                      isSelected
                        ? "border-sage/60 bg-sage/15 text-white shadow-lg"
                        : "border-white/15 bg-white/[0.04] text-white/75 hover:border-white/35 hover:bg-white/[0.08] hover:text-white"
                    }`}
                  >
                    <span className="block text-[0.65rem] font-bold uppercase tracking-[0.16em] text-sage">
                      Story {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="mt-1 block text-sm font-semibold">{film.label}</span>
                  </button>
                );
              })}
            </div>
            <div className="overflow-hidden rounded-2xl border border-white/15 bg-black shadow-[0_30px_90px_rgba(0,0,0,0.38)] ring-1 ring-white/5 sm:rounded-3xl">
              <video
                key={selectedFilm.src}
                ref={filmVideoRef}
                className="block aspect-[3/4] w-full bg-black object-contain"
                controls
                playsInline
                muted
                preload="metadata"
                aria-label={selectedFilm.title}
              >
                <source src={selectedFilm.src} type="video/mp4" />
                Your browser does not support embedded videos.
              </video>
            </div>
            {autoplayBlocked && (
              <p className="mt-3 text-center text-sm text-white/75" role="status">
                Tap play to watch this video.
              </p>
            )}
            <div aria-live="polite" className="px-2 pt-5 text-center sm:px-4">
              <p className="text-xl font-semibold text-white sm:text-2xl">{selectedFilm.title}</p>
              <p className="mx-auto mt-2 max-w-xl text-sm leading-relaxed text-white/70 sm:text-base">
                {selectedFilm.detail}
              </p>
            </div>
          </Reveal>

          <Reveal delay={220} className="mx-auto mt-8 max-w-4xl text-center sm:mt-10">
            <p className="text-sm leading-relaxed text-white/70 sm:text-base">
              From everyday essentials to moments of learning and connection,
              meaningful support starts with people and reaches them directly.
            </p>
            <div className="mt-5 flex flex-wrap justify-center gap-2">
              {["Everyday essentials", "Learning & play", "Neighbors helping neighbors"].map((item) => (
                <span
                  key={item}
                  className="rounded-full border border-white/15 bg-white/[0.06] px-4 py-2 text-xs font-medium tracking-wide text-sage sm:text-sm"
                >
                  {item}
                </span>
              ))}
            </div>
          </Reveal>
        </div>
      </section>


      {/* Stories grid */}
      <section className="py-16 sm:py-20 bg-paper dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-6 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {STORIES.map((s, i) => (
            <StoryCard key={s.title} s={s} index={i} />
          ))}
        </div>
      </section>

      {/* Feature block with square vendor image & animated layout */}
      <section className="py-14 sm:py-20">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-8 items-center">
          <Reveal className="order-2 md:order-1">
            <div>
              <h2 className="text-3xl font-extrabold text-gray-900 dark:text-gray-100">
                From transfer to transformation
              </h2>
              <p className="mt-4 text-gray-700 dark:text-gray-300">
                From bottled water and baby supplies to learning materials, the most useful support is often wonderfully practical. These moments show neighbors gathering, sorting, and sharing what people can use right away.
              </p>
              <div className="mt-6 flex gap-3">
                <Link
                  to="/donate"
                  className="inline-flex items-center justify-center px-6 py-3 rounded-md bg-coral text-white font-semibold hover:bg-coral-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-950 transition"
                >
                  Donate now
                </Link>
                <Link
                  to="/process"
                  className="inline-flex items-center justify-center px-6 py-3 rounded-full ring-1 ring-gray-300 dark:ring-gray-600 text-gray-800 dark:text-gray-100 font-semibold hover:bg-gray-50 dark:hover:bg-gray-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-950 transition"
                >
                  How it works
                </Link>
              </div>
            </div>
          </Reveal>

          <Reveal delay={150} className="order-1 md:order-2">
            <div className="group relative aspect-[4/3] w-full overflow-hidden rounded-xl shadow-xl ring-1 ring-black/5">
              <img
                src={waterDistribution}
                alt="Volunteers and community members collect bottled water at an outdoor relief distribution"
                className="w-full h-full object-cover motion-safe:transition-transform motion-safe:duration-700 hover:scale-[1.03]"
                loading="lazy"
              />
              <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 to-transparent px-5 pb-5 pt-16">
                <p className="text-sm font-semibold text-white">Water, ready to reach the next person</p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
