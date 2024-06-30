/************************************************************************************************
 *                               IMPORTANT LICENSE INFORMATION                                  *
 * This file is part of Ministry Resource Sity by Redmane Digital which is released under RDSL. *
 * See file LICENSE for full license details.                                                   *
 ************************************************************************************************/

import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faSave } from '@fortawesome/free-solid-svg-icons';
import styled from 'styled-components';
import { formatPhoneNumber, updateUser } from '../hooks';
import InputMask from 'react-input-mask';
import Layout from "../components/layout";
import SEO from "../components/seo";
import { navigate } from 'gatsby';
import { useTranslations } from 'gatsby-plugin-translate';

const SavedData = styled.p`
    color: #808080;
`;

const Select = styled.select`
    background-color: #eeeeee;
    border: none;
`;

const Input = styled.input`
    border: none;
    background-color: #eeeeee;
    padding: 15px 25px;
    &:not(.grouped) {
        width: calc(100% - 125px);
    }
`;

const EditButton = styled.button`
    background: transparent;
    border: none;
    &:focus {
        border: none;
    }
    > span {
        vertical-align: middle;
        padding-left: 0.5rem;
        color: #808080;
    }
`;

const Edit = ({ isEditing, field, save, edit }) => {
    const text = isEditing ? 'Save' : 'Edit';
    const icon = isEditing ? faSave : faEdit;
    const action = isEditing ? save : edit;
    return (
        <EditButton className="text-uppercase mb-0" onClick={() => action(field)}>
            <FontAwesomeIcon icon={icon} style={{ color: '#ef4123' }} size="lg" />
            <span>{text}</span>
        </EditButton>
    );
};


const MyAccount = ({ location }) => {
    const dispatch = useDispatch();
    const { user, isAuthenticated } = useSelector(state => state.auth);
    const [userData, updateUserData] = useState(false);
    const t = useTranslations();
    const savedUserData = () => ({
        name: {
            editing: false,
            value: {
                first: user.firstName,
                last: user.lastName
            }
        },
        phone: {
            editing: false,
            value: user.phone
        },
        email: {
            editing: false,
            value: user.email
        },
        password: {
            editing: false,
            value: {
                new: '',
                verify: '',
                match: false
            }
        },
        churchName: {
            editing: false,
            value: user.churchName
        },
        location: {
            editing: false,
            value: {
                street: user.churchLocation,
                city: user.churchCity,
                state: user.churchState,
                zip: user.churchZip,
                country: user.churchCountry
            }
        }
    });

    const setEditing = field => {
        const data = {};

        for (const key in userData) {
            data[key] = {
                ...savedUserData()[key],
                editing: false
            }
        };

        updateUserData({
            ...data,
            [field]: {
                value: userData[field].value,
                editing: true
            }
        })
    };

    const handleChange = function (e) {
        const { id, value } = e.target;
        let key = id;
        let newValue;

        switch (id) {
            case "FirstName":
                key = 'name';
                newValue = { first: value, last: userData.name.value.last };
                break;
            case "LastName":
                key = 'name';
                newValue = { first: userData.name.value.first, last: value };
                break;
            case "churchLocation":
                key = 'location';
                newValue = {
                    street: value,
                    city: userData.location.value.city,
                    state: userData.location.value.state
                };
                break;
            case 'churchCity':
                key = 'location';
                newValue = {
                    street: userData.location.value.street,
                    city: value,
                    state: userData.location.value.state
                };
                break;
            case 'churchState':
                key = 'location';
                newValue = {
                    street: userData.location.value.street,
                    city: userData.location.value.city,
                    state: value,
                    zip: userData.location.value.zip,
                    country: userData.location.value.country
                };
                break;
            case 'churchZip':
                key = 'location';
                newValue = {
                    street: userData.location.value.street,
                    city: userData.location.value.city,
                    state: userData.location.value.state,
                    zip: value,
                    country: userData.location.value.country
                };
                break;
            case 'churchCountry':
                key = 'location';
                newValue = {
                    street: userData.location.value.street,
                    city: userData.location.value.city,
                    state: userData.location.value.state,
                    zip: userData.location.value.zip,
                    country: value
                };
                break;
            case 'newPassword': {
                key = 'password';
                newValue = {
                    new: value,
                    verify: userData.password.value.verify,
                    match: value === userData.password.value.verify
                };
                break;
            }
            case 'verifyPassword': {
                key = 'password';
                newValue = {
                    new: userData.password.value.new,
                    verify: value,
                    match: value === userData.password.value.new
                };
                break;
            }
            default:
                newValue = value;
                break;
        };

        updateUserData({
            ...userData,
            [key]: { ...userData[key], value: newValue }
        });
    };

    const handleSave = field => {
        updateUser({ field, data: userData[field], callback: dispatch })
    };

    useEffect(() => {
        isAuthenticated
            ? updateUserData(savedUserData())
            : navigate('/');
    }, [user]);

    return (
        <Layout location={location}>
            <SEO title={t`My Account`} />
            {userData && <>
                <section className="bg-secondary">
                    <div className="container py-4">
                        <h4 className="text-white mb-0">
                            <strong>{t`My Account`}</strong>
                        </h4>
                    </div>
                </section>
                {userData &&
                    <section className="container my-5">
                        <div className="row">
                            <div className="col-12 col-md-3 d-flex align-items-center">
                                <p className="h5 font-weight-bold mb-0">{t`Name`}</p>
                            </div>
                            <div className="col-12 col-md-9 d-flex align-items-center justify-content-between">
                                {userData.name.editing
                                    ? <div className="row mt-0 mt-md-4" style={{ maxWidth: "calc(100% - 100px)" }}>
                                        <div className="col-12 col-md-6 mb-md-0 mb-3">
                                            <Input type="text" aria-label="First name" id="FirstName" className="form-control grouped" value={userData.name.value.first} onChange={handleChange} required />
                                            <label htmlFor="firstName" className="form-text">{t`First`}</label>
                                        </div>
                                        <div className="col-12 col-md-6">
                                            <Input type="text" aria-label="Last name" id="LastName" className="form-control grouped" value={userData.name.value.last} onChange={handleChange} required />
                                            <label htmlFor="lastName" className="form-text">{t`Last`}</label>
                                        </div>
                                    </div>
                                    : <SavedData className="h4 mb-0">{`${userData.name.value.first} ${userData.name.value.last}`}</SavedData>
                                }
                                <Edit field="name" isEditing={userData.name.editing} edit={setEditing} save={handleSave} />
                            </div>
                            <div className="col-12 my-3 px-3">
                                <hr />
                            </div>
                        </div>
                        {!user?.isPBC && <div className="row">
                            <div className="col-12 col-md-3 d-flex align-items-center">
                                <p className="h5 font-weight-bold mb-0">{t`Password`}</p>
                            </div>
                            <div className="col-12 col-md-9 d-flex align-items-center justify-content-between">
                                {userData.password.editing
                                    ? <div className="row mt-0 mt-md-4" style={{ maxWidth: "calc(100% - 100px)" }}>
                                        <div className="col-12 col-md-6 mb-md-0 mb-3">
                                            <Input type="password" id="newPassword" className="form-control grouped" value={userData.password.value.new} onChange={handleChange} required />
                                            <label htmlFor="newPassword" className="form-text">{t`Password`}</label>
                                        </div>
                                        <div className="col-12 col-md-6">
                                            <Input type="password" id="verifyPassword" className="form-control grouped" value={userData.password.value.verify} onChange={handleChange} required />
                                            <label htmlFor="verifyPassword" className="form-text">{t`Verify Password`}</label>
                                        </div>
                                        <div className="col-12">
                                            {(!userData.password.value.match && userData.password.value.verify.length > 1 && userData.password.value.new.length > 1) && <p>Passwords must match</p>}
                                        </div>
                                    </div>
                                    : <SavedData className="h4 mb-0">************</SavedData>
                                }
                                <Edit field="password" isEditing={userData.password.editing} edit={setEditing} save={handleSave} />
                            </div>
                            <div className="col-12 my-3 px-3">
                                <hr />
                            </div>
                        </div>}
                        <div className="row">
                            <div className="col-12 col-md-3 d-flex align-items-center">
                                <p className="h5 font-weight-bold mb-0">{t`Phone Number`}</p>
                            </div>
                            <div className="col-12 col-md-9 d-flex mt-2 mt-md-0 align-items-center justify-content-between">
                                {userData.phone.editing
                                    ? <InputMask
                                        value={userData.phone.value}
                                        id="phone"
                                        className="form-control"
                                        mask="(999) 999-9999"
                                        maskChar="_"
                                        onChange={handleChange}
                                        style={{
                                            border: "none",
                                            backgroundColor: "#eeeeee",
                                            padding: "15px 25px",
                                            width: "calc(100% - 125px)"
                                        }}
                                    />
                                    : <SavedData className="h4 mb-0">{formatPhoneNumber(userData.phone.value)}</SavedData>
                                }
                                <Edit field="phone" isEditing={userData.phone.editing} edit={setEditing} save={handleSave} />
                            </div>
                            <div className="col-12 my-3 px-3">
                                <hr />
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-12 col-md-3 d-flex align-items-center">
                                <p className="h5 font-weight-bold mb-0">{t`Email`}</p>
                            </div>
                            <div className="col-12 col-md-9 d-flex align-items-center justify-content-between">
                                <SavedData className="h4 mb-0">{userData.email.value}</SavedData>
                                {/* <Edit field="email" isEditing={userData.email.editing} edit={setEditing} save={handleSave} /> */}
                            </div>
                            <div className="col-12 my-3 px-3">
                                <hr />
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-12 col-md-3 d-flex align-items-center">
                                <p className="h5 font-weight-bold mb-0">{t`Church Name`}</p>
                            </div>
                            <div className="col-12 col-md-9 d-flex align-items-center justify-content-between">
                                {userData.churchName.editing
                                    ? <Input type="text" id="churchName" className="form-control grouped" value={userData.churchName.value} style={{ width: "calc(100% - 125px)" }} onChange={handleChange} required />
                                    : <SavedData className="h4 mb-0">{userData.churchName.value}</SavedData>
                                }
                                <Edit field="churchName" isEditing={userData.churchName.editing} edit={setEditing} save={handleSave} />
                            </div>
                            <div className="col-12 my-3 px-3">
                                <hr />
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-12 col-md-3 d-flex align-items-center">
                                <p className="h5 font-weight-bold mb-0">{t`Church Location`}</p>
                            </div>
                            <div className="col-12 col-md-9 d-flex align-items-center justify-content-between">
                                {userData.location.editing
                                    ? <div className="row mt-0 mt-md-4" style={{ maxWidth: "calc(100% - 100px)" }}>
                                        <div classae="col-12">
                                            <Input type="text" id="churchLocation" className="form-control grouped" value={userData.location.value.street} onChange={handleChange} required />
                                            <label htmlFor="churchLocation" className="form-text">{t`Street Address`}</label>
                                        </div>
                                        <div className="col-12 col-md-6 mb-md-0 mb-3">
                                            <Input type="text" id="churchCity" className="form-control grouped" value={userData.location.value.city} onChange={handleChange} required />
                                            <label htmlFor="churchCity" className="form-text">{t`City`}</label>
                                        </div>
                                        <div className="col-12 col-md-3">
                                            <Input type="text" id="churchState" className="form-control grouped" value={userData.location.value.state} onChange={handleChange} required />
                                            <label htmlFor="churchState" className="form-text">{t`State / Province / Region`}</label>
                                        </div>
                                        <div className="col-12 col-md-3">
                                            <Input type="text" id="churchZip" className="form-control grouped" value={userData.location.value.zip} onChange={handleChange} required />
                                            <label htmlFor="churchZip" className="form-text">{t`Postal Code`}</label>
                                        </div>
                                        <div className="col-12">
                                            <Select className="form-select" name="country" id="churchCountry" value={userData.location.value.country} onChange={handleChange} required>
                                                <option value="Afganistan">Afghanistan</option>
                                                <option value="Albania">Albania</option>
                                                <option value="Algeria">Algeria</option>
                                                <option value="American Samoa">American Samoa</option>
                                                <option value="Andorra">Andorra</option>
                                                <option value="Angola">Angola</option>
                                                <option value="Anguilla">Anguilla</option>
                                                <option value="Antigua &amp; Barbuda">Antigua &amp; Barbuda</option>
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
                                                <option value="Bosnia &amp; Herzegovina">Bosnia &amp; Herzegovina</option>
                                                <option value="Botswana">Botswana</option>
                                                <option value="Brazil">Brazil</option>
                                                <option value="British Indian Ocean Ter">British Indian Ocean Ter</option>
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
                                                <option value="Central African Republic">Central African Republic</option>
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
                                                <option value="Republic of Montenegro">Republic of Montenegro</option>
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
                                                <option value="St Pierre &amp; Miquelon">St Pierre &amp; Miquelon</option>
                                                <option value="St Vincent &amp; Grenadines">St Vincent &amp; Grenadines</option>
                                                <option value="Saipan">Saipan</option>
                                                <option value="Samoa">Samoa</option>
                                                <option value="Samoa American">Samoa American</option>
                                                <option value="San Marino">San Marino</option>
                                                <option value="Sao Tome &amp; Principe">Sao Tome &amp; Principe</option>
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
                                                <option value="Trinidad &amp; Tobago">Trinidad &amp; Tobago</option>
                                                <option value="Tunisia">Tunisia</option>
                                                <option value="Turkey">Turkey</option>
                                                <option value="Turkmenistan">Turkmenistan</option>
                                                <option value="Turks &amp; Caicos Is">Turks &amp; Caicos Is</option>
                                                <option value="Tuvalu">Tuvalu</option>
                                                <option value="Uganda">Uganda</option>
                                                <option value="Ukraine">Ukraine</option>
                                                <option value="United Arab Erimates">United Arab Emirates</option>
                                                <option value="United Kingdom">United Kingdom</option>
                                                <option value="United States of America">United States of America</option>
                                                <option value="Uraguay">Uruguay</option>
                                                <option value="Uzbekistan">Uzbekistan</option>
                                                <option value="Vanuatu">Vanuatu</option>
                                                <option value="Vatican City State">Vatican City State</option>
                                                <option value="Venezuela">Venezuela</option>
                                                <option value="Vietnam">Vietnam</option>
                                                <option value="Virgin Islands (Brit)">Virgin Islands (Brit)</option>
                                                <option value="Virgin Islands (USA)">Virgin Islands (USA)</option>
                                                <option value="Wake Island">Wake Island</option>
                                                <option value="Wallis &amp; Futana Is">Wallis &amp; Futana Is</option>
                                                <option value="Yemen">Yemen</option>
                                                <option value="Zaire">Zaire</option>
                                                <option value="Zambia">Zambia</option>
                                                <option value="Zimbabwe">Zimbabwe</option>
                                            </Select>
                                            <label htmlFor="churchCountry" className="form-text">{t`Country`}</label>
                                        </div>
                                    </div>
                                    : <SavedData className="h4 mb-0">
                                        {`${userData.location.value.street}`}
                                        <br />
                                        {`${userData.location.value.city}, ${userData.location.value.state} ${userData.location.value.zip}`}
                                        <br />
                                        {userData.location.value.country}
                                    </SavedData>
                                }
                                <Edit field="location" isEditing={userData.location.editing} edit={setEditing} save={handleSave} />
                            </div>
                            <div className="col-12 my-3 px-3">
                                <hr />
                            </div>
                        </div>
                    </section>}
            </>}
        </Layout>
    );
};

export default MyAccount;