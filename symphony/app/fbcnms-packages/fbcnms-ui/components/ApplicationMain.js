/**
 * Copyright 2004-present Facebook. All Rights Reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 * @format
 */

import * as React from 'react';
import Alert from '@fbcnms/ui/components/Alert/Alert';
import CssBaseline from '@material-ui/core/CssBaseline';
import ThemeProvider from '@material-ui/styles/ThemeProvider';
import axios from 'axios';
import defaultTheme from '@fbcnms/ui/theme/default';
import {ErrorCodes} from '@fbcnms/auth/errorCodes';
import {SnackbarProvider} from 'notistack';
import {TopBarContextProvider} from '@fbcnms/ui/components/layout/TopBarContext';
import {useEffect, useState} from 'react';

const DIALOG_MESSAGE =
  'Please reload the page to log back in. Note that if you are filling out a ' +
  "form, you will lose the changes you've made to your form when the page " +
  'reloads. You can also cancel and refresh your browser when you are ready.';

type Props = {
  children: React.Element<*>,
};

const ApplicationMain = (props: Props) => {
  const [loggedOutAlertOpen, setLoggedOutAlertOpen] = useState(false);

  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      response => response,
      error => {
        if (error.response?.data?.errorCode === ErrorCodes.USER_NOT_LOGGED_IN) {
          // axios request sent while user is logged out, open dialog
          setLoggedOutAlertOpen(true);
        } else {
          return Promise.reject(error);
        }
      },
    );
    return () => axios.interceptors.request.eject(interceptor);
  }, []);

  return (
    <ThemeProvider theme={defaultTheme}>
      <SnackbarProvider
        maxSnack={3}
        autoHideDuration={10000}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}>
        <TopBarContextProvider>
          <CssBaseline />
          {props.children}
        </TopBarContextProvider>
      </SnackbarProvider>
      <Alert
        confirmLabel="Reload Page"
        cancelLabel="Cancel"
        message={DIALOG_MESSAGE}
        title="You have been logged out"
        open={loggedOutAlertOpen}
        onClose={() => setLoggedOutAlertOpen(false)}
        onCancel={() => setLoggedOutAlertOpen(false)}
        onConfirm={() => location.reload()}
      />
    </ThemeProvider>
  );
};

export default ApplicationMain;