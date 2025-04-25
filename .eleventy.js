
require('dotenv').config();
const { DateTime } = require("luxon");
const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");
const htmlmin = require("html-minifier");
const slugify = require("slugify");


module.exports = function(eleventyConfig) {
  eleventyConfig.addFilter("slugify", function(value) {
    return slugify(value, { lower: true });
  });

  const md = require("markdown-it")({
    html: false,
    breaks: true,
    linkify: true,
  });

    // this allows the markdown to be properly formatted
  eleventyConfig.addNunjucksFilter("markdownify", (markdownString) =>
    md.render(markdownString),
  );



    eleventyConfig.addFilter("split", function(value, delimiter = '/') {
      // Check if value is a string
      if (typeof value === 'string') {
        return value.split(delimiter);
      } else {
        return [];
      }
    });




    // this links the about texts list to the full texts
  eleventyConfig.addFilter('getDocumentBySlug', (collection, slug) => {
    return collection.find(item => item.fileSlug === slug);
  });

  // this parses the text and avoids errors
  eleventyConfig.addFilter("jsonify", function(value) {
    // A custom replacer function to handle circular references
    const seen = new Set();
    return JSON.stringify(value, (key, val) => {
      if (typeof val === "object" && val !== null) {
        if (seen.has(val)) {
          return; // omit circular references
        }
        seen.add(val);
      }
      return val;
    });
  });




  // Add YAML data file support
  eleventyConfig.addDataExtension("yaml", contents => yaml.load(contents));

  // Syntax highlighting for code blocks
  eleventyConfig.addPlugin(syntaxHighlight);

  // Human-readable date filter
  eleventyConfig.addFilter("readableDate", dateObj => {
    return DateTime.fromJSDate(dateObj, { zone: "utc" }).toFormat("dd LLL yyyy");
  });

  // Minify HTML files in production
  const htmlmin = require('html-minifier');
  eleventyConfig.addTransform("htmlmin", function(content, outputPath) {
    if (outputPath && outputPath.endsWith(".html")) {
      try {
        return htmlmin.minify(content, {
          collapseWhitespace: true,
          removeComments: true,
          useShortDoctype: true,
          removeEmptyAttributes: true,
          minifyJS: true,
          minifyCSS: true,
        });
      } catch (e) {
        console.warn("HTML minification failed:", e);
        return content;
      }
    }
    return content;
  });


  eleventyConfig.addCollection("homeImage", function(collectionApi) {
    return collectionApi.getFilteredByGlob("./images/uploads/*.md");
  });

  eleventyConfig.addCollection("homepage_slideshow", function(collectionApi) {
    return collectionApi.getFilteredByGlob("homepage_slideshow/*.md");
  });

  eleventyConfig.addCollection("work", function (collectionApi) {
    return collectionApi.getFilteredByGlob("./work/*.md")

  });




  eleventyConfig.addCollection("workCategories", function (collectionApi) {
    const works = collectionApi.getFilteredByGlob("./work/articles/*.md");
    const categories = collectionApi.getFilteredByGlob("./work/categories/*.md")
    .filter(item => item.data.order !== undefined)
    .sort((a, b) => (a.data.order || 0) - (b.data.order || 0));

    return categories.map((category) => {
      const categorySlug = category.data.slug || eleventyConfig.getFilter("slugify")(category.data.categoryName);

      const associatedWorks = works.filter((work) =>
        work.data.categories?.includes(categorySlug)
    ).sort((a, b) => (a.data.order || 0) - (b.data.order || 0)); // Sort works by order field




      return {
        categoryName: category.data.categoryName,
        slug: categorySlug,
        works: associatedWorks,
      };
    });
  });




  eleventyConfig.addCollection("aboutBackground", function (collectionApi) {
    return collectionApi.getFilteredByGlob("about/background/*.md");
  });

  eleventyConfig.addCollection("aboutSkills", function (collectionApi) {
    return collectionApi.getFilteredByGlob("about/skills/*.md");
  });

  eleventyConfig.addCollection("aboutImage", function (collectionApi) {
    return collectionApi.getFilteredByGlob("images/uploads/*.md");
  });

  eleventyConfig.addCollection("impressum", function(collectionApi) {
    return collectionApi.getFilteredByGlob("content/legal/impressum/*.md");
  });

  eleventyConfig.addCollection("privacy-policy", function(collectionApi) {
    return collectionApi.getFilteredByGlob("content/legal/privacy-policy/*.md");
  });


  // Passthrough copy for assets
  eleventyConfig.addPassthroughCopy("styles/**/*.css");
  eleventyConfig.addPassthroughCopy("images");
  eleventyConfig.addPassthroughCopy("*.js");
  eleventyConfig.addPassthroughCopy("admin");
  eleventyConfig.addPassthroughCopy("styles");
  // eleventyConfig.addPassthroughCopy("images/uploads");


  // Set custom directory structure
  return {
    dir: {
      input: ".",
      includes: "_includes",
      data: "_data",
      output: "_site"
    },
    templateFormats: ["njk", "md"], // Ensure both .njk and .md are processed

    htmlTemplateEngine: "njk", // Use Nunjucks for HTML files
  };

  };
