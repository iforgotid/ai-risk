import { load as loadYaml } from "js-yaml";
import markdownIt from "markdown-it";

function parseCsv(contents) {
  const rows = [];
  let row = [];
  let field = "";
  let inQuotes = false;
  const text = String(contents).replace(/^\uFEFF/, "");

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    if (inQuotes) {
      if (char === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i += 1;
        } else {
          inQuotes = false;
        }
      } else {
        field += char;
      }
      continue;
    }
    if (char === '"') {
      inQuotes = true;
    } else if (char === ",") {
      row.push(field);
      field = "";
    } else if (char === "\n" || char === "\r") {
      if (char === "\r" && text[i + 1] === "\n") i += 1;
      row.push(field);
      field = "";
      if (row.some((cell) => cell !== "")) rows.push(row);
      row = [];
    } else {
      field += char;
    }
  }
  if (field.length || row.length) {
    row.push(field);
    if (row.some((cell) => cell !== "")) rows.push(row);
  }

  const [header, ...body] = rows;
  if (!header) return [];
  return body.map((cells) => {
    const record = {};
    header.forEach((key, index) => {
      record[key] = cells[index] ?? "";
    });
    return record;
  });
}

export default function (eleventyConfig) {
  eleventyConfig.addDataExtension("csv", parseCsv);
  eleventyConfig.addDataExtension("yaml,yml", (contents) => loadYaml(contents));

  eleventyConfig.addPassthroughCopy({ "src/css": "css" });
  eleventyConfig.addPassthroughCopy({ "src/favicon.svg": "favicon.svg" });

  eleventyConfig.setLibrary(
    "md",
    markdownIt({
      html: true,
      linkify: false,
      typographer: false,
    })
  );

  eleventyConfig.addFilter("ymd", (value) => {
    if (!value) return "";
    if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}/.test(value)) {
      return value.slice(0, 10);
    }
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return String(value);
    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, "0");
    const day = String(date.getUTCDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  });

  eleventyConfig.addFilter("newestFirst", (items) => {
    return [...(items || [])].sort((a, b) => {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });
  });

  eleventyConfig.addFilter("byDate", (rows) => {
    return [...(rows || [])].sort((a, b) => String(a.date).localeCompare(String(b.date)));
  });

  eleventyConfig.addFilter("whereGroup", (items, group) => {
    return (items || []).filter((item) => item && item.group === group);
  });

  eleventyConfig.addFilter("splitUrls", (value) => {
    if (!value) return [];
    return String(value)
      .trim()
      .split(/\s+/)
      .filter((part) => part.startsWith("http"));
  });

  eleventyConfig.addFilter("docTitle", (title, siteName) => {
    if (!title || title === siteName) return siteName;
    return `${title} · ${siteName}`;
  });

  eleventyConfig.addFilter("coalesce", (description, summary, latestBrief, fallback) => {
    if (description) return description;
    if (summary) return summary;
    if (latestBrief && latestBrief.data && latestBrief.data.summary) return latestBrief.data.summary;
    return fallback || "";
  });

  return {
    pathPrefix: "/ai-risk/",
    markdownTemplateEngine: false,
    htmlTemplateEngine: "njk",
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes",
      data: "_data",
    },
  };
};
