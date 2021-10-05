import React from 'react'
import makeStyles from '@material-ui/core/styles/makeStyles'

import { useMutation, useQuery } from '@apollo/react-hooks'
import {
  CHANGE_KYC_LEVEL_ONE_TO_TWO,
  CHANGE_KYC_LEVEL_THREE_TO_FOUR,
  CHANGE_KYC_LEVEL_TWO_TO_THREE,
  ME_INVEST_IN_BASE_CURRENCY,
} from '../queriesAndMutations'
import { toaster } from '../utils'
import { mandatoryKyc } from '../utils/me'
import { useMe } from '../myHooks'
import { usePublicSettings } from '../myHooks/useSettings'

const useStyles = makeStyles(() => ({
  cursorPointer: {
    cursor: 'pointer',
  },
  itemCenterSpaceBetween: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',

  },
}))

const KycLevelBox = ({ hiddenIfLvlZero = false }) => {
  const classes = useStyles()
  const { data: { publicSettings = {} } = {} } = usePublicSettings()
  const { data: { me } } = useMe()
  const { data: { meInvestInBaseCurrency = {} } = {}, loading: loadingMeInvestInBaseCurrency } = useQuery(ME_INVEST_IN_BASE_CURRENCY)
  const [changeKycLevelOneToTwoAction, { data: { changeKycLevelOneToTwo = false } = false, error: errorChangeKycLevelOneToTwo = {} }] = useMutation(CHANGE_KYC_LEVEL_ONE_TO_TWO)
  const [changeKycLevelTwoToThreeAction, { data: { changeKycLevelTwoToThree = false } = false, error: errorChangeKycLevelTwoToThree = {} }] = useMutation(CHANGE_KYC_LEVEL_TWO_TO_THREE)
  const [changeKycLevelThreeToFourAction, { data: { changeKycLevelThreeToFour = false } = false, error: errorChangeKycLevelThreeToFour = {} }] = useMutation(CHANGE_KYC_LEVEL_THREE_TO_FOUR)
  const is_gto_sales = me.is_gtoswiss || me.is_internal_sales
  if (!loadingMeInvestInBaseCurrency && (meInvestInBaseCurrency.current_lvl || {}).type_customer) {
    var urlRedirect = `/application-lvl-increase/${meInvestInBaseCurrency.current_lvl.type_customer.toLowerCase()}/${meInvestInBaseCurrency.current_lvl.customer_id}`
  }

  // first lvl
  if (changeKycLevelOneToTwo === true) {
    toaster.success('You sent an email with further action!')
    window.location.href = urlRedirect
  } else if (errorChangeKycLevelOneToTwo.message) {
    console.log('errorChangeKycLevelOneToTwo', errorChangeKycLevelOneToTwo.message)
    toaster.error(errorChangeKycLevelOneToTwo.message)
  }
  // second lvl
  if (changeKycLevelTwoToThree === true) {
    toaster.success('You sent an email with further action!')
    window.location.href = urlRedirect
  } else if (errorChangeKycLevelTwoToThree.message) {
    console.log('errorChangeKycLevelOneToTwo', errorChangeKycLevelOneToTwo.message)
    toaster.error(errorChangeKycLevelTwoToThree.message)
  }
  // third lvl
  if (changeKycLevelThreeToFour === true) {
    toaster.success('The request was successful!')
    window.location.href = urlRedirect
  } else if (errorChangeKycLevelThreeToFour.message) {
    console.log('errorChangeKycLevelOneToTwo', errorChangeKycLevelOneToTwo.message)
    toaster.error(errorChangeKycLevelThreeToFour.message)
  }

  const upKycLvl = async () => {
    if (meInvestInBaseCurrency.current_lvl.level === 1) {
      // const urlRedirect = `/application-update/${meInvestInBaseCurrency.current_lvl.type_customer.toLowerCase()}/${meInvestInBaseCurrency.current_lvl.customer_id}`
      // return window.location.href = urlRedirect;
      await changeKycLevelOneToTwoAction({
        variables: {
          input: {
            id: meInvestInBaseCurrency.current_lvl.id,
          },
        },
      })
    }
    if (meInvestInBaseCurrency.current_lvl.level === 2) {
      await changeKycLevelTwoToThreeAction({
        variables: {
          input: {
            id: meInvestInBaseCurrency.current_lvl.id,
          },
        },
      })
    }
    if (meInvestInBaseCurrency.current_lvl.level === 3) {
      await changeKycLevelThreeToFourAction({
        variables: {
          input: {
            id: meInvestInBaseCurrency.current_lvl.id,
          },
        },
      })
    }
  }

  const renderKYCStatusBox = () => <button type="button" className="btn btn-auto btn-xs btn-warning">lvl increase pending</button>

  if (!loadingMeInvestInBaseCurrency) {
    return (
      <>
        {hiddenIfLvlZero && (meInvestInBaseCurrency.current_lvl || {}).level < 1
          ? ''
          : (
            <div className="kyc-info card">
              <div className="card-innr">
                <div className={classes.itemCenterSpaceBetween}>
                  <h6 className="card-title card-title-sm">
                    KYC lvl {!loadingMeInvestInBaseCurrency ? (meInvestInBaseCurrency.current_lvl || {}).level : 1 }
                  </h6>
                  {meInvestInBaseCurrency.kyc_lvl_change && (
                    <>
                      { renderKYCStatusBox() }
                    </>
                  )}
                </div>
                <p>
You are able to invest {' '}
                  {!loadingMeInvestInBaseCurrency && mandatoryKyc(is_gto_sales, (publicSettings.accepted_mandatory_kyc || {}))
                    ? `${meInvestInBaseCurrency.current_lvl.min_invest_amount}-${meInvestInBaseCurrency.current_lvl.max_invest_amount}`
                    : '' }
.
                </p>
                {(
                    (meInvestInBaseCurrency.current_lvl || {}).level !== 4
                  && (meInvestInBaseCurrency.current_lvl || {}).type_customer !== undefined
                  && mandatoryKyc(is_gto_sales, (publicSettings.accepted_mandatory_kyc || {}))
                  && !meInvestInBaseCurrency.kyc_lvl_change
                ) && (
                  <p className="lead text-light pdb-0-5x">
                    <span className={classes.cursorPointer} onClick={() => upKycLvl()}>Increase Level now</span>
                  </p>
                )}
              </div>
            </div>
          )}

      </>
    )
  }
  if (loadingMeInvestInBaseCurrency) {
    return (
      <></>
    )
  }
}

export default KycLevelBox
