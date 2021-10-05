import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import makeStyles from "@material-ui/core/styles/makeStyles";
import "../../styles/legacy/style.scss";
import DialogContent from "@material-ui/core/DialogContent";
import Dialog from "@material-ui/core/Dialog";
import { DialogTitle } from "@material-ui/core";
import { toaster } from "../../utils";
import Grid from "@material-ui/core/Grid";
import Input from "../Input";
import { useMutation } from "@apollo/react-hooks";
import {
  WALLET_ENGINE_PROFILE_DETAILS,
  WALLET_ENGINE_PROFILE_UPDATE,
  WALLET_ENGINE_UPGRADE_KYC_PROCESS,
} from "../../queriesAndMutations/walletEngineMutation";
import CircularProgress from "@material-ui/core/CircularProgress";

const useStyles = makeStyles(() => ({
  dialog: {
    "& .MuiDialog-paper": {
      padding: "10px 0 26px 0",
    },
  },
  circularProgressWrapper: {
    display: "flex",
    justifyContent: "center",
  },
}));

const KYCUpgradeDialog = ({
  dialogOpen,
  onCloseDialog,
  onKycUpgradeSubmitted,
}) => {
  const classes = useStyles();
  const [values, setValues] = useState({
    wallet_engine_first_name: "",
    wallet_engine_last_name: "",
    wallet_engine_phone_number: "",
    wallet_engine_email_address: "",
    wallet_engine_birth_date: "",
    wallet_engine_city: "",
    wallet_engine_street: "",
    wallet_engine_state: "",
    wallet_engine_postal_code: "",
    wallet_engine_country_res_code: "",
  });
  const [getProfileDetails] = useMutation(WALLET_ENGINE_PROFILE_DETAILS);
  const [updateProfileDetails] = useMutation(WALLET_ENGINE_PROFILE_UPDATE);
  const [submitUpgradeProcess] = useMutation(WALLET_ENGINE_UPGRADE_KYC_PROCESS);
  const walletEngineAppID = "5db2a50be7664";
  const bodyData = { app_id: walletEngineAppID };
  const [formSubmitLoading, setFormSubmitLoading] = useState(false);

  useEffect(() => {
    if (dialogOpen) {
      getProfileDetails({
        variables: { input: bodyData },
      }).then((response) => {
        console.log(response);
        if (response.data.walletEngineProfileDetails.status === "success") {
          const details = response.data.walletEngineProfileDetails;
          console.log("KYC Upgrade Dialog walletEngineProfileDetails");
          console.log(details);
          if (details && details.address) {
            setValues({
              ...values,
              wallet_engine_first_name: details.first_name,
              wallet_engine_last_name: details.last_name,
              wallet_engine_birth_date: details.birth_date,
              wallet_engine_email_address: details.email_address,
              wallet_engine_phone_number: details.phone_number,
              wallet_engine_city: details.address.city,
              wallet_engine_state: details.address.state,
              wallet_engine_street: details.address.street,
              wallet_engine_postal_code: details.address.postal_code,
              wallet_engine_country_res_code: details.address.country_res_code,
            });
          }
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dialogOpen]);

  const onEdit = async (e) => {
    setFormSubmitLoading(true);
    console.log("onEdit");
    e.preventDefault();
    console.log(values);
    const bodyData = {
      app_id: walletEngineAppID,
      first_name: values.wallet_engine_first_name,
      last_name: values.wallet_engine_last_name,
      birth_date: values.wallet_engine_birth_date,
      email_address: values.wallet_engine_email_address,
      address: {
        country_res_code: values.wallet_engine_country_res_code,
        city: values.wallet_engine_city,
        state: values.wallet_engine_state,
        street: values.wallet_engine_street,
        postal_code: values.wallet_engine_postal_code,
      },
    };
    console.log(bodyData);
    await updateProfileDetails({
      variables: { input: bodyData },
    }).then((response) => {
      setFormSubmitLoading(false);
      console.log(response);
      if (
        response.data &&
        response.data.walletEngineProfileUpdate &&
        response.data.walletEngineProfileUpdate.valid
      ) {
        toaster.success("Update successfully!");
      }
    });
  };

  const onSubmit = async (e) => {
    setFormSubmitLoading(true);
    console.log("onSubmit KYC Upgrade for Topup");
    e.preventDefault();
    console.log(values);

    await submitUpgradeProcess({
      variables: { input: { app_id: walletEngineAppID } },
    }).then((response) => {
      console.log(response);
      setFormSubmitLoading(false);
      if (
        response.data &&
        response.data.walletEngineUpgradeKYCProcess &&
        response.data.walletEngineUpgradeKYCProcess.valid
      ) {
        onKycUpgradeSubmitted(true);
        toaster.success(
          "Process submitted, Please wait for WalletEngine verify!"
        );
      }
    });
  };

  return (
    <>
      <Dialog
        className={classes.dialog}
        open={dialogOpen}
        onClose={onCloseDialog}
      >
        <DialogTitle>Your KYC Details & Upgrade level to Top Up</DialogTitle>
        <DialogContent>
          <form>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={12}>
                <div className="input-with-label input-wallet-item">
                  <Input
                    propertyName="wallet_engine_first_name"
                    label="First name"
                    state={values}
                    setState={setValues}
                  />
                </div>
                <div className="input-with-label input-wallet-item">
                  <Input
                    propertyName="wallet_engine_last_name"
                    label="Last name"
                    state={values}
                    setState={setValues}
                  />
                </div>
                {/* <div className="input-with-label input-wallet-item">
                  <Input
                    propertyName="wallet_engine_phone_number"
                    label="Phone"
                    state={values}
                    setState={setValues}
                  />
                </div> */}
                <div className="input-with-label input-wallet-item">
                  <Input
                    propertyName="wallet_engine_birth_date"
                    label="Birth date"
                    state={values}
                    setState={setValues}
                  />
                </div>
                {/* <div className="input-with-label input-wallet-item">
                  <Input
                    propertyName="wallet_engine_email_address"
                    label="Email address"
                    state={values}
                    setState={setValues}
                  />
                </div> */}
                <div className="input-with-label input-wallet-item">
                  <Input
                    propertyName="wallet_engine_city"
                    label="City"
                    state={values}
                    setState={setValues}
                  />
                </div>
                <div className="input-with-label input-wallet-item">
                  <Input
                    propertyName="wallet_engine_state"
                    label="State"
                    state={values}
                    setState={setValues}
                  />
                </div>
                <div className="input-with-label input-wallet-item">
                  <Input
                    propertyName="wallet_engine_street"
                    label="Street"
                    state={values}
                    setState={setValues}
                  />
                </div>
                <div className="input-with-label input-wallet-item">
                  <Input
                    propertyName="wallet_engine_postal_code"
                    label="Postal code"
                    state={values}
                    setState={setValues}
                  />
                </div>
              </Grid>
            </Grid>
            {formSubmitLoading ? (
              <div className={classes.circularProgressWrapper}>
                <CircularProgress />
              </div>
            ) : (
              ""
            )}
            <button type="button" className="btn btn-primary" onClick={onEdit}>
              Edit
            </button>
            <button type="button" className="btn btn-danger" onClick={onSubmit}>
              Submit
            </button>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

KYCUpgradeDialog.propTypes = {
  dialogOpen: PropTypes.bool,
  onCloseDialog: PropTypes.func.isRequired,
};

export default KYCUpgradeDialog;
