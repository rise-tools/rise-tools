import React from 'react';
import Layout from '@theme-original/Layout';

export default function LayoutWrapper(props) {
  return (
    <>
      <Layout {...props} />
      <script async defer src="https://scripts.simpleanalyticscdn.com/latest.js"></script>
      <noscript><img src="https://queue.simpleanalyticscdn.com/noscript.gif" alt="" referrerpolicy="no-referrer-when-downgrade" /></noscript>
    </>
  );
}
