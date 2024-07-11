/************************************************************************************************
 *                               IMPORTANT LICENSE INFORMATION                                  *
 * This file is part of Ministry Resource Sity by Redmane Digital which is released under RDSL. *
 * See file LICENSE for full license details.                                                   *
 ************************************************************************************************/

import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { updateAuth } from "../store/actions/auth";
import { useTranslateContext } from 'gatsby-plugin-translate';

const md5 = require("md5")

// Prevents time API calls on every keystroke
export const useDebounce = (value, delay) => {
  // State and setters for debounced value
  const [debouncedValue, setDebouncedValue] = useState(value)
  useEffect(
    () => {
      // Update debounced value after delay
      const handler = setTimeout(() => {
        setDebouncedValue(value)
      }, delay)
      return () => {
        clearTimeout(handler)
      }
    },
    [value, delay] // Only re-call effect if value or delay changes
  )
  return debouncedValue
}

// Putting phone numbers in ###-###-#### format
export const formatPhoneNumber = str => {
  //Filter only numbers from the input
  let cleaned = ("" + str).replace(/\D/g, "")

  //Check if the input is of correct
  let match = cleaned.match(/^(1|)?(\d{3})(\d{3})(\d{4})$/)

  if (match) {
    //Remove the matched extension code
    //Change this to format for any country code.
    let intlCode = match[1] ? "+1 " : ""
    return [intlCode, "(", match[2], ") ", match[3], "-", match[4]].join("")
  }

  return null
}

// Converts the query string in the URL to an object for referencing in components
export const useQueryString = string => {
  const urlParams = new URLSearchParams(string)
  const params = {}

  for (let key of urlParams.keys()) {
    params[key] = urlParams.get(key)
  }

  return params
}

// Firebase configuration data. Make sure to update values in .env file, NOT here.
const config = {
  apiKey: process.env.FIREBASE_KEY,
  authDomain: process.env.FIREBASE_DOMAIN,
  databaseURL: process.env.FIREBASE_DB_URL,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
}

// This is the Firebase instance that runs in the browser
let instance = null

export function getFirebase() {
  if (typeof window !== "undefined") {
    if (instance) return instance
    instance = window.firebase.initializeApp(config)
    return instance
  }

  return null
}

export const translateLink = (slug, lang) => {
  const langSlug = lang !== 'en' ? `/${lang}${slug}`: slug;
  return langSlug;
}

// Function to create a new user and create a DB document for them
export const createUser = async props => {
  const {
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
  } = props
  let user
  const response = {
    success: true,
    msg: "",
  }

  await instance
    .auth()
    .createUserWithEmailAndPassword(email, password)
    .then(() => {
      user = instance.auth().currentUser
      user.updateProfile({ displayName: firstName })
    })
    .then(() => {
      instance
        .firestore()
        .collection("users")
        .doc(user.uid)
        .set({
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
          resources: {},
        })
        .catch(function (error) {
          console.error("Error writing document: ", error)
        })
    })
    .then(() => {
      const functions = instance.functions()
      const cloudFunc = functions.httpsCallable("updateMailchimpContact")
      const data = {
        firstName,
        lastName,
        email: user.email,
        phone,
        position: churchPosition,
        churchName,
        streetAddress: churchLocation,
        city: churchCity,
        state: churchState,
        zip: churchZip,
        country: churchCountry,
      }
      return cloudFunc(data)
        .then(result => {
          return result.data
        })
        .catch(error => {
          // Getting the Error details.
          var code = error.code
          var message = error.message
          var details = error.details
          //

          console.log({
            code,
            message,
            details,
          })
        })
    })
    .catch(err => {
      response.success = false
      response.msg = err
    })
  return response
}

export const setPbcData = async data => {
  const user = instance.auth().currentUser
  const {
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
  } = data
  await instance
    .firestore()
    .collection("users")
    .doc(user.uid)
    .set({
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
      resources: {},
      isPBC: true,
    })
    .then(() => {
      const functions = instance.functions()
      const cloudFunc = functions.httpsCallable("updateMailchimpContact")
      const data = {
        firstName,
        lastName,
        email: user.email,
        phone,
        position: churchPosition,
        churchName,
        addr1: churchLocation,
        city: churchCity,
        state: churchState,
        zip: churchZip,
        country: churchCountry,
      }
      return cloudFunc(data)
        .then(result => {
          return result.data
        })
        .catch(error => {
          // Getting the Error details.
          var code = error.code
          var message = error.message
          var details = error.details
          //

          console.log({
            code,
            message,
            details,
          })
        })
    })
    .catch(function (error) {
      console.error(error)
    })
  return
}

export const saveCustomerResource = async (slug, date) => {
  const user = instance.auth().currentUser
  const userRef = instance.firestore().collection("users").doc(user.uid)
  const currentResources = await userRef.get().then(doc => doc.data().resources)
  const exists = currentResources[slug] ? true : false
  if (exists) return
  userRef.update({ resources: { ...currentResources, [slug]: date } })
}

export const updateName = async (first, last, callback) => {
  const user = instance.auth().currentUser
  await user
    .updateProfile({
      displayName: first,
    })
    .then(() => {
      const userRef = instance.firestore().collection("users").doc(user.uid)
      userRef.update({ firstName: first, lastName: last }).then(
        userRef.get().then(doc => {
          callback(
            updateAuth({
              isAuthenticated: true,
              user: {
                ...doc.data(),
                ...instance.auth().currentUser,
              },
              updated: new Date(),
            })
          )
        })
      )
    })
  return
}

export const updatePhone = (phone, callback) => {
  const user = instance.auth().currentUser
  const userRef = instance.firestore().collection("users").doc(user.uid)
  userRef.update({ phone }).then(
    userRef.get().then(doc => {
      callback(
        updateAuth({
          isAuthenticated: true,
          user: {
            ...doc.data(),
            ...instance.auth().currentUser,
          },
          updated: new Date(),
        })
      )
    })
  )
}

export const updateChurchName = (churchName, callback) => {
  const user = instance.auth().currentUser
  const userRef = instance.firestore().collection("users").doc(user.uid)
  userRef.update({ churchName }).then(
    userRef.get().then(doc => {
      callback(
        updateAuth({
          isAuthenticated: true,
          user: {
            ...doc.data(),
            ...instance.auth().currentUser,
          },
          updated: new Date(),
        })
      )
    })
  )
}

export const updateLocation = (street, city, state, zip, country, callback) => {
  const user = instance.auth().currentUser
  const userRef = instance.firestore().collection("users").doc(user.uid)
  userRef
    .update({
      churchLocation: street,
      churchCity: city,
      churchState: state,
      churchZip: zip,
      churchCountry: country,
    })
    .then(
      userRef.get().then(doc => {
        callback(
          updateAuth({
            isAuthenticated: true,
            user: {
              ...doc.data(),
              ...instance.auth().currentUser,
            },
            updated: new Date(),
          })
        )
      })
    )
}

export const updatePassword = (newPassword, callback) => {
  const user = instance.auth().currentUser
  const userRef = instance.firestore().collection("users").doc(user.uid)
  user
    .updatePassword(newPassword)
    .then(
      userRef.get().then(doc => {
        callback(
          updateAuth({
            isAuthenticated: true,
            user: {
              ...doc.data(),
              ...instance.auth().currentUser,
            },
            updated: new Date(),
          })
        )
      })
    )
    .catch(error => console.error(error))
}

const onAuthStateChange = callback => {
  return instance.auth().onAuthStateChanged(async user => {
    if (user) {
      const docRef = instance.firestore().collection("users").doc(user.uid)
      const { displayName, email, emailVerified, photoURL } = user
      let userData = { displayName, email, emailVerified, photoURL }

      await docRef
        .get()
        .then(doc => {
          if (doc.exists) userData = { ...userData, ...doc.data() }
        })
        .catch(error => console.log("Error getting document:", error))

      callback(
        updateAuth({
          isAuthenticated: true,
          user: {
            ...instance.auth().currentUser,
            ...userData,
          },
        })
      )
    } else {
      callback(
        updateAuth({
          isAuthenticated: false,
          user: null,
        })
      )
    }
  })
}

export const updateUser = ({ field, data, callback }) => {
  switch (field) {
    case "name":
      const { first, last } = data.value
      updateName(first, last, callback)
      break
    case "phone":
      updatePhone(data.value, callback)
      break
    case "email":
      break
    case "location":
      const { street, city, state, zip, country } = data.value
      updateLocation(street, city, state, zip, country, callback)
      break
    case "churchName":
      updateChurchName(data.value, callback)
      break
    case "password":
      if (data.value.match) updatePassword(data.value.new, callback)
      break
  }
}

export const getSSO = user => {
  if (instance) {
    const functions = instance.functions()
    const cloudFunc = functions.httpsCallable("pbcAccessJwt")
    const data = {
      first_name: user.firstName,
      last_name: user.lastName,
      email: user.email,
    }
    if (user.return_to) data.return_to = user.return_to
    return cloudFunc(data)
      .then(result => {
        return result.data
      })
      .catch(error => {
        // Getting the Error details.
        var code = error.code
        var message = error.message
        var details = error.details
        //

        console.log({
          code,
          message,
          details,
        })
      })
  }
}

export const signInWithPbcAccess = async uid => {
  const values = decodeURIComponent(uid).split("|")
  const hash = md5(`id${values[0]}fl${values[1]}e${values[2]}`)
  const ssoDate = new Date(values[3])
  const now = new Date()
  let user
  let res

  // if (now - ssoDate < 180000 * 1000) {
    let authRes = await instance
      .auth()
      .signInWithEmailAndPassword(values[2], hash)
      .then(() => ({ status: "success" }))
      .catch(err => {
        console.log(err)
        if (err.code === "auth/user-not-found") {
          return instance
            .auth()
            .createUserWithEmailAndPassword(values[2], hash)
            .then(() => {
              user = instance.auth().currentUser
              user.updateProfile({ displayName: values[1].split(",")[1] })
              return { status: "success" }
            })
            .then(() => {
              const names = values[1].split(",")
              instance
                .firestore()
                .collection("users")
                .doc(user.uid)
                .set({
                  firstName: names[1],
                  lastName: names[0],
                })
                .catch(function (error) {
                  console.error("Error writing document: ", error)
                })
            })
        } else if (err.code === "auth/wrong-password") {
          return { status: "failed", reason: "User already exists" }
        } else {
          return { status: "failed", reason: err.message }
        }
      })
    res = authRes
    console.log(res)
  // } else {
  //   res = { status: "failed", reason: "bad timestamp" }
  //   console.log(res)
  // }
  return res
}

// Hook to supply a component with the requisite Firebase functions for auth and user updates
export const useAuth = () => {
  const dispatch = useDispatch()
  const [dispatched, setDispatched] = useState(false)
  const funcs = {
    signIn: async (email, password) => {
      debugger;
      const res = await instance
        .auth()
        .signInWithEmailAndPassword(email, password)
        .then(() => { return { success: true } })
        .catch(err => {
          return {
            succeeded: false,
            error: err
          };
        });
        return res;
    },
    signOut: () => instance.auth().signOut(),
    newUser: props => createUser(props),
    resetPassword: async email => {
      const response = { success: true, error: null }
      await instance
        .auth()
        .sendPasswordResetEmail(email)
        .catch(error => {
          response.success = false
          response.error = error
          return response
        })
      return response
    },
    pbcSignIn: async uid => signInWithPbcAccess(uid),
    pbcSetUserData: async data => await setPbcData(data),
  }

  // If a window object exists, set the listener for auth updates
  useEffect(() => {
    if (window && !dispatched) {
      if (!instance) getFirebase()
      onAuthStateChange(dispatch)
      setDispatched(true)
    }
  }, [])

  return funcs
}

export const useCourses = () => {
  const [data, setData] = useState(null)
  useEffect(() => {
    if (window && instance && !data) {
      const functions = instance.functions()
      const cloudFunc = functions.httpsCallable("getCourses")
      cloudFunc()
        .then(result => {
          setData(result.data)
        })
        .catch(error => {
          // Getting the Error details.
          var code = error.code
          var message = error.message
          var details = error.details
          //

          console.log({
            code,
            message,
            details,
          })
        })
    }
    return data
  }, [instance])

  return data
}
