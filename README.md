# About

This is an Omni Automation plug-in bundle for OmniFocus that adjusts the order that tags are assigned to tasks.

_Please note that all scripts on my GitHub account (or shared elsewhere) are works in progress. If you encounter any issues or have any suggestions please let me know--and do please make sure you backup your database before running scripts from the internet!)_

## Known issues 

Refer to ['issues'](https://github.com/ksalzke/reorder-tags-omnifocus-plugin/issues) for known issues and planned changes/enhancements.

# Installation & Set-Up

## Synced Preferences Plug-In

**Important note: for this plug-in bundle to work correctly, my [Synced Preferences for OmniFocus plug-in](https://github.com/ksalzke/synced-preferences-for-omnifocus) is also required and needs to be added to the plug-in folder separately.**

## Installation

1. Download the [latest release](https://github.com/ksalzke/reorder-tags-omnifocus-plugin/releases/latest).
2. Unzip the downloaded file.
3. Move the `.omnifocusjs` file to your OmniFocus plug-in library folder (or open it to install).
4. If desired, configure your 'first' and 'last' tags using the Preferences action.
5. If desired, install the Keyboard Maestro macro to run the 'Reorder Tags for All Tasks' at a regular interval to keep tags in the desired order.

Note that the when a large number of task have tags that need to be re-ordered (e.g. the first time the 'Reorder Tags for All Tasks' action is run), the action may take a significant period of time to run. Subsequent invocations, when most of the tags are in the correct order, should be much faster.

# Actions

This plug-in contains the following actions:

## Reorder Tags for Selected Task(s)

This action runs the below `reorderTags` function on the selected tasks.

## Reorder Tags for All Tasks

This action runs the below `reorderTags` function on the all tasks in the database.

## Preferences

This action allows the user to set the preferences for the plug-in. These sync between devices using the Synced Preferences plug-in linked above.

The user is prompted by up to four dialogues:

1. Select the tags that should come first in the ordering.
   
2. If more than one tag is selected at Step 1, reorder these tags as desired.
   
3. Select the tags that should come last in the ordering.

4. If more than one tag is selected at Step 3, reorder these tags as desired.


# Functions

This plugin contains the following function within the `reorderTagsLibrary` library:

## `loadSyncedPrefs () : SyncedPref`

Returns the [SyncedPref](https://github.com/ksalzke/synced-preferences-for-omnifocus) object for this plug-in.

If the user does not have the plug-in installed correctly, they are alerted.

## `getTags (position: String) : Array<Tag>`

Given a position ('first' or 'last') returns the array of tags that have been set in preferences to appear in that position.

## `reorderTags (taskArray: Array<Task>)`

Reorders the given tags for each of the tasks in the provided array of tasks.

By default, the order used will be the same as the 'Tags' hierarchy in the database. Editing the preferences allows the user to modify this order by specifying tags that should be applied first or last.

## `reorderForm (tags: Array<Tag>) : Form`

Returns a form that is used by 'Preferences' to allow the user to re-order the provided array of tags.