import { render } from 'react-dom';

import App from 'components/global/App';

import './styles';

(async () => {
  render(<App />, document.getElementById('root'));
})();
