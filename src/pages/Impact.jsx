// src/pages/Impact.jsx
import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

// ---- Local image imports (place these files under src/assets/...) ----
import storyCashExchange from "../assets/storyCashExchange.png";
import storyManPhoneCash from "../assets/storyManPhoneCash.png";
import storyBananaHead from "../assets/storyBananaHead.png";
import storyVendorSquare from "../assets/storyVendorSquare.png";

// (Optional) If you have a placeholder image, import and use it in onImgError.
// import placeholder from "../assets/images/placeholder.jpg";

// Fallback so broken/missing images won't break layout
const onImgError = (e) => {
  e.currentTarget.onerror = null;
  e.currentTarget.src = storyVendorSquare; // or placeholder
};

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
          : "opacity-0 translate-y-6",
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
    img: storyCashExchange,
    badge: "East Africa",
    name: "Adah",
    title: "Investing in a micro-business",
    quote:
      "It wasn’t a handout. It was a seed. We invested, and now we can plan ahead.",
    detail:
      "Adah bought initial inventory, set aside school fees, and built a small savings cushion.",
  },
  {
    img: storyManPhoneCash,
    badge: "West Africa",
    name: "Kassim",
    title: "Paying debts & buying tools",
    quote:
      "The money arrived on my phone. I paid debts and bought tools to grow my income.",
    detail:
      "Delivered via mobile money—fast access, fewer fees, and no long trips or paperwork.",
  },
  {
    img: storyBananaHead,
    badge: "East Africa",
    name: "Amina",
    title: "Diversifying a market stall",
    quote:
      "We added products and now earn steadily—even in the slow season.",
    detail:
      "Choice let Amina expand what mattered most for her family’s resilience.",
  },
];

/* ------------------------------------------------------------
   Card with hover overlay
------------------------------------------------------------ */
const StoryCard = ({ s, index }) => (
  <Reveal delay={index * 100}>
    <article className="group relative rounded-2xl overflow-hidden bg-white shadow-sm hover:shadow-lg transition-shadow">
      {/* Image */}
      <div className="aspect-[4/3] w-full overflow-hidden">
        <img
          src={s.img}
          onError={onImgError}
          alt={`${s.name} — ${s.badge}`}
          className="w-full h-full object-cover motion-safe:transition-transform motion-safe:duration-700 group-hover:scale-[1.05]"
          loading="lazy"
        />
      </div>

      {/* Top-left badge */}
      <div className="absolute top-3 left-3">
        <span className="inline-block rounded-full bg-black/60 text-white text-xs font-semibold px-3 py-1 backdrop-blur-sm">
          {s.badge}
        </span>
      </div>

      {/* Hover overlay with description */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 motion-safe:transition-opacity duration-300" />

      <div className="absolute inset-x-0 bottom-0 p-5">
        <div className="motion-safe:transition-all duration-500 translate-y-4 opacity-0 group-hover:opacity-100 group-hover:translate-y-0">
          <h3 className="text-white text-lg font-bold drop-shadow-sm">
            {s.name} — {s.title}
          </h3>
          <p className="mt-1 text-white/90 text-sm line-clamp-3">
            {s.detail}
          </p>
        </div>
      </div>

      {/* Static content under image (visible even without hover) */}
      <div className="p-5">
        <blockquote className="text-gray-800 italic">
          “{s.quote}”
        </blockquote>
      </div>
    </article>
  </Reveal>
);

/* ------------------------------------------------------------
   Page component
------------------------------------------------------------ */
export default function Impact() {
  return (
    <div className="bg-white text-gray-800">
  {/* Header */}
  <section className="relative py-28 px-6 text-white bg-green-700 text-center">
  <div className="absolute inset-0 bg-black/20"></div>
  <div className="relative z-10 max-w-4xl mx-auto">
    <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight" data-aos="fade-up">
      Real Impact, Direct to Families
    </h1>
    <p
      className="mt-4 text-lg max-w-2xl mx-auto opacity-90"
      data-aos="fade-up"
      data-aos-delay="100"
    >
      Your crypto donations arrive as cash transfers people can use for
      what they need most—food, school, tools, or savings. Hover over
      each story to see the details.
    </p>
  </div>
</section>



      {/* Stories grid */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-6 grid gap-10 md:grid-cols-3">
          {STORIES.map((s, i) => (
            <StoryCard key={s.name} s={s} index={i} />
          ))}
        </div>
      </section>

      {/* Feature block with square vendor image & animated layout */}
      <section className="py-10">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-8 items-center">
          <Reveal className="order-2 md:order-1">
            <div>
              <h2 className="text-3xl font-extrabold text-gray-900">
                From transfer to transformation
              </h2>
              <p className="mt-4 text-gray-700">
                Direct giving respects people’s choices. We verify recipients,
                measure outcomes, and share results—so you can see the
                difference your donation makes.
              </p>
              <div className="mt-6 flex gap-3">
                <Link
                  to="/donate"
                  className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-green-600 text-white font-semibold hover:bg-green-700 transition"
                >
                  Donate now
                </Link>
                <Link
                  to="/process"
                  className="inline-flex items-center justify-center px-6 py-3 rounded-full ring-1 ring-gray-300 text-gray-800 font-semibold hover:bg-gray-50 transition"
                >
                  How it works
                </Link>
              </div>
            </div>
          </Reveal>

          <Reveal delay={150} className="order-1 md:order-2">
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl shadow">
              <img
                src={storyVendorSquare}
                onError={onImgError}
                alt="Smiling market vendor"
                className="w-full h-full object-cover motion-safe:transition-transform motion-safe:duration-700 hover:scale-[1.03]"
                loading="lazy"
              />
              {/* subtle gradient border on hover */}
              <div className="pointer-events-none absolute inset-0 rounded-2xl ring-0 group-hover:ring-4" />
              <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-black/5" />
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
