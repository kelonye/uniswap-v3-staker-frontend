import { FC } from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';

const Loader: FC<{
  size?: number;
  opacity?: number;
  fullscreen?: boolean;
  color?: any;
}> = ({ size = 40, opacity = 1, fullscreen, color = 'inherit' }) => {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
        ...(fullscreen
          ? {
              position: 'fixed',
              left: 0,
              right: 0,
              top: 0,
              bottom: 0,
            }
          : {}),
        zIndex: 1000,
        opacity,
      }}
    >
      <div style={{ position: 'relative' }}>
        <CircularProgress
          style={{ position: 'relative' }}
          {...{ size, color }}
        />
      </div>
    </div>
  );
};

export default Loader;
