import { FC } from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import { Link, withRouter } from 'react-router-dom';
import { BORDER_RADIUS } from 'config';

const useStyles = makeStyles((theme) => ({
  container: {
    marginTop: 10,
    backgroundColor: '#222',
    zIndex: 1,
    borderTopLeftRadius: BORDER_RADIUS,
    borderTopRightRadius: BORDER_RADIUS,
  },
  containerInner: {
    paddingTop: 14,
  },
  link: {
    display: 'flex',
    flexGrow: 1,
    justifyContent: 'center',
    color: 'white',
    borderBottom: '5px solid #555',
    textDecoration: 'none',
    padding: '5px 0 15px',
    cursor: 'pointer',
  },
  active: {
    borderBottomColor: theme.palette.secondary.main,
  },
}));

const Nav: FC = () => {
  const classes = useStyles();
  const path = window.location.pathname;
  const isUnstake = ~path.indexOf('unstake');
  const isStake = !isUnstake;

  return (
    <div className={clsx('flex flex-col flex-grow', classes.container)}>
      <div className={clsx('flex flex-grow', classes.containerInner)}>
        <Link
          to='/stake'
          className={clsx(classes.link, {
            [classes.active]: isStake,
          })}
        >
          Stake
        </Link>
        <Link
          to='/unstake'
          className={clsx(classes.link, {
            [classes.active]: isUnstake,
          })}
        >
          Unstake
        </Link>
      </div>
    </div>
  );
};

export default withRouter(Nav);
