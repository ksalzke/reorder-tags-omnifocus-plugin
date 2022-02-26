/* global PlugIn flattenedTasks */
(() => {
  const action = new PlugIn.Action(function (selection, sender) {
    const functionLibrary = this.reorderTagsLibrary

    functionLibrary.reorderTags(flattenedTasks)
  })

  action.validate = function (selection, sender) {
    return true
  }

  return action
})()
