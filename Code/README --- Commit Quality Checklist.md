# Checklist -- Commit Quality
### Goal
This checklist is intended to provide a simple way of validating functionality and ensuring absence of regressions.  


### Checklist

| #      | Item
|--------|--------------------------------------------------------------------------------------
| **100**| **FUNDAMENTALS**
| 101    | PERF: goals are met. No perf regressions. No spinners. 
| 102    | ACCESSIBILITY: requirements are met. 
| 103    | LOC/GLOB: the code works for different locales. All strings are properly localized. 
| 104    | SECURITY: all information stored in the DB is encrypted. 
| 105    | SECURITY: the code is STRIDE-clean (spoofing, tampering, repudiation, information disclosure, denial of service, elevation of privilege) 
| 106    | SECURITY: no violation of HTTPS, e.g. accessing insecure resources from HTTP links 
| 107    | MULTI-USER: changing users works as expected. 
| 108    | LOGGING & TELEMETRY: all logging implemented 
| 109    | STATE: state is handled as expected -- properly preserved and passed (e.g. if I update my age this is reflects everywhere, etc.) 
| 110    | STATE: the browser back-stack works as expected. 
| 111    | STATIC ANALYSIS:  `npm run lint` geerates no issues. 
| 112    | STATIC ANALYSIS: `npm i` generates no warnings. 
| 113    | TESTING: `npm run test` generates no failures or warnings. 
| 114    | TESTING: new unit tests are implemented. 
| 115    | DEPLOYMENT: the site works locally, when from within VS Code.
| 116    | DEPLOYMENT: the sites works on https://fitfortis.com as expected, after CI/CD of the change. 
| **200**| **FUCTIONALITY OF FEATURE** 
| 201    | UX looks as defined in UX design spec. 
| 202    | UX is consistent with the rest of the UX in the app. 
| 203    | Functionality works as expected.   
| **300**| **FUCTIONALITY OF OTHER FEATURES** 
| 301    | SISU: works as expected   
| 302    | PROFILE: works as expected 
| 303    | HOME: works as expected  
| 304    | DASHBOARDS: works as expected 
| 305    | NEWS & ALARMS: works as expected 
| 306    | DOCUMENTSS: works as expected 
| 307    | DEVICES: works as expected 
| 308    | ENCYCLOPEDIA: works as expected 
| 309    | SYMPTOM CHECKER: works as expected 
| 310    | ADMIN TOOLS: works as expected 
