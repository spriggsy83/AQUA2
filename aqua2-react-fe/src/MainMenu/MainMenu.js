import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import CssBaseline from '@material-ui/core/CssBaseline';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { Link } from 'react-router-dom';

import { SearchBar } from '../Search';

const drawerWidth = 180;

const styles = (theme) => ({
  root: {
    display: 'flex',
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing.unit * 3,
  },
  toolbar: theme.mixins.toolbar,
  grow: {
    flexGrow: 1,
  },
  searchbox: {
    justifyContent: 'flex-end',
  },
  pageContainer: {
    position: 'relative',
    minHeight: '85vh',
  },
  contentWrap: {
    paddingBottom: '80px',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: '80px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
  },
});

class SideMenu extends Component {
  render() {
    const { classes } = this.props;
    const title = process.env.REACT_APP_TITLE || null;

    return (
      <div className={classes.root}>
        <CssBaseline />
        <AppBar position="fixed" className={classes.appBar}>
          <Toolbar>
            <Typography variant="h6" color="inherit" noWrap>
              <Link
                className={classes.link}
                to="/"
                style={{ textDecoration: 'none' }}
              >
                <span role="img" aria-labelledby="AQUA2">
                  💧
                </span>{' '}
                AQUA2
                {title && <> : {title}</>}
              </Link>
            </Typography>
            <div className={classes.grow} />
            <SearchBar className={classes.searchbox} />
          </Toolbar>
        </AppBar>
        <Drawer
          className={classes.drawer}
          variant="permanent"
          classes={{
            paper: classes.drawerPaper,
          }}
        >
          <div className={classes.toolbar} />
          <List>
            {[
              { label: 'HOME', link: '/' },
              { label: 'SEQUENCE', link: '/Sequences' },
              { label: 'SAMPLES', link: '/Samples' },
              { label: 'GROUPS', link: '/SeqGroups' },
              { label: 'TYPES', link: '/SeqTypes' },
              { label: 'BULK-ANNOT', link: '/BulkAnnot' },
            ].map((option, index) => (
              <Link
                to={option.link}
                style={{ textDecoration: 'none' }}
                key={option.label + '-link'}
              >
                <ListItem button className={classes.listItem}>
                  <ListItemText primary={option.label} />
                </ListItem>
              </Link>
            ))}
          </List>
        </Drawer>
        <main className={classes.content}>
          <div className={classes.toolbar} />
          <div className={classes.pageContainer}>
            <div className={classes.contentWrap}>{this.props.children}</div>
            <footer className={classes.footer}>
              <Typography variant="caption">
                AQUA: sequence Annotations QUery Assistant
              </Typography>
              <Typography variant="caption">By Andrew Spriggs, 2019</Typography>
              <Typography variant="caption">andrew.spriggs@csiro.au</Typography>
            </footer>
          </div>
        </main>
      </div>
    );
  }
}

SideMenu.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
};

export default withStyles(styles, { withTheme: true })(SideMenu);
