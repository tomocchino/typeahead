## Features

- [ ] Export flattenString from the main package so projects can use it
      * This should probably be its own package but whatever
- [ ] Build out the Actors demo and give it some bells and whistles
- [ ] Build out the Movie List example and turn it into its own app or something?
- [ ] Add “focus downloads bootstrap entries” behavior? Move initial data into endpoints so it can be downloaded and processed on focus.
- [ ] Restructure examples page layout to make nav just a left mounted thing (hidden behind a more menu on mobile?)

## Fixes

- [ ] Flatten user-provide DataSourceEntry keywords?
- [ ] Make the thing actually accessible
      * `import {Combobox, ComboboxItem, ComboboxPopover}`, etc from ariakit/combobox
- [ ] Don't issue network requests for superset queries when subset query had no results
      * For the movies demo, if a query returns no results, and a subsequent query is a “superstring” of the previous query (meaning, it’s even more specific / longer), there’s obviously no results that will come back. Can we easily skip the request?
- [ ] Bail early if input has more tokens than DataSourceEntry with the most tokens
      * If there are a ton of input tokens and no DataSource entries with that many tokens, we should be able to bail early.
      * It would be a bad UX for something to suddenly start matching when it previously hadn't anyway.
- [ ] Get rid of the concept of rawData?
      * Anyone can store their own copies of the raw data and index into and out of it however they want, right?
      * This is a memory leak waiting to happen, and is impossible to type properly in TS with anything other than `any`.
	    * Alternatively, can we use generics to make rawData know the incoming shape of the rawData that's provided?
      * We should probably still split out keywords, unfortunately… https://www.typescriptlang.org/docs/handbook/typescript-in-5-minutes.html
- [ ] Figure out some way to defragment results on reset
      * The example below is a fairly bad experience, but actually prescribed behavior
      * Query 'spotlight', then query 'other' in the movies example:
      +---------------------------------------+
      | other                                 |
      +---------------------------------------+
      | Spot: Where's Spot? and Other Stories |
      | Otherhood                             |
      | OtherLife                             |
      | The Others                            |
      | The Other Guys                        |
      +---------------------------------------+

## Completed

- [x] Create build / publish step and publish to npm?
- [x] Add support for user provided class names
- [x] After updating to Next.js 12, SWC is disabled because of the existence of .babelrc. See here: https://github.com/vercel/next.js/discussions/30174#discussioncomment-1525489 - Need to delete .babelrc and reconfigure Jest to use SWC at some point.
- [x] Make the return value of the Typeahead onSelect method set the value of the input, so the input never needs to be passed to the onSelect as the second value!
- [x] Add TypeScript support to… everything?
- [x] Add Initial Readme
- [x] Add DataSource queryHandler debounce behavior?
- [x] Refactor src directory, throw pages in there and everything else.
- [x] Pull flatten into its own function and make parseTokens rely on that?
- [x] Rewrite parseTokens tests to test flatten and parseTokens separately? 🤔
- [x] Refactor all the "suggested completion placeholder" behavior because it's an absolute mess right now. Do we even need more state for this or can we just leverage the highlighted index!? 😮
- [x] Add better error message when no DataSource is supplied
- [x] Provide default renderer in Typeahead
- [x] Proper tokenization / removal of diacritics
- [x] If something is selected, on focus of the input, select() so it can be cleared easily 
- [x] Add support for keywords / tags to DataSource/Entry
- [x] We aren’t able to match the same word more than once in an entry 🙁 
- [x] Reorganize files to make it _movies_index.js etc.
- [x] Fix broken mouse over highlighting behavior
