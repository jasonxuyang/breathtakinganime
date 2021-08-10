# breathtakinganime.xyz
An interactive image gallery of background art from Japanese animation.  Built with vanilla JS.

### Running the project
Clone the repo into a directory of your choice, and open the index.html file in an internet browser.

### Purpose
This project serves as an exploration into highly interactive web experiences and a deep dive into the capabilities of Javascript DOM manipulation.

### To-do
- Currently looking for a cheap, sustainable hosting solutions for images and audio.
- Look into hooking up a CMS such as Contentful or Prismic
- Add functionality to filter the gallery by anime genre, studio, etc.
- Add search functionality to allow users to directly go to a particular show.
- Finish implementing show viewer.

### Challenges
- Facing difficulty navigating between pages (gallery vs show) using the native browser next and back buttons. Since all "page changes" are handled using DOM manipulation rather than navigating to a new statically generated HTML file... I think for page transitions, each page should start at the end of a transition, and then transition into the intended view on page load.
- Having trouble managing JS functions. Should think a bit more about the best way to divide and encapsulate related JS into seperate JS files for better code organization.
