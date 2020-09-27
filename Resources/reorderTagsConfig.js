(() => {
  var reorderTagsConfig = new PlugIn.Library(new Version("1.0"));

  reorderTagsConfig.firstTags = function () {
    firstTags = [];
    firstTags.concat(
      tagNamed("Helper Tags").tagNamed("Checklists").flattenedTags
    );
    firstTags.concat(
      tagNamed("Helper Tags").tagNamed("Dependency").flattenedTags
    );
    return firstTags;
  };
  reorderTagsConfig.lastTags = function () {
    lastTags = [];
    lastTags.concat(tagNamed("Scheduled").flattenedTags);
    lastTags.concat(
      tagNamed("Helper Tags").tagNamed("Tags Complete").tagNamed("⠀")
    );
    return lastTags;
  };
  reorderTagsConfig.ignoredTags = function () {
    ignoredTags = [];
    return ignoredTags;
  };

  return reorderTagsConfig;
})();
