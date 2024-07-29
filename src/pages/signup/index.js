/************************************************************************************************
 *                               IMPORTANT LICENSE INFORMATION                                  *
 * This file is part of Ministry Resource Sity by Redmane Digital which is released under RDSL. *
 * See file LICENSE for full license details.                                                   *
 ************************************************************************************************/

import React, { useState, useEffect } from 'react';
import { Link, navigate } from 'gatsby';
import { useAuth, getSSO, useQueryString } from '../../hooks';
import booksImgJPG from '../../images/hero__books.jpg';
import booksImgWebP from '../../images/hero__books.webp';
import PasswordStrengthBar from 'react-password-strength-bar';
import Layout from '../../components/layout';
import SEO from '../../components/seo';
import { useSelector } from 'react-redux';
import useYourPbc from '../../images/useyourPBC.jpg';
import { useTranslations, useTranslateContext } from 'gatsby-plugin-translate';
import { translateLink } from '../../hooks';
import BackgroundImage from '../../components/atoms/BackgroundImage';
import * as styles from './styles.module.scss';
import config from './config';

const SignUp = ({ location }) => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const { newUser } = useAuth();
  const [queryString, setQueryString] = useState('');
  const [error, setError] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState();
  const [formData, setFormData] = useState({
    churchCountry: 'United States of America',
  });
  const { ref, return_to, nopbc } = useQueryString(location.search);
  const t = useTranslations();
  const { language } = useTranslateContext();
  const handleChange = function (e) {
    setFormData({
      ...formData,
      [e.target.id]: e.target.checked || e.target.value,
    });
  };
  const handleSubmit = function (e) {
    e.preventDefault();
    const {
      firstName,
      lastName,
      email,
      password,
      phone,
      churchName,
      churchLocation,
      churchPosition,
      agreedToTerms,
      churchCity,
      churchState,
      churchZip,
      churchCountry,
    } = formData;
    if (passwordStrength < 3)
      return setError(
        'Please use a strong password, at least 8 characters long'
      );
    newUser({
      email,
      password,
      firstName,
      lastName,
      phone,
      churchName,
      churchLocation,
      churchCity,
      churchState,
      churchZip,
      churchCountry,
      churchPosition,
      agreedToTerms,
    }).then((res) => {
      if (res.success === false) {
        console.log(res.msg);
      }
    });
  };

  const canUsePbcSSO = false;

  useEffect(() => {
    const redirectIfAuth = async () => {
      if (isAuthenticated) {
        let goTo;
        if (ref == 'pbcaccess') {
          const tmp = {
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
          };
          if (return_to) tmp.return_to = return_to;
          goTo = await getSSO(tmp);
          window.location = goTo;
        } else {
          const goTo =
            location?.state && location.state.from
              ? location.state.from
              : translateLink('/', language);
          navigate(translateLink(goTo, language));
        }
      }
    };
    redirectIfAuth();
  }, [isAuthenticated]);

  useEffect(() => {
    if (typeof window !== undefined) {
      const params = new URLSearchParams(window.location.search).toString();
      if (params.length > 0) setQueryString(`?${params}`);
    }
  }, []);

  return (
    <Layout location={location}>
      <SEO title={t`Sign Up`} />
      <section className="position-relative">
        <BackgroundImage
          jpgSrc={booksImgJPG}
          webpSrc={booksImgWebP}
          altText="Sign Up"
        />
        <div className="container py-5">
          <h1 className={config.hero.h1.classes}>{t`Create An Account`}</h1>
        </div>
      </section>
      <section className="container reduced-width my-5">
        {!nopbc && canUsePbcSSO && (
          <div class="mhr-signin mt-0">
            <a
              class="mhr-btn mt-0 mb-3"
              href="https://www.pbcaccess.com/pages/sign_into_mhr"
            >
              <img src={useYourPbc} alt="Sign-in with PBC Access" />
            </a>
            <div class="text-divider">{t`OR`}</div>
          </div>
        )}
        {error && (
          <div className="alert alert-danger mb-3" role="alert">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="row mb-3">
            <label className="form-label">{t`Name`}</label>
            <div className="col-12 col-md-6 mb-md-0 mb-3">
              <input
                type="text"
                aria-label="First name"
                id="firstName"
                className={`form-control ${styles.formField}`}
                onChange={handleChange}
                required
              />
              <label
                htmlFor="firstName"
                className="form-text"
              >{t`First`}</label>
            </div>
            <div className="col-12 col-md-6">
              <input
                type="text"
                aria-label="Last name"
                id="lastName"
                className={`form-control ${styles.formField}`}
                onChange={handleChange}
                required
              />
              <label htmlFor="lastName" className="form-text">{t`Last`}</label>
            </div>
          </div>
          <div className="mb-3">
            <label
              htmlFor="password"
              className="form-label"
            >{t`Password`}</label>
            <input
              type="password"
              className={`form-control ${styles.formField} mb-2`}
              id="password"
              onChange={handleChange}
              required
            />
            <PasswordStrengthBar
              password={formData.password}
              minLength={8}
              scoreWordClassName="text-uppercase"
              onChangeScore={(score) => setPasswordStrength(score)}
            />
          </div>
          <div className="mb-3">
            <label
              htmlFor="churchName"
              className="form-label"
            >{t`Church Name`}</label>
            <input
              type="text"
              className={`form-control ${styles.formField} mb-2`}
              id="churchName"
              onChange={handleChange}
              required
            />
            <div class="invalid-feedback">{t`Please enter your church's name.`}</div>
          </div>
          <div className="mb-3">
            <label
              htmlFor="churchLocation"
              className="form-label"
            >{t`Street Address`}</label>
            <input
              type="text"
              className={`form-control ${styles.formField} mb-2`}
              id="churchLocation"
              onChange={handleChange}
              required
            />
            <div class="invalid-feedback">{t`Please provide the street address of your church.`}</div>
          </div>
          <div className="mb-3 row">
            <div className="col-12 col-md-6">
              <label
                htmlFor="churchCity"
                className="form-label"
              >{t`City`}</label>
              <input
                type="text"
                className={`form-control ${styles.formField} mb-2`}
                id="churchCity"
                onChange={handleChange}
                required
              />
            </div>
            <div className="col-12 col-md-3">
              <label
                htmlFor="churchState"
                className="form-label"
              >{t`State / Province / Region`}</label>
              <input
                className={`form-select ${styles.formField} mb-3`}
                id="churchState"
                onChange={handleChange}
                required
              />
            </div>
            <div className="col-12 col-md-3">
              <label
                htmlFor="churchZip"
                className="form-label"
              >{t`Postal Code`}</label>
              <input
                className={`form-select ${styles.formField} mb-3`}
                id="churchZip"
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <div className="mb-3">
            <label
              htmlFor="churchCountry"
              className="form-label"
            >{t`Country`}</label>
            <select
              className={`form-select ${styles.formField}`}
              name="country"
              id="churchCountry"
              onChange={handleChange}
              required
            >
              <option value="Afganistan">Afghanistan</option>
              <option value="Albania">Albania</option>
              <option value="Algeria">Algeria</option>
              <option value="American Samoa">American Samoa</option>
              <option value="Andorra">Andorra</option>
              <option value="Angola">Angola</option>
              <option value="Anguilla">Anguilla</option>
              <option value="Antigua &amp; Barbuda">
                Antigua &amp; Barbuda
              </option>
              <option value="Argentina">Argentina</option>
              <option value="Armenia">Armenia</option>
              <option value="Aruba">Aruba</option>
              <option value="Australia">Australia</option>
              <option value="Austria">Austria</option>
              <option value="Azerbaijan">Azerbaijan</option>
              <option value="Bahamas">Bahamas</option>
              <option value="Bahrain">Bahrain</option>
              <option value="Bangladesh">Bangladesh</option>
              <option value="Barbados">Barbados</option>
              <option value="Belarus">Belarus</option>
              <option value="Belgium">Belgium</option>
              <option value="Belize">Belize</option>
              <option value="Benin">Benin</option>
              <option value="Bermuda">Bermuda</option>
              <option value="Bhutan">Bhutan</option>
              <option value="Bolivia">Bolivia</option>
              <option value="Bonaire">Bonaire</option>
              <option value="Bosnia &amp; Herzegovina">
                Bosnia &amp; Herzegovina
              </option>
              <option value="Botswana">Botswana</option>
              <option value="Brazil">Brazil</option>
              <option value="British Indian Ocean Ter">
                British Indian Ocean Ter
              </option>
              <option value="Brunei">Brunei</option>
              <option value="Bulgaria">Bulgaria</option>
              <option value="Burkina Faso">Burkina Faso</option>
              <option value="Burundi">Burundi</option>
              <option value="Cambodia">Cambodia</option>
              <option value="Cameroon">Cameroon</option>
              <option value="Canada">Canada</option>
              <option value="Canary Islands">Canary Islands</option>
              <option value="Cape Verde">Cape Verde</option>
              <option value="Cayman Islands">Cayman Islands</option>
              <option value="Central African Republic">
                Central African Republic
              </option>
              <option value="Chad">Chad</option>
              <option value="Channel Islands">Channel Islands</option>
              <option value="Chile">Chile</option>
              <option value="China">China</option>
              <option value="Christmas Island">Christmas Island</option>
              <option value="Cocos Island">Cocos Island</option>
              <option value="Colombia">Colombia</option>
              <option value="Comoros">Comoros</option>
              <option value="Congo">Congo</option>
              <option value="Cook Islands">Cook Islands</option>
              <option value="Costa Rica">Costa Rica</option>
              <option value="Cote DIvoire">Cote D'Ivoire</option>
              <option value="Croatia">Croatia</option>
              <option value="Cuba">Cuba</option>
              <option value="Curaco">Curacao</option>
              <option value="Cyprus">Cyprus</option>
              <option value="Czech Republic">Czech Republic</option>
              <option value="Denmark">Denmark</option>
              <option value="Djibouti">Djibouti</option>
              <option value="Dominica">Dominica</option>
              <option value="Dominican Republic">Dominican Republic</option>
              <option value="East Timor">East Timor</option>
              <option value="Ecuador">Ecuador</option>
              <option value="Egypt">Egypt</option>
              <option value="El Salvador">El Salvador</option>
              <option value="Equatorial Guinea">Equatorial Guinea</option>
              <option value="Eritrea">Eritrea</option>
              <option value="Estonia">Estonia</option>
              <option value="Ethiopia">Ethiopia</option>
              <option value="Falkland Islands">Falkland Islands</option>
              <option value="Faroe Islands">Faroe Islands</option>
              <option value="Fiji">Fiji</option>
              <option value="Finland">Finland</option>
              <option value="France">France</option>
              <option value="French Guiana">French Guiana</option>
              <option value="French Polynesia">French Polynesia</option>
              <option value="French Southern Ter">French Southern Ter</option>
              <option value="Gabon">Gabon</option>
              <option value="Gambia">Gambia</option>
              <option value="Georgia">Georgia</option>
              <option value="Germany">Germany</option>
              <option value="Ghana">Ghana</option>
              <option value="Gibraltar">Gibraltar</option>
              <option value="Great Britain">Great Britain</option>
              <option value="Greece">Greece</option>
              <option value="Greenland">Greenland</option>
              <option value="Grenada">Grenada</option>
              <option value="Guadeloupe">Guadeloupe</option>
              <option value="Guam">Guam</option>
              <option value="Guatemala">Guatemala</option>
              <option value="Guinea">Guinea</option>
              <option value="Guyana">Guyana</option>
              <option value="Haiti">Haiti</option>
              <option value="Hawaii">Hawaii</option>
              <option value="Honduras">Honduras</option>
              <option value="Hong Kong">Hong Kong</option>
              <option value="Hungary">Hungary</option>
              <option value="Iceland">Iceland</option>
              <option value="India">India</option>
              <option value="Indonesia">Indonesia</option>
              <option value="Iran">Iran</option>
              <option value="Iraq">Iraq</option>
              <option value="Ireland">Ireland</option>
              <option value="Isle of Man">Isle of Man</option>
              <option value="Israel">Israel</option>
              <option value="Italy">Italy</option>
              <option value="Jamaica">Jamaica</option>
              <option value="Japan">Japan</option>
              <option value="Jordan">Jordan</option>
              <option value="Kazakhstan">Kazakhstan</option>
              <option value="Kenya">Kenya</option>
              <option value="Kiribati">Kiribati</option>
              <option value="Korea North">Korea North</option>
              <option value="Korea Sout">Korea South</option>
              <option value="Kuwait">Kuwait</option>
              <option value="Kyrgyzstan">Kyrgyzstan</option>
              <option value="Laos">Laos</option>
              <option value="Latvia">Latvia</option>
              <option value="Lebanon">Lebanon</option>
              <option value="Lesotho">Lesotho</option>
              <option value="Liberia">Liberia</option>
              <option value="Libya">Libya</option>
              <option value="Liechtenstein">Liechtenstein</option>
              <option value="Lithuania">Lithuania</option>
              <option value="Luxembourg">Luxembourg</option>
              <option value="Macau">Macau</option>
              <option value="Macedonia">Macedonia</option>
              <option value="Madagascar">Madagascar</option>
              <option value="Malaysia">Malaysia</option>
              <option value="Malawi">Malawi</option>
              <option value="Maldives">Maldives</option>
              <option value="Mali">Mali</option>
              <option value="Malta">Malta</option>
              <option value="Marshall Islands">Marshall Islands</option>
              <option value="Martinique">Martinique</option>
              <option value="Mauritania">Mauritania</option>
              <option value="Mauritius">Mauritius</option>
              <option value="Mayotte">Mayotte</option>
              <option value="Mexico">Mexico</option>
              <option value="Midway Islands">Midway Islands</option>
              <option value="Moldova">Moldova</option>
              <option value="Monaco">Monaco</option>
              <option value="Mongolia">Mongolia</option>
              <option value="Montserrat">Montserrat</option>
              <option value="Morocco">Morocco</option>
              <option value="Mozambique">Mozambique</option>
              <option value="Myanmar">Myanmar</option>
              <option value="Nambia">Nambia</option>
              <option value="Nauru">Nauru</option>
              <option value="Nepal">Nepal</option>
              <option value="Netherland Antilles">Netherland Antilles</option>
              <option value="Netherlands">Netherlands (Holland, Europe)</option>
              <option value="Nevis">Nevis</option>
              <option value="New Caledonia">New Caledonia</option>
              <option value="New Zealand">New Zealand</option>
              <option value="Nicaragua">Nicaragua</option>
              <option value="Niger">Niger</option>
              <option value="Nigeria">Nigeria</option>
              <option value="Niue">Niue</option>
              <option value="Norfolk Island">Norfolk Island</option>
              <option value="Norway">Norway</option>
              <option value="Oman">Oman</option>
              <option value="Pakistan">Pakistan</option>
              <option value="Palau Island">Palau Island</option>
              <option value="Palestine">Palestine</option>
              <option value="Panama">Panama</option>
              <option value="Papua New Guinea">Papua New Guinea</option>
              <option value="Paraguay">Paraguay</option>
              <option value="Peru">Peru</option>
              <option value="Phillipines">Philippines</option>
              <option value="Pitcairn Island">Pitcairn Island</option>
              <option value="Poland">Poland</option>
              <option value="Portugal">Portugal</option>
              <option value="Puerto Rico">Puerto Rico</option>
              <option value="Qatar">Qatar</option>
              <option value="Republic of Montenegro">
                Republic of Montenegro
              </option>
              <option value="Republic of Serbia">Republic of Serbia</option>
              <option value="Reunion">Reunion</option>
              <option value="Romania">Romania</option>
              <option value="Russia">Russia</option>
              <option value="Rwanda">Rwanda</option>
              <option value="St Barthelemy">St Barthelemy</option>
              <option value="St Eustatius">St Eustatius</option>
              <option value="St Helena">St Helena</option>
              <option value="St Kitts-Nevis">St Kitts-Nevis</option>
              <option value="St Lucia">St Lucia</option>
              <option value="St Maarten">St Maarten</option>
              <option value="St Pierre &amp; Miquelon">
                St Pierre &amp; Miquelon
              </option>
              <option value="St Vincent &amp; Grenadines">
                St Vincent &amp; Grenadines
              </option>
              <option value="Saipan">Saipan</option>
              <option value="Samoa">Samoa</option>
              <option value="Samoa American">Samoa American</option>
              <option value="San Marino">San Marino</option>
              <option value="Sao Tome &amp; Principe">
                Sao Tome &amp; Principe
              </option>
              <option value="Saudi Arabia">Saudi Arabia</option>
              <option value="Senegal">Senegal</option>
              <option value="Serbia">Serbia</option>
              <option value="Seychelles">Seychelles</option>
              <option value="Sierra Leone">Sierra Leone</option>
              <option value="Singapore">Singapore</option>
              <option value="Slovakia">Slovakia</option>
              <option value="Slovenia">Slovenia</option>
              <option value="Solomon Islands">Solomon Islands</option>
              <option value="Somalia">Somalia</option>
              <option value="South Africa">South Africa</option>
              <option value="Spain">Spain</option>
              <option value="Sri Lanka">Sri Lanka</option>
              <option value="Sudan">Sudan</option>
              <option value="Suriname">Suriname</option>
              <option value="Swaziland">Swaziland</option>
              <option value="Sweden">Sweden</option>
              <option value="Switzerland">Switzerland</option>
              <option value="Syria">Syria</option>
              <option value="Tahiti">Tahiti</option>
              <option value="Taiwan">Taiwan</option>
              <option value="Tajikistan">Tajikistan</option>
              <option value="Tanzania">Tanzania</option>
              <option value="Thailand">Thailand</option>
              <option value="Togo">Togo</option>
              <option value="Tokelau">Tokelau</option>
              <option value="Tonga">Tonga</option>
              <option value="Trinidad &amp; Tobago">
                Trinidad &amp; Tobago
              </option>
              <option value="Tunisia">Tunisia</option>
              <option value="Turkey">Turkey</option>
              <option value="Turkmenistan">Turkmenistan</option>
              <option value="Turks &amp; Caicos Is">
                Turks &amp; Caicos Is
              </option>
              <option value="Tuvalu">Tuvalu</option>
              <option value="Uganda">Uganda</option>
              <option value="Ukraine">Ukraine</option>
              <option value="United Arab Erimates">United Arab Emirates</option>
              <option value="United Kingdom">United Kingdom</option>
              <option value="United States of America" selected>
                United States of America
              </option>
              <option value="Uraguay">Uruguay</option>
              <option value="Uzbekistan">Uzbekistan</option>
              <option value="Vanuatu">Vanuatu</option>
              <option value="Vatican City State">Vatican City State</option>
              <option value="Venezuela">Venezuela</option>
              <option value="Vietnam">Vietnam</option>
              <option value="Virgin Islands (Brit)">
                Virgin Islands (Brit)
              </option>
              <option value="Virgin Islands (USA)">Virgin Islands (USA)</option>
              <option value="Wake Island">Wake Island</option>
              <option value="Wallis &amp; Futana Is">
                Wallis &amp; Futana Is
              </option>
              <option value="Yemen">Yemen</option>
              <option value="Zaire">Zaire</option>
              <option value="Zambia">Zambia</option>
              <option value="Zimbabwe">Zimbabwe</option>
            </select>
          </div>
          <div className="mb-3">
            <label
              htmlFor="phone"
              className="form-label"
            >{t`Phone Number`}</label>
            <input
              type="tel"
              className={`form-control ${styles.formField} mb-2`}
              id="phone"
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">{t`Email`}</label>
            <input
              type="email"
              className={`form-control ${styles.formField}`}
              id="email"
              aria-describedby="emailHelp"
              onChange={handleChange}
              required
            />
            <div class="invalid-feedback">{t`Please enter an email address.`}</div>
          </div>
          <div className="mb-3">
            <label
              htmlFor="email"
              className="form-label"
            >{t`Church Position`}</label>
            <select
              className={`form-select ${styles.formField}`}
              id="churchPosition"
              onChange={handleChange}
              required
            >
              <option hidden disabled selected value>
                {' '}
                - {t`Select One`} -{' '}
              </option>
              <option value="Lead Pastor">{t`Lead Pastor`}</option>
              <option value="Elder">{t`Elder`}</option>
              <option value="Executive Pastor">{t`Executive Pastor`}</option>
              <option value="Educator">{t`Educator`}</option>
              <option value="Pastor">Pastor</option>
              <option value="Youth Pastor">{t`Youth Pastor`}</option>
              <option value="Staff">{t`Staff`}</option>
              <option value="Dream Team">{t`Dream Team`}</option>
              <option value="Non-staff leader">{t`Non-staff leader`}</option>
            </select>
            <div class="invalid-feedback">{t`Please select your position.`}</div>
          </div>
          <div class="form-check mt-5 mb-4">
            <input
              class="form-check-input"
              type="checkbox"
              value=""
              id="agreedToTerms"
              onClick={handleChange}
              required
            />
            <label class="form-check-label" for="agreeToTerms">
              {t`I agree to the`}{' '}
              <Link
                to={translateLink(`/terms-of-service`, language)}
              >{t`Terms of Service`}</Link>{' '}
              {t`and`}{' '}
              <Link
                to={translateLink('/privacy-policy', language)}
              >{t`Privacy Policy`}</Link>
            </label>
            <div class="invalid-feedback">{t`You must agree to the Terms to create an account.`}</div>
          </div>
          <button
            type="submit"
            className="btn btn-primary btn-shadow btn-sm text-white mt-3"
          >{t`Sign Up`}</button>
          <Link
            to={translateLink(`/signin${queryString}`, language)}
            class="btn btn-link btn-sm text-primary mt-3"
          >{t`Already have an account?`}</Link>
        </form>
      </section>
    </Layout>
  );
};

export default SignUp;
