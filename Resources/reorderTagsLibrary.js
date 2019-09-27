var _ = (function() {
	var functionLibrary = new PlugIn.Library(new Version("1.0"));

	functionLibrary.reorderTags = function(taskArray) {
		config = PlugIn.find("com.KaitlinSalzke.reorderTags").library(
			"reorderTagsConfig"
		);

		firstTags = config.firstTags();
		lastTags = config.lastTags();
		ignoredTags = config.ignoredTags();

		allTags = flattenedTags;

		// iterate through tasks
		taskArray.forEach(function(task) {
			// get assigned tags, except for excluded tags
			assignedTags = [];
			task.tags.forEach(function(tag) {
				if (!ignoredTags.includes(tag)) {
					assignedTags.push(tag);
				}
			});

			console.log(assignedTags);

			// sort assigned tags based on tag index
			sortedAssignedTags = assignedTags.sort(function(a, b) {
				if (firstTags.includes(a)) {
					aTagOrder = firstTags.indexOf(a);
				} else if (lastTags.includes(a)) {
					aTagOrder = allTags.length + lastTags.indexOf(a) + 1;
				} else {
					aTagOrder = firstTags.length + allTags.indexOf(a);
				}

				if (firstTags.includes(b)) {
					bTagOrder = firstTags.indexOf(b);
				} else if (lastTags.includes(b)) {
					bTagOrder = allTags.length + lastTags.indexOf(b) + 1;
				} else {
					bTagOrder = firstTags.length + allTags.indexOf(b);
				}

				return aTagOrder > bTagOrder;
			});

			// remove all tags from task
			task.removeTags(assignedTags);

			// re-apply tags in order
			task.addTags(sortedAssignedTags);
		});
	};

	return functionLibrary;
})();
_;
