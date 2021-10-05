import React from 'react'

import '../styles/legacy/style.scss'
import AppBar from '../components/AppBar'
import Footer from '../components/Footer'
import { usePublicSettings } from '../myHooks/useSettings'

const Policy = () => {
  const { data: { publicSettings: { company = {} } = {} } = {} } = usePublicSettings()

  return (
    <div className="page-user">
      <AppBar />

      <div className="page-content">
        <div className="container">
          <div className="card content-area">
            <div className="card-innr">
              <div className="card-head">
                <h4 className="card-title card-title-lg">Privacy Policy</h4>
              </div>
              <div className="card-text">
                <p>

The importance of protecting personal data is very important to us. We take the utmost care to ensure the confidentiality of the data entrusted to us by you.

In accordance with the provisions of the EU General Data Protection Regulation (GDPR) and the Liechtenstein Data Protection Act (DSG), the following information gives you an overview of the processing of your personal data and your rights in this regard.

Data Protection Responsible Person

Responsible within the meaning of the GDPR is:

                  <p>
                    {(company || {}).name}
                    {' '}
                    <br />
                    {(company || {}).address}
                    {' '}
                    <br />
                    {(company || {}).email}
                    {' '}
                    <br />
                  </p>

Personal Data

We collect, process and use your personal data only with your consent or on basis of contractual agreements for the purposes agreed with you or if there is another legal basis in accordance with the GDPR; this in compliance with the data protection and civil law provisions.

Only those personal data are collected which are necessary for the performance and processing of our services or which you voluntarily provided to us.

Personal data is any data that contains details of personal or material circumstances, such as name, address, telephone number, fax number, e-mail address, gender, date of birth, age, social security number, insured number, tax ID, identity card data, photos, video and telephone recordings, voice recordings, consulting protocols and cookies. Sensitive data, such as health data or data related to criminal proceedings, may also be included.


Information and Cancellation

As a client or generally as an affected party you have at any time the right to information about your personal data stored, their origin and recipients and the purpose of data processing and a right to correction, data transfer, opposition, restriction of processing as well as blocking or deletion of incorrect or inadmissibly processed data.

As far as changes of your personal data arise, we ask for appropriate notice.

You have the right at any time to revoke your consent to the use of your personal data. Your request for information, deletion, correction, opposition and / or data transfer, in the latter case, unless this is a disproportionate effort, may be addressed to our address.

If you believe that the processing of your personal data by us violates the applicable data protection law or your data protection claims have been violated in another way, it is possible to complain to the competent supervisory authority. In Liechtenstein, the Data Protection Office is responsible for this.


Use of the Data

We will not process the information provided to us for purposes other than those covered by agreements or your consent or otherwise by any provision in accordance with the GDPR. Excepted from this is the use for statistical purposes, provided that the data provided have been anonymised.

The personal data you provide will be processed primarily to provide all necessary services under the contract. The legal basis for data processing is Article 6 (1) (b) GDPR.

Processing of personal data may be required for the purpose of fulfilling various legal obligations (eg Tax Act, Due Diligence Act, AEI, FATCA, etc.) as well as regulatory requirements. The legal basis for data processing is Article 6 (1) (c) GDPR.

When you visit our website, the browser used on your device automatically sends information to the server of our website. This information is temporarily stored in a so-called log file. The following information will be collected without your intervention and stored until automated deletion:

IP address of the requesting computer;
date and time of access;
name and URL of the retrieved file;
website from which access is made (referrer URL);
the browser used and, if applicable, the operating system of your computer and the name of your access provider.

The data mentioned are processed by us for the following purposes:

Ensuring a smooth connection of the website;
ensuring comfortable use of our website;
evaluation of system security and stability and for further administrative purposes.

The legal basis for data processing is Article 6 (1) (f) GDPR. Our legitimate interest follows from the data collection purposes listed above. In no case we use the collected data for the purpose of drawing conclusions about you.

In addition, we use cookies when visiting our website, whereas the website contains content from third parties (hereinafter referred to as ‘Third-party Providers’). To use such content, the transfer of the user’s IP address to the respective Third-party Provider is required for technical purposes. Because without the IP address, the Third-party Provider would not be able to send the content embedded in the website to the respective user’s browser. We have no influence on whether a Third-party Provider stores or otherwise uses the IP address for statistical purposes. Third-party Providers are independent owners of cookies, so their policies apply.

Third-party Providers are:

GOOGLE
FACEBOOK
GOOGLE ANALYTICS

Please refer to the Cookie Policy available on our website for further details.

If you contact us by email, letter or telephone, your details will be stored for the purpose of processing the request and in case of follow-up questions. The data processing for the purpose of contacting us takes place in accordance with Article 6 (1) (a) GDPR on the basis of your voluntarily granted consent. The personal data collected by us will be automatically deleted after completion of the request made by you.


Transmission of data to third parties

We take the protection of your personal rights very seriously. We assure that we will not sell or rent your information to other providers. In order to provide an exemplary service, we may only provide personal information to reputable contractors who are required to protect this information in accordance with the Privacy Policy. These companies work for us (agencies, newsletter providers, etc) or can help us to process information, execute orders, accept services, deliver products to you, manage and maintain customer data, and provide customer service, to evaluate your interest in our products and services, conduct market research or conduct customer satisfaction surveys. These companies are required to protect your personal information in accordance with our Privacy Policy for the protection of personal rights and are also subject to the GDPR. We may also be required by law or legal process to disclose your personal information.

Some of the above recipients of your personal data are located outside your country or process your personal information there. The level of data protection in other countries may not be the same as Liechtenstein's. However, we only transfer your personal data to countries for which the EU Commission has determined that they have an adequate level of data protection, or we take measures to ensure that all recipients have an adequate level of data protection, to which we include standard contractual clauses (2010/87/EC and / or 2004/915/EC).


Data Security

The protection of your personal data takes place through appropriate organisational and technical precautions. These precautions relate in particular to protection against unauthorised, unlawful or accidental access, processing, loss, use and manipulation.

Despite security measures, it cannot be ruled out that information that you provide to us via the Internet or by telephone, fax or otherwise in writing, will be viewed and used by other persons.

Please note that we therefore accept no liability whatsoever for the disclosure of information due to non-caused errors in the data transfer and / or unauthorised access by third parties (eg hacking on e-mail account or telephone, intercepting faxes and letters).

The website uses industry standard SSL (Secure Sockets Layer) encryption. This will ensure the confidentiality of your personal information over the Internet. But we also take internal precautions to protect your personal data from loss, theft and misuse and from unauthorised access, disclosure, modification and destruction. You are also called upon to help us protecting your personal data by taking appropriate precautionary measures. Change your password more frequently, protect it, and be careful when delivering sensitive information. Use strong passwords and be sure to always use a secure web browser or web services.


Protection of Personal Rights

As already mentioned, we take the protection of your personal rights very seriously. To ensure the security of your personal information, this Privacy Policy is shared with all employees and strict safeguards are put into place to protect personal rights within the company. The website contains links to websites of other companies. We are not responsible for the privacy practices of these companies, so we encourage you to check their privacy policy with these companies.


Holding personal information up-to-date

We have also taken internal action to ensure that your personal information is always accurate, complete and up-to-date for the purpose intended. Of course, you always have the right to access and modify the personal information you provide. You can help us to make sure that your contact information and preferences are correct, complete and up-to-date.


Email Newsletter

With our email newsletter we inform you regularly about the offers and services of the company. If you wish to receive the newsletter, we require a valid email address from you, as well as information that allows us to verify that you or the owner of the email address you have agreed to receive the newsletter. Further data is not collected. These data are used only for sending the newsletter. Subscribers to the email newsletter may revoke their consent to the storage of the data and their use for sending the newsletter at any time. The revocation can be made via a link in the newsletter itself or by email with the subject "unsubscribe".

When registering for our newsletter, you will immediately receive an email containing a hyperlink. By clicking on this link, you confirm your newsletter registration (double opt-in procedure). If this registration confirmation is not received within 48 hours, we will delete the email address from our temporary list and no registration has been made.


Storage of the data

We will not retain data for longer than is necessary to fulfil our contractual or legal obligations and to avert any possible liability claims.


Profiling

We do not use automated decision-making or profiling according to Article 22 GDPR.


Announcement of data breaches

We will endeavour to ensure that any data breaches are detected early and, where appropriate, promptly reported to you or the relevant regulatory authority, including the relevant data categories involved.


Updating and changing this Privacy Policy

This Privacy Policy is currently valid and is valid as of 09.01.2019

As a result of the further development of our website and offers thereof or due to changed legal or official requirements, it may be necessary to change this Privacy Policy. The current Privacy Policy can be viewed and printed out at any time on the website at the privacy URL in the footer.


                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}

export default Policy
