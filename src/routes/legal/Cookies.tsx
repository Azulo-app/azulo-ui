import React, { ReactElement } from 'react'
import styled from 'styled-components'
import {
  Card,
  Button,
  Title,
  Text,
  Divider,
  ButtonLink,
  Dot,
  Icon,
  Link as LinkSRC,
} from '@gnosis.pm/safe-react-components'
import Page from 'src/components/layout/Page'
import Link from 'src/components/layout/Link'
import Block from 'src/components/layout/Block'

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  margin: 24px auto 0;
  max-width: 700px
`
const StyledCardDouble = styled(Card)`
  display: flex;
  padding: 0;
`
const StyledCard = styled(Card)`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin: 0 20px 0 0;
  max-width: 27%;
  height: 276px;
`
const CardsCol = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 24px;
  width: 50%;
`
const StyledButton = styled(Button)`
  margin-top: auto;
  text-decoration: none;
`
const TitleWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  margin: 0 0 16px 0;

  h5 {
    color: white;
  }
`
const StyledTitle = styled(Title)`
  margin: 0 0 0 16px;
`
const StyledTitleOnly = styled(Title)`
  margin: 0 0 16px 0;
`
const StyledButtonLink = styled(ButtonLink)`
  margin: 16px 0 16px -8px;
`

type Props = {
  isOldMultisigMigration?: boolean
}

const Cookies = (): ReactElement => (
  <Page align="center">
        <Block>

      <>
        <Wrapper>
          <div>
            {/* Title */}
            <Title size="md" strong>
              Cookies
            </Title>

            {/* Subtitle */}
            <Title size="xs">
              Azulo cookies policy
            </Title>
            <p>Last updated on April, 2020</p>
            <p>&nbsp;</p>
            <p>As described in our Privacy Policy, For general web-browsing of this website, your personal data is not revealed to us, although certain statistical information is available to us via our internet service provider as well as through the use of special tracking technologies. Such information tells us about the pages you are clicking on or the hardware you are using, but not your name, age, address or anything we can use to identify you personally.</p>
            <p>This Cookie Policy sets out some further detail on how and why we use these technologies on our website. The terms "Gnosis", "we", "us", and "our" includes Gnosis Ltd. and our affiliates. The terms “you” and “your” includes our clients, business partners and users of this website. By using our website, you consent to storage and access to cookies and other technologies on your device, in accordance with this Cookie Policy.</p>

            <h4>What are cookies?</h4>
            <p>Cookies are a feature of web browser software that allows web servers to recognize the computer or device used to access a website. A cookie is a small text file that a website saves on your computer or mobile device when you visit the site. It enables the website to remember your actions and preferences (such as login, language, font size and other display preferences) over a period of time, so you don't have to keep re-entering them whenever you come back to the site or browse from one page to another.</p>

            <h4>What are the different types of cookies?</h4>
            <p>A cookie can be classified by its lifespan and the domain to which it belongs.</p>
            <p>By lifespan, a cookie is either a:</p>
            <ul>
              <li><strong>session cookie</strong> which is erased when the user closes the browser; or</li>
              <li><strong>persistent cookie</strong> which is saved to the hard drive and remains on the user's computer/device for a pre-defined period of time. As for the domain to which it belongs, cookies are either:</li>
              <li><strong>first-party cookie</strong> which are set by the web server of the visited page and share the same domain (i.e. set by us); or</li>
              <li><strong>third-party cookie</strong> stored by a different domain to the visited page's domain.</li>
            </ul>

            <h4>What cookies do we use and why?</h4>
            <p>We list all the cookies we use on this website in the APPENDIX below.</p>
            <p>We do not use cookies set by ourselves via our web developers (first-party cookies). We only have those set by others (third-party cookies).</p>
            <p>Cookies are also sometimes classified by reference to their purpose. We use the following cookies for the following purposes:</p>
            <ul>
              <li>Analytical/performance cookies: They allow us to recognize and count the number of visitors and to see how visitors move around our website when they are using it, as well as dates and times they visit. This helps us to improve the way our website works, for example, by ensuring that users are finding what they are looking for easily.</li>
              <li>Targeting cookies: These cookies record your visit to our website, the pages you have visited and the links you have followed, as well as time spent on our website, and the websites visited just before and just after our website. We will use this information to make our website and the advertising displayed on it more relevant to your interests. We may also share this information with third parties for this purpose.</li>
            </ul>
            <p>In general, we use cookies and other technologies (such as web server logs) on our website to enhance your experience and to collect information about how our website is used. This information is put together (‘aggregated’) and provides general and not individually specific information. None of this information is therefore associated with you as an individual and the cookie-related information is not used to identify you personally. It is therefore anonymized and ‘de-identified’. The pattern data is fully under our control and these cookies are not used for any purpose other than those described here.</p>
            <p>We will retain and evaluate information on your recent visits to our website and how you move around different sections of our website for analytics purposes to understand how people use our website so that we can make it more intuitive. The information also helps us to understand which parts of this website are most popular and generally to assess user behaviour and characteristics to measure interest in and use of the various areas of our website. This then allows us to improve our website and the way we market our business.</p>
            <p>This information may also be used to help us to improve, administer and diagnose problems with our server and website. The information also helps us monitor traffic on our website so that we can manage our website's capacity and efficiency.</p>

            <h4>Other Technologies</h4>
            <p>We may allow others to provide analytics services and serve advertisements on our behalf. In addition to the uses of cookies described above, these entities may use other methods, such as the technologies described below, to collect information about your use of our website and other websites and online services.</p>
            <p>Pixels tags. Pixel tags (which are also called clear GIFs, web beacons, or pixels), are small pieces of code that can be embedded on websites and emails. Pixels tags may be used to learn how you interact with our website pages and emails, and this information helps us, and our partners provide you with a more tailored experience.</p>
            <p>Device Identifiers. A device identifier is a unique label can be used to identify a mobile device. Device identifiers may be used to track, analyze and improve the performance of the website and ads delivered.</p>

            <h4>Other Technologies</h4>
            <p>We may allow others to provide analytics services and serve advertisements on our behalf. In addition to the uses of cookies described above, these entities may use other methods, such as the technologies described below, to collect information about your use of our website and other websites and online services.</p>
            <p>Pixels tags. Pixel tags (which are also called clear GIFs, web beacons, or pixels), are small pieces of code that can be embedded on websites and emails. Pixels tags may be used to learn how you interact with our website pages and emails, and this information helps us, and our partners provide you with a more tailored experience.</p>
            <p>Device Identifiers. A device identifier is a unique label can be used to identify a mobile device. Device identifiers may be used to track, analyze and improve the performance of the website and ads delivered.</p>
            <p>What data are collected by cookies and other technologies on our website?</p>
            <p>This information may include:</p>
            <ul>
              <li>the IP and logical address of the server you are using (but the last digits are anonymized so we cannot identify you).</li>
              <li>the top level domain name from which you access the internet (for example .ie, .com, etc)</li>
              <li>the type of browser you are using,</li>
              <li>the date and time you access our website</li>
              <li>the internet address linking to our website.</li>
            </ul>
            <p>This website also uses cookies to:</p>
            <ul>
              <li>remember you and your actions while navigating between pages;</li>
              <li>remember if you have agreed (or not) to our use of cookies on our website;</li>
              <li>ensure the security of the website;</li>
              <li>monitor and improve the performance of servers hosting the site;</li>
              <li>distinguish users and sessions;</li>
              <li>Improving the speed of the site when you access content repeatedly;</li>
              <li>determine new sessions and visits;</li>
              <li>show the traffic source or campaign that explains how you may have reached our website; and</li>
              <li>allow us to store any customization preferences where our website allows this</li>
            </ul>
            <p>We may also use other services, such as Google Analytics (described below) or other third-party cookies, to assist with analyzing performance on our website. As part of providing these services, these service providers may use cookies and the technologies described below to collect and store information about your device, such as time of visit, pages visited, time spent on each page of our website, links clicked and conversion information, IP address, browser, mobile network information, and type of operating system used.</p>

            <h4>Google Analytics Cookies</h4>
            <p>This website uses Google Analytics, a web analytics service provided by Google, Inc. ("Google").</p>
            <p>We use Google Analytics to track your preferences and also to identify popular sections of our website. Use of Google Analytics in this way, enables us to adapt the content of our website more specifically to your needs and thereby improve what we can offer to you.</p>
            <p>Google will use this information for the purpose of evaluating your use of our website, compiling reports on website activity for website operators and providing other services relating to website activity and internet usage. Google may also transfer this information to third parties where required to do so by law, or where such third parties process the information on Google's behalf. Google will not associate your IP address with any other data held by Google.</p>
            <p><strong>In particular Google Analytics tells us</strong></p>
            <ul>
              <li>your IP address (last 3 digits are masked);</li>
              <li>the number of pages visited;</li>
              <li>the time and duration of the visit;</li>
              <li>your location;</li>
              <li>the website you came from (if any);</li>
              <li>the type of hardware you use (i.e. whether you are browsing from a desktop or a mobile device);</li>
              <li>the software used (type of browser); and</li>
              <li>your general interaction with our website.</li>
            </ul>
            <p>As stated above, cookie-related information is not used to identify you personally, and what is compiled is only aggregate data that tells us, for example, what countries we are most popular in, but not that you live in a particular country or your precise location when you visited our website (this is because we have only half the information- we know the country the person is browsing from, but not the name of person who is browsing). In such an example Google will analyze the number of users for us, but the relevant cookies do not reveal their identities.</p>
            <p>By using this website, you consent to the processing of data about you by Google in the manner and for the purposes set out above. Google Analytics, its purpose and function is further explained on the Google Analytics website.</p>
            <p>For more information about Google Analytics cookies, please see Google's help pages and privacy policy: Google's Privacy Policy and Google Analytics Help pages. For further information about the use of these cookies by Google click here.</p>

            <h4>What if you don’t agree to us monitoring your use of our website (even we don’t collect your personal data)?</h4>
            <p>Enabling these cookies is not strictly necessary for our website to work but it will provide you with a better browsing experience. You can delete or block the cookies we set, but if you do that, some features of this website may not work as intended.</p>
            <p>Most browsers are initially set to accept cookies. If you prefer, you can set your browser to refuse cookies and control and/or delete cookies as you wish – for details, see aboutcookies.org. You can delete all cookies that are already on your device and you can set most browsers to prevent them from being placed. You should be aware that if you do this, you may have to manually adjust some preferences every time you visit an Internet site and some services and functionalities may not work if you do not accept the cookies they send.</p>
            <p>Advertisers and business partners that you access on or through our website may also send you cookies. We do not control any cookies outside of our website.</p>
            <p>If you have any further questions regarding disabling cookies you should consult with your preferred browser’s provider or manufacturer.</p>
            <p>In order to implement your objection it may be necessary to install an opt-out cookie on your browser. This cookie will only indicate that you have opted out. It is important to note, that for technical reasons, the opt-out cookie will only affect the browser from which you actively object from. If you delete the cookies in your browser or use a different end device or browser, you will need to opt out again.</p>
            <p>To opt out of being tracked by Google Analytics across all websites, Google has developed Google Analytics opt-out browser add-on. If you would like to opt out of Google Analytics, you have the option of downloading and installing this browser add-on which can be found under the link: http://tools.google.com/dlpage/gaoptout.</p>

            <h4>Revisions to this Cookie Policy</h4>
            <p>On this website, you can always view the latest version of our Privacy Policy and our Cookie Policy. We may modify this Cookie Policy from time to time. If we make changes to this Cookie Policy, we will provide notice of such changes, such as by sending an email notification, providing notice through our website or updating the ‘Last Updated’ date at the beginning of this Cookie Policy. The amended Cookie Policy will be effective immediately after the date it is posted. By continuing to access or use our website after the effective date, you confirm your acceptance of the revised Cookie Policy and all of the terms incorporated therein by reference. We encourage you to review our Privacy Policy and our Cookie Policy whenever you access or use our website to stay informed about our information practices and the choices available to you.</p>
            <p>If you do not accept changes which are made to this Cookie Policy, or take any measures described above to opt-out by removing or rejecting cookies, you may continue to use this website but accept that it may not display and/or function as intended by us. Any social media channels connected to Gnosis Ltd. and third party applications will be subject to the privacy and cookie policies and practices of the relevant platform providers which, unless otherwise indicated, are not affiliated or associated with Gnosis Ltd. Your exercise of any rights to opt-out may also impact how our information and content is displayed and/or accessible to you on this website and on other websites.</p>

            <h4>APPENDIX</h4>
            <p>Overview of cookies placed and the consequences if the cookies are not placed.</p>
            
            <table>
              <tbody>
                <tr>
                  <td><b>Category of cookies</b></td>
                  <td><b>Why we use these cookies</b></td>
                </tr>
                <tr>
                  <td><span>Required</span></td>
                  <td><span>These cookies are essential for our websites and services to perform basic functions and are necessary for us to operate certain features. These include those required to allow registered users to authenticate and perform account-related functions, store preferences set by users such as account name, language, and location, and ensure our services are operating properly.</span></td>
                </tr>
                <tr>
                  <td><span>Analytics and Performance</span></td>
                  <td><span>These cookies allow us to optimize performance by collecting information on how users interact with our websites, including which pages are visited most, as well as other analytical data. We use these details to improve how our websites function and to understand how users interact with them.</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </Wrapper>
      </>
    </Block>
  </Page>
)

export default Cookies