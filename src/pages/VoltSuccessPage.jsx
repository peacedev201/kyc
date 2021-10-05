import React, { useState, useEffect } from "react";
import { useMutation, useQuery } from "@apollo/react-hooks";
import "../styles/legacy/style.scss";
import AppBar from "../components/AppBar";
import Footer from "../components/Footer";
import { NavLink } from "react-router-dom";
import { useMe } from "../myHooks/index";
import CircularProgress from "@material-ui/core/CircularProgress";
import { TRANSACTIONS_USER } from "../queriesAndMutations";
import { makeStyles } from "@material-ui/core";
import { CHANGE_TRANSACTION_STATUS } from '../queriesAndMutations';
import { toaster } from '../utils/toaster';
import { TRANSACTIONS_STATUS_TYPES } from '../constants/transaction'

const useStyles = makeStyles(() => ({
  circularProgressWrapper: {
    display: "flex",
    justifyContent: "center",
  },
}));

const VoltSuccessPage = () => {
  const classes = useStyles();
  const { data: { me } } = useMe()
  const [loading, setLoading] = useState(true)
  const { data: { transactionsUser: transactionsUserList } = {} } = useQuery(
    TRANSACTIONS_USER,
    {
      variables: {
        input: {
          page: 0,
          pageSize: 1,
          userId: me.id,
        },
      }
    }
  );
  const [changeTransactionStatus, { error: errorChangeStatus }] = useMutation(
    CHANGE_TRANSACTION_STATUS
  );

  function updateStatusTransactionApproved() {
    console.log("updateStatusTransactionApproved");
    changeTransactionStatus({
      variables: {
        id: transactionsUserList.objects[0].id,
        status: TRANSACTIONS_STATUS_TYPES.APPROVED,
      },
    }).then((response) => {
      if (response && response.data && response.data.changeTransactionStatus) {
        setLoading(false);
        toaster.success('Update status of transaction success!');
      }
    });
  }

  if (errorChangeStatus) {
    toaster.error(`${errorChangeStatus.message}`);
  }

  useEffect(() => {
    if (transactionsUserList && transactionsUserList.objects.length > 0) {
      const transaction = transactionsUserList.objects[0];
      console.log(transaction);

      if (transaction.status !== TRANSACTIONS_STATUS_TYPES.APPROVED) {
        updateStatusTransactionApproved();
      } else {
        setLoading(false);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [transactionsUserList]);

  return (
    <div className="page-user">
      <AppBar />
      <div className="page-content">
        <div className="container text-center">
          {loading ? (
            <div className={classes.circularProgressWrapper}>
              <CircularProgress />
            </div>
          ) : (
            ""
          )}
          <h4>
            Payment success! Please go to transactions dashboard to check status
            of this payment!
          </h4>
          <NavLink to="/transactions">
            <span className="btn btn-auto btn-sm btn-primary">
              View Transaction
            </span>
          </NavLink>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default VoltSuccessPage;
