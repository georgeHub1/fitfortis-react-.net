# Contents
* [Building blocks](#building-blocks)
* [Code organization](#code-organization)
* [Toolset](#toolset)
* [Build and deploy the site locally](#build-and-deploy-the-site-locally)
* [Run tests](#run-tests)
* [Run lint](#run-lint)
* [Access the backend API](#access-the-backend-api)
* [Commit code](#commit-code)
* [Deploy to Azure](#deploy-to-azure)
* [Localization](#localization)



---
# Building blocks
We use the following building blocks for the site:

* **ReactJS** -- the front end is written in ReactJS.
* **Redux** -- state-management of the front end.
* **Ant.Design** -- the UI toolkit we use use is [Ant.Design](https://ant.design/), with a custom stylesheet.
* **ReCharts** -- all charting is done with [ReCharts](https://recharts.org/en-US/).
* **.NET Core** -- the backend is written in C# and .NET Core and runs on a Linux server hosted in Azure.
* **SQL Server** -- the db is on SQL server.
* **dotnet-script** -- we use [dotnet-script](https://github.com/filipw/dotnet-script) for simple scripting (upload / download of db from / to files, etc.)



---
# Code organization
The application is organized as follows:
```
Code
|___Backend
|   |
|   |___Src
|   |___Tests
|
|
|___ClientApp
    |
    |___src
    |___tests
```
* `Backend` contains all Backend code, written in C# (.net core).
* `ClientApp` contains all browser app code written in ReactJS, Redux, Ant.Design (UI toolkit), and ReCharts.
* `src` contains the production code. 
* `tests` contains the test code.
* The `src` and `tests` directories are as flat as possible, and have **symmetrical directory structures**.



---
# Toolset
1. Download and install **.NET Core** from  https://dotnet.microsoft.com/download.
2. Download and install **Node.js** from https://nodejs.org/en/download.
3. Download and install **VS Code** from https://code.visualstudio.com.
4. Download and install **Azure Data Studio** from https://docs.microsoft.com/en-us/sql/azure-data-studio/download-azure-data-studio. ADS is a good way to access the database.
5. Download and install **Postman** from https://www.getpostman.com. 



---
# Toolset configuration
1. Pull the source code from the git repo.
2. Open a terminal, go to `$/Code/ClientApp` and run **`npm install`** to install the necessary NPM packages:
```
~/Ff
$ cd Code/ClientApp
$ npm install
...
```
3. Install **dotnet-script** from a terminal window, and ensure that it runs properly:
```
~/Ff
$ dotnet tool install -g dotnet-script
...

$ cd Articles/Scripts
$ dotnet script __SampleGuidGenerator.csx
...
```
4. In Postman, import the environment configuration file (FitFortisQA.postman_environment.json) and the API collection file (FitFortis.postmain_collection.json) by 
pressing IMPORT, and choosing the `$/Code/Backend/Api` directory. See [$/Code/Backend/README.md](./Code/Backend/README.md) for details on how to access the API.



---
# Build and deploy the site locally
1. Start **VS Code**
2. Go to **File** > **Open...** and open the `$/Code` folder in your enlistment
3. Install the *C# for Visual Studio Code* extension (or open any C# file in project and VS Code will prompt you to install it automatically)
4. Go to **Debug** > **Start Debugging** to build and deploy. This builds the site, and deploys it to the dev web server
on http://localhost:5000.



---
# Run tests 
For unit tests we use Jest JS testing framework and Enzyme JS Testing utility. All UI components are covered with snapshots.
```
~/Ff
$ cd Code/ClientApp
$ npm run test
...
```
If a UI component is changed, then the corresponding component snapshot should be updated. To update the snapshot, rerun the tests and choose the **u** or **i** command:
```
~/Ff/Code/ClientApp
$ npm run test
...
... use the 'u' or 'i' commands
...
```



---
# Run lint 
For the cleanness of the code we use eslint, the lint rules are in `$/Code/ClientApp/.eslintrc`
```
~/Ff
$ cd Code/ClientApp
$ npm run lint
...
```



---
# Access the backend API 
See [$/Code/Backend/README.md](./Code/Backend/README.md) for details on how to access the API. 



---
# Commit code 
Before you commit any code, make sure you read and follow [$/Code/README --- Commit Quality Checklist.md](Code/README --- Commit Quality Checklist.md). 

When you attempt a commit, a husky pre-commit hook gets executed. ClientApp uses pre-commit to run lint 
and unit tests.
```
  "husky": {
    "hooks": {
      "pre-commit": "npm run lint && npm run test:nowatch"
    }
  }
```
If the lint and unit tests pass, the changes are committed. 



---
# Deploy to Azure
Deployment is done with an automated CI-CD pipeline. For more details, see the corresponding
`Instructions - ...` document in the [$/Documents](../Documents) directory. 



---
#Localization
The site is localized in several languages. Localization is done both in the front-end and in the
backend. For more details, see the [$/Code/ClientApp/src/translation/README.md](./ClientApp/src/translation/README.md) 
document.
