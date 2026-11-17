# WedWise – Interactive Wedding Planner

A frontend-only wedding planning website built with HTML5, CSS3, jQuery, AngularJS 1.8.2 and browser LocalStorage.

## What's included
- Wedding date setting and automatic days-remaining countdown.
- Budget planner with total budget, estimated cost, actual paid amount, editable expense rows and category limits.
- Automatic overall and category overspending warnings.
- Checklist with editable tasks, due dates, custom reminder dates, priority levels, completion status and timeline milestones.
- Dashboard with countdown, budget status, task progress, alerts and upcoming events.
- Existing venue, guest, vendor and invitation pages are retained.

## Run locally
1. Extract the ZIP.
2. Open the `wedwise` folder in VS Code.
3. Install the Live Server extension (recommended).
4. Right-click `index.html` and choose **Open with Live Server**.
5. Internet is needed for AngularJS, jQuery, Google Fonts and remote venue photos.

You can also open `index.html` directly in a browser.

## Deploy to Vercel
1. Upload the contents of this folder to a GitHub repository.
2. In Vercel, select **Add New → Project** and import the repository.
3. Framework Preset: **Other**.
4. Build Command: leave empty.
5. Output Directory: `.` (or leave empty if accepted).
6. Click **Deploy**.

This is a static frontend project; no build command is required.

## Data storage and reminders
- Entries are saved in browser LocalStorage under `wedwiseData`.
- Data remains in the same browser and device. It is not automatically shared between devices, visitors or browsers.
- Export/backup your browser data before clearing site data. Clearing browser storage can remove your entries.
- Task reminders are displayed inside the website when their reminder date is due or overdue. This version does not send push notifications, SMS or email reminders.
- Venue listings are illustrative sample listings. Add your own real venue information before relying on it.
- Do not enter sensitive personal information into a public demo.
