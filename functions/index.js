/************************************************************************************************
 *                               IMPORTANT LICENSE INFORMATION                                  *
 * This file is part of Ministry Resource Sity by Redmane Digital which is released under RDSL. *
 * See file LICENSE for full license details.                                                   *
 ************************************************************************************************/

const { defineString } = require("firebase-functions/params")
const functions = require("firebase-functions")
const axios = require("axios")
const jwt = require("jsonwebtoken")
const mailchimp = require("@mailchimp/mailchimp_marketing")
const md5 = require("md5")

/************************************************************************************************
 *                                      CONFIGS FOR CRMs                                        *
 * These are the configurations for the CRMs that the site will be using. ONLY edit code in     *
 * this section, unless you really know what you are doing and are sure that you need to edit.  *
 *                                                                                              *
 * NOTES: Each array below represents a CRM account that the site will be using. The tag is     *
 *        unique to the resource site and is used to identify it in the CRM. The CRM functions  *
 *        will iterate over each array, tracking as specified. ALWAYS use environment variables,*
 *        do not add API keys or other sensitive information directly in the code.
 ************************************************************************************************/

// Defining parameters for the functions from ENV
const mailchimpApiKey = defineString("MAILCHIMP_API_KEY")
const mailchimpListId = defineString("MAILCHIMP_LIST_ID")
const mailchimpServer = defineString("MAILCHIMP_SERVER")
const thinkificApiKey = defineString("THINKIFIC_API_KEY")
const thinkificSubdomain = defineString("THINKIFIC_SUBDOMAIN")
const whiteLabelTag = defineString("BRAND_SLUG")

const MailChimpAccounts = [
  // Mailchimp account for MHR. This shoud always be present.
  {
    tag: whiteLabelTag.value(),
    listId: mailchimpListId.value(),
    apiKey: mailchimpApiKey.value(),
    server: mailchimpServer.value(),
  },
]

const SendGridAccounts = []

/************************************************************************************************
 *                                    THINKIFIC API FUNCTIONS                                   *
 * These are functions that will be used to fetch course data from Thinkific and to generate    *
 * JWTs for SSO, when a project is configured to allow sign-in via PBC Access.                  *
 ************************************************************************************************/

const thinkificBaseURL = "https://api.thinkific.com/api/public/v1"
const thinkificConfig = {
  headers: {
    "X-Auth-API-Key": thinkificApiKey.value(),
    "X-Auth-Subdomain": thinkificSubdomain.value(),
  },
}

// Should the site allow SSO via Thinkific (PBC), this function will generate a JWT token for the user
exports.pbcAccessJwt = functions.https.onCall((data, context) => {
  const payload = {
    first_name: data.first_name || null,
    last_name: data.last_name || null,
    email: context.auth.token.email || null,
    iat: Math.round(Date.now() / 1000),
    external_id: context.auth.uid,
  }
  const token = jwt.sign(payload, thinkificApiKey.value())
  const thinkificSSO = `https://portlandbiblecollege.thinkific.com/api/sso/v2/sso/jwt?jwt=${token}&return_to=${data.return_to}`

  return thinkificSSO
})

// Check if a user exists in Thinkific (PBC)
exports.pbcUserExists = functions.https.onCall(data => {
  axios
    .get(
      `${thinkificBaseURL}page=1&limit=25&query[email]=${data.email}`,
      thinkificConfig
    )
    .then(res => {
      const data = res.data.items
      return data
    })
    .catch(err => ({
      error: err,
    }))
})

/************************************************************************************************
 *                                     MAILCHIMP API FUNCTIONS                                  *
 *  These are functions that will be used for adding and updating contacts in Mailchimp.        *
 ************************************************************************************************/
exports.updateMailchimpContact = functions.https.onCall(async data => {
  const response = {}

  // Create the body for the setListMember POST request(s)
  const listMemberBody = {
    email_address: data.email,
    status_if_new: "subscribed",
    merge_fields: {
      FNAME: data.firstName,
      LNAME: data.lastName,
      PHONE: data.phone,
      POSITION: data.position,
      CHURCHNAME: data.churchName,
      ADDRESS: {
        addr1: data.streetAddress,
        addr2: "",
        city: data.city,
        state: data.state,
        zip: data.zip,
        country: data.country,
      },
    },
  }

  // Interate over MailChimp accounts and update / create list members for each
  for (const acct of MailChimpAccounts) {
    mailchimp.setConfig({
      apiKey: acct.apiKey,
      server: acct.server,
    })

    // Update Mailchimp for MHR
    response[`${acct.tag}-response`] = await mailchimp.lists.setListMember(
      acct.listId,
      md5(data.email),
      listMemberBody
    )
    response[`${acct.tag}-tags-response`] =
      await mailchimp.lists.updateListMemberTags(mhrListId, member, {
        tags: [{ name: acct.tag, status: "active" }],
      })
  }

  // Return the responses
  return response
})
