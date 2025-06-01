/**
 * IBM Confidential OCO Source Materials IBM Business Platform: Share
 * (C) Copyright IBM Corp. 2018
 *
 * The source code for this program is not published or otherwise divested of
 * its trade secrets, irrespective of what has been deposited with the U.S.
 * Copyright Office
 */
requirejs.config({
  map: {
    "*": {

    }
  },
  bundles: {
    "js/sharecommon/servicesBundle": [
      "bi/sharecommon/nls/share_client",
      "bi/sharecommon/nls/root/share_client",
      "bi/sharecommon/utils/translator",
      "bi/notifications/service/NotificationService",
      "bi/schedule/service/PromptingService"
    ],
    "js/defaultaction/defaultActionBundle": [
      "bi/defaultaction/views/DefaultActionView"
    ],
    "js/notifications/notificationsBundle": [
      "bi/notifications/app/n10nController",
      "bi/notifications/views/n10nBtnView",
      "bi/notifications/views/legacyAppButtonView",
      "bi/sharecommon/utils/simpledoT",
      "text!bi/notifications/templates/notification.html",
      "text!bi/notifications/templates/emptyMessageList.html",
      "text!bi/notifications/templates/loadingMessagesPopUp.html",
      "text!bi/notifications/templates/messagesList.html",
      "bi/notifications/views/messageListView",
      "bi/notifications/views/notificationView"
    ],
    "js/schedule/scheduleBundle": [
      "bi/schedule/app/appControler",
      "bi/sharecommon/utils/simpledoT",
      "text!bi/schedule/templates/ScheduleView.html",
      "bi/schedule/views/CadencePickerView",
      "text!bi/schedule/templates/DateTimeRangeCadencePicker.html",
      "text!bi/schedule/templates/TimePicker.html",
      "datetimepicker",
      "bi/schedule/views/TimePicker",
      "bi/schedule/views/DateTimeRangeCadencePickerView",
      "text!bi/schedule/templates/DailyCadencePicker.html",
      "text!bi/schedule/templates/DailyIntervalCadencePicker.html",
      "bi/schedule/views/DailyIntervalCadencePickerView",
      "bi/schedule/views/DailyCadencePickerView",
      "text!bi/schedule/templates/WeeklyCadencePicker.html",
      "bi/schedule/views/WeeklyCadencePickerView",
      "text!bi/schedule/templates/MonthlyCadencePicker.html",
      "bi/schedule/views/MonthlyCadencePickerView",
      "text!bi/schedule/templates/YearlyCadencePicker.html",
      "bi/schedule/views/YearlyCadencePickerView",
      "text!bi/schedule/templates/TriggerCadencePicker.html",
      "bi/schedule/views/TriggerCadencePickerView",
      "text!bi/schedule/templates/FormatPicker.html",
      "bi/schedule/views/FormatPickerView",
      "bi/schedule/utils/TextFormatter",
      "text!bi/schedule/templates/DeliveryPickerOptions.html",
      "text!bi/schedule/templates/RecipientsList.html",
      "bi/schedule/views/DeliveryPickerView",
      "bi/schedule/views/ScheduleDeliveryPickerView",
      "bi/schedule/views/PdfOptionsView",
      "bi/schedule/views/ScheduleView",
      "text!bi/schedule/templates/SchedulesView.html",
      "bi/schedule/utils/CadenceLabelGenerator",
      "text!bi/notifications/templates/emptyMessageList.html",
      "bi/schedule/views/SchedulesView"
    ]
  }
});
