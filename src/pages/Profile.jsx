import React, { Component } from 'react';

export default class Page extends Component {
    render() {
        return (
            
            <div class="container">
            <div class="jumbotron" style={{ margin: "0 auto", width: "600px" }}>
  <div class="row">
    <div class="col-md-6 img">
      <img src="https://www.bioclub.com.tr/images/team1.jpg" width="150"  alt="" class="img-rounded" />
    </div>
    <div class="col-md-6 details">
      <blockquote>
        <h5>Fiona Gallagher</h5>
        <small><cite title="Source Title">Chicago, United States of America  <i class="icon-map-marker"></i></cite></small>
      </blockquote>
      <p>
        fionagallager@shameless.com <br/>
        www.bootsnipp.com <br/>
        June 18, 1990
      </p>
    </div>
  </div>
</div>
</div>
        )
    }
}