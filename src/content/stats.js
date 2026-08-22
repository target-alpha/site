import { cmsContent, replaceFromCms } from "./cms.js";

export const stats = [
  { value: "1800+", label: "members" },
  { value: "75+", label: "chapters" },
  { value: "4", label: "competitions" }
];

replaceFromCms(stats, cmsContent.stats);
