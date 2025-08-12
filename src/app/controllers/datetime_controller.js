// app/javascript/controllers/datetime_controller.js
import { Controller } from "@hotwired/stimulus";
import flatpickr from "flatpickr";

export default class extends Controller {
  static targets = ["input"];
  connect() {
    this.picker = flatpickr(this.inputTarget, {
      enableTime: true,
      time_24hr: false,              // set true if you prefer 24h
      minuteIncrement: 5,
      altInput: true,
      altFormat: "M j, Y h:i K",     // user-friendly
      dateFormat: "Y-m-d H:i",       // server-friendly
      allowInput: true,
      defaultHour: 9,                // sensible default
      disableMobile: true            // consistent desktop-like UI on mobile
    });
  }
  disconnect() { this.picker?.destroy(); }
}
