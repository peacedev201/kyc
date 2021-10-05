import React, { useState } from 'react'
import PropTypes from 'prop-types'

import omit from 'lodash/omit'

import classNames from 'classnames'

import makeStyles from '@material-ui/core/styles/makeStyles'

import '../styles/legacy/style.scss'
import SwipeableViews from 'react-swipeable-views'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
import Typography from '@material-ui/core/Typography'
import Box from '@material-ui/core/Box'
import Dialog from '@material-ui/core/Dialog'
import DialogContent from '@material-ui/core/DialogContent'
import Grid from '@material-ui/core/Grid'
import Button from '@material-ui/core/Button'
import useTheme from '@material-ui/core/styles/useTheme'
import { useMutation } from '@apollo/react-hooks'
import Input from '../components/Input'
import Footer from '../components/Footer'
import AppBar from '../components/AppBar'
import AdminSettingsIco from '../components/AdminSettings/AdminSettingsIco'
import AdminSettingsCompany from '../components/AdminSettings/AdminSettingsCompany'
import AdminSettingsBank from '../components/AdminSettings/AdminSettingsBank'
import AdminSettingsCrypto from '../components/AdminSettings/AdminSettingsCrypto'
import AdminSettingsMailgun from '../components/AdminSettings/AdminSettingsMailgun'
import { toaster } from '../utils/toaster'
import { useSettings } from '../myHooks/useSettings'

import { SAVE_SETTINGS } from '../queriesAndMutations'
import AdminSettingsUploads from '../components/AdminSettings/AdminSettingsUploads'
import { useMe } from '../myHooks'
import { hasUserEnoughRights } from '../utils'
import { USER_RIGHT_TYPES } from '../constants/user'
import AdminSettingsKYClvl from '../components/AdminSettings/AdminSettingsKYClvl'
import AdminSettingsIdentification from '../components/AdminSettings/AdminSettingsIdentification'

const useStyles = makeStyles(() => ({
  circularProgressWrapper: {
    display: 'flex',
    justifyContent: 'center',
  },
}))

function TabPanel(props) {
  const {
    children, value, index, ...other
  } = props

  return (
    <Typography
      component="div"
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      <Box p={3}>{children}</Box>
    </Typography>
  )
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
}

function a11yProps(index) {
  return {
    id: `full-width-tab-${index}`,
    'aria-controls': `full-width-tabpanel-${index}`,
  }
}

const AdminSettings = () => {
  const classes = useStyles()
  const theme = useTheme()
  const { data, refetch } = useSettings({ fetchPolicy: 'network-only' })
  const { data: { me = {} } = {} } = useMe()
  const [value, setValue] = useState(0)
  const [updateSettings, updateSettingsData] = useMutation(SAVE_SETTINGS)

  const [valuesToSend, setValuesToSend] = useState({ two_fa_token: '' })
  const [twoFaDialogOpened, setTwoFaDialogOpened] = useState(false)
  const changeTwoFADialogState = (state) => () => setTwoFaDialogOpened(state)

  const onUpdate = async (newSettings) => {
    if (me.is_2fa_enabled === false) {
      return toaster.error('Please, enable 2fa first')
    }
    setValuesToSend({ ...newSettings })
    setTwoFaDialogOpened(true)
  }

  const onSend = async () => {
    if (data && data.settings) {
      const { settings } = data
      await updateSettings({ variables: { input: { ...omit(settings, '__typename', 'logo_path', 'logo_for_dark_bg_path', 'brief_logo_path', 'dataroom_logo_path', 'source_of_funds_example_path', 'rights_of_withdrawal_path', 'source_of_address_for_tokens_example_path', 'example_photo_proof_path'), ...valuesToSend } } })
      setTwoFaDialogOpened(false)
      refetch()
    }
  }

  const editingAllowed = hasUserEnoughRights(me.rights, USER_RIGHT_TYPES.GENERAL_ADMIN)

  const handleChange = (event, newValue) => {
    setValue(newValue)
  }

  const handleChangeIndex = (index) => {
    setValue(index)
  }

  return (
    <>
      <Dialog open={twoFaDialogOpened} onClose={changeTwoFADialogState(false)}>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid
              item
              xs={12}
            >
              <Input
                propertyName="two_fa_token"
                label="2FA token"
                state={valuesToSend}
                setState={setValuesToSend}
                error={updateSettingsData.error}
                loading={updateSettingsData.loading}
              />
            </Grid>

            <Grid
              item
              xs={12}
            >
              <Button variant="contained" color="primary" onClick={onSend}>
              Update
              </Button>
            </Grid>
          </Grid>
        </DialogContent>
      </Dialog>

      <div className="page-user">
        <AppBar />

        <div className="page-content">
          <div className="container">
            <div className="card content-area">
              <div className="card-innr">
                <div className="card-head">
                  <h4 className="card-title card-title-lg">Settings</h4>
                </div>
                <div className={classNames('card-text', classes.tableCardBody)}>
                  <Tabs
                    value={value}
                    onChange={handleChange}
                    indicatorColor="primary"
                    textColor="primary"
                    scrollButtons="auto"
                    variant="scrollable"
                  >
                    <Tab label="Main" {...a11yProps(0)} />
                    <Tab label="Company" {...a11yProps(1)} />
                    <Tab label="Bank" {...a11yProps(2)} />
                    <Tab label="Crypto" {...a11yProps(3)} />
                    <Tab label="MailGun" {...a11yProps(4)} />
                    <Tab label="Uploads" {...a11yProps(5)} />
                    <Tab label="KYC level" {...a11yProps(6)} />
                    <Tab label="Identification" {...a11yProps(7)} />
                  </Tabs>
                  {
                  (data && data.settings)
                  && (
                    <SwipeableViews
                      axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
                      index={value}
                      onChangeIndex={handleChangeIndex}
                    >
                      <TabPanel value={value} index={0} dir={theme.direction}>
                        <AdminSettingsIco editingAllowed={editingAllowed} settings={data.settings} loading={updateSettingsData.loading} onUpdate={onUpdate} />
                      </TabPanel>
                      <TabPanel value={value} index={1} dir={theme.direction}>
                        <AdminSettingsCompany
                          companySettings={data.settings && data.settings.company}
                          settings={data.settings || {}}
                          editingAllowed={editingAllowed}
                          loading={updateSettingsData.loading}
                          onUpdate={onUpdate}
                        />
                      </TabPanel>
                      <TabPanel value={value} index={2} dir={theme.direction}>
                        <AdminSettingsBank
                          bankSettings={data.settings && data.settings.bank}
                          settings={data.settings || {}}
                          editingAllowed={editingAllowed}
                          loading={updateSettingsData.loading}
                          onUpdate={onUpdate}
                        />
                      </TabPanel>
                      <TabPanel value={value} index={3} dir={theme.direction}>
                        <AdminSettingsCrypto
                          cryptoSettings={data.settings && data.settings.crypto}
                          settings={data.settings || {}}
                          editingAllowed={editingAllowed}
                          loading={updateSettingsData.loading}
                          onUpdate={onUpdate}
                        />
                      </TabPanel>
                      <TabPanel value={value} index={4} dir={theme.direction}>
                        <AdminSettingsMailgun
                          mailgunSettings={data.settings && data.settings.mailgun}
                          settings={data.settings || {}}
                          editingAllowed={editingAllowed}
                          loading={updateSettingsData.loading}
                          onUpdate={onUpdate}
                        />
                      </TabPanel>
                      <TabPanel value={value} index={5} dir={theme.direction}>
                        <AdminSettingsUploads
                          settings={data.settings}
                          editingAllowed={editingAllowed}
                          loading={updateSettingsData.loading}
                          onUpdate={onUpdate}
                        />
                      </TabPanel>
                      <TabPanel value={value} index={6} dir={theme.direction}>
                        <AdminSettingsKYClvl
                          settings={data.settings}
                          editingAllowed={editingAllowed}
                          loading={updateSettingsData.loading}
                          onUpdate={onUpdate}
                        />
                      </TabPanel>
                      <TabPanel value={value} index={7} dir={theme.direction}>
                        <AdminSettingsIdentification
                          settings={data.settings}
                          editingAllowed={editingAllowed}
                          loading={updateSettingsData.loading}
                          onUpdate={onUpdate}
                        />
                      </TabPanel>
                    </SwipeableViews>
                  )
                }

                </div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </>
  )
}

export default AdminSettings
