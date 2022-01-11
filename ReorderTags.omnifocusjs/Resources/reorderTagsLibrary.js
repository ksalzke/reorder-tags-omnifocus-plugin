/* global PlugIn Version flattenedTags Tag */
(() => {
  const functionLibrary = new PlugIn.Library(new Version('1.0'))

  functionLibrary.reorderTags = function (taskArray) {
    const config = PlugIn.find('com.KaitlinSalzke.reorderTags').library(
      'reorderTagsConfig'
    )

    const firstTags = config.firstTags()
    const lastTags = config.lastTags()

    const middleTags = flattenedTags.filter(tag => ![...firstTags, ...lastTags].includes(tag))

    const newTagOrder = [...firstTags, ...middleTags, ...lastTags]

    // iterate through tasks
    taskArray.forEach(function (task) {
      // sort assigned tags based on tag index
      const sortedAssignedTags = task.tags.sort(function (a, b) {
        return newTagOrder.indexOf(a) > newTagOrder.indexOf(b)
      })

      // remove all tags from task
      task.removeTags(task.tags)

      // re-apply tags in order
      task.addTags(sortedAssignedTags)
    })
  }

  return functionLibrary
})()
