
require('dotenv').config();
const { DateTime } = require("luxon");
const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");
const htmlmin = require("html-minifier");


module.exports = function(eleventyConfig) {

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


  // Add cloudinaryUrl filter
  eleventyConfig.addFilter("cloudinaryUrl", (imagePath) => {
    return `https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload/${imagePath}`;
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


  eleventyConfig.addCollection("homepage_slideshow", function(collectionApi) {
    return collectionApi.getFilteredByGlob("homepage_slideshow/*.md");
  });

  eleventyConfig.addCollection("exhibitions", function(collectionApi) {
    return collectionApi
      .getFilteredByGlob("exhibitions/*.md")
      .filter(item => item.data.order !== undefined)
      .sort((a, b) => (a.data.order || 0) - (b.data.order || 0)); // Default to 0 if `order` is undefined
  });


  eleventyConfig.addCollection("works", function (collectionApi) {
    return collectionApi
      .getFilteredByGlob("./works/*.md")
      .filter(item => item.data.order !== undefined)
      .sort((a, b) => (a.data.order || 0) - (b.data.order || 0));
  });



  eleventyConfig.addCollection("publications", function(collectionApi) {
    const publications = collectionApi.getFilteredByGlob("publications/*.md");
    return publications;
  });

  eleventyConfig.addCollection("about-texts", function(collectionApi) {
    return collectionApi.getFilteredByGlob("about/texts/*.md");
  });


  eleventyConfig.addCollection("about", function(collectionApi) {
    const about = collectionApi.getFilteredByGlob("about/*.md");
    return about;
  });

  eleventyConfig.addCollection("full-texts", function (collectionApi) {
    const fullTexts = collectionApi.getFilteredByGlob("full-texts/*.md");
    console.log('Full Texts Count:', fullTexts.length);
    fullTexts.forEach(text => {
      console.log('Text Slug:', text.data.slug);
      console.log('Text Title:', text.data.title);
    });
    return fullTexts;
  });


  eleventyConfig.addCollection("studio", function(collectionApi) {
    return collectionApi
      .getFilteredByGlob("contact/studio/*.md")
      .filter(item => item.data.order !== undefined) // Ensure `order` is defined
      .sort((a, b) => (a.data.order || 0) - (b.data.order || 0));

  });

  eleventyConfig.addCollection("gallery", function(collectionApi) {
    return collectionApi
    .getFilteredByGlob("contact/gallery/*.md")
    .filter(item => item.data.order !== undefined) // Ensure `order` is defined
    .sort((a, b) => (a.data.order || 0) - (b.data.order || 0));

  });

  eleventyConfig.addCollection("imprint", function(collectionApi) {
    const imprint = collectionApi.getFilteredByGlob("imprint/*.md");
    return imprint;
  });

  eleventyConfig.addCollection("privacy", function(collectionApi) {
    const privacy = collectionApi.getFilteredByGlob("privacy/*.md");
    console.log(privacy);
    return privacy;
  });

  eleventyConfig.addCollection("upcoming", function(collectionApi) {
    return collectionApi
      .getFilteredByGlob("news/upcoming/*.md")
      .sort((a, b) => a.data.order - b.data.order);
  });

  eleventyConfig.addCollection("recent", function(collectionApi) {
    return collectionApi
      .getFilteredByGlob("news/recent/*.md")
      .sort((a, b) => a.data.order - b.data.order);
  });

  eleventyConfig.addCollection("press", function(collectionApi) {
    return collectionApi
      .getFilteredByGlob("news/press/*.md")
      .sort((a, b) => a.data.order - b.data.order);
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
