# Introduction
This document describes the structure of the backend. The backend is implemented in C# (.NET Core Platform) and is runnable on a Linux (or Windows) VM. 
The backend is structured as follows:
```
Code
|___Backend
|   |
|   |___Src
|      |___Api            --> this is the API documentation (see below)  
|      |...
|      |___Controllers    --> this is the API (see below)
|      ...
...
```

# API Documentation & Test Usage
The backend exposes a HTTP-based API that can be used by the web front-end (written in React) as well as any other front-ends (mobile apps, etc.)
To see the API documentation, and play with the API:

1. Use **Azure Data Studio** to access the database.
1. Use **Postman** to access the API.
3. In Postman, import the environment configuration file (`FitFortisQA.postman_environment.json`) 
and the API collection file (`FitFortis.postmain_collection.json`) by pressing IMPORT, and choosing the `$/Code/Backend/Src/Api` directory.  
4. Select the `FitFortisQA` environment from the top-right "No Environment" drop-down list (which 
is on the left of Settings)
5. Now you are ready to send requests to the backend.  
6. Open the FitFortis collection. You can do that by ensuring that the sidebar is visible (see button 
on bottom-left corner)
7. Choose an endpoint (e.g. `FitFortis > Metric > api/metric`) and press the SEND button on the top right. You'll
see the results from the request you sent coming back. 
8. Another simple request you can send is `FitFortis > User > api/user` 
(or `GET {{host}}/api/{{version}}/user?firstName=1&page=1&limit=5`). You'll get an output such as...
```
{
  "items": [
    {
      "firstName": "Oleh",
      "lastName": "Havrylyuk",
      "id": "00000000-0000-0000-0000-000000000001"
    },
    ...
  ]
  "total": 108,
  "success": true
}
```
... which shows you the first 5 users and the fact that there are **`108 users`** in the database.

9. As the API evolves, you will get new versions of the `./Api/FitFortis.postmain_collection.json` file. To see these updates in Postman, you need to 
import the collection again (use the IMPORT button on top-left), replacing the existing collection. For some strange reason pressing the refresh 
button on the top-right DOES NOT WORK.

# API
The API is implemented in the `./Controllers` folder. The API is public methods exposed by the controllers with the following general signature:

```
[Http...]
public async Task<IActionResult> SomeMethod(...)
{
    ...
}
```  

Here `[Http...]` is the HTTP method used by the API (HttpGet, HttpPut, HttpPost, HttpPatch, HttpDelete). 
The method can have parameters. For example, the following API is a GET request that accepts a `userId` and a `metricId` (both of type Guid) 
and returns the corresponding metric data for the given user...
```
// This is the C# code from MetricDataController.cs 
...
public class MetricDataController : BaseApiController
{
    ...
    [HttpGet("user/{userId:Guid}/metric/{metricId:Guid}")]
    public async Task<IActionResult> GetMetricData(Guid userId, Guid metricId, ModelApiServiceRequest<ModelMetricDataQueryParams> apiRequest)
    {
        ...
    }
    ...
}
```

For demonstration purposes, a React component that wants to get back the given metric for the given user, would call this API as follows:
```
// This is the React code from dashboard.js
...
const getMetricData = (uId = userId, metricId) =>
  api
    .get(
      `${API_URL}/metricdata/user/${uId}/metric/${metricId}?dateFrom=01-06-2018&dateTo=10-07-2019`
    )
    .then(data =>
      data.items.map(el => {
        el.dateTime = new Date(el.date).getTime();
        delete el.date;
        return el;
      })
    );
...
```

Notice how the name of the controller (`MetricDataController`) is converted to the `metricdata` portion of the API request. This is a convention - 
every FooBarController exposes APIs as `${API_URL}/foobar/...` (notice the lower-casing of the name, and the removal of Controller from it!)

