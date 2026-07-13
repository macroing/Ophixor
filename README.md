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

- It should be possible to specify JSON-LD data for a Website.
- It should be possible to specify JSON-LD data for a WebsitePage.
- It should be possible to specify some JSON schema for Data Model and Data loading for a WebsitePage.
- When the point above works, a few Actions and Expressions are required. These have to do with Data fetching for a specific page.
- A few Actions and Expressions for adding or removing components.
- An Action for Integrations.
- The transformation pipeline for Integrations has not been implemented yet.
- A user of the platform should have support for requesting to change the password.
- A user of a website should have support for requesting to change the password.
- A user of a website should be able to update the profile. So a general Action should support that functionality.
- Someone running a Website should be able to manage their WebsiteUsers.
- The collaborator feature needs to be finished. It is mainly updating existing collaborators left.
- Subscription management needs to be added. This includes being able to subscribe to a plan, canceling the subscription and admin management.
- All components need support for visibility checks.
- Everything should support the Swedish language. Preferably in a way that makes support for other languages easy.
- Data should support expressions for most types. The Workflow Editor should be used to configure it on the Data-part of the Models page.
- Actions for loading one or more WebsiteUsers should be added. Pagination should be supported.
- The slug for a WebsitePage should support Regex so that many pages can refer to the same WebsitePage instance.
- Some Expressions for retrieving the path parts of the slugs should be added.
- A WebsiteUserModel should be added where the developers of the Website can specify custom fields that WebsiteUsers should have. Added on creation.
