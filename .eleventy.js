require('dotenv').config();




const yaml = require("js-yaml");
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
  eleventyConfig.addTransform("htmlmin", function(content, outputPath) {
    if (outputPath && outputPath.endsWith(".html")) {
      return htmlmin.minify(content, {
        useShortDoctype: true,
        removeComments: true,
        collapseWhitespace: true
      });
    }
    return content;
  });

  eleventyConfig.addCollection("homepage_slideshow", function(collectionApi) {
    return collectionApi.getFilteredByGlob("homepage_slideshow/*.md");
  });

  eleventyConfig.addCollection("exhibitions", function(collectionApi) {
    return collectionApi
      .getFilteredByGlob("exhibitions/*.md")
      .filter(item => item.data.order !== undefined) // Ensure `order` is defined
      .sort((a, b) => (a.data.order || 0) - (b.data.order || 0)); // Default to 0 if `order` is undefined
  });


  eleventyConfig.addCollection("works", function (collectionApi) {
    return collectionApi
      .getFilteredByGlob("./works/*.md")
      .filter(item => item.data.order !== undefined) // Ensure `order` is defined
      .sort((a, b) => (a.data.order || 0) - (b.data.order || 0)); // Default to 0 if `order` is undefined
  });



  eleventyConfig.addCollection("publications", function(collectionApi) {
    const publications = collectionApi.getFilteredByGlob("publications/*.md");
    return publications;
  });

  eleventyConfig.addCollection("about", function(collectionApi) {
    const about = collectionApi.getFilteredByGlob("about/*.md");
    return about;
  });

  eleventyConfig.addCollection("contact", function(collectionApi) {
    const contact = collectionApi.getFilteredByGlob("contact/*.md");
    return contact;
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
      .sort((a, b) => (a.data.order || 0) - (b.data.order || 0));

  });

  eleventyConfig.addCollection("recent", function(collectionApi) {
    return collectionApi
      .getFilteredByGlob("news/recent/*.md")
      .sort((a, b) => a.data.order - b.data.order);
  });


  // eleventyConfig.addCollection("news", function (collectionApi) {
  //   return collectionApi
  //     .getFilteredByGlob("./news/*.md")
  //     .sort((a, b) => a.data.order - b.data.order); // Sort by 'order' field
  // });


  // Passthrough copy for assets

  eleventyConfig.addPassthroughCopy("styles");

  eleventyConfig.addPassthroughCopy("images");
  eleventyConfig.addPassthroughCopy("*.js");
  eleventyConfig.addPassthroughCopy("admin");

  eleventyConfig.addWatchTarget("styles");


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
