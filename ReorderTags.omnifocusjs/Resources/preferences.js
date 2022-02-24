/* global PlugIn Form flattenedTags */
(() => {
  const action = new PlugIn.Action(async function (selection, sender) {
    const lib = this.reorderTagsLibrary
    const syncedPrefs = lib.loadSyncedPrefs()

    // get current preferences or set defaults if they don't yet exist
    let firstTags = lib.getTags('first')
    const lastTags = lib.getTags('last')

    // first form - multi-select
    const firstForm = new Form()
    firstForm.addField(new Form.Field.MultipleOptions('firstTags', 'First Tags', flattenedTags, flattenedTags.map(t => t.name), firstTags))
    await firstForm.show('Select First Tags', 'Continue')

    const secondForm = new Form()

    const createFieldsFrom = (tags) => {
      const numbers = [ ...Array(tags.length + 1).keys() ].map( i => i+1);
      
      for (let i = 1; i <= tags.length; i++) {
        const tag = tags[i - 1]
        secondForm.addField(new Form.Field.Option(`${tag.id.primaryKey}-position`, tag.name, numbers, numbers.map(n => n.toString()), i, null)) // TODO: add formatter?
      }
    }

    createFieldsFrom(firstForm.values.firstTags)

    


    secondForm.validate = (form) => {
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
        const orderedTags = firstForm.values.firstTags.sort((t1, t2) => {
          return form.values[`${t1.id.primaryKey}-position`] - form.values[`${t2.id.primaryKey}-position`]
        })
        
        const oldFields = form.fields
        console.log('before adding fields:', form.fields)
        createFieldsFrom(orderedTags)
        console.log('after adding fields:', form.fields)
        
        for (const field of oldFields) form.removeField(field)
        console.log('after removing fields:', form.fields)
        
      }

      return true
    }

    await secondForm.show('Order First Tags', 'OK')




    /*
    // helper function to add fields to the form
    const addFields = () => {
      for (let i = 1; i <= firstTags.length; i++) {
        form.addField(new Form.Field.Option(`firstTag${i}`, `First Tag ${i}`, flattenedTags, flattenedTags.map(t => t.name), firstTags[i - 1]))
      }

      form.addField(new Form.Field.Option(`firstTag${firstTags.length + 1}`, `First Tag ${firstTags.length + 1}`, flattenedTags, flattenedTags.map(t => t.name), null))
    }

    

    // create and show form
    const form = new Form()
    addFields()
    form.validate = form => {

      //const nonNullFields = form.fields.filter(field => form.values[field.key])
      // firstTags = nonNullFields

      const fieldsShowing = form.fields.length

      for (const field of form.fields) {
        // remove if null and not last field
        if (!form.values[field.key] && !field.key.endsWith(fieldsShowing)) form.removeField(field)
      }

      // if last field is not null, add a new one
      if (form.values[field.key] && field.name.endsWith(fieldsShowing)) {
        form.addField(new Form.Field.Option(`firstTag${fieldsShowing + 1}`, `First Tag ${fieldsShowing + 1}`, flattenedTags, flattenedTags.map(t => t.name), null))
      }

      /* const fields = form.fields
      const firstTagFields = Array.from(fields.filter(field => field.key.startsWith('firstTag')))
      const nullFieldExists = firstTagFields.some(field => !form.values[field.key])

      if (!nullFieldExists) {
        form.addField(new Form.Field.Option('firstTag2', 'First Tag 2', flattenedTags, flattenedTags.map(t => t.name)))
        
        
      }

      

      for (const field of firstTagFields) {
         // successfully logging
      }
      */
      //return true
      // TODO: add additional fields

      // TODO: don't include tags that are already in the first or last tag lists

    // }

    // await form.show('Preferences: Reorder Tags', 'OK')

    // TODO: save preferences

  })

  action.validate = function (selection, sender) {
    return true
  }

  return action
})()
