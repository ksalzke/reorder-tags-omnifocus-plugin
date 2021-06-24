/* global PlugIn */
(() => {
  const action = new PlugIn.Action(function (selection, sender) {
    const functionLibrary = this.reorderTagsLibrary

    functionLibrary.reorderTags(selection.tasks)
  })

  action.validate = function (selection, sender) {
    return selection.tasks.length > 0
  }

  return action
})()
