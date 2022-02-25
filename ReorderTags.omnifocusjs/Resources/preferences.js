/* global PlugIn Form flattenedTags */
(() => {
  const action = new PlugIn.Action(async function (selection, sender) {
    const lib = this.reorderTagsLibrary
    const syncedPrefs = lib.loadSyncedPrefs()

    // get current preferences or set defaults if they don't yet exist
    const firstTags = lib.getTags('first')
    const lastTags = lib.getTags('last')

    // first form - multi-select
    const firstForm = new Form()
    firstForm.addField(new Form.Field.MultipleOptions('firstTags', 'First Tags', flattenedTags, flattenedTags.map(t => t.name), firstTags))
    await firstForm.show('Select First Tags', 'Continue')

    const secondForm = lib.reorderForm(firstForm.values.firstTags)

    await secondForm.show('Order First Tags', 'OK')




    // TODO: save preferences

  })

  action.validate = function (selection, sender) {
    return true
  }

  return action
})()
