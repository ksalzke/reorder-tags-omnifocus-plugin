/* global PlugIn Version flattenedTags Tag */
(() => {
  const functionLibrary = new PlugIn.Library(new Version('1.0'))

  functionLibrary.reorderTags = function (taskArray) {
    const config = PlugIn.find('com.KaitlinSalzke.reorderTags').library(
      'reorderTagsConfig'
    )

    const firstTags = config.firstTags()
    const lastTags = config.lastTags()
    const ignoredTags = config.ignoredTags()

    const middleTags = flattenedTags.filter(tag => ![...firstTags, ...lastTags, ...ignoredTags].includes(tag))

    const newTagOrder = [...firstTags, ...middleTags, ...lastTags]

    // iterate through tasks
    taskArray.forEach(function (task) {
      // get assigned tags, except for excluded tags
      const assignedTags = []
      task.tags.forEach(function (tag) {
        if (!ignoredTags.includes(tag)) {
          assignedTags.push(tag)
        }
      })

      // sort assigned tags based on tag index
      const sortedAssignedTags = assignedTags.sort(function (a, b) {
        return newTagOrder.indexOf(a) > newTagOrder.indexOf(b)
      })

      // remove all tags from task
      task.removeTags(assignedTags)

      // re-apply tags in order
      task.addTags(sortedAssignedTags)
    })
  }

  return functionLibrary
})()
