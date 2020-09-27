(() => {
  var reorderTagsConfig = new PlugIn.Library(new Version("1.0"));

  reorderTagsConfig.firstTags = function () {
    // edit the below to specify the tags that should be applied first
    // THIS SHOULD BE AN ARRAY OF TAG OBJECTS
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
    // edit the below to specify the tags that should be applied last
    // THIS SHOULD BE AN ARRAY OF TAG OBJECTS
    lastTags = [];
    lastTags.concat(tagNamed("Scheduled").flattenedTags);
    lastTags.concat(
      tagNamed("Helper Tags").tagNamed("Tags Complete").tagNamed("⠀")
    );
    return lastTags;
  };
  reorderTagsConfig.ignoredTags = function () {
    // edit the below to specify the tags that should be ignored
    // THIS SHOULD BE AN ARRAY OF TAG OBJECTS
    ignoredTags = [];
    return ignoredTags;
  };

  return reorderTagsConfig;
})();
