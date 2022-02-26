/* global PlugIn Form flattenedTags */
(() => {
  const action = new PlugIn.Action(async function (selection, sender) {
    const lib = this.reorderTagsLibrary
    const syncedPrefs = lib.loadSyncedPrefs()

    // get current preferences or set defaults if they don't yet exist
    const firstTags = lib.getTags('first')
    const lastTags = lib.getTags('last')

    // configure a set of tags
    const configureTags = async (position, formPrompt) => {
      const startingTags = lib.getTags(position)
      const selectForm = new Form()
      const positionTitleCase = position.charAt(0).toUpperCase() + position.substr(1).toLowerCase()
      const tags = [...startingTags, ...flattenedTags.filter(tag => !startingTags.includes(tag))]
      selectForm.addField(new Form.Field.MultipleOptions('tags', `Select ${positionTitleCase} Tags`, tags, tags.map(t => t.name), startingTags))
      await selectForm.show(formPrompt, 'Continue')

      if (selectForm.values.tags.length > 1) {
        const orderForm = lib.reorderForm(selectForm.values.tags)
        await orderForm.show(`Order ${positionTitleCase} Tags`, 'OK')
        const orderedTags = orderForm.fields.map(field => Tag.byIdentifier(field.key))
        syncedPrefs.write(`${position}TagIDs`, orderedTags.map(tag => tag.id.primaryKey))
      } else syncedPrefs.write(`${position}TagIDs`, selectForm.values.tags.map(tag => tag.id.primaryKey))
    }

    await configureTags('first', 'SELECT FIRST TAGS.\nThese are tags that should be put first when the \'Reorder Tags\' action is run. \nIf more than one tag is selected, you will be able to select the order in the next screen.')


  })

  action.validate = function (selection, sender) {
    return true
  }

  return action
})()
