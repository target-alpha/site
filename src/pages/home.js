import { homePageContent } from "../content/site.js";
import { stats } from "../content/stats.js";
import { events } from "../content/events.js";
import { ArrowLink, SectionHeading } from "../components/primitives.js";
import { escapeHtml, paragraphs, responsiveImage } from "../components/html.js";

const sectionId = (section, fallback) => `${fallback}-${String(section._key || "section").replace(/[^a-z0-9_-]/gi, "-")}`;
const optionalLink = (section, className = "text-link") => section.linkLabel && section.href
  ? ArrowLink(section.linkLabel, section.href, className)
  : "";

function Hero() {
  const hero = homePageContent.hero;
  const images = (hero.images || []).filter(({ src }) => src).slice(0, 3);
  const imageClasses = ["one", "two", "three"];

  return `<section class="home-hero">
    <div class="home-hero__masthead" aria-label="Target Alpha">
      <span class="home-hero__meta">Canada / Since 2013</span>
      <h1><span>Target</span><span>Alpha</span></h1>
      <div class="home-hero__alpha" aria-hidden="true">α</div>
    </div>
    <div class="home-hero__thesis">
      <p>${escapeHtml(hero.statement)}</p>
      ${hero.ctaLabel && hero.ctaHref ? ArrowLink(hero.ctaLabel, hero.ctaHref, "button-link") : ""}
    </div>
    <div class="home-hero__collage home-hero__collage--${images.length}">
      ${images.map((image, index) => `<figure class="home-hero__image home-hero__image--${imageClasses[index]}">${responsiveImage({ src: image.src, alt: image.imageAlt || "Target Alpha event", eager: index < 2 })}</figure>`).join("")}
      <span class="home-hero__caption">Financial literacy / real-time competition / nationwide chapters</span>
    </div>
  </section>`;
}

function EventAnnouncement(section) {
  if (!section.title || !section.href) return "";
  const titleId = sectionId(section, "home-event-title");
  const metaItems = [["Date", section.date], ["Location", section.location]].filter(([, value]) => value);

  return `<section class="home-event-bulletin" aria-labelledby="${titleId}">
    <div class="home-event-bulletin__signal">
      <div class="home-event-bulletin__live"><span aria-hidden="true"></span>Event bulletin</div>
      <strong>${escapeHtml(section.eventType || "Event")}</strong>
      ${section.status ? `<p>${escapeHtml(section.status)}</p>` : ""}
    </div>
    <div class="home-event-bulletin__content">
      <p class="eyebrow">Event information</p>
      <h2 id="${titleId}">${escapeHtml(section.title)}</h2>
      ${section.details ? `<p>${escapeHtml(section.details)}</p>` : ""}
    </div>
    <div class="home-event-bulletin__meta">
      ${metaItems.length ? `<dl>${metaItems.map(([label, value]) => `<div><dt>${label}</dt><dd>${escapeHtml(value)}</dd></div>`).join("")}</dl>` : ""}
      ${optionalLink({ ...section, linkLabel: section.linkLabel || "View event" }, "button-link")}
    </div>
  </section>`;
}

function StatsSection(section) {
  return `<section class="home-ledger" aria-label="Target Alpha at a glance">
    ${stats.map((stat) => `<div class="home-ledger__item"><strong>${escapeHtml(stat.value)}</strong><span>${escapeHtml(stat.label)}</span></div>`).join("")}
    ${section.summary ? `<p>${escapeHtml(section.summary)}</p>` : ""}
  </section>`;
}

function AboutSection(section) {
  return `<section class="home-about section-space">
    ${SectionHeading({ eyebrow: section.eyebrow || "About us", title: section.title || "About Target Alpha" })}
    <div class="home-about__copy">
      ${section.body ? `<p>${escapeHtml(section.body)}</p>` : ""}
      ${optionalLink(section)}
    </div>
    ${section.yearValue ? `<div class="home-about__year"><span>${escapeHtml(section.yearLabel || "Founded")}</span><strong>${escapeHtml(section.yearValue)}</strong></div>` : ""}
  </section>`;
}

function EventsSection(section) {
  return `<section class="home-events section-space">
    <div class="home-events__intro">
      ${SectionHeading({ eyebrow: section.eyebrow || "Our events", title: section.title || "Events", body: section.body || "" })}
      ${optionalLink(section)}
    </div>
    <div class="home-events__list">
      ${events.map((event, index) => `<a class="home-event-row" href="/events#${event.slug}" data-route-link>
        <span>${String(index + 1).padStart(2, "0")}</span>
        <strong>${escapeHtml(event.acronym)}</strong>
        <h3>${escapeHtml(event.fullTitle)}</h3>
        <i aria-hidden="true">↗</i>
      </a>`).join("")}
    </div>
  </section>`;
}

function ChapterSection(section) {
  return `<section class="home-chapter section-space">
    <div class="home-chapter__stamp" aria-hidden="true">${escapeHtml(section.stamp || "75+")}</div>
    <div class="home-chapter__copy">
      <p class="eyebrow">${escapeHtml(section.eyebrow || "Start a chapter")}</p>
      <h2>${escapeHtml(section.title || "Lead financial literacy in your community.")}</h2>
      ${section.body ? `<p>${escapeHtml(section.body)}</p>` : ""}
      ${optionalLink(section, "button-link button-link--light")}
    </div>
    ${section.image || section.imageUrl ? `<figure>${responsiveImage({ src: section.image || section.imageUrl, alt: section.imageAlt || "Target Alpha chapter members" })}</figure>` : ""}
  </section>`;
}

function FlexibleSection(section) {
  const themes = new Set(["paper", "green", "sage"]);
  const theme = themes.has(section.theme) ? section.theme : "paper";
  const titleId = sectionId(section, "home-flex-title");

  return `<section class="home-flex-section home-flex-section--${theme} section-space" aria-labelledby="${titleId}">
    <div class="home-flex-section__copy">
      ${section.eyebrow ? `<p class="eyebrow">${escapeHtml(section.eyebrow)}</p>` : ""}
      <h2 id="${titleId}">${escapeHtml(section.title)}</h2>
      ${section.body ? `<div class="home-flex-section__body">${paragraphs(section.body)}</div>` : ""}
      ${optionalLink(section, theme === "green" ? "button-link button-link--light" : "button-link")}
    </div>
    ${section.image || section.imageUrl ? `<figure>${responsiveImage({ src: section.image || section.imageUrl, alt: section.imageAlt || "" })}</figure>` : ""}
  </section>`;
}

const sectionRenderers = {
  homeEventAnnouncement: EventAnnouncement,
  homeStatsSection: StatsSection,
  homeAboutSection: AboutSection,
  homeEventsSection: EventsSection,
  homeChapterSection: ChapterSection,
  homeFlexibleSection: FlexibleSection
};

export function HomePage() {
  const sections = (homePageContent.sections || [])
    .filter((section) => section?.enabled !== false)
    .map((section) => sectionRenderers[section._type]?.(section) || "")
    .join("");

  return `${Hero()}${sections}`;
}
