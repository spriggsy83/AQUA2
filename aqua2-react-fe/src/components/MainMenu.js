import React, { Component } from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Drawer from "@material-ui/core/Drawer";
import AppBar from "@material-ui/core/AppBar";
import CssBaseline from "@material-ui/core/CssBaseline";
import Toolbar from "@material-ui/core/Toolbar";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import { Link } from "react-router-dom";

const drawerWidth = 180;

const styles = theme => ({
    root: {
        display: "flex"
    },
    appBar: {
        zIndex: theme.zIndex.drawer + 1
    },
    drawer: {
        width: drawerWidth,
        flexShrink: 0
    },
    drawerPaper: {
        width: drawerWidth
    },
    content: {
        flexGrow: 1,
        padding: theme.spacing.unit * 3
    },
    toolbar: theme.mixins.toolbar,
/*    listItem: {
        "&:hover": {
            backgroundColor: theme.palette.secondary.main + " !important"
        }
    }*/
});

class SideMenu extends Component {
    render() {
        const { classes } = this.props;

        return (
            <div className={classes.root}>
                <CssBaseline />
                <AppBar position="fixed" className={classes.appBar}>
                    <Toolbar>
                        <Typography variant="h6" color="inherit" noWrap>
                            AQUA2
                        </Typography>
                    </Toolbar>
                </AppBar>
                <Drawer
                    className={classes.drawer}
                    variant="permanent"
                    classes={{
                        paper: classes.drawerPaper
                    }}
                >
                    <div className={classes.toolbar} />
                    <List>
                        {[
                            { label: "HOME", link: "/" },
                            { label: "SEQUENCE", link: "/Sequences" },
                            { label: "BULK-ANNOT", link: "/BulkAnnot" },
                            { label: "SAMPLES", link: "/Samples" },
                            { label: "GROUPS", link: "/SeqGroups" },
                            { label: "TYPES", link: "/SeqTypes" }
                        ].map((option, index) => (
                            <Link
                                to={option.link}
                                style={{ textDecoration: "none" }}
                                key={option.label + "-link"}
                            >
                                <ListItem
                                    button
                                    className={classes.listItem}
                                >
                                    <ListItemText primary={option.label} />
                                </ListItem>
                            </Link>
                        ))}
                    </List>
                </Drawer>
                <main className={classes.content}>
                    <div className={classes.toolbar} />
                    {this.props.children}
                </main>
            </div>
        );
    }
}

SideMenu.propTypes = {
    classes: PropTypes.object.isRequired,
    theme: PropTypes.object.isRequired
};

export default withStyles(styles, { withTheme: true })(SideMenu);
