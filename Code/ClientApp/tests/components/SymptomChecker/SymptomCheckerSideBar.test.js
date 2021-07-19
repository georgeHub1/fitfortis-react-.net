import React from 'react';
import renderer from 'react-test-renderer';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import SymptomCheckerSideBar from '../../../src/components/SymptomChecker/SymptomCheckerSideBar';

import { createStore, applyMiddleware } from 'redux';
import configureStore from 'redux-mock-store';

import { getShortDescription } from '../../../src/utils/stringTools';

const Container = SymptomCheckerSideBar;
const mockStore = configureStore([]);
beforeEach(() => {
  const consoleErrorMock = jest.fn();

  console.error = consoleErrorMock;
});

describe('SymptomCheckerSideBar', () => {
  it('renders correctly', () => {
    let store = mockStore({
      symptomChecker: {
        symptomDetails: null,
        isSymptomDetailsLoaded: false
      }
    });
    store.dispatch = jest.fn();

    const wrapper = renderer.create(
        <Provider store={store}>
          <Router>
            <Container />
          </Router>
        </Provider>
    ).toJSON();

    expect(wrapper).toMatchSnapshot();
  });

  // it('render with text more than 200 character in <p>', () => {
    
  //   for(let i in dummy){
  //     const symptomDetails = dummy[i];
  //     const stringText = [];
  //     const regex = /(<([^>]+)>)/ig;
  //     const regextForParagraph = /(?<=\<p\>).*?(?=\<\/p\>)/ig;
  //     const lastTrimmedString = getShortDescription(symptomDetails.descriptionEnUs, 200);

  //     expect(lastTrimmedString).toEqual(symptomDetails.expected);
  //   }
  // });
});

/*
const dummy = [{
  "descriptionEnUs": "<p>Pneumonia is an infection in one or both of the lungs. Many germs, such as bacteria, viruses, and fungi, can cause pneumonia. You can also get pneumonia by inhaling a liquid or chemical. People most at risk are older than 65 or younger than 2 years of age, or already have health problems.<br />Symptoms of pneumonia vary from mild to severe. See your doctor promptly if you</p>\r\n<ul>\r\n<li>Have a high fever</li>\r\n<li>Have shaking chills</li>\r\n<li>Have a cough with phlegm that doesn't improve or gets worse</li>\r\n<li>Develop shortness of breath with normal daily activities</li>\r\n<li>Have chest pain when you breathe or cough</li>\r\n<li>Feel suddenly worse after a cold or the flu</li>\r\n</ul>\r\n<p>Your doctor will use your medical history, a physical exam, and lab tests to diagnose pneumonia. Treatment depends on what kind you have. If bacteria are the cause, antibiotics should help. If you have viral pneumonia, your doctor may prescribe an antiviral medicine to treat it.<br />Preventing pneumonia is always better than treating it. Vaccines are available to prevent pneumococcal pneumonia and the flu. Other preventive measures include washing your hands frequently and not smoking.<br /><br />NIH: National Heart, Lung, and Blood Institute</p>\r\n<h1>Detailed Information</h1>\r\n<p>Pneumonia is a bacterial, viral, or fungal infection of one or both sides of the lungs that causes the air sacs, or alveoli, of the lungs to fill up with fluid or pus. Symptoms can be mild or severe and may include a cough with phlegm (a slimy substance), fever, chills, and trouble breathing. Many factors affect how serious pneumonia is, such as the type of germ causing the lung infection, your age, and your overall health. Pneumonia tends to be more serious for children under the age of five, adults over the age of 65, people with certain conditions such as heart failure, diabetes, or COPD (chronic obstructive pulmonary disease), or people who have weak immune systems due to HIV/AIDS, chemotherapy (a treatment for cancer), or organ or blood and marrow stem cell transplant procedures.<br /> <br /> To diagnose pneumonia, your doctor will review your medical history, perform a physical exam, and order diagnostic tests. This information can help your doctor determine what type of pneumonia you have. If your doctor suspects you got your infection while in a hospital, you may be diagnosed with hospital-acquired pneumonia. If you have been on a ventilator to help you breathe, you may have ventilator-associated pneumonia. The most common form of pneumonia is community-acquired pneumonia, which is when you get an infection outside of a hospital.<br /> <br /> Treatment depends on whether bacteria, viruses, or fungi are causing your pneumonia. If bacteria are causing your pneumonia, you usually are treated at home with oral antibiotics. Most people respond quickly to treatment. If your symptoms worsen you should see a doctor right away. If you have severe symptoms or underlying health problems, you may need to be treated in a hospital. It may take several weeks to recover from pneumonia.</p>\r\n<div id=\"causes\" class=\"accordion-header-secondary ui-accordion-header ui-corner-top ui-state-default ui-accordion-icons ui-accordion-header-active ui-state-active\" tabindex=\"0\" title=\"Causes - Pneumonia\">\r\n<h2 class=\"field field--name-field-display-title field--type-string field--label-hidden field__item\">Causes</h2>\r\n</div>\r\n<div id=\"ui-id-12\" class=\"ui-accordion-content ui-corner-bottom ui-helper-reset ui-widget-content ui-accordion-content-active\" style=\"height: 100%;\">\r\n<div class=\"field field--name-field-expanding-content field--type-entity-reference-revisions field--label-hidden field__item\">\r\n<div class=\"readMoreContainer paragraph paragraph--type--intro-text paragraph--view-mode--default\">\r\n<div class=\"bodytext\">\r\n<div class=\"clearfix text-formatted field field--name-field-introduction field--type-text-long field--label-hidden field__item\">\r\n<p>Bacteria, viruses, and fungi infections can cause pneumonia. These infections cause inflammation in the air sacs, or alveoli, of the lungs. This inflammation causes the air sacs to fill with fluid and pus.</p>\r\n</div>\r\n</div>\r\n</div>\r\n</div>\r\n<div class=\"primary-accordion ui-accordion ui-widget ui-helper-reset paragraph paragraph--type-- paragraph--view-mode--child-page\" data-viewtype=\"health-topics-subaccordion\">\r\n<h3 class=\"field field--name-field-panel-title field--type-string field--label-hidden field__item\">Bacteria</h3>\r\n<div class=\"bodytext\">\r\n<div class=\"clearfix text-formatted field field--name-field-accordion-body field--type-text-long field--label-hidden field__item\">\r\n<p>Bacteria are the most common cause of pneumonia in adults. Many types of bacteria can cause bacterial pneumonia. <em>Streptococcus</em>&nbsp;<em>pneumoniae</em> or pneumococcus bacteria are the most common cause of bacterial pneumonia in the United States.</p>\r\n<p>If your pneumonia is caused by one of the following types of bacteria, it is called atypical pneumonia.</p>\r\n<ul>\r\n<li><strong><em>Legionella pneumophila.</em></strong>&nbsp;This type of pneumonia sometimes is called Legionnaire's disease, and it has caused serious outbreaks. Outbreaks have been linked to exposure to cooling towers, whirlpool spas, and decorative fountains.</li>\r\n<li><strong><em>Mycoplasma pneumoniae</em></strong><strong>.</strong>&nbsp;This is a common type of pneumonia that usually affects people younger than 40 years old. People who live or work in crowded places like schools, homeless shelters, and prisons are at higher risk for this type of pneumonia. It's usually mild and responds well to treatment with antibiotics. However,&nbsp;<em>Mycoplasma pneumoniae</em>&nbsp;can be very serious. It may be associated with a skin rash and <span class=\"entity-embed full\">hemolysis</span>. This type of bacteria is a common cause of &ldquo;walking pneumonia&rdquo;.</li>\r\n<li><em><strong>Chlamydia pneumoniae.</strong></em>&nbsp;This type of pneumonia can occur all year and often is mild. The infection is most common in people 65 to 79 years old.</li>\r\n</ul>\r\n<p>Bacterial pneumonia can occur on its own or develop after you've had a viral cold or the flu. Bacterial pneumonia often affects just one lobe, or area, of a lung. When this happens, the condition is called lobar pneumonia.</p>\r\n<figure class=\"align-center b-loaded caption caption-img \"><img class=\"b-lazy b-loaded\" src=\"https://www.nhlbi.nih.gov/sites/default/files/inline-images/lobarpneumonia.jpeg\" alt=\"Lobar Pneumonia\" width=\"auto\" height=\"auto\" data-entity-type=\"file\" data-entity-uuid=\"ef87b319-39c9-4d4c-868b-e24c44a94d56\" />\r\n<figcaption>Lobar bacterial pneumonia. This figure shows pneumonia affecting the single lower lobe of the left lung. Figure A shows the location of the lungs and airways in the body. Figure B shows normal alveoli. Figure C shows infected alveoli or air sacs.</figcaption>\r\n</figure>\r\n</div>\r\n</div>\r\n<div class=\"readMoreContainer\">\r\n<div class=\"blueRoundButton readMoreButton\">&nbsp;</div>\r\n<div class=\"readMore\">\r\n<div class=\"bodytext\">\r\n<div class=\"clearfix text-formatted field field--name-field-additional-text field--type-text-long field--label-hidden field__item\">\r\n<p>Most of the time, the body filters bacteria out of the air that we breathe to protect the lungs from infection. Your immune system, the shape of your nose and throat, your ability to&nbsp;cough, and fine, hair-like structures called cilia help stop the germs from reaching your lungs.</p>\r\n<p>Sometimes bacteria manage to enter the lungs and cause infections. This is more likely to occur if:</p>\r\n<ul>\r\n<li>Your immune system is weak</li>\r\n<li>A germ is very strong</li>\r\n<li>Your body fails to filter out the bacteria from the air that you breathe. For example, if you can't cough because you've had a&nbsp;stroke&nbsp;or are <span class=\"entity-embed full\">sedated</span>, bacteria may remain in your airways.</li>\r\n</ul>\r\n<p>When bacteria reach your lungs, your immune system goes into action. It sends many kinds of cells to attack the bacteria. These cells cause inflammation in alveoli (air sacs) and can cause these spaces to fill up with fluid and pus. This causes the symptoms of pneumonia.</p>\r\n</div>\r\n</div>\r\n</div>\r\n</div>\r\n<h3 class=\"field field--name-field-panel-title field--type-string field--label-hidden field__item\">Virus</h3>\r\n<div class=\"bodytext\">\r\n<div class=\"clearfix text-formatted field field--name-field-accordion-body field--type-text-long field--label-hidden field__item\">\r\n<p>Viruses that infect the respiratory tract may cause pneumonia. The influenza or flu virus is the most common cause of viral pneumonia in adults. Respiratory syncytial virus (RSV) is the most common cause of viral pneumonia in children younger than one year old. &nbsp;Other viruses can cause pneumonia such as the common cold virus known as rhinovirus, human parainfluenza virus (HPIV), and human metapneumovirus (HMPV).</p>\r\n<p>Most cases of viral pneumonia are mild. They get better in about one to three weeks without treatment. Some cases are more serious and may require treatment in a hospital. If you have viral pneumonia, you run the risk of getting bacterial pneumonia.</p>\r\n</div>\r\n</div>\r\n<h3 class=\"field field--name-field-panel-title field--type-string field--label-hidden field__item\">Fungi</h3>\r\n<div class=\"bodytext\">\r\n<div class=\"clearfix text-formatted field field--name-field-accordion-body field--type-text-long field--label-hidden field__item\">\r\n<p>Pneumocystis pneumonia is a serious fungal infection caused by <em>Pneumocystis jirovecii</em>. It occurs in people who have weak immune systems due to HIV/AIDS or the long-term use of medicines that suppress their immune systems, such as those used to treat cancer or as part of organ or&nbsp;blood and marrow stem cell transplant procedures.</p>\r\n<p>Other fungal infections also can lead to pneumonia. The following are three fungi that occur in the soil in some parts of the United States and can cause some people to get pneumonia.</p>\r\n<ul>\r\n<li><strong>Coccidioidomycosis</strong>. This fungus is found in Southern California and the desert Southwest. It is the cause of valley fever.</li>\r\n<li><strong>Histoplasmosis</strong>. This fungus is found in the Ohio and Mississippi River Valleys.</li>\r\n<li><strong>Cryptococcus</strong>. This fungus is found throughout the United States in bird droppings and soil contaminated with bird droppings.</li>\r\n</ul>\r\n<div id=\"risk-factors\" class=\"accordion-header-secondary ui-accordion-header ui-corner-top ui-state-default ui-accordion-icons ui-accordion-header-active ui-state-active\" tabindex=\"0\" title=\"Risk Factors - Pneumonia\">\r\n<h2 class=\"field field--name-field-display-title field--type-string field--label-hidden field__item\">Risk Factors</h2>\r\n</div>\r\n<div id=\"ui-id-13\" class=\"ui-accordion-content ui-corner-bottom ui-helper-reset ui-widget-content ui-accordion-content-active\" style=\"height: 100%;\">\r\n<div class=\"field field--name-field-expanding-content field--type-entity-reference-revisions field--label-hidden field__item\">\r\n<div class=\"readMoreContainer paragraph paragraph--type--intro-text paragraph--view-mode--default\">\r\n<div class=\"bodytext\">\r\n<div class=\"clearfix text-formatted field field--name-field-introduction field--type-text-long field--label-hidden field__item\">\r\n<p>Many factors such as age, smoking, and other medical conditions can increase your chances of getting pneumonia and having more severe pneumonia.</p>\r\n<h3>Age</h3>\r\n<p>Pneumonia can affect people of all ages. However, two age groups are at greater risk of developing pneumonia and having more severe pneumonia:</p>\r\n<ul>\r\n<li><strong>Infants who are two years old or younger</strong> because their immune systems are still developing during the first few years of life.</li>\r\n<li><strong>People who are 65 years old or older </strong>because their immune systems begin to change as a normal part of aging.</li>\r\n</ul>\r\n<h3>Environment</h3>\r\n<p>Your risk for pneumonia may increase if you have been exposed to certain chemicals, pollutants, or toxic fumes.</p>\r\n<h3>Lifestyle habits</h3>\r\n<p>Smoking cigarettes, excessive use of alcohol, or being undernourished also increases your risk for pneumonia.</p>\r\n<h3>Other medical conditions</h3>\r\n<p>Other conditions and factors also increase your risk for pneumonia. Your risk also goes up if you:</p>\r\n<ul>\r\n<li>Have trouble&nbsp;coughing because of a&nbsp;stroke&nbsp;or other condition, or have problems swallowing.</li>\r\n<li>Can't move around much or are&nbsp;<span class=\"entity-embed full\">sedated</span> .</li>\r\n<li>Recently had a cold or the flu.</li>\r\n<li>Have a lung disease or other serious disease including&nbsp;cystic fibrosis,&nbsp;asthma,&nbsp;COPD&nbsp;(chronic obstructive pulmonary disease),&nbsp;bronchiectasis, diabetes,&nbsp;heart failure, or&nbsp;sickle cell disease.</li>\r\n<li>Are in a hospital intensive-care unit, especially if you using a&nbsp;ventilator&nbsp;to help you breathe.</li>\r\n<li>Have a weak or suppressed immune system due to HIV/AIDS, organ transplant or&nbsp;blood and marrow stem cell transplant, chemotherapy (a treatment for cancer), or long-term steroid use.</li>\r\n</ul>\r\n<div id=\"screening-and-prevention\" class=\"accordion-header-secondary ui-accordion-header ui-corner-top ui-state-default ui-accordion-icons ui-accordion-header-active ui-state-active\" tabindex=\"0\" title=\"Screening and Prevention - Pneumonia\">\r\n<h2 class=\"field field--name-field-display-title field--type-string field--label-hidden field__item\">Screening and Prevention</h2>\r\n</div>\r\n<div id=\"ui-id-14\" class=\"ui-accordion-content ui-corner-bottom ui-helper-reset ui-widget-content ui-accordion-content-active\" style=\"height: 100%;\">\r\n<div class=\"field field--name-field-expanding-content field--type-entity-reference-revisions field--label-hidden field__item\">\r\n<div class=\"readMoreContainer paragraph paragraph--type--intro-text paragraph--view-mode--default\">\r\n<div class=\"bodytext\">\r\n<div class=\"clearfix text-formatted field field--name-field-introduction field--type-text-long field--label-hidden field__item\">\r\n<p>Pneumonia can be very serious and even life threatening. Vaccines can help prevent certain types of pneumonia. Good hygiene, quitting smoking, and keeping your immune system strong by exercising and healthy eating are other ways to prevent pneumonia.</p>\r\n</div>\r\n</div>\r\n</div>\r\n</div>\r\n<div class=\"primary-accordion ui-accordion ui-widget ui-helper-reset paragraph paragraph--type-- paragraph--view-mode--child-page\" data-viewtype=\"health-topics-subaccordion\">\r\n<h3 class=\"field field--name-field-panel-title field--type-string field--label-hidden field__item\">Vaccines</h3>\r\n<div class=\"bodytext\">\r\n<div class=\"clearfix text-formatted field field--name-field-accordion-body field--type-text-long field--label-hidden field__item\">\r\n<p>Vaccines are available to prevent pneumonia caused by pneumococcal bacteria or the flu virus, or influenza. Vaccines can't prevent all cases of infection. However, compared to people who don't get vaccinated, those who are vaccinated and still get pneumonia tend to have:</p>\r\n<ul>\r\n<li>Milder infections</li>\r\n<li>Pneumonia that doesn't last as long</li>\r\n<li>Fewer serious complications</li>\r\n</ul>\r\n<h4>Pneumococcal pneumonia vaccines</h4>\r\n<p>Two vaccines are available to prevent pneumococcal pneumonia and potentially fatal complications such as bacteremia and <span class=\"entity-embed full\">meningitis</span>. Pneumococcal vaccines are particularly important for:</p>\r\n<ul>\r\n<li>Adults who are 65 years old or older.</li>\r\n<li>People who have chronic (ongoing) diseases, serious long-term health problems, or weak immune systems. For example, this may include people who have cancer, HIV/AIDS, asthma, sickle cell disease, or damaged or removed spleens.</li>\r\n<li>People who smoke.</li>\r\n<li>Children who are younger than five years old.</li>\r\n<li>Children older than five years of age with certain medical conditions such as heart or lung diseases or cancer.</li>\r\n</ul>\r\n<p>The Centers for Disease Control and Prevention (CDC) recommends that <strong>adults who are 65 and older should have two pneumococcal vaccinations.</strong> Visit the CDC&rsquo;s <a class=\"ext\" title=\"Hyperlink\" href=\"http://www.cdc.gov/vaccines/vpd-vac/pneumo/default.htm\" target=\"_blank\" rel=\"nofollow noopener nofererer\">Pneumococcal Vaccination</a><a class=\"ext-icon\" href=\"https://www.nhlbi.nih.gov/health-topics/pneumonia#\"><span class=\"element-invisible\"> external link </span></a> for information about pneumococcal pneumonia vaccines for adults.</p>\r\n<h4>Influenza (flu) vaccine</h4>\r\n<p>Because many people get pneumonia after having influenza or the flu, your yearly flu vaccine can help you and your family not get pneumonia. The flu vaccine is usually given in September through November before the months when influenza or the flu is most frequently spread.</p>\r\n<p>For more information about the influenza or flu vaccine, go to the CDC's&nbsp;<a class=\"ext\" title=\"Hyperlink\" href=\"http://www.cdc.gov/vaccines/vpd-vac/flu/default.htm\" target=\"_blank\" rel=\"nofollow noopener nofererer\">Seasonal Influenza (Flu) Vaccination</a><a class=\"ext-icon\" href=\"https://www.nhlbi.nih.gov/health-topics/pneumonia#\"><span class=\"element-invisible\"> external link </span></a>Web page.</p>\r\n<h4>Hib vaccine</h4>\r\n<p><em>Haemophilus influenzae</em>&nbsp;type b (Hib) is a type of bacteria that can cause pneumonia and <span class=\"entity-embed full\">meningitis</span>. The Hib vaccine is given to children to help prevent these infections. The vaccine is recommended for all children in the United States who are younger than five years old. The vaccine often is given to infants starting at two months of age.</p>\r\n<p>For more information about the Hib vaccine, go to the CDC's&nbsp;<a class=\"ext\" title=\"Hyperlink\" href=\"http://www.cdc.gov/vaccines/vpd-vac/hib/default.htm\" target=\"_blank\" rel=\"nofollow noopener nofererer\">Hib Vaccination</a><a class=\"ext-icon\" href=\"https://www.nhlbi.nih.gov/health-topics/pneumonia#\"><span class=\"element-invisible\"> external link </span></a>Web page.</p>\r\n</div>\r\n</div>\r\n<h3 class=\"field field--name-field-panel-title field--type-string field--label-hidden field__item\">Other ways to help prevent pneumonia</h3>\r\n<div class=\"bodytext\">\r\n<div class=\"clearfix text-formatted field field--name-field-accordion-body field--type-text-long field--label-hidden field__item\">\r\n<p>You also can take the following steps to help prevent pneumonia:</p>\r\n<ul>\r\n<li><strong>Wash your hands</strong> with soap and water or alcohol-based rubs to kill germs.</li>\r\n<li><strong>Don't smoke</strong>. Smoking damages your lungs' ability to filter out and defend against germs.</li>\r\n<li>Although this resource focuses on heart health, it includes general information about how to quit smoking.</li>\r\n<li><strong>Keep your immune system strong</strong>. Get plenty of rest and physical activity and follow a healthy diet.</li>\r\n</ul>\r\n<div id=\"signs-symptoms-and-complications\" class=\"accordion-header-secondary ui-accordion-header ui-corner-top ui-state-default ui-accordion-icons ui-accordion-header-active ui-state-active\" tabindex=\"0\" title=\"Signs, Symptoms, and Complications - Pneumonia\">\r\n<h2 class=\"field field--name-field-display-title field--type-string field--label-hidden field__item\">Signs, Symptoms, and Complications<span class=\"ui-helper-hidden-accessible\"><br /></span></h2>\r\n</div>\r\n<div id=\"ui-id-15\" class=\"ui-accordion-content ui-corner-bottom ui-helper-reset ui-widget-content ui-accordion-content-active\" style=\"height: 100%;\">\r\n<div class=\"field field--name-field-expanding-content field--type-entity-reference-revisions field--label-hidden field__item\">\r\n<div class=\"readMoreContainer paragraph paragraph--type--intro-text paragraph--view-mode--default\">\r\n<div class=\"bodytext\">\r\n<div class=\"clearfix text-formatted field field--name-field-introduction field--type-text-long field--label-hidden field__item\">\r\n<p>The signs and symptoms of pneumonia vary from mild to severe. But some people are at risk&nbsp;for developing more severe pneumonia or potentially fatal complications.</p>\r\n<h3>Signs and Symptoms</h3>\r\n<p>See your doctor promptly if you have the following signs and symptoms:</p>\r\n<ul>\r\n<li>Have a high fever</li>\r\n<li>Have shaking chills</li>\r\n<li>Have a cough with phlegm (a slimy substance), which doesn't improve or worsens</li>\r\n<li>Develop shortness of breath with normal daily activities</li>\r\n<li>Have chest pain when you breathe or cough</li>\r\n<li>Feel suddenly worse after a cold or the flu</li>\r\n</ul>\r\n<p>If you have pneumonia, you also may have other symptoms, including nausea (feeling sick to the stomach), vomiting, and diarrhea.</p>\r\n<p>Symptoms may vary in certain populations. Newborns and infants may not show any signs of the infection. Or, they may vomit, have a fever and cough, or appear restless, sick, or tired and without energy.</p>\r\n<p>Older adults and people who have serious illnesses or weak immune systems may have fewer and milder symptoms. They may even have a lower than normal temperature. If they already have a lung disease, it may get worse. Older adults who have pneumonia sometimes have sudden changes in mental awareness.</p>\r\n<h3>Complications</h3>\r\n<p>Often, people who have pneumonia can be successfully treated&nbsp;and do not have complications. Possible complications of pneumonia may include:</p>\r\n<ul>\r\n<li><strong>Bacteremia</strong> <strong>and septic shock.</strong> <span class=\"entity-embed full\">Bacteremia</span> is a serious complication in which bacteria from the initial site of infection spread into the blood. It may lead to <span class=\"entity-embed full\">septic shock</span>, a potentially fatal complication.</li>\r\n<li><strong>Lung abscesses.</strong>&nbsp;<span class=\"entity-embed full\">Lung abscesses</span> usually are treated with antibiotics. Sometimes surgery or drainage with a needle is needed to remove the pus.</li>\r\n<li><strong>Pleural effusions, empyema, and pleurisy. </strong>These painful or even potentially fatal complications can occur if pneumonia is not treated. The pleura is a membrane that consists of two large, thin layers of tissue. One layer wraps around the outside of your lungs and the other layer lines the inside of your chest cavity. Pleurisy is when the two layers of the pleura become irritated and inflamed, causing sharp pain each time you breathe in. The pleural space is a very thin space between the two pleura. Pleural effusions are the build-up of fluid in the pleural space. If the fluid becomes infected, it is called empyema. If this happens, you may need to have the fluid drained through a chest tube or removed with surgery.</li>\r\n<li><strong>Renal failure</strong></li>\r\n<li><strong>Respiratory failure</strong></li>\r\n</ul>\r\n<div id=\"diagnosis\" class=\"accordion-header-secondary ui-accordion-header ui-corner-top ui-state-default ui-accordion-icons ui-accordion-header-active ui-state-active\" tabindex=\"0\" title=\"Diagnosis - Pneumonia\">\r\n<h2 class=\"field field--name-field-display-title field--type-string field--label-hidden field__item\">Diagnosis</h2>\r\n</div>\r\n<div id=\"ui-id-16\" class=\"ui-accordion-content ui-corner-bottom ui-helper-reset ui-widget-content ui-accordion-content-active\" style=\"height: 100%;\">\r\n<div class=\"field field--name-field-expanding-content field--type-entity-reference-revisions field--label-hidden field__item\">\r\n<div class=\"readMoreContainer paragraph paragraph--type--intro-text paragraph--view-mode--default\">\r\n<div class=\"bodytext\">\r\n<div class=\"clearfix text-formatted field field--name-field-introduction field--type-text-long field--label-hidden field__item\">\r\n<p>Sometimes pneumonia is hard to diagnose because it may cause symptoms&nbsp;commonly seen in people with colds or the flu. You may not realize it's more serious until it lasts longer than these other conditions. Your doctor will diagnose pneumonia based on your medical history, a physical exam, and test results. Your doctor may be able to diagnose you with a certain type of pneumonia based on how you got your infection and the type of germ causing your infection.</p>\r\n<h3>Medical history</h3>\r\n<p>Your doctor will ask about your&nbsp;signs and symptoms&nbsp;and how and when they began. To find out whether you have bacterial, viral, or fungal pneumonia, your doctor also may ask about:</p>\r\n<ul>\r\n<li>Any recent traveling you've done</li>\r\n<li>Your hobbies</li>\r\n<li>Your exposure to animals</li>\r\n<li>Your exposure to sick people at home, school, or work</li>\r\n<li>Your past and current medical conditions, and whether any have gotten worse recently</li>\r\n<li>Any medicines you take</li>\r\n<li>Whether you smoke</li>\r\n<li>Whether you've had flu or pneumonia vaccinations</li>\r\n</ul>\r\n<h3>Physical exam</h3>\r\n<p>Your doctor will listen to your lungs with a stethoscope. If you have pneumonia, your lungs may make crackling, bubbling, and rumbling sounds when you inhale. Your doctor also may hear wheezing. Your doctor may find it hard to hear sounds of breathing in some areas of your chest.</p>\r\n<h3>Diagnostic tests</h3>\r\n<p>If your doctor thinks you have pneumonia, he or she may recommend one or more of the following tests.</p>\r\n<ul>\r\n<li>Chest x ray&nbsp;to look for inflammation in your lungs. A chest x ray is the best test for diagnosing pneumonia. However, this test won't tell your doctor what kind of germ is causing the pneumonia.</li>\r\n<li>Blood tests&nbsp;such as a complete blood count (CBC) to see if your immune system is actively fighting an infection.</li>\r\n<li><strong>Blood culture</strong> to find out whether you have a bacterial infection that has spread to your bloodstream. If so, your doctor can decide how to treat the infection.</li>\r\n</ul>\r\n<p>Your doctor may recommend other tests if you're in the hospital, have serious symptoms, are older, or have other health problems.</p>\r\n<ul>\r\n<li><strong>Sputum test.</strong>&nbsp;Your doctor may collect a sample of sputum (spit) or phlegm (slimy substance from deep in your lungs) that was produced from one of your deep coughs and send the sample to the lab for testing. This may help your doctor find out if bacteria are causing your pneumonia. Then, he or she can plan your treatment.</li>\r\n<li>Chest computed tomography (CT) scan to see how much of your lungs is affected by your condition or to see if you have complications such as lung abscesses or pleural effusions. A CT scan shows more detail than a chest x ray.</li>\r\n<li><strong>Pleural fluid culture.</strong>&nbsp;For this test, a fluid sample is taken from the pleural space (a thin space between two layers of tissue that line the lungs and chest cavity). Doctors use a procedure called&nbsp;thoracentesis&nbsp;to collect the fluid sample. The fluid is studied for bacteria that may cause pneumonia.</li>\r\n<li><strong>Pulse oximetry.</strong>&nbsp;For this test, a small sensor is attached to your finger or ear. The sensor uses light to estimate how much oxygen is in your blood. Pneumonia can keep your lungs from moving enough oxygen into your bloodstream. If you're very sick, your doctor may need to measure the level of oxygen in your blood using a blood sample. The sample is taken from an artery, usually in your wrist. This test is called an arterial blood gas test.</li>\r\n<li>Bronchoscopy is a procedure used to look inside the lungs' airways. If you're in the hospital and treatment with antibiotics isn't working well, your doctor may use this procedure. Your doctor passes a thin, flexible tube through your nose or mouth, down your throat, and into the airways. The tube has a light and small camera that allow your doctor to see your windpipe and airways and take pictures. Your doctor can see whether something is blocking your airways or whether another factor is contributing to your pneumonia. Your doctor may use this procedure to collect samples of fluid from the site of pneumonia (called bronchoalveolar lavage or BAL) or to take small biopsies of lung tissue to help find the cause of your pneumonia.</li>\r\n</ul>\r\n<h3>Types of pneumonia</h3>\r\n<p>Your doctor may also diagnosis you with a certain type of pneumonia. Pneumonia is named for the way in which a person gets the infection or for the germ that causes the infection.</p>\r\n<ul>\r\n<li><strong>Community-Acquired Pneumonia (CAP).</strong> CAP is the most common type of pneumonia and is usually caused by pneumococcus bacteria. Most cases occur during the winter. CAP occurs outside of hospitals and other health care settings. Most people get CAP by breathing in germs (especially while sleeping) that live in the mouth, nose, or throat.</li>\r\n<li><strong>Hospital-Acquired Pneumonia (HAP)</strong>. HAP is when people catch pneumonia during a hospital stay for another illness. HAP tends to be more serious than CAP because you're already sick. Also, hospitals tend to have more germs that are resistant to antibiotics that are used to treat bacterial pneumonia.</li>\r\n<li><strong>Ventilator-associated pneumonia (VAP).</strong> VAP is when people who are on a&nbsp;ventilator machine to help them breathe get pneumonia.</li>\r\n<li><strong>Atypical pneumonia</strong>. Atypical pneumonia is a type of CAP. It is caused by lung infections with less common bacteria than the pneumococcus bacteria that cause CAP. Atypical bacteria include <em>Legionella pneumophila,&nbsp;Mycoplasma pneumoniae</em>,&nbsp;or&nbsp;<em>Chlamydia pneumoniae</em>.</li>\r\n<li><strong>Aspiration pneumonia</strong>. This type of pneumonia can occur if you inhale food, drink, vomit, or saliva from your mouth into your lungs. This may happen if something disturbs your normal gag reflex, such as a brain injury, swallowing problem, or excessive use of alcohol or drugs. Aspiration pneumonia can cause lung abscesses.</li>\r\n</ul>\r\n<div id=\"treatment\" class=\"accordion-header-secondary ui-accordion-header ui-corner-top ui-state-default ui-accordion-icons ui-accordion-header-active ui-state-active\" tabindex=\"0\" title=\"Treatment - Pneumonia\">\r\n<h2 class=\"field field--name-field-display-title field--type-string field--label-hidden field__item\">Treatment<span class=\"ui-helper-hidden-accessible\"><br /></span></h2>\r\n</div>\r\n<div id=\"ui-id-17\" class=\"ui-accordion-content ui-corner-bottom ui-helper-reset ui-widget-content ui-accordion-content-active\" style=\"height: 100%;\">\r\n<div class=\"field field--name-field-expanding-content field--type-entity-reference-revisions field--label-hidden field__item\">\r\n<div class=\"readMoreContainer paragraph paragraph--type--intro-text paragraph--view-mode--default\">\r\n<div class=\"bodytext\">\r\n<div class=\"clearfix text-formatted field field--name-field-introduction field--type-text-long field--label-hidden field__item\">\r\n<p>Treatment for pneumonia depends on the type of pneumonia you have, the germ causing your infection, and how severe your pneumonia is. Most people who have community-acquired pneumonia&mdash;the most common type of pneumonia&mdash;are treated at home. The goals of treatment are to cure the infection and prevent complications.</p>\r\n<h3>Bacterial pneumonia</h3>\r\n<p>Bacterial pneumonia is treated with medicines called antibiotics. You should take antibiotics as your doctor prescribes. You may start to feel better before you finish the medicine, but you should continue taking it as prescribed. If you stop too soon, the pneumonia may come back.</p>\r\n<p>Most people begin to improve after one to three days of antibiotic treatment. This means that they should feel better and have fewer symptoms such as&nbsp;cough and fever.</p>\r\n<h3>Viral pneumonia</h3>\r\n<p>Antibiotics don't work when the cause of pneumonia is a virus. If you have viral pneumonia, your doctor may prescribe an antiviral medicine to treat it. Viral pneumonia usually improves in one to three weeks.</p>\r\n<h3>Treating severe symptoms</h3>\r\n<p>You may need to be treated in a hospital if:</p>\r\n<ul>\r\n<li>Your symptoms are severe</li>\r\n<li>You're at risk for complications because of other health problems</li>\r\n</ul>\r\n<p>If the level of oxygen in your bloodstream is low, you may receive&nbsp;oxygen therapy. If you have bacterial pneumonia, your doctor may give you antibiotics through an intravenous (IV) line inserted into a vein.</p>\r\n<h3>General treatment advice and follow-up care</h3>\r\n<p>If you have pneumonia, follow your treatment plan, take all medicines as prescribed, and get follow-up medical care.</p>\r\n<div id=\"living-with\" class=\"accordion-header-secondary ui-accordion-header ui-corner-top ui-state-default ui-accordion-icons ui-accordion-header-active ui-state-active\" tabindex=\"0\" title=\"Living With - Pneumonia\">\r\n<h2 class=\"field field--name-field-display-title field--type-string field--la",
  "id": "3aecedc1-09d1-47eb-55a1-08d77e21eb9f",
  "expected": "Pneumonia is an infection in one or both of the lungs. Many germs, such as bacteria, viruses, and fungi, can cause pneumonia. You can also get pneumonia by inhaling a liquid or chemical. People most..."
},{
  "descriptionEnUs": "Test description",
  "id": "00000000-0000-0000-0000-000000000013",
  "expected": ""
},{
  "descriptionEnUs": "<p>Cold weather can affect your body in different ways. You can get frostbite, which is an injury to the body that is caused by freezing. Your body can also lose heat faster than you can produce it. That can cause hypothermia, or abnormally low body temperature. It can make you sleepy, confused, and clumsy. Because it happens gradually and affects your thinking, you may not realize you need help. That makes it especially dangerous. A body temperature below 95&deg; F is a medical emergency and can lead to death if not treated promptly.</p>\r\n<p>Anyone who spends much time outdoors in cold weather can get hypothermia. You can also get it from being cold and wet, or under cold water for too long. Babies and old people are especially at risk. Babies can get it from sleeping in a cold room.</p>\r\n<p>A serious emergency leading to an exposure to extreme cold are winter storms. Winter storms can bring extreme cold, freezing rain, snow, ice, and high winds. Staying safe and warm can be a challenge. You may have to cope with problems such as</p>\r\n<ul>\r\n<li>Cold-related health problems, including frostbite and hypothermia</li>\r\n<li>Household fires and carbon monoxide poisoning from space heaters and fireplaces</li>\r\n<li>Unsafe driving conditions from icy roads</li>\r\n<li>Power failures and loss of communication</li>\r\n<li>Floods after the snow and ice melt</li>\r\n</ul>\r\n<h3>How can I prepare for a winter weather emergency? </h3>\r\n<p>If there is a winter storm coming, there are things you can do to try to keep yourself and your loved ones safe:</p>\r\n<ul>\r\n<li>Have a disaster plan which includes<br />\r\n<ul>\r\n<li>Making sure that you have important phone numbers, including for your health care providers, pharmacy, and veterinarian</li>\r\n<li>Having a communication plan for your family</li>\r\n<li>Knowing how to get reliable information during the storm</li>\r\n</ul>\r\n</li>\r\n<li>Prepare your home to keep out the cold with insulation, caulking, and weather stripping. Learn how to keep pipes from freezing.</li>\r\n<li>Gather supplies in case you need to stay home for several days without power</li>\r\n<li>If you plan to use your fireplace or wood stove for emergency heating, have your chimney or flue inspected each year</li>\r\n<li>Install a smoke detector and a battery-operated carbon monoxide detector</li>\r\n<li>If you have to travel, be sure you have an emergency car kit with some basic supplies like<br />\r\n<ul>\r\n<li>An ice scraper</li>\r\n<li>A shovel</li>\r\n<li>Cat litter or sand for better tire traction</li>\r\n<li>Water and snacks</li>\r\n<li>Extra warm clothing</li>\r\n<li>Jumper cables</li>\r\n<li>First aid kit with any necessary medicines and a pocket knife</li>\r\n<li>A battery-powered radio, a flashlight, and extra batteries</li>\r\n<li>Emergency flares or distress flags</li>\r\n<li>Waterproof matches and a can to melt snow for water</li>\r\n</ul>\r\n</li>\r\n</ul>\r\n<p>If you do experience a disaster, it is normal to feel stressed. You may need help in finding ways to cope.<br /><br />Source: Centers for Disease Control and Prevention</p>",
  "id": "c869f17b-2a99-4319-5707-08d77e21eb9f",
  "expected": "Cold weather can affect your body in different ways. You can get frostbite, which is an injury to the body that is caused by freezing. Your body can also lose heat faster than you can produce it...."
},
,{
  "descriptionEnUs": "<p>Cold weather can affect your body in different ways.</p>",
  "id": "c869f17b-2a99-4319-5707-08d77e21eb9f",
  "expected": "Cold weather can affect your body in different ways."
}];
*/
