# Doss take-home technical challenge

Getting Started:

1. Make sure you have NodeJS, npm, and yarn installed on your local machine.
2. Run `yarn install` from `src/web` and `web/api`.
3. Run `yarn start` from the root directory and the frontend should open at `localhost:3000`.
4. Open `localhost:3000/readme`.

# Details

This project contains a frontend and backend, with data stored in a JSON file.

- `src/web` contains all frontend files, with UI classes under the `components` direction and CSS in `style`. The class `api.ts` should contain
  client-side functions for interacting with the backend API.
- `src/api` contains all backend classes. API endpoints are defined in `app.ts`, functions for managing invoice and project data are in `util.ts`,
  and generic utility functions for interacting with the JSON data file are in `db/db.ts`.

# Useful Commands

To run prettier, run `yarn prettier`.
To run eslint, run `yarn eslint`.
To run tests, run `yarn test --watchAll=false`.

# UI Flow

1. Open `localhost:3000/`.
2. Displays a list of Workspaces as cards with `chevronRight` icon acting as CTA to Workspace dashboard.
3. Clicking `Create Workspace` button will display a input element with add button. Entering the title and clicking on `Add` will create a new workspace and append the created workspace to the list.
4. Clicking on the `chevronRight` icon will take you to workspace dashboard which in turn lists down the builds associated in that workspace.
5. `Inline editing` is enabled on this page for the Workspace title which will enable user to edit Workspace title.
6. Clicking `Create Build` button will display a input element with add button. Entering the build number and clicking on `Add` will create a new build with dummy shipment and append the created build to the list.
7. Clicking on the `chevronRight` icon will take you to shipment dashboard which displays all the shipments associated with that particular build in a tabular format.
8. `Add new Row` button will add a new shipment record to the table.
9. `Inline editing` is enabled on this page for the Build Number title which will enable user to edit Build Number inplace.
10. `Back` CTA on each page facilitates going back to previous page.
