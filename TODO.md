# UI/UX + Functionality changes/fixes/additions

## Dashboard page:
No Changes

## Group Chat page:
No Changes

## Specbot Chat:
1. New layout for roles other than clients:
    1. In root page.jsx, use PageBanner at top, then a row of relevant stat cards, followed by SearchCreateHeader(don't show button in this case) and a table with data and actions.
    2. Actions would include: Download, extract and summarize features.

2. Client message should show client's profile pic and username, not hardcoded User string. There can be many clients in a project so we have to save the info in db in this case.
3. Allow only copy action on a message. right now clicking it gives error: Runtime TypeError: setMenuOpenId is not a function
4. Replace 'SpecBot' text from the sidebar in specbot/page.jsx with a relevant emoji.
5. Track new messages in specbot chat to prevent downloading/extracting/summarizing it every single time. For example, if manager/engineer downloads it once and then there is no new message after that it means there is no need to download/extract/summarize it again. You can use last messages date and download/extract/summarize. In this case clicking those buttons should show already present info instead of computing.
6. When import requirements is clicked use the Confirmation Component instead if alert.

## Meetings
1. Create a separate page to show the recording/transcript/Extraction feature+requirements. Tabs on left and content on right just like on user settings page.
2. Use Confirmation component for confirmations such as deleting a meeting. 
3. Title is must for a meeting, ensure it on fe/be/db.
4. time+date of a meeting should be asked and is editable, ensure that.

## Feedback
1. Use Confirmation Component for confirmations.
2. Show feedback form title in the bread crumb not id from the db
3. Hovering on eye icon says "view", change it to "responses"
4. respomse preview shows "Question<number_here>", not the exact question.

## Legal feasibility
No changes

## Economic feasibility
1. Truncate requirement description after a few words to avoid incresing the width of the table. 
2. In results tab the graph text is not visible in dark mode.

## Technical feasibility
1. Update the UI; show results in a popup, keep good UI/UX and show reqd in a paginagted table similar to table on legal feasb. page.

## Prototyping
1. Show only 2 stat cards: Total prototypes and Total Screens
2. Show Confirmation before deleting.
3. It takes a couple of secs to load the the editor, optimize it.
4. Show prototype title instead of id in the breadcrumb.

## Verification
1. For IEEE AI Analysis: AI Reasoning Feedback is not formatted for each characteristic we are checking for.
2. Running verification check for all reqs. at once says "failed to parse the output." Use a standard for LLM input and output to avoid this.

## Diagrams
1. Show diagram title instead of id in the breadcrumb
2. On the editor add a button to view guidlines/syntax for creating mermaid diagrams, help.
3. Allow user to zoom in/out for the generated diagram. Also, the ability to move around.
4. Add Confirmation comp when deleting. 
5. Add the feature to link a diagram to requirements, just like the one in prototyping.

## Docs
1. There must be only 1 SRS type doc
2. Add Confirmation before deletion
3. Show doc title instead of id
4. Add the feature to link a doc to requirements, just like the one in prototyping.
5. 4th stat card should show general note count

## Requirements
1. Show 4 reqs. per table page.
2. Use Confirmation comp, not alert.

## Settings
1. Fetch and show Team members when that tab is selected.

## Users
1. Manager count stat cards icon ain't visible in dark mode.
2. Show icons in action column to maintain consistency accross the app for table UI/UX 
3. In role column, some chips text is not visible in dark mode.

## RBAC 
No changes

## Profile
1. Disable username change, similar to what is done on role field

## Sidebar
1. In sidebar, switching project should refresh the current page not take the user to dashboard. It should also update the state so that the page's data is updated for the newly swutched project. If this can be done without refreshing then that is better. 
