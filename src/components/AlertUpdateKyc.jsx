import React from 'react'
import PropTypes from 'prop-types'

import '../styles/legacy/style.scss'
import { useQuery } from "@apollo/react-hooks";
import { UPDATE_COMMENT_KYC_LIST } from "../queriesAndMutations";
import { NavLink } from "react-router-dom";
import Alert from './Alert'

const AlertUpdateKyc = ({ typeKyc, kycId, customerTypeKyc }) => {
  const { data: { updateCommentKyc = {} } = {} } = useQuery(UPDATE_COMMENT_KYC_LIST, {
    variables: {
      input: {
        type: customerTypeKyc,
        kycId,
        page: 0,
        pageSize: 1,
      },
    },
  });

  const { objects = {} } = updateCommentKyc;

  return (
    <div>
      {Object.keys(objects).length > 0 && (
        <Alert classAlert='alert-danger'>
          <p>
            Your KYC application needs attention! Here is the information what you need to
            change: {objects[0].comment}.
            <br/>
            <br/>Click here to <NavLink to={`/application-update/${typeKyc}/${kycId}`}>update</NavLink>.
          </p>
        </Alert>
      )}
    </div>
  )
}

AlertUpdateKyc.propTypes = {
  typeKyc: PropTypes.string.isRequired,
  customerTypeKyc: PropTypes.string.isRequired,
  kycId: PropTypes.number.isRequired,
}

export default AlertUpdateKyc
