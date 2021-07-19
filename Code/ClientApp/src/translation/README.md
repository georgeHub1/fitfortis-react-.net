This document describes the overall localization procedure for the web site.

# Localization of the front-end
To create a new localization for the application, follow the steps below.

1. Create a folder for the new locale in `$/Code/ClientApp/src/translation` e.g. **`.../src/tranlation/bg-BG`**. The locale ID 
should generally have the **aa-BB** format, where aa is the language designator (small caps) and BB is the region designator 
(all caps). 

2. Replicate the folder and file structure of an existing locale (e.g. en-US) in the newly created folder.

3. Import the new locale into **`.../src/translation/index.js`** as follows:
```
...
import bg from './bg-BG';
...
export default {
    ...
    'bg-bg': bg,
    ...
}
```

4. Add an image file for the flag of the new locale as **`.../src/img/languages/bg-BG.svg`**.

5. Import flag into **`.../src/components/Profile/ProfileAccount.js`** and add it to the drop-down for locale selection. 
This way the user would be able to change the locale of their profile:
```
...
import { ReactComponent as FlagBgBg } from '../../img/languages/bg-BG.svg';
    ...
    <Select
        defaultValue={language}
        dropdownClassName={'languages-select'}
        onChange={value => this.updateValues('language', value)}
        >
        ...
        <Option value="bg-bg">
            <Icon component={FlagBgBg}/>Bulgarian
        </Option>
       ...
    </Select>
    ...
```

6. Add locale to **`.../src/App.js`** as follows:
```
...
import bgBG from 'react-intl/locale-data/bg';
...
addLocaleData([...bgBG, ...enUS, ...ukUK]);
...
```


# Localization of the SISU (Sign-In, Sign-Up) screens
7. Import flag into **`SisuLanguageSelector.js`** and add code to show the 
language selection button, as follows:
```
...
import { ReactComponent as FlagBgBg } from '../../img/languages/bg-BG.svg';
    ...
    <CustomButtonTooltip
        textTooltip = "Български (Bulgarian)"
        iconComponentButton ={FlagBgBg}
        positionTooltip ="right"
        keyButton = "language"
        valueButton = "bg-bg"
        handleClick={this.handleClick}
        buttonActived = {this.state.language === 'bg-bg'}
     />
     ...
```


# Localization of the backend
8. Contact the backend developer to add appropriate localized content in the backend. Most of this 
involves adding new filed to the `EncyclopediaEntity` table and adding logic to the endpoints to 
process the languageCode parameter properly.
