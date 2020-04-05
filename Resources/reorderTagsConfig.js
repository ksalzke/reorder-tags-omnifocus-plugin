(() => {
  var reorderTagsConfig = new PlugIn.Library(new Version("1.0"));

  reorderTagsConfig.firstTags = function () {
    return [];
  };
  reorderTagsConfig.lastTags = function () {
    lastTags = [];
    tagNamed("Scheduled").apply((tag) => lastTags.push(tag));
    return lastTags;
  };
  reorderTagsConfig.ignoredTags = function () {
    ignoredTags = [];

    // if sortByImportance plugin is installed, exclude those tags
    sortByImportancePlugin = PlugIn.find("com.KaitlinSalzke.sortByImportance");
    if (sortByImportancePlugin !== null) {
      sortByImportanceConfig = sortByImportancePlugin.library(
        "sortByImportanceConfig"
      );
      ignoredTags.push(
        sortByImportanceConfig.sortedTag(),
        sortByImportanceConfig.parentSortTag(),
        sortByImportanceConfig.backupCopyTag()
      );
    }
    console.log(ignoredTags);
    return ignoredTags;
  };

  return reorderTagsConfig;
})();
