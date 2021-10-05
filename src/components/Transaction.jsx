import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { useQuery, useMutation } from '@apollo/react-hooks'
import makeStyles from '@material-ui/core/styles/makeStyles'

import '../styles/legacy/style.scss'
import { TRANSACTION_INFO_SCHEME } from '../schemas/transaction'
import { formatDate } from '../utils/table'
import { TRANSACTION, VOLT_GET_PAYMENT_DETAILS } from "../queriesAndMutations";
import { usePublicSettings } from '../myHooks/useSettings'
import { PAYMENT_TYPES } from '../constants/transaction'
import CircularProgress from "@material-ui/core/CircularProgress";
import { TRANSACTIONS_STATUS_TYPES } from "../constants/transaction";
import { CHANGE_TRANSACTION_STATUS } from "../queriesAndMutations";

const useStyles = makeStyles(() => ({
  mainTxInfo: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: '4px',
    border: '1px solid #d2dde9',
    padding: '10px 30px',
    '&>div': {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      '&>span': {
        textAlign: 'center',
      },
    },
  },
  info: {
    borderRadius: '4px',
    border: '1px solid #d2dde9',
    '&>li': {
      display: 'flex',
    },
  },
  infoHead: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '10px 30px',
    fontSize: '14px',
    fontWeight: 500,
    color: '#758698',
    width: '190px',
    textAlign: 'center',
  },
  infoDes: {
    display: 'flex',
    alignItems: 'center',
    padding: '10px 30px',
    fontSize: '14px',
    color: '#495463',
    fontWeight: 400,
    flexGrow: 1,
    borderBottom: '1px solid #d2dde9',
    borderLeft: '1px solid #d2dde9',
    width: 'calc(100% - 190px)',
    textAlign: 'center',
  },
  circularProgressWrapper: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },
  voltLink: {
    paddingLeft: '10px',
  },
}))

const Transaction = ({ id, isAdmin = false }) => {
  const classes = useStyles()

  const { data: { transaction } = {}, refetch } = useQuery(TRANSACTION, {
    variables: {
      id,
    },
    fetchPolicy: 'network-only',
  })
  const { data: { publicSettings = {} } = {} } = usePublicSettings()
  const bankDetails = (publicSettings.bank || {})[(transaction || {}).currency] || {}
  const ethAddress = ((publicSettings && publicSettings.crypto) || {}).eth_address

  const formatPaymentRef = (transaction) => `TNX${transaction.id}-${transaction.payment_ref}`

  const [ getVoltPaymentDetails, { data: { voltGetPaymentDetails } = {} }] = useMutation(VOLT_GET_PAYMENT_DETAILS);

  const [loadingVolt, setLoadingVolt] = useState(false);

  const [changeTransactionStatus] = useMutation(
    CHANGE_TRANSACTION_STATUS
  );

  const [voltPaymentUrl, setVoltPaymentUrl] = useState("");

  useEffect(() => {
    if (transaction !== undefined && transaction.volt_transaction_id !== null) {
      setLoadingVolt(true);
      console.log(transaction);

      const encodedVoltPaymentId = btoa(transaction.volt_transaction_id);

      const newVoltPaymentUrl = `https://api.volt.io/checkout/${encodedVoltPaymentId}`;

      setVoltPaymentUrl(newVoltPaymentUrl);

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

      const voltPaymentDetailsInput = {
        oauth2: voltOAuth2Input,
        volt_transaction_id: transaction.volt_transaction_id,
      };

      getVoltPaymentDetails({
        variables: { input: voltPaymentDetailsInput },
      }).then((response) => {
        setLoadingVolt(false);

        if (response && response.data && response.data.voltGetPaymentDetails) {
          const voltStatus = response.data.voltGetPaymentDetails.status;

          if (voltStatus === "COMPLETED") {
            changeTransactionStatus({
              variables: {
                id: transaction.id,
                status: TRANSACTIONS_STATUS_TYPES.APPROVED,
              },
            }).then((response) => { refetch() });
          }

          if (voltStatus === "ERROR_AT_BANK") {
            changeTransactionStatus({
              variables: {
                id: transaction.id,
                status: TRANSACTIONS_STATUS_TYPES.REJECTED,
              },
            }).then((response) => { refetch() });
          }
        }
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [transaction]);

  const renderVoltPaymentDetails = () => (
    <div>
      {loadingVolt ? (
        <div className={classes.circularProgressWrapper}>
          <CircularProgress />
        </div>
      ) : ( transaction.volt_transaction_id && voltGetPaymentDetails !== undefined
            ? voltGetPaymentDetails.status
            : null )
      }
    </div>
  );

  const renderVoltPaymentUrl = () => (
    <div>
      <span>
        Followup to complete payment with Volt:
      </span>
      <a
        href={voltPaymentUrl}
        className={classes.voltLink}
        rel="noopener noreferrer"
        target="_blank"
      >
        PAYMENT LINK
      </a>
    </div>
  );

  return transaction ? (
    <>
      <div className={classes.mainTxInfo}>
        <div>
          <span>Tranx Date</span>
          <span>{formatDate(transaction.created_at)}</span>
        </div>
        <div>
          <span>Tranx Status</span>
          <span>{transaction.status}</span>
        </div>
        { isAdmin && (
        <div>
          <span>KYC Status</span>
          <span>{transaction.user.kyc_status}</span>
        </div>
        )}
        <div>
          <span>Tranx Approved Note</span>
          <span>{transaction.approved_note}</span>
        </div>
      </div>
      <h5 className={classes.tableTitle}>Details</h5>
      <ul className={classes.info}>
        {
          Object.keys(TRANSACTION_INFO_SCHEME).map((key) => {
            const { label } = TRANSACTION_INFO_SCHEME[key]
            let value = transaction[key]

            if (TRANSACTION_INFO_SCHEME[key].type && TRANSACTION_INFO_SCHEME[key].type === 'date') {
              value = new Date(value).toDateString()
            }

            if (key === 'payment_type' && value === 'WALLET') {
              value = `${value} - Transaction No: TNX${transaction.id}`;
              if (transaction.wallet_transaction_id) {
                value = `${value} - Transaction No: TNX${transaction.id} - Wallet transaction id: ${transaction.wallet_transaction_id}`;
              }
            }

            return (
              <li key={key}>
                <div className={classes.infoHead}>{label}</div>
                <div className={classes.infoDes}>{value}</div>
              </li>
            );
          })
        }

        { transaction.payment_type === PAYMENT_TYPES.BANK_TRANSFER ? (
          <li>
            <div className={classes.infoHead}>Details</div>
            <div className={classes.infoDes}>
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
                    <td>{formatPaymentRef(transaction)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </li>
        ) : transaction.payment_type === PAYMENT_TYPES.CRYPTO ? (
          <li>
            <div className={classes.infoHead}>Payment Address</div>
            <div className={classes.infoDes}>
              {ethAddress}
            </div>
          </li>
        ) : null }
      </ul>

      { transaction.payment_type === PAYMENT_TYPES.VOLT ?
        <>
          <h5 className={classes.tableTitle}>Volt Payment Details</h5>
          <ul className={classes.info}>
            <li>
              <div className={classes.infoHead}>Payment status</div>
              <div className={classes.infoDes}>{renderVoltPaymentDetails()}</div>
            </li>
            <li>
              <div className={classes.infoHead}>Payment link</div>
              <div className={classes.infoDes}>{renderVoltPaymentUrl()}</div>
            </li>
          </ul>
        </>
        : null}

      <h5 className={classes.tableTitle}>Token Details</h5>
      <ul className={classes.info}>
        {/* <li> */}
        {/* <div className={classes.infoHead}>Stage Name</div> */}
        {/* <div className={classes.infoDes}>sample ICO Phase 3</div> */}
        {/* </li> */}
        <li>
          <div className={classes.infoHead}>Contribution</div>
          <div className={classes.infoDes}>
            {+transaction.currency_amount}
            {' '}
            {transaction.currency}
          </div>
        </li>
        <li>
          <div className={classes.infoHead}>Tokens Added To</div>
          <div className={classes.infoDes}>{transaction.user.email}</div>
        </li>
        <li>
          <div className={classes.infoHead}>Token Total</div>
          <div className={classes.infoDes}>
            {+transaction.token_amount}
          </div>
        </li>
      </ul>
    </>
  ) : null
}

Transaction.propTypes = {
  id: PropTypes.object.isRequired,
}

export default Transaction
