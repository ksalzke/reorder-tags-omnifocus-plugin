/* global PlugIn Version flattenedTags Tag */
(() => {
  const functionLibrary = new PlugIn.Library(new Version('1.0'))


  functionLibrary.loadSyncedPrefs = () => {
    const syncedPrefsPlugin = PlugIn.find('com.KaitlinSalzke.SyncedPrefLibrary')

    if (syncedPrefsPlugin !== null) {
      const SyncedPref = syncedPrefsPlugin.library('syncedPrefLibrary').SyncedPref
      return new SyncedPref('com.KaitlinSalzke.reorderTags')
    } else {
      const alert = new Alert(
        'Synced Preferences Library Required',
        'For the \'Reorder Tags\' plug-in to work correctly, the \'Synced Preferences for OmniFocus\' plug-in (https://github.com/ksalzke/synced-preferences-for-omnifocus) is also required and needs to be added to the plug-in folder separately. Either you do not currently have this plugin installed, or it is not installed correctly.'
      )
      alert.show()
    }
  }

  functionLibrary.getTags = (position) => {
    const syncedPrefs = functionLibrary.loadSyncedPrefs()
    const tagIDs = syncedPrefs.read(`${position}TagIDs`)
    if (tagIDs === null) return []
    const tags = tagIDs.map(id => Tag.byIdentifier(id)).filter(tag => tag !== null)
    if (position === 'first') return tags
    // exclude tags that are already in the 'first' list from being included as 'last' tags
    else if (position === 'last') return tags.filter(tag => !functionLibrary.getTags('first').includes(tag))
  }

  functionLibrary.reorderTags = taskArray => {

    const firstTags = functionLibrary.getTags('first').flatMap(tag => [tag, ...tag.flattenedChildren])
    const lastTags = functionLibrary.getTags('last').flatMap(tag => [tag, ...tag.flattenedChildren])

    const middleTags = flattenedTags.filter(tag => ![...firstTags, ...lastTags].includes(tag))

    const newTagOrder = [...firstTags, ...middleTags, ...lastTags]

    // iterate through tasks
    for (const task of taskArray) {
      // sort assigned tags based on tag index
      const sortedAssignedTags = task.tags.sort(function (a, b) {
        return newTagOrder.indexOf(a) > newTagOrder.indexOf(b)
      })

      // check if already sorted
      const tagsSorted = (task) => {
        for (let i = 0; i < task.tags.length; i++) {
          if (task.tags[i] !== sortedAssignedTags[i]) return false
        }
        return true
      }

      // if not already sorted, remove and re-add tags
      if (!tagsSorted(task)) {
        // remove all tags from task
        task.removeTags(task.tags)

        // re-apply tags in order
        task.addTags(sortedAssignedTags)
      }
    }
  }

  functionLibrary.reorderForm = (tags) => {
    const createFieldsFrom = (tags) => {
      const numbers = [...Array(tags.length).keys()].map(i => i+1)
      for (let i = 1; i <= tags.length; i++) {
        const tag = tags[i - 1]
        const key = tag.id.primaryKey
        const existingField = form.fields.find(field => field.key === key)
        if (existingField !== undefined) form.removeField(existingField)
        form.addField(new Form.Field.Option(key, tag.name, numbers, numbers.map(n => n.toString()), i, null))
      }
    }

    const form = new Form()
    createFieldsFrom(tags)

    form.validate = (form) => {
      const hasChanged = (form) => {
        for (let i = 1; i <= form.fields.length; i++) {
          const field = form.fields[i - 1]
          const fieldKey = field.key
          const fieldValue = form.values[fieldKey]
          if (fieldValue !== i & fieldValue !== undefined) return true
        }
        return false
      }

      if (hasChanged(form)) {
        // update ordering
        const orderedTags = tags.sort((t1, t2) => {
          const t1newPosition = form.values[t1.id.primaryKey]
          const t2newPosition = form.values[t2.id.primaryKey]

          // if new positions are different, put in correct order
          if (t1newPosition !== t2newPosition) return t1newPosition - t2newPosition

          // otherwise, one of the two tags has been changed (new position is the same)

          // which tag is the one that has been changed?
          const t1field = form.fields.find(field => field.key === t1.id.primaryKey)
          const t1oldPosition = form.fields.indexOf(t1field) + 1
          const t1changed = t1oldPosition !== t1newPosition
          const changedTag = t1changed ? t1: t2

          // for the changed tag, compare the old and new positions
          const oldField = form.fields.find(field => field.key === changedTag.id.primaryKey)
          const oldPos = form.fields.indexOf(oldField) + 1
          const newPos = form.values[changedTag.id.primaryKey]

          // sort - if new position > old position, unchanged tag first; else changed tag first
          if (newPos > oldPos && t1changed) return 1
          if (newPos > oldPos && !t1changed) return -1
          if (newPos < oldPos && t1changed) return -1
          if (newPos < oldPos && !t1changed) return 1
        })
        createFieldsFrom(orderedTags)
      }
      return true
    }

    return form
  }

  return functionLibrary
})()
