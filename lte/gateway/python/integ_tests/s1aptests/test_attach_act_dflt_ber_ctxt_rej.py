"""
Copyright (c) 2016-present, Facebook, Inc.
All rights reserved.

This source code is licensed under the BSD-style license found in the
LICENSE file in the root directory of this source tree. An additional grant
of patent rights can be found in the PATENTS file in the same directory.
"""


import unittest

import s1ap_types
import s1ap_wrapper
import time


class TestAttachCompleteWithActvDfltBearCtxtRej(unittest.TestCase):
    def setUp(self):
        self._s1ap_wrapper = s1ap_wrapper.TestWrapper()

    def tearDown(self):
        self._s1ap_wrapper.cleanup()

    def test_attach_complete_with_ActvDfltBearCtxtRej(self):
        """ Test Attach test case for sending Activate Default
        EPS Bearer Reject along with Attach Complete message """
        # Ground work.
        self._s1ap_wrapper.configUEDevice(1)
        req = self._s1ap_wrapper.ue_req

        # Trigger Attach Request
        attach_req = s1ap_types.ueAttachRequest_t()
        sec_ctxt = s1ap_types.TFW_CREATE_NEW_SECURITY_CONTEXT
        id_type = s1ap_types.TFW_MID_TYPE_IMSI
        eps_type = s1ap_types.TFW_EPS_ATTACH_TYPE_EPS_ATTACH
        pdn_type = s1ap_types.pdn_Type()
        pdn_type.pres = True
        pdn_type.pdn_type = 1
        attach_req.ue_Id = req.ue_id
        attach_req.mIdType = id_type
        attach_req.epsAttachType = eps_type
        attach_req.useOldSecCtxt = sec_ctxt
        attach_req.pdnType_pr = pdn_type

        print("********Triggering Attach Request ")

        self._s1ap_wrapper._s1_util.issue_cmd(s1ap_types.tfwCmd.
                                              UE_ATTACH_REQUEST,
                                              attach_req)
        response = self._s1ap_wrapper.s1_util.get_response()
        self.assertTrue(response,
                        s1ap_types.tfwCmd.UE_AUTH_REQ_IND.value)

        # Trigger Authentication Response
        auth_res = s1ap_types.ueAuthResp_t()
        auth_res.ue_Id = req.ue_id
        sqnRecvd = s1ap_types.ueSqnRcvd_t()
        sqnRecvd.pres = 0
        auth_res.sqnRcvd = sqnRecvd
        self._s1ap_wrapper._s1_util.issue_cmd(s1ap_types.tfwCmd.
                                              UE_AUTH_RESP,
                                              auth_res)
        response = self._s1ap_wrapper.s1_util.get_response()
        self.assertTrue(response,
                        s1ap_types.tfwCmd.UE_SEC_MOD_CMD_IND.value)

        # Trigger Security Mode Complete
        sec_mode_complete = s1ap_types.ueSecModeComplete_t()
        sec_mode_complete.ue_Id = req.ue_id
        self._s1ap_wrapper._s1_util.issue_cmd(
            s1ap_types.tfwCmd.UE_SEC_MOD_COMPLETE, sec_mode_complete)

        response = self._s1ap_wrapper.s1_util.get_response()
        self.assertTrue(response, s1ap_types.tfwCmd.UE_ATTACH_ACCEPT_IND.value)
        msg = response.cast(s1ap_types.ueAttachAccept_t)
        bid = msg.esmInfo.epsBearerId

        # Trigger Attach Complete with
        # Activate Default EPS Bearer Context Reject
        time.sleep(0.2)
        act_rej = s1ap_types.ueActvDfltEpsBearerCtxtRej_t()
        act_rej.ue_Id = req.ue_id
        act_rej.bearerId = bid
        act_rej.esmCause = s1ap_types.TFW_EMM_CAUSE_REQ_REJ_UNSPECIFIED

        # Activate Default EPS Bearer Context Reject sent along with
        # Attach Complete message
        # Attach Complete + Activate Default EPS Bearer Context Reject
        self._s1ap_wrapper._s1_util.issue_cmd(
            s1ap_types.tfwCmd.UE_ACTV_DEFAULT_EPS_BEARER_CNTXT_REJECT,
            act_rej)
        # Added delay to ensure S1APTester receives the emm information before
        # sending the detach request message
        time.sleep(0.5)
        print("************************* Running UE detach")
        # Now detach the UE
        detach_req = s1ap_types.uedetachReq_t()
        detach_req.ue_Id = req.ue_id
        detach_req.ueDetType = s1ap_types.ueDetachType_t.\
            UE_SWITCHOFF_DETACH.value
        self._s1ap_wrapper._s1_util.issue_cmd(
            s1ap_types.tfwCmd.UE_DETACH_REQUEST, detach_req)
        time.sleep(0.5)


if __name__ == "__main__":
    unittest.main()
