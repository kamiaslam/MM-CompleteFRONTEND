import { Suspense } from 'react';
import LoaderWithLogo from '../components/Loader/LoaderWithLogo';
const Loadable = Component => props => {
  return (
    <Suspense fallback={<LoaderWithLogo />}>
      <Component {...props} />
    </Suspense>
  );
};

export default Loadable;