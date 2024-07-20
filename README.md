This project is in progress and not currently hosted. It's a data management and visualization tool for the [AACT database of clinical trials](https://aact.ctti-clinicaltrials.org/) incorporating and expanding ideas from my time at [TrialTrace](https://demo.trialtrace.com/).

## Stack
- [Next.js](https://nextjs.org/)
- React
- Typescript
- d3.js
- jest
- playwrite
- Tailwind CSS

## Features

### Queries to the AACT database are rendered as an interactive spreadsheet and as data visualizations

![](/public/Fetch.gif)

### Interactive Data Visualisations

![](/public/ResizeAndSelect.gif)

### Realtime data updates
![](/public/UpdateData.gif)

### Ai-enhanced query translation
For users who are not comfortable with SQL, the app uses chatGPT's function calling API to translate natural language requests into queries against the AACT database.

## Roadmap
- Add user accounts and project folders
- Deploy to Vercel
- Add more visualizations
- Add multi-player editing for visualizations and spreadsheets
- Improve AI assistant and add drug discovery.OWL database
- Improve general response time
