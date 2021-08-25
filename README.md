A typeahead is a text input that displays suggestions as you type. It can be used for search, navigation, entity selection, and countless other things, and has become a ubiquitous part of modern user interfaces.

I've spent a bunch of time throughout my career working on various implementations of this component and have developed some strong opinions about how they should work. This project aims to provide a simple reference typeahead implementation which codifies the following opinions:

1. One reflow per keystroke
   The contents of the results list should only ever be changed once after every keystroke. It might be okay to perform multiple paints, meaning you show a placeholder while an image downloads, or insert a line of expensive-to-fetch metadata after an initial render, but it's important to _never change the layout of the result list_, including modifying the height of the rendered items, more than once per keystroke. User interfaces that change shape asynchronously are infuriating. Note that there is one exception to this rule [1], but "one reflow per keystroke" is easy enough to remember, so let's run with it.
2. No result reordering
   As a corollary to one reflow per keystroke, regardless of what new information you gain from the server or elsewhere after the results are rendered, you should _never, ever reorder results after they are initially rendered_. You get one shot per keystroke to get the ordering of results right. If for some reason you get it wrong, you must simply swallow sadness and try to do better on future keystrokes. That being said:
3. Reverse waterfall filtering
   Once an item is displayed it should continue to be displayed for as long as it continues to be a prefix match. As the user types, previous results that continue to match should _flow upwards_ causing what I call a "reverse waterfall" effect. Even if you know a result is no longer relevant, the only time it should be removed from the result list is if it stops matching the typed query. Items that no longer match simply disappear, and items from the bottom of the list should flow upwards until they no longer match.
4. Backspace should be instant
   If you've generated the results for a query in a particular typeahead session, you should never need to go to the server or even do expensive work on the client to generate them again. This means that as the user hits backspace, the exact same results they saw a keystroke ago show up again instantly.

This typeahead implementation offers prefix token matching only (no mid-string matching), and abides by the rules above through some pre-processing when new entries are added to the DataSource. It is generally able to filter a couple hundred thousand entries in less than a single frame (16ms) on a low end device.

Note: This project is still in early development and should probably not be used by anyone, for anything, yet.

[1] The exception to the "one reflow per keystroke" is appending more results to the end of the list. It's okay to append more results to the end as long as you don't cause a reflow in anything that's already been rendered.
