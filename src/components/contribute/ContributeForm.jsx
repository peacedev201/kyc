import React, { useState, useEffect } from 'react'
import { useMutation, useQuery } from '@apollo/react-hooks'
import { NavLink } from 'react-router-dom'
import Grid from '@material-ui/core/Grid'
import Dialog from '@material-ui/core/Dialog'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Checkbox from '@material-ui/core/Checkbox'
import makeStyles from '@material-ui/core/styles/makeStyles'
import InfoIcon from '@material-ui/icons/Info'
import FileCopyIcon from '@material-ui/icons/FileCopy'
import Box from '@material-ui/core/Box'
import pick from 'lodash/pick'
import AccountBalanceWalletOutlinedIcon from '@material-ui/icons/AccountBalanceWallet'
import ArrowForwardIcon from '@material-ui/icons/ArrowForward'
import IconButton from '@material-ui/core/IconButton'
import CloseIcon from '@material-ui/icons/Close'
import classNames from 'classnames'
import copy from 'copy-to-clipboard'
import qrcode from 'qrcode'
import ReactPixel from 'react-facebook-pixel'
import payBankIcon from '../../media/images/pay-bank.png'
// import payPayPalIcon from '../../media/images/pay-paypal.png'
// import payCoinbase from '../../media/images/pay-coinbase.png'
import payCryptoManual from '../../media/images/pay-crypto-manual.png'
import voltLogo from '../../media/images/logo-volt.svg'
import MenuItem from "@material-ui/core/MenuItem";
import Input from "../Input";

import {
  tokenToEth, ethToFiat, fiatToToken,
} from '../../utils/rate'
import { useExchangeRates, useMe } from '../../myHooks/index'
import currencyIcons from '../../media/images/currencyIcons/index'
import { toaster } from '../../utils'
import { mandatoryKyc } from '../../utils/me'
import CircularProgress from "@material-ui/core/CircularProgress";

import {
  CONTRIBUTE,
  ME_INVEST_IN_BASE_CURRENCY,
  CHANGE_KYC_LEVEL_TWO_TO_THREE,
  CHANGE_KYC_LEVEL_THREE_TO_FOUR,
  CHANGE_KYC_LEVEL_ONE_TO_TWO,
  VOLT_GET_SUPPORTED_COUNTRIES,
  VOLT_GET_SUPPORTED_BANKS,
  VOLT_PAYMENT_INIT_REQUEST,
  UPDATE_VOLT_TRANSACTION_ID,
} from "../../queriesAndMutations";
import {
  // WALLET_ENGINE_CURRENT_KYC_DETAILS,
  WALLET_ENGINE_WITHDRAW_BANK,
} from "../../queriesAndMutations/walletEngineMutation";
import { usePublicSettings } from '../../myHooks/useSettings'
import { PAYMENT_TYPES } from '../../constants/transaction'
import { USER_KYC_STATUS_TYPES } from '../../constants/user'
// import CreateNewAndTopUpLink from '../WalletEngine/CreateNewAndTopUpLink'

const useStyles = makeStyles(() => ({
  cursorPointer: {
    cursor: "pointer",
  },
  kycLvlUp: {
    fontSize: "1rem",
  },
  currencyIcon: {
    width: 22,
    height: 22,
    marginRight: 5,
  },
  radioInputLabel: {
    position: "relative",
  },
  payButtonIcon: {
    marginTop: "auto",
    marginBottom: "auto",
    fontSize: "16px",
  },
  paymentSuccessInfo: {
    width: "100%",
  },
  sendAmount: {
    textAlign: "left",
  },
  ethInputIcon: {
    width: "20px",
    height: "19px",
    marginTop: "12px",
    position: "absolute",
    marginLeft: "11px",
  },
  qrCode: {
    backgroundColor: "#fff",
    border: "1px solid #dee2e6",
    borderRadius: ".25rem",
    maxWidth: "100%",
    height: "auto",
  },
  infoIcon: {
    left: "-17px !important",
  },
  closeButton: {
    position: "absolute",
    right: 1,
    top: 1,
    color: "#000",
  },
  circularProgressWrapper: {
    display: "flex",
    justifyContent: "center",
  },
  voltBankLogo: {
    width: "80px",
    height: "auto",
    marginRight: "10px",
  },
  voltBankName: {
    fontWeight: "bold",
  },
}));

const ContributeForm = () => {
  const classes = useStyles()
  const { data: { publicSettings = {} } = {}, loading: loadingPublicSetting } = usePublicSettings()
  const cryptoSettings = (publicSettings && publicSettings.crypto) || {}
  const acceptedCurrencies = (publicSettings && publicSettings.accepted_currencies) || {}

  const [contribute] = useMutation(CONTRIBUTE)
  const { data: { exchangeRates } = {}, loading } = useExchangeRates()
  const { data: { me } } = useMe()
  const { data: { meInvestInBaseCurrency = {} } = {}, loading: loadingMeInvestInBaseCurrency, refetch: refetchMeInvestInBaseCurrency } = useQuery(ME_INVEST_IN_BASE_CURRENCY)
  const [changeKycLevelOneToTwoAction, { data: { changeKycLevelOneToTwo = false } = false, error: errorChangeKycLevelOneToTwo = {} }] = useMutation(CHANGE_KYC_LEVEL_ONE_TO_TWO)
  const [changeKycLevelTwoToThreeAction, { data: { changeKycLevelTwoToThree = false } = false, error: errorChangeKycLevelTwoToThree = {} }] = useMutation(CHANGE_KYC_LEVEL_TWO_TO_THREE)
  const [changeKycLevelThreeToFourAction, { data: { changeKycLevelThreeToFour = false } = false, error: errorChangeKycLevelThreeToFour = {} }] = useMutation(CHANGE_KYC_LEVEL_THREE_TO_FOUR)
  const baseCurrency = publicSettings.base_currency ? publicSettings.base_currency : 'usd'
  let canInvesting = (!loadingMeInvestInBaseCurrency && !loading)
    ? (+(fiatToToken(baseCurrency, meInvestInBaseCurrency.current_lvl.max_invest_amount - meInvestInBaseCurrency.invest_amount, exchangeRates))).toFixed(0)
    : 0
  canInvesting = canInvesting < 0 ? 0 : canInvesting
  const fiatList = ['usd', 'eur', 'chf']
  const cryptoList = ['eth']
  const allCurrency = [...fiatList, ...cryptoList]
  const acceptedCurrency = allCurrency.filter((name) => acceptedCurrencies[name])
  if (!loadingMeInvestInBaseCurrency && meInvestInBaseCurrency.current_lvl.type_customer) {
    var urlRedirect = `/application-lvl-increase/${meInvestInBaseCurrency.current_lvl.type_customer.toLowerCase()}/${meInvestInBaseCurrency.current_lvl.customer_id}`
  }
  const getTokenValueInAnything = (currency, value = 1) => {
    if (fiatList.indexOf(currency) !== -1) {
      return ethToFiat(currency, tokenToEth(value, exchangeRates), exchangeRates)
    }
    switch (currency) {
      case 'eth':
        return tokenToEth(value, exchangeRates)
      default:
        throw new Error('Undefined currency')
    }
  }
  const is_gto_sales = me.is_gtoswiss || me.is_internal_sales
  const [initFirstSelectCurrency, setInitFirstSelectCurrency] = useState(false)
  const [disabledBtn, setDisabledBtn] = useState(false)
  const [disabledVoltPaymentBtn, setDisabledVoltPaymentBtn] = useState(true)
  const [voltPaymentUrl, setVoltPaymentUrl] = useState('')
  const [values, setValues] = useState({
    currency: (publicSettings || {}).base_currency || 'usd',
    amount: me.amount_contribution_gto !== null ? String(parseInt(me.amount_contribution_gto)) : '',
    isContributionGto: me.amount_contribution_gto !== null,
    paymentType: PAYMENT_TYPES.BANK_TRANSFER,
    isMandatoryKYCNoticeDialogOpened: false,
    isMandatoryKYCNoticeDialogAlreadyClosed: false,
    isPaymentMethodDialogOpened: false,
    isPaymentConfirmationDialogOpened: false,
    isNonExchangesDialogOpen: false,
    isNonKycDialogAlreadyClosed: false,
    isNoKycDialogOpen: false,
    agreeWithConditions: false,
    qrCodeUrl: null,
    transaction: {},
    selectedTransferType: PAYMENT_TYPES.BANK_TRANSFER,
    isPaymentViaVoltDialogOpened: false,
    volt_banks: null,
    volt_selected_bank: null,
    volt_selected_country: null,
  })
  const [
    onPayViaWalletEngineLoading,
    setOnPayViaWalletEngineLoading,
  ] = useState(false);

  // WalletEngine Variables
  const walletEngineAppID = "5db2a50be7664";
  // const bodyData = { app_id: walletEngineAppID };
  // const [
  //   getCurrentKYCDetails,
  //   { data: { walletEngineCurrentKYCDetails } = {} },
  // ] = useMutation(WALLET_ENGINE_CURRENT_KYC_DETAILS);
  const [
    submitWalletEngineWithDrawBank
  ] = useMutation(WALLET_ENGINE_WITHDRAW_BANK);

  // VOLT.IO
  const [ updateVoltTransactionId ] = useMutation(UPDATE_VOLT_TRANSACTION_ID);
  const [ getVoltSupportedCountries, { data: { voltGetSupportedCountries } = {} }] = useMutation(VOLT_GET_SUPPORTED_COUNTRIES);
  const [ getVoltSupportedBanks, { data: { voltGetSupportedBanks } = {} }] = useMutation(VOLT_GET_SUPPORTED_BANKS);
  const [ makeVoltPaymentInitRequest ] = useMutation(VOLT_PAYMENT_INIT_REQUEST);
  const voltOAuth2Input = {
    // Develop
    // client_id: "242bfe66-d9b4-442e-8af0-0071cd684437",
    // client_secret: "irsurtswr",
    // grant_type: "password",
    // password: "m7qkExzbeLCQGHDk",
    // username: "admin@enercom.ag",
    // Live
    client_id: "1264a27b-d89a-41b9-9352-bae995f9dedf",
    client_secret: "c20d3f2e-ca4e-4061-b2f3-1e914b22a90c",
    grant_type: "password",
    password: "ujB@2N9CJRT4UigZ!Hzf6Mpsb&tkwh$X",
    username: "5f68760555242@volt.io",
  };

  const handleSelectedTransferType = () => (event) => setValues({
    ...values,
    selectedTransferType: event.target.value,
  });

  if (acceptedCurrency.length > 0 && !loadingPublicSetting && !initFirstSelectCurrency) {
    const randomInitCurrencyIndex = Math.floor((Math.random() * acceptedCurrency.length));
    const initCurrency = acceptedCurrency[randomInitCurrencyIndex];
    setValues({
      ...values,
      currency: initCurrency,
      paymentType: fiatList.indexOf(initCurrency) !== -1 ? PAYMENT_TYPES.BANK_TRANSFER : PAYMENT_TYPES.CRYPTO,
      selectedTransferType: fiatList.indexOf(initCurrency) !== -1 ? PAYMENT_TYPES.BANK_TRANSFER : PAYMENT_TYPES.CRYPTO
    });
    setInitFirstSelectCurrency(true);
  }

  const bankDetails = (((publicSettings || {}).bank) || {})[values.currency] || {}

  const ethAddress = cryptoSettings.eth_address

  if (changeKycLevelThreeToFour === true) {
    toaster.success('The request was successful!')
  }

  if (values.qrCodeUrl === null && ethAddress) {
    qrcode.toDataURL(ethAddress).then((qrCode) => setValues({
      ...values,
      qrCodeUrl: qrCode,
    }))
  }

  const changeMandatoryKYCNoticeDialogState = (state) => () => setValues({
    ...values,
    ...(state === false ? { isMandatoryKYCNoticeDialogAlreadyClosed: true } : {}),
    isMandatoryKYCNoticeDialogOpened: state,
  })

  const changePaymentMethodDialogState = (state) => () => setValues({
    ...values,
    isPaymentMethodDialogOpened: state,
  })

  const changePaymentConfirmationDialogState = (state) => () => setValues({
    ...values,
    isPaymentConfirmationDialogOpened: state,
  })

  const changePaymentViaVoltDialogState = (state) => () => setValues({
    ...values,
    isPaymentViaVoltDialogOpened: state,
  })

  const changeNonExchangesDialogState = (state) => () => setValues({
    ...values,
    isNonExchangesDialogOpen: state,
  })

  const changeNoKycDialogState = (state) => () => setValues({
    ...values,
    ...(state === false ? { isNonKycDialogAlreadyClosed: true } : {}),
    isNoKycDialogOpen: state,
  })

  const handleCheckboxChange = (name) => (event) => {
    setValues({ ...values, [name]: event.target.checked })
  }

  const formatPaymentRef = (transaction) =>
    transaction.payment_ref != null
      ? `TNX${transaction.id}-${transaction.payment_ref}`
      : `TNX${transaction.id}`;

  const handleAmountChange = (e) => {
    const { value } = e.target
    const amount = isNaN(+value)
      ? 0
      : +value
    setValues({ ...values, amount })
  }

  const handleCurrencyRadioChange = (currency) => () => setValues({
    ...values,
    currency,
    paymentType: fiatList.indexOf(currency) !== -1 ? PAYMENT_TYPES.BANK_TRANSFER : PAYMENT_TYPES.CRYPTO,
    selectedTransferType: fiatList.indexOf(currency) !== -1 ? PAYMENT_TYPES.BANK_TRANSFER : PAYMENT_TYPES.CRYPTO
  })

  const onPay = async () => {
    setDisabledBtn(true)
    let walletEngineTransactionId = null;
    const input = pick(values, ['currency', 'amount', 'paymentType', 'isContributionGto'])

    if (values.selectedTransferType === PAYMENT_TYPES.WALLET) {
      setOnPayViaWalletEngineLoading(true);
      input.paymentType = PAYMENT_TYPES.WALLET
      const amount_in_eur = getTokenValueInAnything('eur', values.amount)
      const bodyTransferData = {
        app_id: walletEngineAppID,
        amount: amount_in_eur,
        channel_id: "sg_debit_enercom",
        variables: {
          bank_name: "Bank of Enercom",
        },
      };
      console.log(bodyTransferData)
      await submitWalletEngineWithDrawBank({
        variables: { input: bodyTransferData },
      }).then((response) => {
        setOnPayViaWalletEngineLoading(false);
        console.log(response)
        if (response.data && response.data.walletEngineWithDrawBank && response.data.walletEngineWithDrawBank.status === "success") {
          walletEngineTransactionId = response.data.walletEngineWithDrawBank.transaction_id;
          console.log(walletEngineTransactionId)
        }
      })
    }

    if (walletEngineTransactionId !== null){
      input.walletTransactionId = walletEngineTransactionId;
    }

    if (values.selectedTransferType === PAYMENT_TYPES.VOLT) {
      setDisabledBtn(false);
      setValues({
        ...values,
        isPaymentMethodDialogOpened: false,
        isNonExchangesDialogOpen: false,
        isPaymentViaVoltDialogOpened: true,
      });
    } else {
      const { data: { contribute: dataContribute } } = await contribute({ variables: { input } })
      refetchMeInvestInBaseCurrency()
      ReactPixel.track('Purchase', { value: input.amount, ...input })
      if (Object.keys(dataContribute).length > 0) {
        setDisabledBtn(false)
        setValues({
          ...values,
          isPaymentMethodDialogOpened: false,
          isNonExchangesDialogOpen: false,
          isPaymentConfirmationDialogOpened: true,
          transaction: dataContribute,
        })
      }
    }
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


  useEffect(() => {
    if (me.kyc_status === USER_KYC_STATUS_TYPES.NOT_SUBMITTED && !values.isNoKycDialogOpen && !values.isNonKycDialogAlreadyClosed) {
      changeNoKycDialogState(true)()
    }
  })

  useEffect(() => {
    if (
      is_gto_sales
      && me.kyc_status !== USER_KYC_STATUS_TYPES.PASSED
      && (publicSettings.accepted_mandatory_kyc || {}).mandatoryKYCReferral
      && !values.isMandatoryKYCNoticeDialogAlreadyClosed
      && !values.isMandatoryKYCNoticeDialogOpened
    ) {
      changeMandatoryKYCNoticeDialogState(true)()
    }
    if (
      !is_gto_sales
      && me.kyc_status !== USER_KYC_STATUS_TYPES.PASSED
      && (publicSettings.accepted_mandatory_kyc || {}).mandatoryKYCOrganic
      && !values.isMandatoryKYCNoticeDialogAlreadyClosed
      && !values.isMandatoryKYCNoticeDialogOpened
    ) {
      changeMandatoryKYCNoticeDialogState(true)()
    }
  })

  useEffect(() => {
    if (values.isMandatoryKYCNoticeDialogOpened && values.isNoKycDialogOpen && !values.isNonKycDialogAlreadyClosed) {
      changeNoKycDialogState(false)()
    }
  })

  // useEffect(() => {
  //   if (me.kyc_status !== USER_KYC_STATUS_TYPES.NOT_SUBMITTED) {
  //     getCurrentKYCDetails({
  //       variables: { input: bodyData },
  //     });
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);

  // VOLT.IO
  let menuVoltCountryItems = [];
  let menuVoltBankItems = [];

  useEffect(() => {
    getVoltSupportedCountries({
      variables: { input: voltOAuth2Input },
    });

    getVoltSupportedBanks({
      variables: { input: voltOAuth2Input },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (values.volt_selected_bank !== null) {
      setDisabledVoltPaymentBtn(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [values.volt_selected_bank])

  if (voltGetSupportedCountries && voltGetSupportedCountries.data) {
    const voltCountryNameOptions = voltGetSupportedCountries.data.filter(
      (country) => (country["region"] || {})["regionName"] === 'Europe'
    );

    if (voltCountryNameOptions) {
      voltCountryNameOptions.forEach((country) => {
        menuVoltCountryItems.push(
          <MenuItem key={`volt_country_${country["id"]}`} value={country["id"]}>
            {country["name"].toUpperCase()}
          </MenuItem>
        );
      });
    }
  }

  if (values.volt_selected_country !== null) {
    if (voltGetSupportedBanks && voltGetSupportedBanks["banks"]) {
      let voltBankNameOptions = voltGetSupportedBanks["banks"].filter(
        (bank) => bank["country"]["id"] === values.volt_selected_country
      ).slice(0, 40);

      if (voltBankNameOptions) {
        voltBankNameOptions.forEach((bank) => {
          menuVoltBankItems.push(
            <MenuItem key={bank['id']} value={bank['id']}>
              <img className={classes.voltBankLogo} src={bank['logo']} alt='bank-logo'/>
              <span className={classes.voltBankName}>{bank['branchName']}</span>
            </MenuItem>
          );
        });
      }
    }
  }

  const renderVoltPaymentUrl = () => (
    <div>
      <p>
        Open the link below on new tab and followup to complete payment with
        Volt:
      </p>
      <a
        href={voltPaymentUrl}
        className="btn btn-info"
        rel="noopener noreferrer"
      >
        PAYMENT LINK
      </a>
    </div>
  );

  const onCheckoutVolt = async (e) => {
    e.preventDefault();
    setDisabledVoltPaymentBtn(true);
    const input = pick(values, ['currency', 'amount', 'paymentType', 'isContributionGto'])
    input.paymentType = PAYMENT_TYPES.VOLT;

    const { data: { contribute: dataContribute } } = await contribute({ variables: { input } })

    if (values.volt_selected_bank !== null) {
      const voltPaymentRequestData = {
        currencyCode: "EUR",
        amount: getTokenValueInAnything("eur", values.amount) * 100 + "",
        // Develop
        // account: "8e98915a-dff8-48f5-9041-23eddd0f2b19", // enercom.ag
        // Live
        account: "64222377-d466-4265-9583-feee8230c562",
        type: "BILL",
        uniqueReference: formatPaymentRef(dataContribute) + process.env.NODE_ENV,
        bank: values.volt_selected_bank,
      };
      console.log("voltPaymentRequestData");
      console.log(voltPaymentRequestData);
      await makeVoltPaymentInitRequest({
        variables: {
          input: {
            oauth2: voltOAuth2Input,
            payment_request: voltPaymentRequestData,
          },
        },
      }).then((response) => {
        console.log("voltPaymentInitRequest Result");
        console.log(response);
        if (response && response.data && response.data.voltPaymentInitRequest) {
          if (response.data.voltPaymentInitRequest.status === "success") {
            toaster.success("Init payment request with Volt successfully!");
            const transactionId = dataContribute.id;
            const voltPaymentId = response.data.voltPaymentInitRequest.id;
            const encodedVoltPaymentId = btoa(voltPaymentId);
            const newVoltPaymentUrl = `https://api.volt.io/checkout/${encodedVoltPaymentId}`;
            setVoltPaymentUrl(newVoltPaymentUrl);
            updateVoltTransactionId({
              variables: {
                id: transactionId,
                voltTransactionId: voltPaymentId,
              },
            });
          } else {
            toaster.error(response.data.voltPaymentInitRequest.message);
          }
        } else {
          toaster.error("Something went wrong when init payment from Volt.io");
        }
      });
      refetchMeInvestInBaseCurrency();
      ReactPixel.track("Purchase", { value: input.amount, ...input });
      if (Object.keys(dataContribute).length > 0) {
        setDisabledBtn(false);
        setValues({
          ...values,
          isPaymentMethodDialogOpened: false,
          isNonExchangesDialogOpen: false,
          isPaymentViaVoltDialogOpened: false,
          isPaymentConfirmationDialogOpened: true,
          transaction: dataContribute,
        });
      }
    };
  };

  // const wallet_engine_topup_amount = (walletEngineCurrentKYCDetails && walletEngineCurrentKYCDetails.balance) || 0;

  const renderMandatoryKYC = () => (
    <Dialog
      open={values.isMandatoryKYCNoticeDialogOpened}
      onClose={changeMandatoryKYCNoticeDialogState(false)}
    >
      <div className="popup-body">
        <IconButton
          aria-label="close"
          className={classes.closeButton}
          onClick={changeMandatoryKYCNoticeDialogState(false)}
        >
          <CloseIcon />
        </IconButton>
        <h4 className="popup-title">Notice</h4>
        <p>Please, complete KYC first</p>
      </div>
    </Dialog>
  );

  // const renderOptionPaymentViaWallet = () => (
  //   <li className="pay-item">
  //     {me.wallet_engine_token &&
  //     wallet_engine_topup_amount !== 0 &&
  //     wallet_engine_topup_amount >=
  //       getTokenValueInAnything(values.currency, values.amount) ? (
  //       <>
  //         <input
  //           type="radio"
  //           checked={values.selectedTransferType === PAYMENT_TYPES.WALLET}
  //           className="pay-check"
  //           name="pay-transfer"
  //           id="pay-wallet"
  //           value={PAYMENT_TYPES.WALLET}
  //           onChange={handleSelectedTransferType()}
  //         />
  //         {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
  //         <label className="pay-check-label" htmlFor="pay-wallet">
  //           Pay via Wallet
  //           <img
  //             src={payCryptoManual}
  //             className="pay-check-img"
  //             alt="pay-logo"
  //           />
  //         </label>
  //       </>
  //     ) : (
  //       <>
  //         <CreateNewAndTopUpLink parent="ContributeForm" />
  //       </>
  //     )}
  //   </li>
  // );

  const renderOptionPaymentWithVolt = () => (
    <li className="pay-item">
      <>
        <input
          type="radio"
          checked={values.selectedTransferType === PAYMENT_TYPES.VOLT}
          className="pay-check"
          name="pay-transfer"
          id="pay-volt"
          value={PAYMENT_TYPES.VOLT}
          onChange={handleSelectedTransferType()}
        />
        {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
        <label className="pay-check-label" htmlFor="pay-volt">
          Pay via Volt
          <img src={voltLogo} className="pay-check-img" alt="pay-logo" />
        </label>
      </>
    </li>
  );

  const renderPaymentMethodDialog = () => (
    <Dialog open={values.isPaymentMethodDialogOpened} onClose={changePaymentMethodDialogState(false)}>
      <div className="popup-body">
        <h4 className="popup-title">Buy Tokens and Payment</h4>
        <p className="lead">
          To receiving
          {' '}
          <strong>
            {values.amount}
            {' '}
            {publicSettings && publicSettings.token_symbol}
          </strong>
          {' '}
          require payment amount of
          {' '}
          <strong>
            {getTokenValueInAnything(values.currency, values.amount)}
            {' '}
            {values.currency.toUpperCase()}
          </strong>
        </p>
        <p>
          You can choose any of following payment method to make your payment. The tokens balance will appear in
          your account after successfull payment.
        </p>
        <h5 className="mgt-1-5x font-mid">Select payment method:</h5>
        <ul className="pay-list guttar-20px">
          { values.paymentType === PAYMENT_TYPES.BANK_TRANSFER ? (
            <>
              <li className="pay-item">
                <input type="radio" checked={values.selectedTransferType === PAYMENT_TYPES.BANK_TRANSFER} className="pay-check" name="pay-transfer" id="pay-transfer" value={PAYMENT_TYPES.BANK_TRANSFER} onChange={handleSelectedTransferType()}/>
                {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
                <label className="pay-check-label" htmlFor="pay-transfer">
                  Pay via bank transfer
                  <img src={payBankIcon} className="pay-check-img" alt="pay-logo" />
                </label>
              </li>
              {/* <li className="pay-item"> */}
              {/* <input type="radio" disabled className="pay-check" name="pay-paypal" id="pay-paypal" /> */}
              {/* /!* eslint-disable-next-line jsx-a11y/label-has-associated-control *!/ */}
              {/* <label className="pay-check-label" htmlFor="pay-paypal"> */}
              {/* Pay with PayPal */}
              {/* <img src={payPayPalIcon} className="pay-check-img" alt="pay-logo" /> */}
              {/* </label> */}
              {/* </li> */}
              {/* { renderOptionPaymentViaWallet() } */}
              { renderOptionPaymentWithVolt() }
            </>
          ) : (
            <>
              <li className="pay-item">
                <input type="radio" checked={values.selectedTransferType === PAYMENT_TYPES.CRYPTO} className="pay-check" name="pay-transfer" id="pay-transfer" value={PAYMENT_TYPES.CRYPTO} onChange={handleSelectedTransferType()}/>
                {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
                <label className="pay-check-label" htmlFor="pay-transfer">
                    Pay With Crypto
                  <img src={payCryptoManual} className="pay-check-img" alt="pay-logo" />
                </label>
              </li>
              {/* <li className="pay-item"> */}
              {/* <input type="radio" disabled className="pay-check" name="pay-paypal" id="pay-paypal" /> */}
              {/* /!* eslint-disable-next-line jsx-a11y/label-has-associated-control *!/ */}
              {/* <label className="pay-check-label" htmlFor="pay-paypal"> */}
              {/* Pay With Coinbase */}
              {/* <img src={payCoinbase} className="pay-check-img" alt="pay-logo" /> */}
              {/* </label> */}
              {/* </li> */}
              {/* { renderOptionPaymentViaWallet() } */}
              { renderOptionPaymentWithVolt() }
            </>
          )}

        </ul>
        {/* <span className="text-light font-italic mgb-2x"><small>* Payment gateway company may charge you a processing fees.</small></span> */}
        <div className="pdb-2-5x pdt-1-5x">
          <FormControlLabel
            control={(
              <Checkbox
                checked={values.agreeWithConditions}
                onChange={handleCheckboxChange('agreeWithConditions')}
                color="default"
                value="rememberMe"
              />
            )}
            label="I hereby agree to the terms and conditions"
          />
        </div>
        <ul className="d-flex flex-wrap align-items-center guttar-30px">
          <li>
            <button
              disabled={values.agreeWithConditions === false || disabledBtn}
              onClick={values.paymentType === PAYMENT_TYPES.BANK_TRANSFER ? onPay : changeNonExchangesDialogState(true)}
              type="button"
              className="btn btn-primary btn-between w-100"
            >
              Buy Tokens Now
              <ArrowForwardIcon className={classNames('ti')} />
            </button>
          </li>
        </ul>
        {onPayViaWalletEngineLoading ? (
          <div className={classes.circularProgressWrapper}>
            <CircularProgress />
          </div>
        ) : (
          ""
        )}
        <div className="gaps-2x" />
        <div className="gaps-1x d-none d-sm-block" />
        <div className="note note-plane note-light note-md">
          <InfoIcon className={classNames('fa', classes.infoIcon)} fontSize="inherit" />
          <p>
            Our payment address will appear or redirect you for payment after the order is placed
          </p>
        </div>
      </div>
    </Dialog>
  )


  const renderNonExchangesDialog = () => (
    <Dialog open={values.isNonExchangesDialogOpen} onClose={changeNonExchangesDialogState(false)}>
      <div className="popup-body">
        <h4 className="popup-title">Confirmation</h4>
        <p>
          Please confirm one more time you are not sending from an exchange but from your own Ethereum wallet like Metamask and NOT from an exchange like Binance, Coinbase, Kraken or other.
        </p>
        <br />
        <Grid container spacing={2}>
          <Grid item>
            <div onClick={onPay}>
              <span className="btn btn-auto btn-sm btn-primary">
                    Yes
              </span>
            </div>
          </Grid>
        </Grid>
      </div>
    </Dialog>
  )

  const renderNoKycDialog = () => (
    <Dialog open={values.isNoKycDialogOpen && !values.isMandatoryKYCNoticeDialogOpened} onClose={changeNoKycDialogState(false)}>
      <div className="popup-body">
        <h4 className="popup-title">Confirmation</h4>
        <p>
          Hello, we recognized that you not have submitted a KYC Application, this is required to accept any payments from investors.
          Please note that if you send any transactions via FIAT to our bank account and you will not KYC yourself for the next 30 days,
          we will refund the money and void the transaction. Please note that if you send via ETH and you are not KYCed your transaction will fail and rejected.
          You will only be able to send ETH into the Smart Contract once you have been approved by our compliance team.
        </p>
        <br />
        <Grid container spacing={2}>
          <Grid item>
            <div onClick={changeNoKycDialogState(false)}>
              <span className="btn btn-auto btn-sm btn-primary">
                    I confirm
              </span>
            </div>
          </Grid>
        </Grid>
      </div>
    </Dialog>
  )


  const renderPaymentConfirmationDialog = () => (
    <Dialog open={values.isPaymentConfirmationDialogOpened} onClose={changePaymentConfirmationDialogState(false)}>
      <div className="popup-body">
        <h4 className="popup-title">Confirmation Your Payment</h4>
        <div className="popup-content">
          <p className="lead-lg text-primary">
            Your Order no.
            <strong>
              TNX
              {values.transaction.id}
            </strong>
            {' '}
            has been placed successfully.
          </p>
          {values.selectedTransferType === PAYMENT_TYPES.BANK_TRANSFER ? (
            <p>
            Please make your payment of
              {' '}
              <strong className="text-primary">{+values.transaction.currency_amount}</strong>
              {' '}
              <strong
                className="text-primary"
              >
                {values.transaction.currency}
              </strong>
              {' '}
            through bank to the below bank address. The token balance will
            appear in your account only after your transaction gets approved by our team.
            </p>
          ) : values.selectedTransferType === PAYMENT_TYPES.CRYPTO ? (
            <p>
Please send
              {' '}
              <strong className="text-primary">
                {' '}
                {+values.transaction.currency_amount}
              </strong>
              {' '}
              <strong
                className="text-primary"
              >
                {values.transaction.currency}
              </strong>
              {' '}
to the address below. The token balance will appear in your account
              only after transaction gets 3 confirmation and approved by our team.
            </p>
          ) : values.selectedTransferType === PAYMENT_TYPES.VOLT ? renderVoltPaymentUrl() : null }
          <div className="gaps-1x" />
          {values.selectedTransferType === PAYMENT_TYPES.BANK_TRANSFER ? (
            <div className={classes.paymentSuccessInfo}>
              <h5 className="text-head mgb-0-5x"><strong>Bank Details for Payment</strong></h5>
              <table className="table table-flat">
                <tbody>
                  <tr>
                    <th>Account Name</th>
                    <td>{bankDetails.account_name}</td>
                  </tr>
                  <tr>
                    <th>Account Number</th>
                    <td>{bankDetails.account_number}</td>
                  </tr>
                  <tr>
                    <th>Bank Name</th>
                    <td>{bankDetails.bank_name}</td>
                  </tr>
                  <tr>
                    <th>Bank Address</th>
                    <td>{bankDetails.bank_address}</td>
                  </tr>
                  <tr>
                    <th>Routing Number</th>
                    <td>{bankDetails.routing_number}</td>
                  </tr>
                  <tr>
                    <th>IBAN</th>
                    <td>{bankDetails.iban}</td>
                  </tr>
                  <tr>
                    <th>Swift/BIC</th>
                    <td>{bankDetails['swift/bic']}</td>
                  </tr>
                  <tr>
                    <th>Payment Reference</th>
                    <td>{formatPaymentRef(values.transaction)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          ) : values.selectedTransferType === PAYMENT_TYPES.CRYPTO ? (
            <div className="pay-wallet-address pay-wallet-eth">
              <h6 className="font-bold">Payment to the following Ethereum Wallet Address</h6>
              <Grid container spacing={5} className="row guttar-1px guttar-vr-15px">
                <Grid item sm={2} className="col-sm-2">
                  <p className="text-center text-sm-left">
                    {values.qrCodeUrl && (
                    <img
                      title="Scan QR code to payment."
                      className={classes.qrCode}
                      width="82"
                      src={values.qrCodeUrl}
                      alt=""
                    />
                    )}
                  </p>
                </Grid>
                <Grid item sm={9}>
                  <div className="fake-class pl-sm-3">
                    <p className={classes.sendAmount}>
                      <strong>
Send Amount:
                        { ' ' }
                        <span className="fs-16 text-primary">
                          {+values.transaction.currency_amount}
                          {' '}
                          {values.transaction.currency}
                        </span>
                      </strong>
                    </p>
                    <div className="copy-wrap mgb-0-5x">
                      <span className="copy-feedback" />
                      <img src={currencyIcons.eth} className={classes.ethInputIcon} alt="" />
                      <input
                        type="text"
                        className="copy-address ignore"
                        value={ethAddress}
                        disabled=""
                        readOnly=""
                      />
                      <button type="button" className="copy-trigger copy-clipboard" onClick={() => copy(ethAddress)}>
                        <FileCopyIcon />
                      </button>
                    </div>
                  </div>
                </Grid>
              </Grid>
            </div>
          ) : null}
          <div className="gaps-0-5x" />
          <div className="gaps-0-5x" />
          <ul className="d-flex flex-wrap align-items-center guttar-30px">
            <li>
              <NavLink to="/transactions">
                <span className="btn btn-auto btn-sm btn-primary">
                    View
                    Transaction
                </span>
              </NavLink>
            </li>
          </ul>
          <div className="gaps-2-5x" />
          <div className="note note-info note-plane">
            {values.paymentType === PAYMENT_TYPES.BANK_TRANSFER && (
            <p>
                Use this transaction id (
              {formatPaymentRef(values.transaction)}
) as reference. Make your payment within 24
                hours, If we will not received your payment within 24 hours, then we will cancel the transaction.
            </p>
            )}
          </div>
        </div>
      </div>
    </Dialog>
  )

  const renderPaymentViaVoltDialog = () => (
    <Dialog fullWidth="true" maxWidth="sm" open={values.isPaymentViaVoltDialogOpened} onClose={changePaymentViaVoltDialogState(false)}>
      <div className="popup-body">
        <h4 className="popup-title">Payment via Volt</h4>
        <div className="popup-content">
          <form onSubmit={onCheckoutVolt}>
            <Grid container spacing={0}>
              <Grid xs={12}>
                <Input
                  propertyName="volt_selected_country"
                  label="Your country"
                  state={values}
                  setState={setValues}
                  select
                >
                  {menuVoltCountryItems}
                </Input>
              </Grid>
              <Grid xs={12}>
                <Input
                  propertyName="volt_selected_bank"
                  label="Your bank"
                  state={values}
                  setState={setValues}
                  select
                >
                  {menuVoltBankItems}
                </Input>
              </Grid>
            </Grid>
            <button disabled={disabledVoltPaymentBtn} type="submit" className="btn btn-primary">
              Continue to payment
            </button>
          </form>
        </div>
      </div>
    </Dialog>
  )

  return !loading && (
    <div className="content-area card">
      {renderMandatoryKYC()}
      {renderPaymentMethodDialog()}
      {renderPaymentConfirmationDialog()}
      {renderNonExchangesDialog()}
      {renderNoKycDialog()}
      {renderPaymentViaVoltDialog()}
      <div className="card-innr">
        <div className="card-head">
          <h4 className="card-title">
            Choose currency and calculate
            {' '}
            {publicSettings && publicSettings.token_symbol}
            {' '}
            token price
          </h4>
        </div>
        <div className="card-text">
          <p>
            You can buy our
            {' '}
            {publicSettings && publicSettings.token_symbol}
            {' '}
            tokens using
            {' '}
            {[...fiatList, ...cryptoList].filter((name) => acceptedCurrencies[name]).map((name) => name.toUpperCase()).join(', ')}
            {' '}
            to become part of
            {' '}
            {(publicSettings.company || {}).name}
          </p>
        </div>

        <div className="token-currency-choose">
          <Grid container spacing={1}>
            {[...fiatList, ...cryptoList].map((name) => acceptedCurrencies[name] && (
              <Grid key={name} item sm={6}>
                <div className="pay-option">
                  <input id={`pay_${name}`} onChange={handleCurrencyRadioChange(name)} checked={values.currency === name} className="pay-option-check" type="radio" />
                  <label className={`pay-option-label ${classes.radioInputLabel}`} htmlFor={`pay_${name}`}>
                    <span className="pay-title">
                      <img className={classes.currencyIcon} src={currencyIcons[name]} alt="" />
                      <span className="pay-cur">{name.toUpperCase()}</span>
                    </span>
                    <span className="pay-amount">{getTokenValueInAnything(name)}</span>
                  </label>
                </div>
              </Grid>
            ))}
          </Grid>
        </div>
        <div className="card-head">
          <h4 className="card-title">Amount of contribution</h4>
        </div>
        <div className="card-text">
          <p>
            Enter your amount you are willing to contribute and calculate the amount of tokens you will receive.
            The calculator helps to convert chosen currency to tokens.
          </p>
        </div>
        {!loadingMeInvestInBaseCurrency && (
          <>
            {(meInvestInBaseCurrency.current_lvl.max_invest_amount !== 0 && mandatoryKyc(is_gto_sales, (publicSettings.accepted_mandatory_kyc || {}))) && (
              <div className="card-text">
                <p className={classNames('note-danger', classes.kycLvlUp)}>
                  <InfoIcon className={classNames('fa', classes.infoIcon)} fontSize="inherit" />
                  {' '}
                  You can still invest
                  {' '}
                  {canInvesting}
                  {' '}
tokens within you KYC level
                  {' '}
                  {' '}
                  {meInvestInBaseCurrency.kyc_lvl_change
                    ? (
                      <>
                        <span>
                          lvl increase pending (lvl
                          {' '}
                          {meInvestInBaseCurrency.current_lvl.level}
                          {' '}
to lvl
                          {' '}
                          {meInvestInBaseCurrency.current_lvl.level + 1}
)
                        </span>
                      </>
                    )
                    : (
                      <>
                        {(meInvestInBaseCurrency.current_lvl.level !== 4 && meInvestInBaseCurrency.current_lvl.type_customer !== undefined) && (
                          <span className={classes.cursorPointer} onClick={() => upKycLvl()}>Increase Level now</span>
                        )}
                      </>
                    )}
                </p>
              </div>
            )}
          </>
        )}
        <div className="token-contribute">
          <div className="token-calc">
            <div className="token-pay-amount">
              <input id="token-base-amount" value={values.amount} onChange={handleAmountChange} className="input-bordered input-with-hint" type="text" />

              <div className="token-pay-currency">
                <span className="input-hint input-hint-sap">{publicSettings && publicSettings.token_symbol}</span>
              </div>
            </div>
            {values.amount > 0 && (
              <div className="token-received">
                <div className="token-eq-sign">=</div>
                <div className="token-received-amount">
                  <h5 className="token-amount">{getTokenValueInAnything(values.currency, values.amount)}</h5>
                  <div className="token-symbol">{values.currency.toUpperCase()}</div>
                </div>
              </div>
            )}
          </div>
          <div>
            <span className="note-text text-light">
              <InfoIcon className={classNames('fa', classes.infoIcon)} fontSize="inherit" />
              {' '}
              { publicSettings.minimum_investment_amount }
              {' '}
              {publicSettings.base_currency && publicSettings.base_currency.toUpperCase()}
              {' '}
              minimum contribution required. You can only purchase full tokens. No Decimals are allowed.
            </span>
          </div>
        </div>

        <div className="token-overview-wrap">
          <div className="note-danger note-sm">
            <p>
              Your contribution will be calculated based on exchange rate at the moment your transaction is confirmed.
            </p>
          </div>
        </div>
        {!loadingMeInvestInBaseCurrency && (
          <div className="pay-buttons">
            <div className="pay-button">
              <button
                disabled={
                ((parseInt(values.amount) > 0) === false
                  || (values.isMandatoryKYCNoticeDialogAlreadyClosed)
                  || (
                    (parseInt(values.amount) > parseInt(canInvesting) && mandatoryKyc(is_gto_sales, (publicSettings.accepted_mandatory_kyc || {})))
                      && parseInt(meInvestInBaseCurrency.current_lvl.max_invest_amount) !== 0
                  )
                )
                || (mandatoryKyc(is_gto_sales, (publicSettings.accepted_mandatory_kyc || {})) && me.kyc_status !== USER_KYC_STATUS_TYPES.PASSED)
                || (!mandatoryKyc(is_gto_sales, (publicSettings.accepted_mandatory_kyc || {})) && me.kyc_status === USER_KYC_STATUS_TYPES.REJECTED)
              }
                type="button"
                onClick={changePaymentMethodDialogState(true)}
                className="btn btn-primary btn-between w-100"
              >
                Make Payment
                <AccountBalanceWalletOutlinedIcon className={classNames('ti', classes.payButtonIcon)} />
              </button>
            </div>
          </div>
        )}
        <div className="pay-notes">
          <Box fontStyle="italic" className="note note-plane note-light note-md">
            <InfoIcon className={classNames('fa', classes.infoIcon)} fontSize="inherit" />
            <p>
              Tokens will appear in your account after payment is made and approved by our compliance team.
              <br className="d-none d-lg-block" />
              {' '}
              Please note,
              {' '}
              {publicSettings && publicSettings.token_symbol}
              {' '}
              tokens will be distributed at the end of the offering (see prospectus for details).
            </p>
          </Box>
        </div>
      </div>
    </div>
  )
}

export default ContributeForm
