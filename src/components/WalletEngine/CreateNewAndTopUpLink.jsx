import React, { useState, useEffect } from "react";
import makeStyles from "@material-ui/core/styles/makeStyles";
import TopUpAmountDialog from "./TopUpAmountDialog";
import RegisterWalletEngineDialog from "./RegisterWalletEngineDialog";
import KYCUpgradeDialog from "./KYCUpgradeDialog";
import { useMe } from "../../myHooks";
import { useMutation } from "@apollo/react-hooks";
import { WALLET_ENGINE_CURRENT_KYC_DETAILS } from "../../queriesAndMutations/walletEngineMutation";
import { USER_KYC_STATUS_TYPES } from "../../constants/user";
import Dialog from "@material-ui/core/Dialog";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";

const useStyles = makeStyles(() => ({
  cardSubtitle: {
    margin: "0 0 4px 0",
    color: "#74fffa",
  },
  cardSubtitleContributeForm: {
    margin: "0 0 4px 0",
    color: "#000",
  },
  tokenBalanceText: {
    display: "inline-block",
  },
  topUpWallet: {
    margin: 0,
    cursor: "pointer",
    textDecoration: "underline",
  },
  closeButton: {
    position: "absolute",
    right: 1,
    top: 1,
    color: "#000",
  },
  textKYCSubbmited: {
    fontSize: "10px",
    marginTop: "5px"
  },
}));

const CreateNewAndTopUpLink = (props) => {
  const {
    data: { me: userData },
  } = useMe();

  const [
    getCurrentKYCDetails,
    { data: { walletEngineCurrentKYCDetails } = {} },
  ] = useMutation(WALLET_ENGINE_CURRENT_KYC_DETAILS);

  const walletEngineAppID = "5db2a50be7664";
  const bodyData = { app_id: walletEngineAppID };

  const classes = useStyles();

  const [values, setValues] = useState({
    topUpAmountDialogOpened: false,
    registerWalletEngineDialogOpened: false,
    kycUpgradeDialogOpened: false,
    kycUpgradeSubmitted: false,
    isMandatoryKYCNoticeDialogOpened: false,
    isTopUpSuccess: false,
  });

  useEffect(() => {
    if (
      userData.kyc_status !== USER_KYC_STATUS_TYPES.NOT_SUBMITTED
    ) {
      getCurrentKYCDetails({
        variables: { input: bodyData },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleKycUpgradeSubmitted(value){
    if (value) {
      setValues({
        ...values,
        kycUpgradeSubmitted: value,
      });
    }
  }

  function handleTopUpSuccess(value){
    if (value) {
      setValues({
        ...values,
        isTopUpSuccess: value,
      });
    }
  }

  const changeTopUpAmountDialogState = (state) => () =>
    setValues({
      ...values,
      topUpAmountDialogOpened: state,
    });

  const changeRegisterWalletEngineDialogState = (state) => () =>
    setValues({
      ...values,
      registerWalletEngineDialogOpened: state,
    });

  const changeKYCUpgradeDialogState = (state) => () =>
    setValues({
      ...values,
      kycUpgradeDialogOpened: state,
    });

  const changeMandatoryKYCNoticeDialogState = (state) => () =>
    setValues({
      ...values,
      isMandatoryKYCNoticeDialogOpened: state,
    });

  const wallet_engine_topup_amount =
    (walletEngineCurrentKYCDetails && walletEngineCurrentKYCDetails.balance) || 0;

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

  const renderTextKYCSubbmited = () => (
    <div className={classes.textKYCSubbmited}>
      {values.kycUpgradeSubmitted ||
      (walletEngineCurrentKYCDetails &&
        walletEngineCurrentKYCDetails.kyc_status === "Processing")
        ? "KYC is currently checked this can take up to 10-15 mins you get ready to topup"
        : null}
    </div>
  );

  const renderTextTopUpSuccess = () => (
    <div className={classes.textKYCSubbmited}>
      {values.isTopUpSuccess
        ? "Top up complete this can take 10-60 seconds please refresh this page in 10-60 seconds"
        : null}
    </div>
  );

  const createNewWalletEngine = () => {
    return (
      <div className={classes.tokenBalanceText}>
        <h6
          className={
            props.parent && props.parent === "ContributeForm"
              ? classes.cardSubtitleContributeForm
              : classes.cardSubtitle
          }
        >
          You don't have WalletEngine
        </h6>
        <span className="lead">
          <span
            onClick={
              userData.kyc_status === USER_KYC_STATUS_TYPES.NOT_SUBMITTED
                ? changeMandatoryKYCNoticeDialogState(true)
                : changeRegisterWalletEngineDialogState(true)
            }
            className={`${classes.topUpWallet} link link-ucap`}
          >
            Create new wallet
          </span>
        </span>
      </div>
    );
  };

  const topUpWalletEngine = () => {
    return (
      <div className={classes.tokenBalanceText}>
        <h6
          className={
            props.parent && props.parent === "ContributeForm"
              ? classes.cardSubtitleContributeForm
              : classes.cardSubtitle
          }
        >
          Add Wallet Balance
        </h6>
        <span className="lead">
          {wallet_engine_topup_amount} EURO{" "}
          <span
            onClick={changeTopUpAmountDialogState(true)}
            className={`${classes.topUpWallet} link link-ucap`}
          >
            Top Up
          </span>
        </span>
        {renderTextTopUpSuccess()}
      </div>
    );
  };

  const kycUpgradeWalletEngine = () => {
    return (
      <div className={classes.tokenBalanceText}>
        <h6
          className={
            props.parent && props.parent === "ContributeForm"
              ? classes.cardSubtitleContributeForm
              : classes.cardSubtitle
          }
        >
          Your KYC level:{" "}
          {walletEngineCurrentKYCDetails &&
            walletEngineCurrentKYCDetails.kyc_level}
        </h6>
        <h6
          className={
            props.parent && props.parent === "ContributeForm"
              ? classes.cardSubtitleContributeForm
              : classes.cardSubtitle
          }
        >
          Your KYC status:{" "}
          {walletEngineCurrentKYCDetails &&
            walletEngineCurrentKYCDetails.kyc_status}
        </h6>
        {values.kycUpgradeSubmitted ||
        (walletEngineCurrentKYCDetails &&
          walletEngineCurrentKYCDetails.kyc_status === "Processing") ? null : (
          <span className="lead">
            {wallet_engine_topup_amount} EURO{" "}
            <span
              onClick={changeKYCUpgradeDialogState(true)}
              className={`${classes.topUpWallet} link link-ucap`}
            >
              Upgrade for Top Up
            </span>
          </span>
        )}
        {renderTextKYCSubbmited()}
      </div>
    );
  }

  return (
    <>
      {renderMandatoryKYC()}
      {values.kycUpgradeSubmitted}
      <div>
        {userData.wallet_engine_token == null
          ? createNewWalletEngine()
          : walletEngineCurrentKYCDetails &&
            walletEngineCurrentKYCDetails.kyc_level > 0
          ? topUpWalletEngine()
          : kycUpgradeWalletEngine()}
      </div>
      <TopUpAmountDialog
        dialogOpen={values.topUpAmountDialogOpened}
        onCloseDialog={changeTopUpAmountDialogState(false)}
        onTopUpSuccess={(value) => handleTopUpSuccess(value)}
      />
      <RegisterWalletEngineDialog
        dialogOpen={values.registerWalletEngineDialogOpened}
        onCloseDialog={changeRegisterWalletEngineDialogState(false)}
      />
      <KYCUpgradeDialog
        dialogOpen={values.kycUpgradeDialogOpened}
        onCloseDialog={changeKYCUpgradeDialogState(false)}
        onKycUpgradeSubmitted={(value) => handleKycUpgradeSubmitted(value)}
      />
    </>
  );
};

export default CreateNewAndTopUpLink;
