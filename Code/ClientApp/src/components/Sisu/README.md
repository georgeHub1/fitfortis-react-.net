# Adding language selector to SISU screens
To add more languages to the SISU screens, follow these steps:

1. See $/Code/ClientApp/src/translation/README.md for instructions on how to add a new locale.

2. Modify SisuLanguageSelector.js to import the flag file for the new language, and add 
a button for the new language, as follows:

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
