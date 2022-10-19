import React from "react";
import {AppBar, makeStyles, Toolbar, Typography , Badge} from "@material-ui/core";
import {connect} from "react-redux"
import {Link} from 'react-router-dom';
import {LocalMall, ShoppingBasket} from "@material-ui/icons";
import { cartSelector } from "redux/selects/user.select"
import {e2p} from "utils/LanguageNumberConvertor.utils"
import {LINKS} from './Header.config';
import { Navigation, SearchInput } from "components";
import {PATHS} from 'configs/routes.config';
import { removeFromCart } from "redux/actions/card.action";
import logo from "assets/logo.png";

const useStyle = makeStyles((theme) => ({
  toolbar: {
    display: "flex",
    justifyContent: "space-between",
    backgroundColor: " #1a1a1a",
    flexWrap: "wrap",
  },
  rightSide: {
    display: "flex",
    alignItems: "center",
  },
  leftSide: {
    display: "flex",
    alignItems: "center",
  },
  navigation: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: theme.spacing(10),
    fontSize: "1.5rem",
  },
  title: {
    color: "#fff",
    fontSize: "2.5rem!important",
    fontFamily: "AMitra",
  },
  image: {
    width: "8rem",
    height: "5rem",
  },
  icon: {
    transform: "translate(10rem)",
  },
}));

const HeaderLayout = (props) => {
    const classes = useStyle()
    return (
      <>
        <AppBar>
          <Toolbar className={classes.toolbar}>
            <div className={classes.rightSide}>
              <img src={logo} className={classes.image} />
              <Link to={PATHS.HOME}>
                <Typography className={classes.title} variant="h6" noWrap>
                  کیک کــــافه
                </Typography>
              </Link>
            </div>
            <SearchInput />
            <div className={classes.leftSide}>
              <Navigation
                className={{ navClass: classes.navigation }}
                links={LINKS}
              />
              <Badge
                className={classes.icon}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "left",
                }}
                badgeContent={e2p(
                  "" + props.userCart.reduce((acc, cv) => acc + cv.count, 0)
                )}
                color="secondary"
              >
                <ShoppingBasket />
              </Badge>
            </div>
          </Toolbar>
        </AppBar>
      </>
    );
}

const mapStateToProps = (state) => ({userCart:cartSelector(state)})
const mapDispatchToProps = (dispatch) => ({removeFromCart:product => dispatch(removeFromCart(product)) })

const Header = connect(mapStateToProps, mapDispatchToProps)(HeaderLayout)
export {Header}