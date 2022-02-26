/* global PlugIn Form flattenedTags */
(() => {
  const action = new PlugIn.Action(async function (selection, sender) {
    const lib = this.reorderTagsLibrary
    const syncedPrefs = lib.loadSyncedPrefs()

    // get current preferences or set defaults if they don't yet exist
    const firstTags = lib.getTags('first')
    const lastTags = lib.getTags('last')

    // first form - multi-select
    const firstSelectForm = new Form()
    const firstFlattenedTags = [...firstTags, ...flattenedTags.filter(tag => !firstTags.includes(tag))]
    firstSelectForm.addField(new Form.Field.MultipleOptions('firstTags', 'First Tags', firstFlattenedTags, firstFlattenedTags.map(t => t.name), firstTags))
    await firstSelectForm.show('SELECT FIRST TAGS.\nThese are tags that should be put first when the \'Reorder Tags\' action is run. \nIf more than one tag is selected, you will be able to select the order in the next screen.', 'Continue')

    if (firstSelectForm.values.firstTags.length > 0) {
      const firstOrderForm = lib.reorderForm(firstSelectForm.values.firstTags)
      await firstOrderForm.show('Order First Tags', 'OK')
      const orderedTags = firstOrderForm.fields.map(field => Tag.byIdentifier(field.key))
      syncedPrefs.write('firstTagIDs', orderedTags.map(tag => tag.id.primaryKey))
    } else syncedPrefs.write('firstTagIDs', [])

    


  



  })

  action.validate = function (selection, sender) {
    return true
  }

  return action
})()
