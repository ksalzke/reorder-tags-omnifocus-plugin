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
    else return tagIDs.map(id => Tag.byIdentifier(id)).filter(tag => tag !== null)
  }

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

  functionLibrary.reorderForm = (tags) => {

    const createFieldsFrom = (tags) => {
      const numbers = [...Array(tags.length + 1).keys().map(i => i+1) ];
      for (let i = 1; i <= tags.length; i++) {
        const tag = tags[i - 1]
        const key = `${tag.id.primaryKey}-position`
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
          return form.values[`${t1.id.primaryKey}-position`] - form.values[`${t2.id.primaryKey}-position`]
        })
        createFieldsFrom(orderedTags)
      }
      return true
    }

    return form

  }

  return functionLibrary
})()
