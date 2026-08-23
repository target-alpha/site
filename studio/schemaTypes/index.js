import { team } from "./team.js";
import { event, judge, newsItem, partner, sponsor, stat } from "./collections.js";
import { siteSettings } from "./siteSettings.js";
import {
  homeAboutSection,
  homeChapterSection,
  homeEventAnnouncement,
  homeEventsSection,
  homeFlexibleSection,
  homeHero,
  homePage,
  homeStatsSection
} from "./homePage.js";

export const schemaTypes = [
  homePage,
  homeHero,
  homeEventAnnouncement,
  homeStatsSection,
  homeAboutSection,
  homeEventsSection,
  homeChapterSection,
  homeFlexibleSection,
  siteSettings,
  team,
  event,
  judge,
  newsItem,
  stat,
  sponsor,
  partner
];
