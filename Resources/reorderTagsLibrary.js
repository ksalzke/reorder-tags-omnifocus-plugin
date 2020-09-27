(() => {
  var functionLibrary = new PlugIn.Library(new Version("1.0"));

  functionLibrary.reorderTags = function (taskArray) {
    config = PlugIn.find("com.KaitlinSalzke.reorderTags").library(
      "reorderTagsConfig"
    );

    firstTags = config.firstTags();
    lastTags = config.lastTags();
    ignoredTags = config.ignoredTags();

    // create tag order
    newTagOrder = [];
    newTagOrder.push(firstTags);
    flattenedTags.forEach((tag) => {
      if (
        tag.status === Tag.Status.Active &&
        !firstTags.includes(tag) &&
        !lastTags.includes(tag)
      ) {
        newTagOrder.push(tag);
      }
    });
    newTagOrder.push(lastTags);

    // iterate through tasks
    taskArray.forEach(function (task) {
      // get assigned tags, except for excluded tags
      assignedTags = [];
      task.tags.forEach(function (tag) {
        if (!ignoredTags.includes(tag)) {
          assignedTags.push(tag);
        }
      });

      // sort assigned tags based on tag index
      sortedAssignedTags = assignedTags.sort(function (a, b) {
        return newTagOrder.indexOf(a) > newTagOrder.indexOf(b);
      });

      // remove all tags from task
      task.removeTags(assignedTags);

      // re-apply tags in order
      task.addTags(sortedAssignedTags);
    });
  };

  return functionLibrary;
})();
