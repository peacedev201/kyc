import React from 'react'
import AppBar from '../components/AppBar'
import Footer from '../components/Footer'
import Uploads from '../components/Uploads/Uploads'


const DataCenter = () => (
  <>
    <div className="page-user">
      <AppBar />
      <div className="page-content">
        <div className="container">
          <div className="main-content">
            <div className="card-head">
              <h4 className="card-title">Data center</h4>
            </div>

            <Uploads />

          </div>
        </div>

      </div>
      <Footer />
    </div>
  </>
)

export default DataCenter
