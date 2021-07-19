# Instructions -- Analytics & AB Tests



# Basics
* All analytics are done with **[Firebase Analytics (FB)](https://console.firebase.google.com/u/0/project/fitfortis-20200928)** / 
**[Google Analytics (GA)](https://analytics.google.com/analytics/web/#/p247771093)**. 
* FB & GA both have access to the same analytics and have slightly different available views. 
* All AB tests are controlled with **[Google Optimize (GO)](https://optimize.google.com/optimize/home/#/accounts/4703930804/containers/14222002)**. 
* FB / GA and GO are connected (same account ID)


------
# Code 
All code is under **`$/Code/ClientApp`**:

* Analytics and AB tests are controlled by **`$/.../src/utils/AnalyticsAndAbTests.tsx`**.
* The file has all ids. 
* The file has an **`initializeAnalytics()`** method and an **`initializeAbTests()`** method.
* The file has many **`abTest_foo()`** methods, where Foo is the name of the specific AB test.
* The FB config is in **`$/.../src/utils/firebaseConfig.js`**.

Several other files call methods in the file above:
* **`$/.../public/index.html`** loads FB/GA in the app.
* **`$/.../.../src/App.js`** initializes GO.


------
# Analytics
Analytics are emitted by making calls to the **`firebaseAnalyticsLog()`** method, which takes an **event** name and optional **parameters**. Examples:

```
// Alerts.js

...
componentDidMount() {
    ...
    firebaseAnalyticsLog('Alerts');
}
...
```

and...
```
// EncyclopediaTermEntry.js

...
componentDidMount() {
    ...
    firebaseAnalyticsLog('Encyclopedia_Topics_Item', {encyclopediaId: pathSnippets[1]});
    ...
}
...
```


------
# AB Tests
...


