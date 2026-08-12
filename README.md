# WEB103 Prework - *Creatorverse*

Submitted by: **BIngram17**

About this web app: **Creatorverse is a curated field guide to online creators worth following. Users can browse creator cards, open a unique profile for each creator, visit their channel, and add, edit, or remove recommendations.**

Time spent: 11 hours

## Live Demo

- [Creatorverse on Azure](https://brave-water-0ab07af10.7.azurestaticapps.net/)
- [GitHub repository](https://github.com/BIngram17/creatorverse)

## Tech Stack

- React 19
- Vite through Vinext
- React Router with `useRoutes`
- Supabase and `@supabase/supabase-js`
- PicoCSS
- Custom responsive CSS
- Azure Static Web Apps with GitHub Actions CI/CD

## Project Requirement Audit

| Course requirement | Implementation |
| --- | --- |
| Vite + React project | The app builds with Vite/Vinext and uses React components throughout. |
| Supabase database | A live `creators` table stores `name`, `url`, `description`, `imageURL`, category, and timestamps. |
| Supabase client | `src/client.js` initializes and exports the Supabase client using public environment variables. |
| RLS disabled | Disabled as directed by the WEB103 prework. See the security note below. |
| Realtime enabled | The `creators` table is included in the `supabase_realtime` publication. |
| Pages and components | Separate list, detail, add, and edit components are rendered through dedicated routes. |
| React Router routes | `useRoutes` defines `/`, `/add`, `/creator/:id`, and `/creator/:id/edit`. |
| View all creators | The homepage loads and maps every creator returned by Supabase. |
| View one creator | Every card links to a detail view that fetches its creator by ID. |
| Add a creator | The add form inserts a new Supabase row and navigates to its unique detail URL. |
| Update a creator | The edit form preloads the creator and updates its Supabase row. |
| Delete a creator | The detail view includes a confirmation dialog and deletes the selected row. |
| Empty database state | A dedicated message and add button appear when there are no creators. |

## Required Features

The following **required** functionality is completed:

- [x] **A logical component structure in React is used to create the frontend of the app**
- [x] **React Router and `useRoutes` define the main, add, detail, and edit routes**
- [x] **At least five content creators are displayed on the homepage of the app**
- [x] **Each content creator item includes their name, a link to their channel/page, and a short description of their content**
- [x] **API calls use the async/await design pattern through the Supabase JavaScript client (which uses fetch)**
- [x] **Clicking on a content creator item takes the user to their details page, which includes their name, URL, and description**
- [x] **Each content creator has their own unique URL**
- [x] **The user can edit a content creator to change their name, URL, or description**
- [x] **The user can delete a content creator**
- [x] **The user can add a new content creator by entering a name, URL, and description, after which it is displayed on the homepage**

The following **optional** features are implemented:

- [x] PicoCSS is used to style semantic HTML elements and form controls
- [x] The content creator items are displayed in a creative card format
- [x] An image of each content creator is shown on their content creator card

The following **additional** features are implemented:

- [x] Persistent Supabase database storage with asynchronous CRUD operations
- [x] Responsive layouts for desktop, tablet, and mobile screens
- [x] Category labels and optional image URL support
- [x] Form validation, loading states, and helpful error messages
- [x] A confirmation dialog that helps prevent accidental deletion
- [x] Custom social-sharing artwork and metadata
- [x] Accessible labels, keyboard-friendly controls, and reduced-motion support
- [x] A helpful empty-directory state when the database contains no creators

## Video Walkthrough

Here's a walkthrough of the implemented required features:

<img src="./public/creatorverse-walkthrough.gif" title="Creatorverse Video Walkthrough" width="960" alt="Animated walkthrough showing the Creatorverse homepage, creator directory, details page, edit form, add form, and delete confirmation" />

GIF created with **Pillow**.

## Running the Project

1. Install dependencies:

   ```bash
   npm install
   ```

2. Copy `.env.example` to `.env.local` and provide the Supabase project URL and publishable key:

   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-publishable-key
   ```

3. Apply `supabase/migrations/20260811110000_create_creators.sql` to a Supabase project if the `creators` table does not already exist.

4. Start the app:

   ```bash
   npm run dev
   ```

5. Run the production build and automated requirement checks:

   ```bash
   npm test
   ```

## Notes

The app uses a Supabase `creators` table with the required `name`, `url`, `description`, and `imageURL` fields. Supabase Realtime is enabled, and the frontend performs all create, read, update, and delete operations through `@supabase/supabase-js`.

Following the WEB103 prework instructions, Row Level Security is disabled on this table. This is suitable for the class exercise but should be replaced with appropriate RLS policies before using the app in production.

The most involved part was connecting persistent Supabase operations to the editorial visual design consistently across the creator directory, detail pages, forms, loading states, and mobile layouts while maintaining clear navigation and accessible controls.


## License

Copyright 2026 BIngram17

Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at

> http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
