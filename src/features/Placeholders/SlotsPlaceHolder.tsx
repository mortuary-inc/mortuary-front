import React from 'react';
import ContentLoader, { IContentLoaderProps } from 'react-content-loader';

const SlotsPlaceHolder = (props: JSX.IntrinsicAttributes & IContentLoaderProps & { children?: React.ReactNode }) => (
  <ContentLoader width={'100%'} height={'100%'} viewBox="0 0 832 64" backgroundColor="#f3f3f3" foregroundColor="#ecebeb" {...props}>
    <rect x="0" y="0" width={'64'} height={'64'} />
    <rect x="88" y="0" width={'64'} height={'64'} />
    <rect x="172" y="0" width={'64'} height={'64'} />
    <rect x="256" y="0" width={'64'} height={'64'} />
    <rect x="340" y="0" width={'64'} height={'64'} />
    <rect x="424" y="0" width={'64'} height={'64'} />
    <rect x="508" y="0" width={'64'} height={'64'} />
    <rect x="590" y="0" width={'64'} height={'64'} />
    <rect x="674" y="0" width={'64'} height={'64'} />
    <rect x="758" y="0" width={'64'} height={'64'} />
  </ContentLoader>
);

export default SlotsPlaceHolder;
