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

- `Alert`
- `Badge`
- `Button`
- `Card`
- `Checkbox`
- `Dialog`
- `Divider`
- `Element`
- `Footer`
- `Form`
- `Grid`
- `Heading`
- `Image`
- `Input`
- `Label`
- `Link`
- `List`
- `ListItem`
- `Map`
- `MenuBar`
- `Page`
- `RadioGroup`
- `RichText`
- `Section`
- `Select`
- `SideBar`
- `Spacer`
- `Spinner`
- `Switch`
- `Table`
- `TableData`
- `TableHeader`
- `TableRow`
- `Text`
- `TextArea`

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
- Add an Accordion component.
- Add a Breadcrumb component.
- Add a Calendar component.
- Add a Carousel component.
- Add a Chat component.
- Add a DateOfBirth component.
- Add an Icon component. It should probably also support Font Awesome icons.
- Add a Menu component.
- Add a Pagination component.
- Add a ProgressBar component.
- Add a Rating component.
- Add a TabPane component.
- Add a Toast component.
- Add a Tooltip component.
- Add a Video component.
- Make some improvements to the MenuBar component. It does not work well with the hamburger menu. It should probably also support large menus and icons.
- Add more functionality to the Canvas component so it can be used to create games and other interactive experiences.
- Add support for uploading video.
- Add new size properties to the Page component, such as minWidth, maxWidth, minHeight and maxHeight.
