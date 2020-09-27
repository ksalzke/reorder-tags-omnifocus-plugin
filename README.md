# About

This is an Omni Automation plug-in bundle for OmniFocus that adjusts the order that tags are assigned to tasks.

_Please note that all scripts on my GitHub account (or shared elsewhere) are works in progress. If you encounter any issues or have any suggestions please let me know--and do please make sure you backup your database before running scripts from an amateur on the internet!)_

## Known issues 

None so far! 🤞

# Installation & Set-Up

1. Click on the green `Clone or download` button above to download a `.zip` file of all the files in this GitHub repository.
2. Unzip the downloaded file.
3. Open the configuration file located at `reorderTagsConfig.js` and make any changes needed to reflect your OmniFocus set-up. Further explanations of the options are included within that file as comments.
4. Rename the entire folder to anything you like, with the extension `.omnifocusjs`
5. Move the resulting file to your OmniFocus plug-in library folder.

# Actions

This plug-in contains the following action:

## Reorder Tags

This action runs the below `reorderTags` function on the selected tasks.

# Functions

This plugin contains the following function within the `reorderTagsLibrary` library:

## reorderTags

This function takes an array of tasks as input and reorders the attached tags. 

By default, the order used will be the same as the 'Tags' listing in the database. Editing the  `reorderTagsConfig` file allows the user to modify this order by specifying tags that should be:
* applied first
* applied last, or 
* ignored.