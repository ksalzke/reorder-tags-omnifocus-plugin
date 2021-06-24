/* global PlugIn Version tagsMatching */
(() => {
  const reorderTagsConfig = new PlugIn.Library(new Version('1.0'))

  reorderTagsConfig.firstTags = function () {
    // edit the below to specify the tags that should be applied first
    // THIS SHOULD BE AN ARRAY OF TAG OBJECTS
    const firstTags = []
    firstTags.concat(tagsMatching('Checklists')[0].flattenedTags)
    firstTags.concat(tagsMatching('Dependency')[0].flattenedTags)
    return firstTags
  }

  reorderTagsConfig.lastTags = function () {
    // edit the below to specify the tags that should be applied last
    // THIS SHOULD BE AN ARRAY OF TAG OBJECTS
    const lastTags = []
    lastTags.concat(tagsMatching('Scheduled')[0].flattenedTags)
    lastTags.concat(tagsMatching('⠀')[0])
    return lastTags
  }
  reorderTagsConfig.ignoredTags = function () {
    // edit the below to specify the tags that should be ignored
    // THIS SHOULD BE AN ARRAY OF TAG OBJECTS
    const ignoredTags = []
    return ignoredTags
  }

  return reorderTagsConfig
})()
