import chai from 'chai';
import dirtyChai from 'dirty-chai';
import jsxChai from 'jsx-chai';
import sinonChai from 'sinon-chai';

chai.use(dirtyChai);
chai.use(sinonChai);
chai.use(jsxChai);

console.error = (msg) => { throw new Error(msg); }; // throw errors to fail the build

const testsContext = require.context('../..', true, /^\.\/(src|lib).*\.spec.jsx?$/);
testsContext.keys().forEach(testsContext);
