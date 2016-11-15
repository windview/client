Test Comments
=====

## Getting up to speed with react and redux

 - The react docs are very good. After running through the quick start section [here](https://facebook.github.io/react/docs/hello-world.html) I was able to complete the initial implementation of WindView quite easily
 - The guy who wrote redux does a very thorough video series [here](https://egghead.io/courses/getting-started-with-redux) that also serves as a nice suplemental react lesson. After absorbing this I refactored the initial WindView version to utilize redux and I am quite happy about the results.
  - [Here](https://jsbin.com/pebesisaqi/edit?js,output) is the JSBin of the final version of the redux video tutorial. If you can look through this and understand everything you can probably understand everything I've done with windview-react (as of 2016/11/15)
 - A lot of great concepts in [here](http://redux.js.org/docs/basics/UsageWithReact.html). Nothing new but useful to see how it plays out when applied to react-redux
 - I borrowed heavily from the post [here](http://jaysoo.ca/2016/02/28/organizing-redux-application/) when creating the structure. Open to discussion if you guys would like to do it differently


## Creating project

React has a nifty tool `create-react-app` that scaffolds up a project. The whole thing is node.js and npm managed. The resulting project comes complete with dev server (incl. hot reload), tests, lint, and build script for production style builds. However it is totally canned and can't be expanded on (e.g. addign support for sass). It does have a script `npm run eject` that basically takes all of the black box and blows it up into a full set of project files. We're talking about tons of junk in `package.json`, config directory, scripts to start, build, etc. I have mixed feelings about this. One the one hand, it took about 10 minutes to set up a base project, add sass support, and hit the ground running. On the other hand there are hundreds of lines of script and config code that are totally meaningless to me. I guess you can't have your cake and eat it too.

**Total Time:** < 10 minutes to scaffold the basic project and add scss support

## Re-Creating the Vue version in React

Generally speaking there wasn't a lot of trouble moving stuff around. JSX is basically JavaScript that lets you put HTML-like stuff inline. Vue is basically HTML that lets you put JavaScript-like stuff inline. To make a JSX from a Vue was a matter of
 1. Create the empty React component
 2. Copy the javascript part of the code and adjust as apporpriate (e.g. move imports to the top of the file)
 3. Copy the Vue `template` into the React component `render` method and tweak as needed (e.g. fix conditional logic)
 4. Create the empty scss file
 5. Copy the Vue `style` into the relevant scss file 

Might seem like a lot of steps but it was painless and pretty darn fast. I did get confused a couple of times trying to figure out where all the CSS was coming from. Having it embedded in the template files themselves wasn't quite obvious at first. Once I got bit by it twice it became a no-brainer to know where to look. The only other thing that gave me any pause was integrating bootstrap. There is a project `React Bootstrap` that wraps bootstrap styles in React components. In this case I just went with using 'normal' bootstrap since Jon had already done the app layout with it and I didn't want to have to figure out the React-Bootstrap equivalents of everything used. The hitch there was the bootstrap requirement to have a global dependency on JQuery which proved to be a little tricky in React's ES6 modular world. Finally found a solution [here](http://stackoverflow.com/questions/37932454/jquery-needed-for-bootstrap-in-react-project) which has a link in the solution to a nice blog post if you want some background info on the matter.

**Total Time:** ~ 4 hours to get the whole thing working including stateful buttons. Of that time I'd say I spent about an hour figuring out where all the CSS was and another hour figuring out the bootstrap/jquery thing

## Caveats & Random notes
 * React website seems to be pretty dang fantastic with documentation, guides, etc. 
 * Learning Curve: I walked through a quick start (which took about 3 hours) and felt like I had enough command of the basics to finish our prototype. 
 * Logo: Reminds me of the Simpsons. 
 * Webpack has some nice console logging. Things like unused variables, unused imports, etc
 * Components can import styles using webpack, but this is different than the Vue scoped styles. These would get compiled into a single CSS file as part of production build process
 * Dropping `console.log` and `debugger` statements in JSX works just like you'd expect it to
 * Was able to quickly find and install Syntax highlighting for JSX into Sublime
 * JSX statements all have to result in a single html element. On two separate occasions I had to add an extra DIV just to meet this requirement. A little planning of the component layout would be needed to insure that we don't end up with ridiculous nesting in the final DOM