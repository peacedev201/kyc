import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { NavLink, Redirect } from 'react-router-dom'

import classNames from 'classnames'
import pick from 'lodash/pick'
import reduce from 'lodash/reduce'

import '../styles/legacy/style.scss'
import Grid from '@material-ui/core/Grid'
import TextField from '@material-ui/core/TextField'
import MenuItem from '@material-ui/core/MenuItem'

import makeStyles from '@material-ui/core/styles/makeStyles'

import FormControl from '@material-ui/core/FormControl'
import FormLabel from '@material-ui/core/FormLabel'
import RadioGroup from '@material-ui/core/RadioGroup'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Radio from '@material-ui/core/Radio'
import Checkbox from '@material-ui/core/Checkbox'
import AddIcon from '@material-ui/icons/Add'
import RemoveIcon from '@material-ui/icons/Remove'
import FormHelperText from '@material-ui/core/FormHelperText'
import ReactPixel from 'react-facebook-pixel'

import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/dist/style.css'


import CircularProgress from '@material-ui/core/CircularProgress'
import moment from 'moment'
import DateFnsUtils from '@date-io/date-fns/build/index'
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from '@material-ui/pickers'
import axios from 'axios'
import { PROSPECTUS_OR_ISSUING, TOKEN_TYPES } from '../constants/settings'
import { CUSTOMER_STATUS_TYPES, CUSTOMER_TYPES } from '../constants/customer'


import { extractMsgFromErrByPropertyName, getFileUrl, mapSchema } from '../utils'
import {
  ethToFiat, tokenToEth, isFiat,
} from '../utils/rate'
import { useExchangeRates, useMe } from '../myHooks'
import { usePublicSettings } from '../myHooks/useSettings'


import KycVerificationFormLevelTwo from './KycVerificationFormLevels/KycVerificationFormLevelTwo'
import KycVerificationFormSourceOfFunds from './KycVerificationFormSourceOfFunds'


const useStyles = makeStyles(() => ({
  input_border_date: {
    borderRadius: '4px',
    border: '1px solid #d2dde9',
    width: '100%',
    padding: '10px 15px',
    lineHeight: '20px',
    fontSize: '.9em',
    color: 'rgba(73, 84, 99, 0.7)',
    transition: 'all .4s',
    '&:focus': {
      boxShadow: 'none',
      outline: 'none',
      borderColor: '#b1becc',
    },
    '&:disabled': {
      background: 'rgba(230, 239, 251, 0.2)',
    },

    '~': {
      error: {
        color: '#ff6868',
        marginBottom: '0',
        position: 'relative',
        top: '7px',
      },
    },
  },
  circularProgressWrapper: {
    display: 'flex',
    justifyContent: 'center',
  },
  itemBar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  flexAlignCenter: {
    display: 'flex',
    alignItems: 'center',
  },
  info: {
    color: '#758698',
    '&>svg': {
      margin: '0 5px 0 0',
    },
  },
  note: {
    color: '#758698',
    fontSize: '12px',
  },
  listCheck: {
    '&>li': {
      display: 'flex',
      alignItems: 'center',
      '&>svg': {
        margin: '0 5px 0 0',
        color: '#6e81a9',
      },
    },
  },
  formControl: {
    marginBottom: '30px',
    '& label': {
      margin: '0 0 10px 0',
      '&>.MuiTypography-body1': {
        fontSize: '14px',
        color: 'rgba(0, 0, 0, 0.65)',
      },
    },
  },
  title: {
    marginBottom: '40px',
  },
  confirmParagraph: {
    paddingLeft: '20px',
    margin: '0 0 0 30px',
    listStyleType: 'square',
    '& li:last-child': {
      paddingBottom: '0',
    },
    '& li': {
      padding: '0 0 25px 0',
    },
    '&>li': {
      listStyleType: 'square',
      paddingBottom: '25px',
      '&>ul': {
        padding: '20px 0 0 20px',
        margin: '0 0 0 30px',
        listStyleType: 'circle',
        '&>li': {
          listStyleType: 'circle',
        },
      },
    },
  },
  declarationWarging: {
    border: '1px solid',
    padding: '10px',
    margin: ' 20px 0 50px 30px',
  },
  inputText: {
    marginBottom: '5px',
  },
  controlIcon: {
    cursor: 'pointer',
  },

  equalsContainer: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
  },

  sourceOfFundsExample: {
    marginLeft: 10,
  },

  documentTypeButton: {
    paddingBottom: '22px !important',
  },
}))

const KYC_USER_TYPE_ENUM = {
  notPoliticalPerson: {
    value: 'NOT_POLITICAL_PERSON',
    label: 'I am no politically exposed person, no family member of a politically exposed person, and no person known'
      + ' to a politically exposed person.',
  },
  politicalPerson: {
    value: 'POLITICAL_PERSON',
    label: 'I am a politically exposed person who exercises or has exercised a high-level public office at'
      + ' international, European or national level, or who has a public office below the national level whose'
      + ' political significance is comparable, or has exercised, a family member of such politically exposed'
      + ' Person or person known to be related to such politically exposed person.',
  },
  anotherPoliticalPerson: {
    value: 'ANOTHER_POLITICAL_PERSON',
    label: 'I am another politically exposed person, a family member of such a politically exposed person or'
      + ' someone known to such a politically exposed person.',
  },
}

const KYC_WALLET_ENUM = {
  ethereum: {
    value: 'ETHEREUM',
    label: 'Ethereum',
    currencies: {
      usd: 165,
    },
  },
}

const MAX_AMOUNT_USD_WITHOUT_PROOF_IDENTITY = 20625

const DISABLED_INPUT_FIELD = {
  amount: true,
  wallet: true,
  currency: true,
  tokenAddress: true,
}

const UpdateKycVerificationForm = ({
  mainInfoSchemas, addressInfoSchemas, filesSchemas, documentTypeEnum, kycType, updateCustomer, updateCustomerData,
  onSuccess, customer,
}) => {
  const classes = useStyles()
  const { data: { exchangeRates } = {} } = useExchangeRates()
  const { data: { publicSettings = {} } = {}, loading: loadingPublicSettings } = usePublicSettings()
  const { data: { me: userData = {} } = {} } = useMe()
  const { loading, error, data } = updateCustomerData
  const [values, setValues] = useState({
    // wallets and terms
    wallet: KYC_WALLET_ENUM.ethereum.value,
    tokenAddress: userData.eth_receiving_wallet || '',
    personType: KYC_USER_TYPE_ENUM.notPoliticalPerson.value,
    duties: '',
    relationshipToPEP: '',
    documentType: documentTypeEnum[Object.keys(documentTypeEnum)[0]].value,
    amount: String(parseInt(customer.amount)),
    currency: customer.currency,
    sourceOfFunds: kycType === CUSTOMER_TYPES.INDIVIDUAL ? customer.source_of_funds : undefined,
    sourceOfFundsOther: kycType === CUSTOMER_TYPES.INDIVIDUAL ? customer.source_of_funds_other : undefined,
  })
  const disabledInput = customer.status !== CUSTOMER_STATUS_TYPES.REOPEN

  const accepted_field_application_individual_fiat = Object.keys(publicSettings).length > 0
    ? (publicSettings.kyc_levels[1].acceptedFieldIndividualFiat || {})
    : {}
  const accepted_field_application_individual_crypto = Object.keys(publicSettings).length > 0
    ? (publicSettings.kyc_levels[1].acceptedFieldIndividualCrypto || {})
    : {}

  const fiatList = ['usd', 'eur', 'chf']
  const cryptoList = ['eth']
  const acceptedCurrencies = (publicSettings && publicSettings.accepted_currencies) || {}


  const [checkboxValues, setCheckboxValues] = useState({
    IActOnMyOwnAccount: false,
    acknowledgementOfReceiptTerm1: false,
    acknowledgementOfReceiptTerm2: false,
    acknowledgementOfReceiptTerm3: false,

    confirmationTerms1: false,

    declarationOfConsent1: false,
    declarationOfConsent2: false,
    declarationOfConsent3: false,
    declarationOfConsent4: false,
  })

  const [mainInfoValues, setMainInfoValues] = useState({
    ...reduce(mainInfoSchemas, mapSchema, {}),
    birthDate: userData.birth_date,
    email: userData.email,
    firstName: customer.first_name,
    lastName: customer.last_name,
    phoneNumber: userData.phone,
    uniqueId: customer.uniqueId,
    descriptionOfFunds: customer.descriptionOfFunds,
    taxNumber: customer.taxNumber,
    taxOffice: customer.taxOffice,
    personType: customer.personType,
    duties: customer.duties,
    relationshipToPEP: customer.relationshipToPEP,
    companyName: customer.companyName,
    companyAddress: customer.companyAddress,
    companyRegisterNumber: customer.companyRegisterNumber,
    descriptionRegisterExtractBusinessActivity: customer.descriptionRegisterExtractBusinessActivity,
    authorizedPersonals: customer.authorizedPersonals,
  })

  const [addressValues, setAddressValues] = useState({
    ...reduce(addressInfoSchemas, mapSchema, {}),
    placeOfBirth: customer.placeOfBirth,
    nationality: customer.nationality,
    countryOfResidence: customer.countryOfResidence,
    residentialAddress: customer.residentialAddress,
    city: customer.city,
    postalCode: customer.postalCode,
  })
  const [fileValues, setFileValues] = useState(reduce(filesSchemas, mapSchema, {}))
  const [listCountryIdentification, setListCountryIdentification] = useState([])

  useEffect(() => {
    axios.get('https://etrust-live.electronicid.eu/v2/videoid.idtypes')
      .then((res) => setListCountryIdentification(res.data))
  }, [setListCountryIdentification])

  const prospectusOrIssuingDate = ((publicSettings || {}).prospectus_or_issuing === PROSPECTUS_OR_ISSUING.ISSUING)
    ? moment(publicSettings.issuing_guidelines).format('YYYY-MM-DD')
    : moment(publicSettings.prospectus_date).format('YYYY-MM-DD')
  const prospectusOrIssuing = (publicSettings || {}).prospectus_or_issuing === PROSPECTUS_OR_ISSUING.ISSUING ? 'Issuing Guidelines' : 'Prospectus'
  const getDownloadUrl = (path) => `${getFileUrl(path)}?origin=${window.location.origin}`
  const handleChange = (name, state, setState) => (event) => {
    setState({ ...state, [name]: event.target.value })
  }

  const baseCurrency = (publicSettings && publicSettings.base_currency) || 'chf'
  const baseCurrencyUpperCase = baseCurrency.toUpperCase()
  const tokenToChf = exchangeRates && ethToFiat(
    values.currency === 'eth'
      ? baseCurrency
      : values.currency,
    tokenToEth(values.amount, exchangeRates),
    exchangeRates
  )

  const handleAmountChange = (e) => {
    const { value } = e.target
    const amount = (value)
      ? String(parseInt(value))
      : String(value)
    setValues({ ...values, amount })
  }

  const onChangeCheckbox = (name, state, setState) => (event) => {
    setState({ ...state, [name]: event.target.checked })
  }

  const onChangeTab = (name, state, setState, value = '') => () => {
    if (value) {
      setState({ ...state, [name]: value })
    }
  }

  const onDropFile = (name) => (img, imgURI) => {
    const newImage = {
      img: img.length > 0 ? img[0] : null,
      imgURI: imgURI.length > 0 ? imgURI[0] : '',
    }

    setFileValues({ ...fileValues, [name]: newImage })
  }

  const onSend = () => {
    const files = Object.keys(fileValues).reduce((prev, current) => ({
      ...prev,
      [current]: fileValues[current].img,
    }), {})

    let inputData = {
      ...pick(mainInfoValues, [
        ...Object.keys(mainInfoSchemas),
      ]),
      ...pick(values, [
        'wallet', 'tokenAddress', 'personType', 'duties', 'relationshipToPEP', 'documentType', 'amount', 'currency',
      ]),
      ...pick(files, [
        ...Object.keys(filesSchemas),
      ]),
    }

    if (kycType === CUSTOMER_TYPES.INDIVIDUAL) {
      inputData = {
        ...inputData,
        ...pick(values, [
          'sourceOfFunds',
          'sourceOfFundsOther',
        ]),
      }
    }

    if (addressInfoSchemas) {
      inputData = {
        ...inputData,
        ...pick(addressValues, [
          ...Object.keys(addressInfoSchemas),
        ]),
      }
    }

    updateCustomer({ variables: { id: customer.id, input: inputData } })
    ReactPixel.track('SubmitApplication')
  }

  const renderInputField = ({
    // eslint-disable-next-line react/prop-types
    propertyName, label = '', type = 'text', isRequired, helperText, state, setState, disabled = false, setter = null, labelPostfix = null, options = [],
  } = {}) => {
    const errorsTexts = extractMsgFromErrByPropertyName(error, propertyName)

    let input = null

    switch (type) {
      case 'phone':
        input = (
          <>
            <PhoneInput
              defaultCountry="us"
              onChange={setter || ((value) => { setState({ ...state, [propertyName]: value }) })}
              variant="outlined"
              disabled={disabledInput}
              fullWidth
              value={state[propertyName] || ''}
            />
            <FormHelperText error={errorsTexts.length !== 0}>{helperText || ((errorsTexts && errorsTexts.join('. ')) || '')}</FormHelperText>
          </>
        )
        break
      case 'select':
        input = (
          <TextField
            className="input-bordered"
            select
            value={state[propertyName] || ''}
            onChange={setter || handleChange(propertyName, state, setState)}
            margin="none"
            variant="outlined"
            fullWidth
            error={errorsTexts.length !== 0}
            helperText={helperText || ((errorsTexts && errorsTexts.join('. ')) || '')}
            disabled={disabledInput}
          >
            { options.map((option) => <MenuItem key={option} value={option}>{option}</MenuItem>)}
          </TextField>
        )
        break
      default:
        if (customer.status !== CUSTOMER_STATUS_TYPES.REOPEN) {
          input = (
            <TextField
              id="outlined-name"
              className="input-bordered"
              value={state[propertyName] || ''}
              onChange={setter || handleChange(propertyName, state, setState)}
              margin="none"
              type={type}
              error={errorsTexts.length !== 0}
              helperText={helperText || ((errorsTexts && errorsTexts.join('. ')) || '')}
              variant="outlined"
              disabled={propertyName !== 'descriptionOfFunds'}
              fullWidth
            />
          )
        } else {
          input = (
            <TextField
              id="outlined-name"
              className="input-bordered"
              value={state[propertyName] || ''}
              onChange={setter || handleChange(propertyName, state, setState)}
              margin="none"
              type={type}
              error={errorsTexts.length !== 0}
              helperText={helperText || ((errorsTexts && errorsTexts.join('. ')) || '')}
              variant="outlined"
              disabled={
              disabledInput
              || DISABLED_INPUT_FIELD[propertyName]
            }
              fullWidth
            />
          )
        }
    }

    return (
      <>
        {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
        <label className="input-item-label" key={`label-${propertyName}`}>
          { label }
          { isRequired && <span className="text-danger"> *</span>}
          {labelPostfix}
        </label>
        <div className="input-item" key={propertyName}>
          {input}
        </div>
      </>
    )
  }

  const renderInputArray = ({
    // eslint-disable-next-line react/prop-types
    propertyName, label = '', type, isRequired, state, setState,
  } = {}) => (
    <>
      <div className={classes.itemBar}>
        {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
        <label className="input-item-label" key={`label-${propertyName}`}>
          { label }
          { isRequired && <span className="text-danger"> *</span>}
        </label>
        <div>
          <AddIcon
            className={classes.controlIcon}
            onClick={() => {
              if (state[propertyName].length < 15) {
                const newArray = state[propertyName]
                setState({ ...state, [propertyName]: [...newArray, ''] })
              }
            }}
          />
          <RemoveIcon
            className={classes.controlIcon}
            onClick={() => {
              if (state[propertyName].length > 1) {
                const newArray = state[propertyName].slice(0, state[propertyName].length - 1)
                setState({ ...state, [propertyName]: newArray })
              }
            }}
          />
        </div>
      </div>


      <div className="input-item" key={propertyName}>
        {
          state[propertyName].map((v, i) => {
            const errorsTexts = extractMsgFromErrByPropertyName(error, `${propertyName}.${i}`)

            return (
              <TextField
                id="outlined-name"
                // eslint-disable-next-line react/no-array-index-key
                key={`${propertyName}-${i}`}
                className={classNames('input-bordered', classes.inputText)}
                value={v || ''}
                onChange={(event) => {
                  const arrayValues = state[propertyName]
                  arrayValues[i] = event.target.value

                  setState({ ...state, [propertyName]: arrayValues })
                }}
                margin="none"
                type={type || 'text'}
                error={errorsTexts.length !== 0}
                helperText={(errorsTexts && errorsTexts.join('. ')) || ''}
                variant="outlined"
                disabled={disabledInput}
                fullWidth
              />
            )
          })
        }
      </div>
    </>
  )


  const renderPaymentsForm = () => {
    const minimumInvestAmount = (publicSettings && publicSettings.minimum_investment_amount) || 15000

    return typeof exchangeRates === 'undefined' ? null : (
      <div className="form-step form-step3">
        <div className="form-step-head card-innr">
          <div className="step-head">
            <div className="step-number">01</div>
            <div className="step-head-text">
              <h4>Payments</h4>
              <p>
                At the same time as the subscription is accepted, the Subscriber is requested to transfer the
                subscription amount to the following special account of the Issuer within 10 days:
              </p>
            </div>
          </div>
        </div>
        <div className="form-step-fields card-innr">
          <Grid container spacing={2}>
            <Grid item md={6} xs={12}>
              <div className={classNames('step-head-text')}>
                <h4>
herewith subscribe (the “Subscriber”): in ETH/
                  { baseCurrencyUpperCase }
                </h4>
                {' '}
                <br />
              </div>
              {
                renderInputField({
                  propertyName: 'amount',
                  type: publicSettings.token_type === TOKEN_TYPES.BOND ? 'text' : 'number',
                  label: 'Tokens',
                  isRequired: false,
                  helperText: `The minimum subscription amount per investor is ${baseCurrencyUpperCase} ${minimumInvestAmount} or `
                    + `the equivalent in ETH according to the ${prospectusOrIssuing} dated ${prospectusOrIssuingDate}`,
                  state: values,
                  setState: setValues,
                  setter: handleAmountChange,
                })
              }
            </Grid>
            <Grid item md={6} xs={12}>
              { values.amount && (
                <div className={classes.equalsContainer}>
                  {values.currency === 'eth' ? (
                    <h4>
                      Equals
                      {' '}
                      {tokenToEth(values.amount, exchangeRates)}
                      {' '}
                      ETH
                    </h4>
                  )
                    : (
                      <h4>
                      Equals
                        {' '}
                        {ethToFiat(values.currency, tokenToEth(values.amount, exchangeRates), exchangeRates)}
                        {' '}
                        { (values.currency || '').toUpperCase() }
                      </h4>
                    )}
                </div>
              )}
            </Grid>
          </Grid>
          <div className="gaps-2x" />
          <FormControl disabled>
            <FormLabel>Currency</FormLabel>
            <RadioGroup value={(values || {}).currency} onChange={({ target: { value } }) => setValues({ ...values, currency: value })}>
              {[...cryptoList, ...fiatList].filter((name) => acceptedCurrencies[name]).map((name) => (
                <FormControlLabel key={name} label={name.toUpperCase()} value={name} control={<Radio color="primary" />} />))}
            </RadioGroup>
          </FormControl>
          <div className="gaps-2x" />
          <Grid container spacing={2}>
            <Grid item md={6} xs={12}>
              {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
              <label className="input-item-label">
                Select wallet
              </label>
              <div className="input-item">
                <TextField
                  disabled
                  className="input-bordered"
                  select
                  value={values.wallet}
                  onChange={handleChange(
                    'wallet',
                    values,
                    setValues
                  )}
                  margin="none"
                  variant="outlined"
                  fullWidth
                >
                  {Object.keys(KYC_WALLET_ENUM).map((key) => (
                    <MenuItem key={key} value={KYC_WALLET_ENUM[key].value}>
                      {KYC_WALLET_ENUM[key].label || ''}
                    </MenuItem>
                  ))}
                </TextField>
              </div>
            </Grid>
          </Grid>
          <div className="gaps-2x" />
          <Grid container spacing={2}>
            <Grid item md={12} xs={12}>
              {
                renderInputField({
                  propertyName: 'tokenAddress',
                  type: 'text',
                  label: 'Your Address for tokens',
                  isRequired: true,
                  helperText: 'Note: Address should be ERC20-compliant.',
                  state: values,
                  setState: setValues,
                  labelPostfix: (publicSettings || {}).source_of_address_for_tokens_example_path && (
                    <a
                      className={classes.sourceOfFundsExample}
                      href={getDownloadUrl(publicSettings.source_of_address_for_tokens_example_path)}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {'   '}
Show Example
                    </a>
                  ),
                })
              }
            </Grid>
          </Grid>
        </div>
      </div>
    )
  }


  const renderPersonalDetailForm = () => (
    <div className="form-step-fields card-innr">
      <div className="note note-plane note-light-alt note-md pdb-1x">
        <p>
          {publicSettings.kyc_text || ''}
        </p>
      </div>
      <div className="note note-plane note-light-alt note-md pdb-1x">
        <p>
          Please type carefully and fill out the form with your personal details.
          Entered data will not be editable once you have submitted the form.
        </p>
      </div>
      <Grid container spacing={2}>
        {
          Object.keys(mainInfoSchemas).map((key) => {
            if (mainInfoSchemas[key].type === 'array') {
              return mainInfoSchemas[key].adminOnly ? null : (
                <Grid item md={12} xs={12} key={key}>
                  {
                    renderInputArray({
                      propertyName: key,
                      type: mainInfoSchemas[key].type || 'text',
                      label: mainInfoSchemas[key].label || '',
                      isRequired: mainInfoSchemas[key].isRequired || false,
                      state: mainInfoValues,
                      setState: setMainInfoValues,
                    })
                  }
                </Grid>
              )
            }

            if (isFiat(values.currency)) {
              if (!accepted_field_application_individual_fiat[key] && accepted_field_application_individual_fiat[key] !== undefined) {
                return null
              }
            }
            if (!isFiat(values.currency)) {
              if (!accepted_field_application_individual_crypto[key] && accepted_field_application_individual_crypto[key] !== undefined) {
                return null
              }
            }

            if (mainInfoSchemas[key].type === 'date') {
              const errorsTexts = extractMsgFromErrByPropertyName(error, key)

              return mainInfoSchemas[key].adminOnly ? null : (
                <Grid item md={6} xs={12} key={key}>
                  <div className="input-item input-with-label">
                    {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
                    <label className="input-item-label" key="birth_date">
                      {mainInfoSchemas[key].label}
                      <span className="text-danger"> *</span>
                    </label>
                    <div className="input-item">
                      <MuiPickersUtilsProvider utils={DateFnsUtils}>
                        <KeyboardDatePicker
                          disabled={key !== 'descriptionOfFunds' && disabledInput}
                          disableToolbar
                          disableFuture
                          variant="outlined"
                          format="dd.MM.yyyy"
                          margin="none"
                          className={classes.input_border_date}
                          id="date-picker-dialog"
                          value={mainInfoValues[key]}
                          error={errorsTexts.length !== 0}
                          helperText={(errorsTexts && errorsTexts.join('. ')) || ''}
                          onChange={(date) => setMainInfoValues({ ...mainInfoValues, [key]: date })}
                        />
                      </MuiPickersUtilsProvider>
                    </div>
                  </div>
                </Grid>
              )
            }

            if (key === 'descriptionOfFunds' && tokenToChf >= +(publicSettings.kyc_levels[3].min_invest_amount)) {
              const postfix = (publicSettings || {}).source_of_funds_example_path
                && (
                <a
                  className={classes.sourceOfFundsExample}
                  href={getDownloadUrl(publicSettings.source_of_funds_example_path)}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {'   '}
Show Example
                </a>
                )
              return mainInfoSchemas[key].adminOnly ? null : (
                <Grid item md={6} xs={12} key={key}>
                  {
                    renderInputField({
                      propertyName: key,
                      type: mainInfoSchemas[key].type || 'text',
                      label: mainInfoSchemas[key].label || '',
                      isRequired: mainInfoSchemas[key].isRequired || false,
                      state: mainInfoValues,
                      setState: setMainInfoValues,
                      labelPostfix: postfix,
                    })
                  }

                </Grid>
              )
            } if (key === 'descriptionOfFunds') {
              return null
            }

            return mainInfoSchemas[key].adminOnly ? null : (
              <Grid item md={6} xs={12} key={key}>
                {
                  renderInputField({
                    propertyName: key,
                    type: mainInfoSchemas[key].type || 'text',
                    label: mainInfoSchemas[key].label || '',
                    isRequired: mainInfoSchemas[key].isRequired || false,
                    state: mainInfoValues,
                    setState: setMainInfoValues,
                  })
                }
              </Grid>
            )
          })
        }
      </Grid>
      {kycType === CUSTOMER_TYPES.INDIVIDUAL && (
        <>
          {(isFiat(values.currency) && accepted_field_application_individual_fiat.descriptionOfFunds) && (
            <>
              <h4 className="text-secondary mgt-0-5x">Source of funds</h4>
              <FormHelperText error={extractMsgFromErrByPropertyName(error, 'sourceOfFunds').length !== 0}>{((extractMsgFromErrByPropertyName(error, 'sourceOfFunds') && extractMsgFromErrByPropertyName(error, 'sourceOfFunds').join('. ')) || '')}</FormHelperText>
              <Grid container spacing={2}>
                <Grid item md={6} xs={12} key="sourceOfFunds">
                  <KycVerificationFormSourceOfFunds
                    values={values}
                    setValues={setValues}
                    loading={loading}
                    handleChange={handleChange}
                  />
                </Grid>
              </Grid>
            </>
          )}
          {(!isFiat(values.currency) && accepted_field_application_individual_crypto.descriptionOfFunds) && (
            <>
              <h4 className="text-secondary mgt-0-5x">Source of funds</h4>
              <FormHelperText error={extractMsgFromErrByPropertyName(error, 'sourceOfFunds').length !== 0}>{((extractMsgFromErrByPropertyName(error, 'sourceOfFunds') && extractMsgFromErrByPropertyName(error, 'sourceOfFunds').join('. ')) || '')}</FormHelperText>
              <Grid container spacing={2}>
                <Grid item md={6} xs={12} key="sourceOfFunds">
                  <KycVerificationFormSourceOfFunds
                    values={values}
                    setValues={setValues}
                    loading={loading}
                    handleChange={handleChange}
                  />
                </Grid>
              </Grid>
            </>
          )}
        </>
      )}
      <h4 className="text-secondary mgt-0-5x">Your Address</h4>
      <Grid container spacing={2}>
        {
          addressInfoSchemas && Object.keys(addressInfoSchemas).map((key) => {
            if (key === 'countryOfResidence') {
              return (
                <Grid item md={6} xs={12} key={key}>
                  {
                  renderInputField({
                    propertyName: key,
                    type: 'select',
                    label: addressInfoSchemas[key].label || '',
                    isRequired: addressInfoSchemas[key].isRequired || false,
                    state: addressValues,
                    setState: setAddressValues,
                    options: listCountryIdentification.filter((country) => country.countryName)
                      .map((country) => country.countryName),
                  })
                }
                </Grid>
              )
            }
            return (
              <Grid item md={6} xs={12} key={key}>
                {
                  renderInputField({
                    propertyName: key,
                    type: addressInfoSchemas[key].type || 'text',
                    label: addressInfoSchemas[key].label || '',
                    isRequired: addressInfoSchemas[key].isRequired || false,
                    state: addressValues,
                    setState: setAddressValues,
                  })
                }
              </Grid>
            )
          })
        }
      </Grid>
    </div>
  )

  const renderTermsAndConditions = () => (
    <div className="form-step form-step-final">
      <div className="form-step-fields card-innr">
        <div className={classNames('step-head-text', classes.title)}>
          <h4>I am / The beneficial owner is:</h4>
        </div>
        <FormControl component="fieldset" className={classes.formControl}>
          <RadioGroup
            aria-label="person type"
            name="personType"
            value={values.personType}
            onChange={handleChange(
              'personType',
              values,
              setValues
            )}
          >
            {
              Object.keys(KYC_USER_TYPE_ENUM).map((key) => (
                KYC_USER_TYPE_ENUM[key].value
                && (
                  <FormControlLabel
                    key={key}
                    value={KYC_USER_TYPE_ENUM[key].value}
                    control={<Radio color="primary" />}
                    label={KYC_USER_TYPE_ENUM[key].label || ''}
                  />
                )
              ))
            }
          </RadioGroup>
        </FormControl>
        {
          values.personType !== KYC_USER_TYPE_ENUM.notPoliticalPerson.value
          && (
            <>
              {
                renderInputField({
                  propertyName: 'duties',
                  type: 'text',
                  label: 'Exact description of the function:',
                  isRequired: true,
                  state: values,
                  setState: setValues,
                })
              }
              {
                renderInputField({
                  propertyName: 'relationshipToPEP',
                  type: 'text',
                  label: 'relationship to PEP:',
                  isRequired: true,
                  state: values,
                  setState: setValues,
                })
              }
            </>
          )
        }
        <div className={classNames('step-head-text', classes.title)}>
          <h4>Acknowledgement of Receipt</h4>
        </div>
        <FormControlLabel
          control={(
            <Checkbox
              checked={checkboxValues.IActOnMyOwnAccount}
              onChange={onChangeCheckbox(
                'IActOnMyOwnAccount',
                checkboxValues,
                setCheckboxValues
              )}
              color="primary"
              value="IActOnMyOwnAccount"
            />
          )}
          label={'I Confirm That I Act On My Own Account, In My Own Economic Interests And Not'
          + ' On Behalf Of Others. Or The Beneficial Owner Is, If Different From The Subscriber:'}
        />
        <p className={classes.note}>
          Note: A Beneficial Owner In Accordance With Art. 2 Para. 1 Let. E) DDA Is A Natural Person On
          Whose Behalf Or In Whose Interest A Transaction Or Activity Is Carried Out Or A Business
          Relationship Is Ultimately Established. In The Case Of Legal Entities, It Is Also The
          Natural Person In Whose Property Or Under Its Control The Legal Entity Ultimately Stands.
          <br />
          According to Art. 3 of the Liechtenstein Due Diligence Ordinance (DDO) in particular:
          <br />
          in the case of corporations, including corporately structured establishments or trust companies,
          and non-personality corporations: those individuals who, in the end, directly or indirectly hold
          or control share or voting rights of 25% or more in such entities, or otherwise control these
          entities exercise;
          <br />
          in the case of foundations, trusts and foundation-like structured establishments or trust
          enterprises: those natural persons who are effective, non-trustee founders, founders or
          trustors, regardless of whether they exercise control over them after the legal entity has
          been established; those natural or legal persons who are members of the foundation council
          or of the board of trustees; any natural persons who are protectors or persons with similar
          or equivalent functions; those natural persons who are beneficiaries; if no beneficiaries are
          yet to be designated, the group of persons in whose interest the legal entity is primarily
          established or operated; in addition, those individuals who ultimately control the entity
          through direct or indirect ownership or otherwise.
        </p>
        <div className={classNames('step-head-text', classes.title)}>
          <h4>Declaration of Consent</h4>
        </div>
        <FormControlLabel
          className={classes.formControl}
          control={(
            <Checkbox
              checked={checkboxValues.acknowledgementOfReceiptTerm1}
              onChange={onChangeCheckbox(
                'acknowledgementOfReceiptTerm1',
                checkboxValues,
                setCheckboxValues
              )}
              color="primary"
              value="acknowledgementOfReceiptTerm1"
            />
          )}
          label={`I Hereby Confirm The Receipt Of The ${prospectusOrIssuing} Of The Issuer Dated ${prospectusOrIssuingDate} Regarding The`
          + ` ${publicSettings.token_type === TOKEN_TYPES.BOND ? 'Bond' : 'Shares'}, Which Among Other Things Contain The Information According To Art.`
          + ' 5 Liechtenstein Act On Distance Marketing Of Consumer Financial Services.'}
        />
        <FormControlLabel
          className={classes.formControl}
          control={(
            <Checkbox
              checked={checkboxValues.acknowledgementOfReceiptTerm2}
              onChange={onChangeCheckbox(
                'acknowledgementOfReceiptTerm2',
                checkboxValues,
                setCheckboxValues
              )}
              color="primary"
              value="acknowledgementOfReceiptTerm2"
            />
          )}
          label={(
            <>
              I Hereby Confirm To Have Been Informed
              <NavLink to="/right-of-withdrawal"> About The Right Of Withdrawal.</NavLink>
            </>
          )}
        />
        <FormControlLabel
          className={classes.formControl}
          control={(
            <Checkbox
              checked={checkboxValues.acknowledgementOfReceiptTerm3}
              onChange={onChangeCheckbox(
                'acknowledgementOfReceiptTerm3',
                checkboxValues,
                setCheckboxValues
              )}
              color="primary"
              value="acknowledgementOfReceiptTerm3"
            />
          )}
          label={'I Hereby Declare And Confirm That, At The Same Time As The Subscription Is Accepted,'
          + ' I Am Requested To Transfer The Subscription Amount To The Following Special'
          + ' Account Of The Issuer Within The Duration Of The Offer. Please Refer To Further'
          + ' Instructions In Your My Account (This Account Will Be Created Once The KYC Form'
          + ' Has Been Successfully Submitted))'}
        />
        <div className={classNames('step-head-text', classes.title)}>
          <h4>Confirmations</h4>
        </div>
        <FormControlLabel
          className={classes.formControl}
          control={(
            <Checkbox
              checked={checkboxValues.confirmationTerms1}
              onChange={onChangeCheckbox(
                'confirmationTerms1',
                checkboxValues,
                setCheckboxValues
              )}
              color="primary"
              value="confirmationTerms1"
            />
          )}
          label={(
            <>
              I Hereby Confirm That, Before Subscribing, I Have Received And Read The
              {' '}
              {prospectusOrIssuing}
              {' '}
Of The
              Issuer Dated
              {' '}
              {prospectusOrIssuingDate}
              {' '}
              Regarding The
              {' '}
              {publicSettings.token_type === TOKEN_TYPES.BOND ? 'Bond' : 'Shares'}
, In Particular The Risk Information,
              Promptly And In Full And I Agree With The Content Of The
              {' '}
              {prospectusOrIssuing}
, And In Particular That
            </>
          )}
        />
        <ul className={classes.confirmParagraph}>
          <li>I Accept The Subscription Applications</li>
          <li>
            I Have Duly Noted The Sales Restrictions Stipulated In The
            {' '}
            {prospectusOrIssuing}
            {' '}
And Hereby Con
            Firm That Those Restrictions Are Observed, Especially I Certify That I As A Single
            Natural Person Or Legal Entity
            <ul>
              <li>Am Not A Citizen Of The USA, Canada And Australia</li>
              <li>
                Do Not Hold A Permanent Residence And Work Permit For The US (Green Card), Canada Or Australia
              </li>
              <li>
                Have No Residence Or Principal Place Of Business In The USA,
                Canada Or Australia Or Their Respective Territories
              </li>
              <li>
                Am Not A Corporation Or Any Other Asset Organized Under The Laws Of The United States,
                Canada Or Australia, The Income Of Which Is Governed By The Laws Of Canada Or Australia
              </li>
              <li>
                Am Not On Any Of The Sanction Lists Of The European Union, The United States, Canada Or Australia
              </li>
            </ul>
          </li>
          <li>
            I Have Duly Noted The Risks And Their Potential Implications
            Described In The
            {' '}
            {prospectusOrIssuing}
            {' '}
And Hereby Accept Them
          </li>
        </ul>
        <div className={classNames('step-head-text', classes.title)}>
          <h4>Declaration of Consent</h4>
        </div>
        <FormControlLabel
          className={classes.formControl}
          control={(
            <Checkbox
              checked={checkboxValues.declarationOfConsent1}
              onChange={onChangeCheckbox(
                'declarationOfConsent1',
                checkboxValues,
                setCheckboxValues
              )}
              color="primary"
              value="declarationOfConsent1"
            />
          )}
          label={(
            <>
              I Hereby Consent To My Personal Data Being Processed By The Issuer And All Companies
              Affiliated With It, As Well As The Persons And Entities Involved In The Management
              And Supervision Of My Investment (In Particular The Issuer’s Business, Banks, Tax
              Advisors, Auditors) Being Stored In Computer Equipment And Be Used. The Data Collected
              May Also Be Used For The Purposes Of Advertising By Email And Post, Regardless
              Of A Contractual Relationship.Please
              {' '}
              <NavLink to="/declaration-of-consent">See The Declaration Of Consent</NavLink>
            </>
          )}
        />
        <FormControlLabel
          className={classes.formControl}
          control={(
            <Checkbox
              checked={checkboxValues.declarationOfConsent2}
              onChange={onChangeCheckbox(
                'declarationOfConsent2',
                checkboxValues,
                setCheckboxValues
              )}
              color="primary"
              value="declarationOfConsent2"
            />
          )}
          label={(
            <>
              I Hereby Declare That I Have Been Provided With The
              {' '}
              <NavLink to="/privacy-policy">Privacy Policy</NavLink>
              {' '}
              Of The Issuer
              And That I Have Been Informed About The Details Of The Data Processing As Well As About
              My Data Protection Rights.
            </>
          )}
        />
        <div className={classes.declarationWarging}>
          Warnings: The Acquisition Of The
          {' '}
          {publicSettings.token_type === TOKEN_TYPES.BOND ? 'Bond' : 'Shares'}
          {' '}
Involves Considerable Risks And May Result In The
          Complete Loss Of The Invested Assets. The Issuer Indicates That It Does Not Assess Whether
          (1) The
          {' '}
          {publicSettings.token_type === TOKEN_TYPES.BOND ? 'Bond' : 'Shares'}
          {' '}
Comply With The Investment Objectives Of The Subscriber, (2) The Resulting
          Investment Risk Is Financially Viable For The Subscriber Of Its Investment Objectives And
          (3) The Subscriber With His / Her / Its Knowledge And Experiences Can Understand The
          Resulting Investment Risks.
        </div>
        <FormControlLabel
          className={classes.formControl}
          control={(
            <Checkbox
              checked={checkboxValues.declarationOfConsent3}
              onChange={onChangeCheckbox(
                'declarationOfConsent3',
                checkboxValues,
                setCheckboxValues
              )}
              color="primary"
              value="declarationOfConsent3"
            />
          )}
          label={'I Hereby Confirm That The Declarations Made To The Best Of My Knowledge And Belief'
          + ' Are Correct And Complete. Any Changes To The Aforementioned Circumstances Will'
          + ' Be Communicated To The Issuer Without Delay In Written Form And Must Be Forwarded'
          + ' An Updated Self-Assessment Within 30 Days Upon Request.'}
        />
        <FormControlLabel
          className={classes.formControl}
          control={(
            <Checkbox
              checked={checkboxValues.declarationOfConsent4}
              onChange={onChangeCheckbox(
                'declarationOfConsent4',
                checkboxValues,
                setCheckboxValues
              )}
              color="primary"
              value="declarationOfConsent4"
            />
          )}
          label={'I Have Read The Aforementioned “Warnings” And Especially'
          + ` The “Risk Information” In The ${prospectusOrIssuing}. I Am Aware Of The Risk Of The Acquisition Of The ${publicSettings.token_type === TOKEN_TYPES.BOND ? 'Bond' : 'Shares'}.`}
        />

        {
          loading
            ? <div className={classes.circularProgressWrapper}><CircularProgress /></div>
            : <button disabled={!!Object.keys(checkboxValues).find((v) => !checkboxValues[v])} onClick={onSend} type="button" className="btn btn-primary">Process for Verify</button>
        }

      </div>
    </div>
  )

  if (data) {
    const kycName = { INDIVIDUAL: 'individual', COMPANY: 'company' }
    const urlRedirect = `/application-lvl-increase/${kycName[kycType]}/${Object.values(data)[0].id}`
    return <Redirect push to={urlRedirect || '/profile'} />
  }

  return !loadingPublicSettings ? (
    <div className="page-content">
      <div className="container">
        <Grid justify="center" alignItems="center" container spacing={0}>
          <Grid item xl={9} lg={10}>
            <div className="kyc-form-steps card mx-lg-4">
              {publicSettings && renderPaymentsForm()}
              <div className="form-step form-step1">
                <div className="form-step-head card-innr">
                  <div className="step-head">
                    <div className="step-number">02</div>
                    <div className="step-head-text">
                      <h4>Personal Details</h4>
                      <p>
Your personal information required for identification
                        <br />
                      </p>
                    </div>
                  </div>
                </div>

                { renderPersonalDetailForm() }

              </div>
              <KycVerificationFormLevelTwo
                documentTypeEnum={documentTypeEnum}
                onChangeTab={onChangeTab}
                setValues={setValues}
                KYC_WALLET_ENUM={KYC_WALLET_ENUM}
                kycType={kycType}
                filesSchemas={filesSchemas}
                onDropFile={onDropFile}
                fileValues={fileValues}
                values={values}
                customer={customer}
                settings={publicSettings}
                MAX_AMOUNT_USD_WITHOUT_PROOF_IDENTITY={MAX_AMOUNT_USD_WITHOUT_PROOF_IDENTITY}
                accepted_field_application_individual_fiat={accepted_field_application_individual_fiat}
                accepted_field_application_individual_crypto={accepted_field_application_individual_crypto}
              />

              { renderTermsAndConditions() }
            </div>
          </Grid>
        </Grid>
      </div>
    </div>
  )
    : <div className={classes.circularProgressWrapper}><CircularProgress /></div>
}

UpdateKycVerificationForm.propTypes = {
  mainInfoSchemas: PropTypes.object.isRequired,
  addressInfoSchemas: PropTypes.object,
  filesSchemas: PropTypes.object.isRequired,
  documentTypeEnum: PropTypes.object.isRequired,
  kycType: PropTypes.string.isRequired,
  updateCustomer: PropTypes.func.isRequired,
  updateCustomerData: PropTypes.object.isRequired,
  onSuccess: PropTypes.func,
}

export default UpdateKycVerificationForm
