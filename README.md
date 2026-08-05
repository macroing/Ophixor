# Ophixor

Ophixor is a platform where you can create both static websites and dynamic web applications using visual tools and without writing any code.

The official instance can be reached at [ophixor.com](https://ophixor.com).

## Getting Started

To clone this repository, you can type the following in Git Bash.

```bash
git clone https://github.com/macroing/Ophixor.git
```

Now you have to configure the environment variables in `.env.local` or similar.

```
E_MAIL_FROM=info@example.com
E_MAIL_HOSTNAME=email.example.com
E_MAIL_PASSWORD=Password
E_MAIL_USERNAME=info@example.com
MONGODB_URI=mongodb+srv://<Username>:<Password>@cluster.ucibc.mongodb.net/<DatabaseName>?retryWrites=true&w=majority
NEXTAUTH_SECRET=YourProvidedSecret
NEXTAUTH_URL=http://localhost:3000
NEXT_PUBLIC_PLATFORM_DEMO_WEBSITE_CODE=example
NEXT_PUBLIC_PLATFORM_E_MAIL=info@example.com
NEXT_PUBLIC_PLATFORM_NAME=Ophixor
NEXT_PUBLIC_PLATFORM_URL=https://example.com
NEXT_PUBLIC_PLATFORM_URL_SHORT=example.com
PIXABAY_API_KEY=YourProvidedAPIKey
```

Before you install you need to add your Font Awesome auth token to `.npmrc`. This project is using Font Awesome Pro icons.

If you are in the root directory of the project, install all dependencies like the following.

```bash
npm install
```

To run the project in development mode, run the following command.

```bash
npm run dev
```

If you want to build the project and run in production, run the following commands.

```bash
npm run build
npm run start
```

## Features

- `Component` - A configurable building block for UI.
- `Component Template` - This is used for creating reusable component configurations.
- `Model` - A user-defined schema for model data.
- `Model Data` - The user-defined data that are created for a given model.
- `Expression` - A function or variable that returns some output value given some optional input values.
- `Action` - A procedure that do something with its optional input values.
- `Integration` - A set of user-defined endpoints to some external source.
- `Data Source` - Controls the data available inside a component and its children.

### Components

- `Accordion` - A content container with titled and expandable content containers (items).
- `AccordionItem` - A titled and expandable content container (item) of an Accordion component.
- `Alert` - A content container that alerts the user in a visual way using different themes.
- `Badge` - A badge can be used to display unread notifications, item counts or status indicators among other things.
- `Button` - A button or a link that looks like a button.
- `Canvas` - A programmable canvas that can be used to create interactive experiences, tools or games.
- `Card` - A card that contains three optional slots; a header, a body and a footer.
- `Checkbox` - A checkbox that is useful in forms among other places.
- `Dialog` - A dialog that contains three optional slots; a header, a body and a footer.
- `Divider` - A way to divide content vertically; the content above the divider and the content below it.
- `Element` - A useful component if you cannot do what you want with other existing ones.
- `Footer` - A simple customizable footer that can be used at the bottom of the page.
- `Form` - A form that allows you to submit data.
- `Grid` - A grid-based container that is useful for creating some layouts.
- `Heading` - A heading with six different levels that have been configured using a typography scale.
- `Icon` - An icon that supports Font Awesome icons.
- `Image` - An image with built-in optimization capabilities.
- `Input` - An input that can be used in a form or other places and receive input.
- `Label` - A label that mainly describes form controls like inputs and text areas.
- `Link` - A link that can be configured to open in the same window or a separate blank window.
- `List` - A list that can be either ordered or unordered.
- `ListItem` - An item in an ordered or unordered list.
- `Map` - A map that uses tiles from OpenStreetMap by default.
- `Marquee` - A container component that rolls in one direction.
- `MenuBar` - A simple customizable menu bar that can be used at the top of the page.
- `Page` - A container of the whole page.
- `ProgressBar` - A progress bar shows the progress of some process or task.
- `RadioGroup` - A radio group where only one radio button can be enabled at a time.
- `Rating` - A component that allows you to rate something by selecting how many stars it should have.
- `RichText` - A rich text-editor and viewer with support for text styles and headings among other things.
- `Section` - A mostly flex-based general purpose layout container that can be used for more than that.
- `Select` - A form control with a drop-down menu where you can select an option.
- `SideBar`
- `Spacer` - A component that adds space between other components.
- `Spinner` - A component that spins around forever and is useful for when things are loading.
- `Switch` - A component that acts in a similar way to a checkbox but looks different.
- `TabPane` - A content container with titled tabs that contains content containers (items).
- `TabPaneItem` - A titled content container (item) that is represented as a tab in a TabPane component.
- `Table` - A component that contains mainly tabular data.
- `TableData` - A component that contains the tabular data for a column in a row of a table.
- `TableHeader` - A component that contains the header for a column in a table.
- `TableRow` - A component that contains a row in a table.
- `Text` - A component that contains text.
- `TextArea` - A text area that can be used in a form or other places and receive input.

### Expressions

- `abs`
- `acos`
- `acosh`
- `add`
- `all`
- `and`
- `any`
- `asin`
- `asinh`
- `atan`
- `atan2`
- `atanh`
- `average`
- `canvasDeltaTime`
- `canvasFPS`
- `canvasFrame`
- `canvasHeight`
- `canvasKeyDown`
- `canvasMouseButton`
- `canvasMouseDown`
- `canvasMouseMoved`
- `canvasMousePressed`
- `canvasMouseReleased`
- `canvasMouseWheel`
- `canvasMouseX`
- `canvasMouseY`
- `canvasTime`
- `canvasWidth`
- `ceil`
- `clamp`
- `coalesce`
- `concat`
- `contains`
- `cos`
- `cosh`
- `count`
- `dateAdd`
- `dateDiff`
- `datePart`
- `degreesToRadians`
- `distinct`
- `divide`
- `equals`
- `filter`
- `first`
- `floor`
- `formatDate`
- `getByKey`
- `greaterThan`
- `greaterThanOrEqualTo`
- `groupBy`
- `hoursToMilliseconds`
- `hoursToMinutes`
- `hoursToSeconds`
- `if`
- `includes`
- `isDesktop`
- `isEmail`
- `isLandscape`
- `isMobile`
- `isPlatformUserAdmin`
- `isPlatformUserAuthenticated`
- `isPlatformUserWebsiteOwner`
- `isPortrait`
- `isSocketConnected`
- `isSocketDisconnected`
- `isSocketReconnecting`
- `isTablet`
- `isUserAuthenticated`
- `join`
- `last`
- `length`
- `lessThan`
- `lessThanOrEqualTo`
- `literal`
- `lookup`
- `lowercase`
- `map`
- `max`
- `millisecondsToHours`
- `millisecondsToMinutes`
- `millisecondsToSeconds`
- `min`
- `minutesToHours`
- `minutesToMilliseconds`
- `minutesToSeconds`
- `multiply`
- `not`
- `now`
- `object`
- `or`
- `PI`
- `path`
- `pipeline`
- `platformUserEmail`
- `pow`
- `prop`
- `radiansToDegrees`
- `random`
- `range`
- `replace`
- `round`
- `secondsToHours`
- `secondsToMilliseconds`
- `secondsToMinutes`
- `sin`
- `sinh`
- `socketData`
- `socketDataArray`
- `sort`
- `split`
- `sqrt`
- `state`
- `stringLength`
- `substring`
- `subtract`
- `sum`
- `tan`
- `tanh`
- `toArray`
- `toBoolean`
- `toNumber`
- `toObject`
- `toString`
- `trim`
- `uppercase`
- `userEmail`
- `userName`
- `viewportHeight`
- `viewportOrientation`
- `viewportWidth`
- `websiteDescription`
- `websiteLanguage`
- `websiteName`

### Actions

- `addStateValue`
- `canvasCircle`
- `canvasClear`
- `canvasImage`
- `canvasLine`
- `canvasPolygon`
- `canvasRectangle`
- `canvasRestore`
- `canvasRotate`
- `canvasSave`
- `canvasScale`
- `canvasText`
- `canvasTranslate`
- `forEach`
- `if`
- `navigate`
- `print`
- `socketBroadcast`
- `socketConnect`
- `socketDataAdd`
- `socketDataClear`
- `socketDataRemove`
- `socketDisconnect`
- `socketEmit`
- `setStateValue`
- `updateComponent`
- `userSignIn`
- `userSignOut`
- `userSignUp`
- `wait`

## TODO

- Add JSON-LD-support for a Website.
- Add JSON-LD-support for a WebsitePage.
- Add a JSON-schema to WebsitePage that specifies which WebsiteModel instances and WebsiteModelData instances to load initially.
- Add some Actions and Expressions for the WebsiteModel and WebsiteModelData loading of a WebsitePage.
- Add some Actions and Expressions for adding or removing components.
- Add an Action for WebsiteIntegration instances.
- Add the transformation pipeline to the WebsiteIntegration.
- Add support for password change requests to PlatformUsers.
- Add support for password change requests to WebsiteUsers.
- Add support for profile updating to WebsiteUsers with an Action.
- Add WebsiteUser management to a Website.
- Finish the collaborator feature. What's left is mainly to update existing collaborators.
- Add subscription management. This includes being able to subscribe to a plan, cancel a subscription and management for administrators.
- Add the isVisible property to all components so they can be hidden or shown dynamically.
- Add translations to Swedish. Many have already been added. When all exists it is possible to add new languages easily.
- Add support for Expressions using the Workflow Editor to WebsiteModelData fields.
- Add Actions for loading one or more WebsiteUsers. It should include support for pagination.
- Add regex support for the slug of a WebsitePage. This allows for multiple pages that refer to the same WebsitePage instance.
- Add Expressions for retrieving parts of the current path that refers to the current WebsitePage.
- Add a WebsiteUserModel model where custom fields for a WebsiteUser can be specified. These custom fields are then added on creation.
- Add theme settings to Website. These consists of CSS variables that override the default ones. Mainly colors.
- Add an AreaChart component.
- Add a BarChart component.
- Add a Breadcrumb component.
- Add a Calendar component.
- Add a Carousel component.
- Add a Chat component.
- Add a Code component.
- Add a ColorPicker component.
- Add a DateOfBirth component.
- Add a Drawer component.
- Add a FileUpload component.
- Add a Menu component.
- Add a Pagination component.
- Add a PieChart component.
- Add a ScrollPane component.
- Add a SearchInput component.
- Add a Skeleton component.
- Add a Slider component.
- Add a TagInput component.
- Add a Toast component.
- Add a Tooltip component.
- Add a TreeView component.
- Add a Video component.
- Make some improvements to the MenuBar component. It does not work well with the hamburger menu. It should probably also support large menus and icons.
- Add more functionality to the Canvas component so it can be used to create games and other interactive experiences.
- Add support for uploading video.
- Add a server Action that delegates the following execution to the server and a client Action that delegates the following execution back to the client.
- Add theme properties to the Checkbox component.
- An AccordionItem can currently only use static values for isVisible in order for the Accordion component to work correctly. This needs a fix.
