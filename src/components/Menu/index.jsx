import React, { Fragment } from "react";
import Menu from "@material-ui/core/Menu";
import { makeStyles } from "@material-ui/styles";

const useStyles = makeStyles((theme) => ({
  menuButton: {
    display: "inline-block",
    "& div:hover": {},
  },
}));

const CustomMenu = (props) => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const children = React.Children.toArray(props.children);
  let { shouldCloseOnItemClick = true, horizontalPosition = "left" } = props;
  const classes = useStyles();

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Fragment>
      <div className={classes.menuButton} onClick={handleClick}>
        {props.menuButton}
      </div>
      <Menu
        elevation={8}
        getContentAnchorEl={null}
        anchorEl={anchorEl}
        open={!!anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: horizontalPosition,
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: horizontalPosition,
        }}
      >
        {children.map((child, index) => (
          <div
            onClick={shouldCloseOnItemClick ? handleClose : () => {}}
            key={index}
          >
            {child}
          </div>
        ))}
      </Menu>
    </Fragment>
  );
};

export default CustomMenu;
