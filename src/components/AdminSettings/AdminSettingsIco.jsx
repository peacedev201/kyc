import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { useQuery } from '@apollo/react-hooks'

import reduce from 'lodash/reduce'
import difference from 'lodash/difference'

import '../../styles/legacy/style.scss'
import makeStyles from '@material-ui/core/styles/makeStyles'

import Grid from '@material-ui/core/Grid'
import MenuItem from '@material-ui/core/MenuItem'
import Button from '@material-ui/core/Button'
import CircularProgress from '@material-ui/core/CircularProgress'
import FormControl from '@material-ui/core/FormControl'
import FormLabel from '@material-ui/core/FormLabel'
import RadioGroup from '@material-ui/core/RadioGroup'
import Radio from '@material-ui/core/Radio'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Checkbox from '@material-ui/core/Checkbox'

import moment from 'moment'
import countryList from 'react-select-country-list'
import Chip from '@material-ui/core/Chip'
import Select from '@material-ui/core/Select'
import InputMatetial from '@material-ui/core/Input'
import { TOKEN_TYPES, PROSPECTUS_OR_ISSUING } from '../../constants/settings'
import { ACCEPTED_CURRENCIES } from '../../constants/contribute'
import Input from '../Input'
import { DATE_UPLOAD_COPY_CSV } from '../../queriesAndMutations'

const SETS = {
  token_type: {
    default: TOKEN_TYPES.EQUITY,
  },
  token_name: {
    default: '',
  },
  token_symbol: {
    default: '',
  },
  base_currency: {
    default: '',
  },
  minimum_investment_amount: {
    default: 1,
  },
  prospectus_date: {
    default: new Date('01.01.1970'),
  },
  google_analytics_id: {
    default: '',
  },
  google_tag_manager_id: {
    default: '',
  },
  pixel_id: {
    default: '',
  },
  video_ident_value: {
    default: 15000,
  },
  interval_upload_csv_pythagoras: {
    default: 1,
  },
  kyc_text: {
    default: 'Hello!',
  },
  prospectus_or_issuing: {
    default: PROSPECTUS_OR_ISSUING.PROSPECTUS,
  },
  issuing_guidelines: {
    default: new Date('01.01.1970'),
  },
  login_youtube_video: {
    default: '',
  },
  first_link_login: {
    default: '',
  },
  first_text_login: {
    default: '',
  },
  second_link_login: {
    default: '',
  },
  second_text_login: {
    default: '',
  },
  not_video_ident_countries: {
    default: {},
  },
  high_risk_countries: {
    default: {},
  },
  low_risk_countries: {
    default: {},
  },
  show_source_signup: {
    default: false,
  },
  send_gto_api_when_changing_status: {
    default: false,
  },
  add_ether_wallet_later_option: {
    default: false,
  },
  internal_sales_api: {
    default: ''
  },
  internal_sales_api_key: {
    default: ''
  },
}

const useStyles = makeStyles(() => ({
  circularProgressWrapper: {
    display: 'flex',
    justifyContent: 'center',
  },
  chips: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  chip: {
    margin: 2,
  },
}))

const AdminSettingsIco = ({
  settings, loading, error, onUpdate, editingAllowed,
}) => {
  const classes = useStyles()
  const [values, setValues] = useState({
    ...reduce(SETS, (memo, value, key) => {
      if (key === 'prospectus_date' || key === 'issuing_guidelines') {
        // eslint-disable-next-line no-param-reassign
        memo[key] = (settings[key] && moment(settings[key]).format('YYYY-MM-DD')) || moment(SETS[key].default).format('YYYY-MM-DD')
        return memo
      }

      // eslint-disable-next-line no-param-reassign
      memo[key] = settings[key] || SETS[key].default
      return memo
    }, {}),
  })
  const {
    data: { dateUploadCopyCsv = {} } = {},
    loading: loadingLastUploadCsv = false,
    error: errorLastUploadCsv
  } = useQuery(DATE_UPLOAD_COPY_CSV)

  const [acceptedCurrencies, setAcceptedCurrencies] = useState({
    eth: true,
    eur: true,
    chf: true,
    usd: true,
    ...(settings.accepted_currencies || {}),
  })

  const [daysForNotifications, setDaysForNotifications] = useState({
    signUpWithoutKYC: 3,
    transactionWithoutKYC: 3,
    ...(settings.days_for_notifications || {}),
  })
  const countryListHighRiskCountries = countryList().getData().map((country) => country.label)
  const countryListLowRiskCountries = countryList().getData().map((country) => country.label)

  const fieldsDaysForNotifications = {
    signUpWithoutKYC: {
      propertyName: 'signUpWithoutKYC',
      label: 'Sign up without KYC. Days for notification',
    },
    transactionWithoutKYC: {
      propertyName: 'transactionWithoutKYC',
      label: 'Transaction without KYC. Days for notification',
    },
  }

  const nameFieldApplication = {
    taxNumber: 'Tax number',
    taxOffice: 'Tax office',
    photoWithMeUpload: 'Upload photo proof document',
    proofOfResidenceUpload: 'Upload proof Residence',
    show_source_signup: 'Show source registered',
    send_gto_api_when_changing_status: 'Send info about transactions to GTO endpoint',
    mandatoryKYCOrganic: 'Mandatory KYC organic to create transaction',
    mandatoryKYCReferral: 'Mandatory KYC referral to create transaction ',
  }

  const [acceptMandatoryKYC, setAcceptMandatoryKYC] = useState({
    mandatoryKYCOrganic: true,
    mandatoryKYCReferral: true,
    ...(settings.accepted_mandatory_kyc || {}),
  })

  const onChangeInput = (name, state, setState) => (event) => {
    setState({ ...state, [name]: +event[name] })
  }

  const onChangeCheckbox = (name, state, setState) => (event) => {
    setState({ ...state, [name]: event.target.checked })
  }

  const onChangeVideoIdentCountries = (name, state, setState) => (event) => {
    setState({ ...state, [name]: { ...event.target.value } })
  }

  const onUpdateBtnClick = () => {
    const newValues = {
      ...values,
      days_for_notifications: daysForNotifications,
      accepted_currencies: acceptedCurrencies,
      accepted_mandatory_kyc: acceptMandatoryKYC,
    }
    newValues.minimum_investment_amount = parseInt(newValues.minimum_investment_amount, 10)
    newValues.video_ident_value = parseInt(newValues.video_ident_value, 10)
    onUpdate(newValues)
  }

  const renderCheckbox = (checkbox, setCheckbox) => (
    <>
      { Object.keys(checkbox).map((name, key) => (
        <Grid key={key} item xs={12} md={3}>
          <FormControlLabel
            control={(
              <Checkbox
                checked={checkbox[name]}
                disabled={!editingAllowed}
                onChange={onChangeCheckbox(
                  name,
                  checkbox,
                  setCheckbox
                )}
                color="primary"
                value={checkbox[name]}
              />
            )}
            label={`Accept ${nameFieldApplication[name]}`}
          />
        </Grid>
      )) }
    </>
  )

  const renderTokenSettings = () => (
    <Grid container spacing={2}>
      <Grid item xs={12} md={4}>
        <Input
          propertyName="token_name"
          label="Token Name"
          state={values}
          setState={setValues}
          error={error}
          disabled={!editingAllowed}
          loading={loading}
        />
      </Grid>
      <Grid item xs={12} md={2}>
        <Input
          propertyName="token_symbol"
          label="Token Symbol"
          state={values}
          setState={setValues}
          error={error}
          disabled={!editingAllowed}
          loading={loading}
        />
      </Grid>
      <Grid item xs={12} md={4}>
        <FormControl>
          <FormLabel>Token type</FormLabel>
          <RadioGroup value={(values || {}).token_type} onChange={({ target: { value } }) => setValues({ ...values, token_type: value })}>
            <FormControlLabel disabled={!editingAllowed} label="Equity" value={TOKEN_TYPES.EQUITY} control={<Radio />} />
            <FormControlLabel disabled={!editingAllowed} label="Bond" value={TOKEN_TYPES.BOND} control={<Radio />} />
          </RadioGroup>
        </FormControl>
      </Grid>
      <Grid item xs={12} md={4}>
        <FormControl>
          <FormLabel>Prospectus date or issuing guidelines</FormLabel>
          <RadioGroup value={(values || {}).prospectus_or_issuing} onChange={({ target: { value } }) => setValues({ ...values, prospectus_or_issuing: value })}>
            <FormControlLabel disabled={!editingAllowed} label="Prospectus date" value={PROSPECTUS_OR_ISSUING.PROSPECTUS} control={<Radio />} />
            <FormControlLabel disabled={!editingAllowed} label="Issuing guidelines" value={PROSPECTUS_OR_ISSUING.ISSUING} control={<Radio />} />
          </RadioGroup>
        </FormControl>
      </Grid>

      {(values || {}).prospectus_or_issuing === PROSPECTUS_OR_ISSUING.ISSUING ? (
        <Grid item xs={12} md={3}>
          <Input
            propertyName="issuing_guidelines"
            type="date"
            label="Issuing guidelines"
            state={values}
            setState={setValues}
            error={error}
            disabled={!editingAllowed}
            loading={loading}
          />
        </Grid>
      ) : (
        <Grid item xs={12} md={3}>
          <Input
            propertyName="prospectus_date"
            type="date"
            label="Prospectus date"
            state={values}
            setState={setValues}
            error={error}
            disabled={!editingAllowed}
            loading={loading}
          />
        </Grid>
      )}
    </Grid>
  )

  const renderCurrencySettings = () => (
    <>
      <Grid container spacing={2}>
        <Grid item xs={12} md={4}>
          <Input
            propertyName="minimum_investment_amount"
            type="number"
            label="Min investment amount"
            state={values}
            setState={setValues}
            error={error}
            disabled={!editingAllowed}
            loading={loading}
          />
        </Grid>
        <Grid item xs={12} md={2}>
          <Input
            propertyName="base_currency"
            label="Base currency"
            state={values}
            setState={setValues}
            error={error}
            disabled={!editingAllowed}
            loading={loading}
            select
          >
            {
              ACCEPTED_CURRENCIES.map((item) => (
                <MenuItem key={item} value={item}>
                  {item.toUpperCase()}
                </MenuItem>
              ))
            }
          </Input>
        </Grid>
      </Grid>
      <Grid container spacing={2}>
        { Object.keys(acceptedCurrencies).map((name, key) => (
          <Grid key={key} item xs={12} md={3}>
            <FormControlLabel
              control={(
                <Checkbox
                  checked={acceptedCurrencies[name]}
                  disabled={!editingAllowed}
                  onChange={onChangeCheckbox(
                    name,
                    acceptedCurrencies,
                    setAcceptedCurrencies
                  )}
                  color="primary"
                  value={name}
                />
            )}
              label={`Accept ${name}`}
            />
          </Grid>
        )) }
      </Grid>

      <Grid container spacing={2}>
        <Grid item xs={12} md={12}>
          <Input
            propertyName="kyc_text"
            type="text"
            label="Kyc text"
            state={values}
            setState={setValues}
            error={error}
            disabled={!editingAllowed}
            loading={loading}
          />
        </Grid>
      </Grid>
      <Grid container spacing={2}>
        <label className="input-item-label" key="label-not_video_ident_countries">
        Video Ident is not needed if the country
        </label>
        <Grid item xs={12} md={12}>
          <Select
            multiple
            value={Object.values(values.not_video_ident_countries)}
            onChange={onChangeVideoIdentCountries(
              'not_video_ident_countries',
              values,
              setValues
            )}
            input={<InputMatetial />}
            renderValue={(selected) => (
              <div className={classes.chips}>
                {selected.map((value) => (
                  <Chip key={value} label={value} className={classes.chip} />
                ))}
              </div>
            )}
          >
            { countryList().getData().map((country) => <MenuItem key={country.label} value={country.label}>{country.label}</MenuItem>) }
          </Select>
        </Grid>
        <label className="input-item-label" key="label-high_risk_countries">
        High risk countries
        </label>
        <Grid item xs={12} md={12}>
          <Select
            multiple
            value={Object.values(values.high_risk_countries)}
            onChange={onChangeVideoIdentCountries(
              'high_risk_countries',
              values,
              setValues
            )}
            input={<InputMatetial />}
            renderValue={(selected) => (
              <div className={classes.chips}>
                {selected.map((value) => (
                  <Chip key={value} label={value} className={classes.chip} />
                ))}
              </div>
            )}
          >
            { difference(countryListHighRiskCountries, Object.values(values.low_risk_countries))
              .map((country) => <MenuItem key={country} value={country}>{country}</MenuItem>) }
          </Select>
        </Grid>
        <label className="input-item-label" key="label-low_risk_countries">
        Low risk countries
        </label>
        <Grid item xs={12} md={12}>
          <Select
            multiple
            value={Object.values(values.low_risk_countries)}
            onChange={onChangeVideoIdentCountries(
              'low_risk_countries',
              values,
              setValues
            )}
            input={<InputMatetial />}
            renderValue={(selected) => (
              <div className={classes.chips}>
                {selected.map((value) => (
                  <Chip key={value} label={value} className={classes.chip} />
                ))}
              </div>
            )}
          >
            { difference(countryListLowRiskCountries, Object.values(values.high_risk_countries))
              .map((country) => <MenuItem key={country} value={country}>{country}</MenuItem>) }
          </Select>
        </Grid>
      </Grid>
    </>
  )

  const renderVideoIdentValueSettings = () => (
    <Grid container spacing={2}>
      <Grid item xs={12} md={4}>
        <Input
          propertyName="video_ident_value"
          label="Video ident value (CHF)"
          state={values}
          type="number"
          setState={setValues}
          error={error}
          disabled={!editingAllowed}
          loading={loading}
        />
      </Grid>
    </Grid>
  )

  const renderGoogleAnalyticsSettings = () => (
    <Grid container spacing={2}>
      <Grid item xs={12} md={6}>
        <Input
          propertyName="google_analytics_id"
          label="Google analytics id"
          state={values}
          setState={setValues}
          error={error}
          disabled={!editingAllowed}
          loading={loading}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <Input
          propertyName="google_tag_manager_id"
          label="Google tag manager id"
          state={values}
          setState={setValues}
          error={error}
          disabled={!editingAllowed}
          loading={loading}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <Input
          propertyName="pixel_id"
          label="Facebook pixel id"
          state={values}
          setState={setValues}
          error={error}
          disabled={!editingAllowed}
          loading={loading}
        />
      </Grid>
    </Grid>
  )

  const renderFieldLoginPageSettings = () => (
    <div>
      <h4>Login page</h4>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Input
            propertyName="login_youtube_video"
            label="Youtube video"
            state={values}
            setState={setValues}
            error={error}
            disabled={!editingAllowed}
            loading={loading}
            helperText="video url format = https://www.youtube.com/embed/{video code}"
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <Input
            propertyName="first_link_login"
            label="First link button"
            state={values}
            setState={setValues}
            error={error}
            disabled={!editingAllowed}
            loading={loading}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <Input
            propertyName="first_text_login"
            label="First text button"
            state={values}
            setState={setValues}
            error={error}
            disabled={!editingAllowed}
            loading={loading}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <Input
            propertyName="second_link_login"
            label="First link button"
            state={values}
            setState={setValues}
            error={error}
            disabled={!editingAllowed}
            loading={loading}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <Input
            propertyName="second_text_login"
            label="First text button"
            state={values}
            setState={setValues}
            error={error}
            disabled={!editingAllowed}
            loading={loading}
          />
        </Grid>
      </Grid>
    </div>
  )

  const renderFieldsSendEmail = () => (
    <div>
      <h4>Send email</h4>
      <Grid container spacing={2}>
        { Object.keys(daysForNotifications).map((name, key) => (
          <Grid key={key} item xs={12} md={3}>
            <Input
              type="number"
              propertyName={fieldsDaysForNotifications[name].propertyName}
              label={fieldsDaysForNotifications[name].label}
              state={daysForNotifications}
              setState={onChangeInput(
                name,
                daysForNotifications,
                setDaysForNotifications,
              )}
              error={error}
              disabled={!editingAllowed}
              loading={loading}
            />
          </Grid>
        )) }
      </Grid>
    </div>
  )

  const renderOtherFields = () => (
    <div>
      <h4>Other settings</h4>
      <Grid container spacing={2}>
        <Grid item xs={12} md={3}>
          <FormControlLabel
            control={(
              <Checkbox
                checked={values.show_source_signup}
                disabled={!editingAllowed}
                onChange={onChangeCheckbox(
                  'show_source_signup',
                  values,
                  setValues
                )}
                color="primary"
                value={values.show_source_signup}
              />
)}
            label="Show source registered"
          />
        </Grid>
        { renderCheckbox(acceptMandatoryKYC, setAcceptMandatoryKYC) }
        <Grid item xs={12} md={3}>
          <FormControlLabel
            control={(
              <Checkbox
                checked={values.send_gto_api_when_changing_status}
                disabled={!editingAllowed}
                onChange={onChangeCheckbox(
                  'send_gto_api_when_changing_status',
                  values,
                  setValues
                )}
                color="primary"
                value={values.send_gto_api_when_changing_status}
              />
            )}
            label="Send info about transactions to GTO endpoint"
          />
        </Grid>
        <br/>
      </Grid>
      <Grid container spacing={2}>
        <Grid item xs={12} md={3}>
          <FormControlLabel
            control={(
              <Checkbox
                checked={values.add_ether_wallet_later_option}
                disabled={!editingAllowed}
                onChange={onChangeCheckbox(
                  'add_ether_wallet_later_option',
                  values,
                  setValues
                )}
                color="primary"
                value={values.add_ether_wallet_later_option}
              />
)}
            label="Add ether wallet later"
          />
        </Grid>
      </Grid>
      <Grid container spacing={2}>
        <Grid item xs={12} md={3}>
          <Input
            propertyName="interval_upload_csv_pythagoras"
            label="Csv (pythagoras) upload  Interval in days"
            state={values}
            setState={onChangeInput(
              'interval_upload_csv_pythagoras',
              values,
              setValues)}
            error={error}
            type="number"
            disabled={!editingAllowed}
            loading={loading}
            helperText={<div>
              <p>Bucket equanimity-sync</p>
              {(!loadingLastUploadCsv && !errorLastUploadCsv) && (
                <p>Last upload {moment(dateUploadCopyCsv).format('YYYY-MM-DD hh:mm:ss a')}</p>
              )}
            </div>}
          />
        </Grid>
      </Grid>
    </div>
  )

 const renderInternalSalesApiSettings = () => (
   <div>
     <h4>Internal Sales API Settings</h4>
     <Grid container spacing={2}>
       <Grid item xs={12} md={4}>
          <Input
            propertyName='internal_sales_api'
            type='text'
            label='API Url'
            state={values}
            setState={setValues}
            error={error}
            disabled={!editingAllowed}
            loading={loading}
          />
       </Grid>
       <Grid item xs={12} md={4}>
          <Input
            propertyName='internal_sales_api_key'
            type='text'
            label='API Key'
            state={values}
            setState={setValues}
            error={error}
            disabled={!editingAllowed}
            loading={loading}
          />
       </Grid>
     </Grid>
   </div>
 );

  return (
    <>
      { renderTokenSettings() }
      { renderCurrencySettings() }
      { renderVideoIdentValueSettings() }
      { renderGoogleAnalyticsSettings() }
      { renderFieldLoginPageSettings() }
      { renderFieldsSendEmail() }
      { renderOtherFields() }
      { renderInternalSalesApiSettings() }
      {
        loading
          ? <div className={classes.circularProgressWrapper}><CircularProgress /></div>
          : (
            <Button disabled={!editingAllowed} variant="contained" color="primary" onClick={onUpdateBtnClick}>
              Update
            </Button>
          )
      }
    </>
  )
}

AdminSettingsIco.propTypes = {
  settings: PropTypes.object.isRequired,
  onUpdate: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  error: PropTypes.object,
}

export default AdminSettingsIco
