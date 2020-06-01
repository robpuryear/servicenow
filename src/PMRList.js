import React from 'react';
import axios from 'axios';
import './PMRList.css';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Divider from '@material-ui/core/Divider';
import ListItemText from '@material-ui/core/ListItemText';


export default class PMRList extends React.Component {
  state = {
    pmrs:[]
  }

  

  componentDidMount() {
    axios.post(`https://gw.2018gw.rtp.raleigh.ibm.com/roborg/sandbox/servicenow`)
      .then(res => {
        const pmrs = res.data.data.repository.issues.edges;
        // console.log(pmrs);
        this.setState({ pmrs});
      })
  }

render() {
return (
  <div>
    <Typography variant="h4" component="h2" color="initial">
      ServiceNow Issues
    </Typography>

    {this.state.pmrs
      .filter((edge) =>
        edge.node.labels.edges.find(
          (pmr) =>
            (pmr.node.name === "Squad: Firmware") |
            (pmr.node.name === "Squad: Hatteras (gateway-policy)") |
            (pmr.node.name === "Squad: Rubicon (gateway-security)")
        )
      )
      .map((edge) => (
        <div key={edge.node.title}>
          <Container maxWidth="lg" className="container">
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Paper elevation={3} className="paper">
                  <Typography
                    component="h2"
                    variant="h5"
                    color="primary"
                    gutterBottom
                  >
                    {edge.node.title}
                  </Typography>
                  {edge.node.assignees.edges.map((owner) => (
                    <ul className="owner">
                      <Typography
                        variant="h6"
                        component="h2"
                        color="textPrimary"
                      >
                        <li>{owner.node.name}</li>
                      </Typography>
                    </ul>
                  ))}
                  <br></br>
                  {edge.node.labels.edges.map((labels) => (
                    <ul className="labels">
                      <Typography
                        variant="h7"
                        component="h5"
                        color="textSecondary"
                      >
                        <li>{labels.node.name}</li>
                      </Typography>
                    </ul>
                  ))}
                  <br/>
                  {edge.node.comments.edges.map((comments) => (
                    <List>
                    <ListItem alignItems="flex-start">
                      <ListItemText
                        primary={comments.node.author.login}
                        secondary={
                            <Typography
                              component="subtitle1"
                              variant="subtitle1"
                              color="textSecondary"
                            >
                            {comments.node.publishedAt} {comments.node.bodyText}
                            </Typography>
                        }
                      />
                    </ListItem>
                    <Divider variant="inset" component="li" />
              </List>
                  ))}
                </Paper>
              </Grid>
            </Grid>
          </Container>
        </div>
      ))}
  </div>
);
  }
}