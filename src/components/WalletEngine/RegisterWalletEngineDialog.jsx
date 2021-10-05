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
import { useMe } from "../../myHooks";
import { useMutation } from "@apollo/react-hooks";
import moment from 'moment';
import CircularProgress from "@material-ui/core/CircularProgress";
import {
  WALLET_ENGINE_TOKEN_MUTATION,
  WALLET_ENGINE_ACTIVATION_REQUEST,
  WALLET_ENGINE_ACTIVATION_OTP_VERIFY,
} from "../../queriesAndMutations/walletEngineMutation";
const axios = require("axios");

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

const RegisterWalletEngineDialog = ({ dialogOpen, onCloseDialog }) => {
  const [formSubmitLoading, setFormSubmitLoading] = useState(false);
  const { data: { me: userData }, refetch } = useMe();
  const classes = useStyles();
  const [values, setValues] = useState({
    wallet_engine_passcode: "",
    wallet_engine_token: "",
    wallet_engine_valid: null,
    wallet_engine_request_id: null,
  });
  const [updateWalletEngineToken] = useMutation(
    WALLET_ENGINE_TOKEN_MUTATION
  );
  const [walletEngineActivationRequest] = useMutation(
    WALLET_ENGINE_ACTIVATION_REQUEST
  );
  const [walletEngineActivationOTPVerify] = useMutation(
    WALLET_ENGINE_ACTIVATION_OTP_VERIFY
  );
  const walletEngineAppID = "5db2a50be7664";
  const getBodyDataForWalletEngine = async (e) => {
    setFormSubmitLoading(true);
    await axios
      .get(`https://restcountries.eu/rest/v2/name/${userData.customer.countryOfResidence}`)
      .then(
        (response) => {
          const countryData = response.data[0];
          const callingCode = countryData.callingCodes[0];
          const callingCodeRegex = new RegExp(`\\+${callingCode}`);
          const re = new RegExp('-', "g");
          const walletEnginePhoneNumber = userData.phone.replace(callingCodeRegex, '').trim().replace(re, '');
          // Development
          // const bodyData = {
          //   app_id: walletEngineAppID,
          //   country_dial_code: "84",
          //   phone_number: "0357960654",
          //   first_name: userData.first_name,
          //   last_name: userData.last_name,
          //   birth_date: moment(userData.birth_date).format("YYYY-MM-DD"),
          //   address: {
          //     country_res_code: "SG",
          //     city: "Singapore",
          //     state: "East Coast",
          //     street: "Eastgate 46",
          //     postal_code: "428766",
          //   },
          //   tos_accepted: "2020-01-20 10:50:59",
          //   country_nat_code: "SG",
          // };
          const bodyData = {
            app_id: walletEngineAppID,
            country_dial_code: callingCode,
            phone_number: walletEnginePhoneNumber,
            first_name: userData.first_name,
            last_name: userData.last_name,
            birth_date: moment(userData.birth_date).format("YYYY-MM-DD"),
            address: {
              country_res_code: countryData.alpha2Code,
              city: userData.customer.city,
              state: userData.customer.residentialAddress,
              street: userData.customer.residentialAddress,
              postal_code: userData.customer.postalCode,
            },
            tos_accepted: "2020-01-20 10:50:59",
            country_nat_code: countryData.alpha2Code,
          };
          console.log("walletEngineActivationRequest request Data");
          console.log(bodyData);
          walletEngineActivationRequest({
            variables: { input: bodyData },
          }).then((response) => {
            setFormSubmitLoading(false);
            console.log("walletEngineActivationRequest");
            console.log(response);
            if (
              response.data.walletEngineActivationRequest.status === "success"
            ) {
              toaster.success(
                response.data.walletEngineActivationRequest.message
              );
              setValues({
                ...values,
                wallet_engine_valid:
                  response.data.walletEngineActivationRequest.valid,
                wallet_engine_request_id:
                  response.data.walletEngineActivationRequest.request_id,
              });
            } else {
              onCloseDialog();
              toaster.error(
                response.data.walletEngineActivationRequest.message
              );
            }
          });
        }
      );
  }
  const submitWalletOTP = async (e) => {
    setFormSubmitLoading(true);
    e.preventDefault();
    console.log("submit otp")
    console.log(values)

    const bodyData = {
      app_id: walletEngineAppID,
      request_id: values.wallet_engine_request_id,
      passcode: values.wallet_engine_passcode
    }

    const token = await walletEngineActivationOTPVerify({
      variables: { input: bodyData },
    }).then((response) => {
      setFormSubmitLoading(false);
      console.log(response.data);
      if (response.data.walletEngineActivationOTPVerify.status === "success") {
        return response.data.walletEngineActivationOTPVerify.token;
      } else {
        toaster.error(response.data.walletEngineActivationOTPVerify.message);
        return null;
      }
    });

    if (token != null) {
      await updateWalletEngineToken({
        variables: {
          wallet_engine_token: token,
        },
      }).then((response) => {
        toaster.success("Passcode submit successfully!");
        refetch();
        onCloseDialog();
        setTimeout(() => {
          window.location.reload()
        }, 1000)
      });
    }
  };

  useEffect(() => {
    if(dialogOpen) {
      getBodyDataForWalletEngine();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dialogOpen]);

  return (
    <>
      <Dialog
        className={classes.dialog}
        open={dialogOpen}
        onClose={onCloseDialog}
      >
        <DialogTitle>
          We sent a 6 digit code to your phone, please enter it here:
        </DialogTitle>
        <DialogContent>
          <form onSubmit={submitWalletOTP}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={9}>
                <div className="input-with-label input-wallet-item">
                  <Input
                    propertyName="wallet_engine_passcode"
                    label=""
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
            <button type="submit" className="btn btn-primary">
              Submit
            </button>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

RegisterWalletEngineDialog.propTypes = {
  dialogOpen: PropTypes.bool,
  onCloseDialog: PropTypes.func.isRequired,
};

export default RegisterWalletEngineDialog;
