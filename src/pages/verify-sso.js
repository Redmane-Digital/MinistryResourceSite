/************************************************************************************************
 *                               IMPORTANT LICENSE INFORMATION                                  *
 * This file is part of Ministry Resource Sity by Redmane Digital which is released under RDSL. *
 * See file LICENSE for full license details.                                                   *
 ************************************************************************************************/

import React, { useEffect, useState } from "react"
import { useQueryString, useAuth } from "../hooks"
import { useSelector } from "react-redux"
import Layout from "../components/layout"
import SEO from "../components/seo"
import { Link, navigate } from "gatsby"
import styled from "styled-components"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCircle } from '@fortawesome/free-solid-svg-icons';
import { useTranslateContext, useTranslations } from "gatsby-plugin-translate";
import { translateLink } from '../hooks/';

const Input = styled.input`
  background: #eeeeee;
`

const Select = styled.select`
  background-color: #eeeeee;
`

const VerifySSO = ({ location }) => {
  const t = useTranslations();
  const { language } = useTranslateContext();
  const { uid } = useQueryString(location.search)
  const auth = useAuth()
  const { isAuthenticated, user } = useSelector(state => state.auth)
  const [state, setState] = useState({ status: "pending" })
  const [formData, setFormData] = useState({
    churchCountry: "United States of America",
    agreedToTerms: true
  })
  const handleChange = function (e) {
    setFormData({
      ...formData,
      [e.target.id]: e.target.checked || e.target.value,
    })
  }

  const handleSubmit = function (e) {
    e.preventDefault();
    const { phone, churchName, churchLocation, churchPosition, agreedToTerms, churchCity, churchState, churchZip, churchCountry } = formData;
    auth.pbcSetUserData({ firstName: user.firstName, lastName: user.lastName, phone, churchName, churchLocation, churchCity, churchState, churchZip, churchCountry, churchPosition, agreedToTerms })
        .then(() => navigate(translateLink('/', language)));
  }

  useEffect(async () => {
    const data = await auth.pbcSignIn(uid)
    setState(data)
  }, [])

  useEffect(() => {
    const redirectIfAuth = () => {
      if (isAuthenticated) {
          if (user.churchName) {
            navigate(translateLink('/', language));
          }
      }
    }
    redirectIfAuth()
  }, [isAuthenticated, user])

  return (
    <Layout location={location}>
      <SEO title={t`Sign In with PBC Access`} />
      <section
        style={{
          backgroundPosition: "center",
          backgroundSize: "cover",
          backgroundColor: "#1a3757",
        }}
      >
        <div
          className="container py-5 text-center"
          style={{ color: "#e8e1cf" }}
        >
          <h1 className="kapra font-weight-bold my-0 display-3 text-center">
            {t`Use Your PBC Access Account`}
          </h1>
          <p className="my-0">{t`To sign into Mannahouse Resource`}</p>
        </div>
      </section>
      {!isAuthenticated && (
        <div className="container reduced-width py-5 text-center">
          {state?.status === "pending" && <h2>{t`Signing you in`}...</h2>}
          {state?.status === "failed" ? (
            state.reason === "User already exists" ? (
              <div>
                <h2>{t`You already have an account with Mannahouse Resource`}</h2>
                <Link to={translateLink("/signin?nopbc=true", language)}>
                  <button
                    type="submit"
                    class="btn btn-primary btn-shadow btn-sm text-white mt-3"
                  >
                    {t`Sign In`}
                  </button>
                </Link>
              </div>
            ) : (
              <div>
                <h2>{t`Something went wrong`}...</h2>
                <p>{state.reason}</p>
                {/* <h4>
                  <a href="https://www.pbcaccess.com/pages/sign_into_mhr">
                    Click here
                  </a>{" "}
                  to try signing in with PBC Access again.
                </h4> */}
              </div>
            )
          ) : (
            <h2></h2>
          )}
          {state === undefined && (
            <div>
              <h2>{t`Something went wrong`}...</h2>
              <h4>
                <a href="https://www.pbcaccess.com/pages/sign_into_mhr">
                  {t`Click here`}
                </a>{" "}
                {t`to try signing in with PBC Access again.`}
              </h4>
            </div>
          )}
        </div>
      )}

      {isAuthenticated && !user.churchName && (
        <section className="container reduced-width py-5">
          <p className="text-center mb-1">{t`Welcome`}</p>
          <h2 className="text-center mb-4">
            <strong>
                <FontAwesomeIcon icon={faUserCircle} style={{ color: '#aaaaaa', verticalAlign: "middle", margin: "0 0.5rem 6px" }} size="2x" /> {user.firstName} {user.lastName}
            </strong>
          </h2>
          <hr className="my-3" />
          <h4
            style={{ color: "#1a3757" }}
            className="display-3 mt-4 mb-0 kapra font-weight-bold text-center"
          >
            {t`Almost there!`}
          </h4>
          <p className="text-center h4">{t`We just need a little more info`}</p>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="churchName" className="form-label">
                {t`Church Name`}
              </label>
              <Input
                type="text"
                className="form-control mb-2"
                id="churchName"
                onChange={handleChange}
                required
              />
              <div class="invalid-feedback">
                {t`Please enter your church's name.`}
              </div>
            </div>
            <div className="mb-3">
              <label htmlFor="churchLocation" className="form-label">
                {t`Street Address`}
              </label>
              <Input
                type="text"
                className="form-control mb-2"
                id="churchLocation"
                onChange={handleChange}
                required
              />
              <div class="invalid-feedback">
                {t`Please provide the street address of your church.`}
              </div>
            </div>
            <div className="mb-3 row">
              <div className="col-12 col-md-6">
                <label htmlFor="churchCity" className="form-label">
                  {t`City`}
                </label>
                <Input
                  type="text"
                  className="form-control mb-2"
                  id="churchCity"
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="col-12 col-md-3">
                <label htmlFor="churchState" className="form-label">
                  {t`State / Province / Region`}
                </label>
                <Input
                  className="form-select mb-3"
                  id="churchState"
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="col-12 col-md-3">
                <label htmlFor="churchZip" className="form-label">
                  {t`Postal Code`}
                </label>
                <Input
                  className="form-select mb-3"
                  id="churchZip"
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="mb-3">
              <label htmlFor="churchCountry" className="form-label">
                {t`Country`}
              </label>
              <Select
                className="form-select"
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
                <option value="Netherlands">
                  Netherlands (Holland, Europe)
                </option>
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
                <option value="United Arab Erimates">
                  United Arab Emirates
                </option>
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
                <option value="Virgin Islands (USA)">
                  Virgin Islands (USA)
                </option>
                <option value="Wake Island">Wake Island</option>
                <option value="Wallis &amp; Futana Is">
                  Wallis &amp; Futana Is
                </option>
                <option value="Yemen">Yemen</option>
                <option value="Zaire">Zaire</option>
                <option value="Zambia">Zambia</option>
                <option value="Zimbabwe">Zimbabwe</option>
              </Select>
            </div>
            <div className="mb-3">
              <label htmlFor="phone" className="form-label">
                {t`Phone Number`}
              </label>
              <Input
                type="tel"
                className="form-control mb-2"
                id="phone"
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="churchPosition" className="form-label">
                {t`Church Position`}
              </label>
              <Select
                className="form-select"
                id="churchPosition"
                onChange={handleChange}
                required
              >
                <option hidden disabled selected value>
                  {" "}
                  - {t`Select One`} -{" "}
                </option>
                <option>{t`Lead Pastor`}</option>
                <option>{t`Elder`}</option>
                <option>{t`Executive Pastor`}</option>
                <option>{t`Educator`}</option>
                <option>{t`Pastor`}</option>
                <option>{t`Youth Pastor`}</option>
                <option>{t`Staff`}</option>
                <option>{t`Dream Team`}</option>
                <option>{t`Non-staff leader`}</option>
              </Select>
              <div class="invalid-feedback">{t`Please select your position.`}</div>
            </div>
            <button
              type="submit"
              className="btn btn-primary btn-shadow btn-sm text-white mt-3"
            >
              {t`Sign In`}
            </button>
          </form>
        </section>
      )}
    </Layout>
  )
}

export default VerifySSO
