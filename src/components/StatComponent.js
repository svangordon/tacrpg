import React, { PropTypes } from 'react'

import { Card, CardMedia, CardTitle, CardText, CardActions } from 'react-toolbox/lib/card'

// Soon, this is going to be generic for both attr & status
const StatComponent = ({data, title}) => (
  <div>
    <p style={{marginBottom: '0'}}><b>{title}</b></p>
    <ul style={{listStyleType: 'none', display: 'inline-block'}}>
      {Object.keys(data).map((key, i) => (
        <li key={i}>{ key + " : " + data[key] }</li>
      ))}
    </ul>
  </div>
)

StatComponent.propTypes = {
  data: PropTypes.object,
  title: PropTypes.string
}

export default StatComponent
