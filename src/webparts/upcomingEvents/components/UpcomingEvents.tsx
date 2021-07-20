import * as React from "react";
import styles from "./UpcomingEvents.module.scss";

import { IUpcomingEventsProps } from "./IUpcomingEventsProps";
import { escape } from "@microsoft/sp-lodash-subset";
import { sp, Web } from "sp-pnp-js";
import { FontIcon } from "office-ui-fabric-react";
import axios from "axios";
import { initializeIcons } from "@uifabric/icons";
import Button from "react-bootstrap/Button";
//import './UpcomingThemeClasses.css';
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";//limit these

initializeIcons();

export interface IUpcomingState {
  primaryColor: string;
  selectedLng: string;
  role: string;
  calendarData: any;
}
export default class UpcomingEvents extends React.Component<
  IUpcomingEventsProps,
  IUpcomingState
> {
  constructor(props) {
    super(props);
    this.state = {
      primaryColor: "#052942",
      selectedLng: this.props.language.toUpperCase(),
      role: "student",
      calendarData: [],
    };
  }

  componentDidMount = () => {
   
    let webUrl = this.props.context.pageContext.web.absoluteUrl
      .toLowerCase()
      .split("/");
    let arbaicSite = webUrl.filter((search) => {
      return search == "ar";
    });
    if (arbaicSite.length > 0)
      this.setState({
        selectedLng: "ARABIC",
      });

    axios
      .get("https://coreservices.uaeu.ac.ae/General/Calendar")
      .then((res: any) => {
        this.setState({
          calendarData: res.data,
        });
      });
  };

  public render(): React.ReactElement<IUpcomingEventsProps> {
    let month = [
      "JAN",
      "FEB",
      "MAR",
      "APR",
      "MAY",
      "JUN",
      "JUL",
      "AUG",
      "SEP",
      "OCT",
      "NOV",
      "DEC",
    ];
    let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    if (this.state.selectedLng != "ENGLISH") this.AlignTextOnLng();
    let eventDate = 0,
      eventMonth = "",
      eventDay = "",
      eventYear = 0,
      eventTitle = "",
      eventTitle1 = "",
      eventDay1 = "",
      eventYear1 = 0,
      eventMonth1 = "",
      eventDate1 = 0;
    let eventData = [];
    let dateObjectFuture = new Date();
    let varMonthFuture = dateObjectFuture.getMonth();
    
    let year = dateObjectFuture.getFullYear();
    eventData = this.state.calendarData.filter((monthtst) => {
      return (
        
        new Date(monthtst.startDate) > new Date()
      );
    });
    
    let combinedStyle = [styles.Upcoming, styles.upcomingBlue];

    if (eventData.length > 1) {
      let item = eventData[0];
      let item1 = eventData[1];

      let date = new Date(item["startDate"]);
      let date1 = new Date(item1["startDate"]);
      if (this.state.selectedLng == "ENGLISH") {
        eventDay = days[date.getDay()];
        eventDay1 = days[date1.getDay()];

        eventMonth = month[date.getMonth()];
        eventMonth1 = month[date1.getMonth()];

        eventDate = date.getDate();
        eventDate1 = date1.getDate();

        eventYear = date.getFullYear();
        eventYear1 = date1.getFullYear();

        eventTitle = item["titleEn"];
        eventTitle1 = item1["titleEn"];
      } else {
        let item = eventData[0];
        let item1 = eventData[1];

        let date = new Date(item["startDate"]);
        let date1 = new Date(item1["startDate"]);
        eventDay = days[date.getDay()];
        eventDay1 = days[date1.getDay()];

        eventMonth = month[date.getMonth()];
        eventMonth1 = month[date1.getMonth()];

        eventDate = date.getDate();
        eventDate1 = date1.getDate();

        eventYear = date.getFullYear();
        eventYear1 = date1.getFullYear();

        eventTitle = item["titleAr"];
        eventTitle1 = item1["titleAr"];
      }
    } else if (eventData.length == 1) {
      let item = eventData[0];

      let date = new Date(item["startDate"]);
      if (this.state.selectedLng == "ENGLISH") {
        eventDay = days[date.getDay()];
        eventDay1 = "-";

        eventMonth = month[date.getMonth()];
        eventMonth1 = "-";

        eventDate = date.getDate();
        eventDate1 = 0;

        eventYear = date.getFullYear();
        eventYear1 = 0;

        eventTitle = item["titleEn"];
        eventTitle1 = "No Events";
      } else {
        eventDay = days[date.getDay()];
        eventDay1 = "-";

        eventMonth = month[date.getMonth()];
        eventMonth1 = "-";

        eventDate = date.getDate();
        eventDate1 = 0;

        eventYear = date.getFullYear();
        eventYear1 = 0;

        eventTitle = item["titleAr"];
        eventTitle1 = "لا أحداث";
      }
    } else if (eventData.length == 0) {
      if (this.state.selectedLng == "ENGLISH") {
        eventDay = "-";
        eventDay1 = "-";

        eventMonth = "-";
        eventMonth1 = "_";

        eventDate = 0;
        eventDate1 = 0;

        eventYear = 0;
        eventYear1 = 0;

        eventTitle = "No Events";
        eventTitle1 = "No Events";
      } else {
        eventDay = "-";
        eventDay1 = "-";

        eventMonth = "-";
        eventMonth1 = "-";

        eventDate = 0;
        eventDate1 = 0;

        eventYear = 0;
        eventYear1 = 0;

        eventTitle = "لا أحداث";
        eventTitle1 = "لا أحداث";
      }
    }

    return (
      <div id="UpcomingEventsRoot" className={combinedStyle.join(" ")}>
        <p style={{ marginBottom: "0px" }}>
          <h3 className={styles.upcomingEvents}>
            {this.state.selectedLng == "ENGLISH" ? "UPCOMING" : "القادمة"}
          </h3>
        </p>

        <div className={styles.events}>
          {eventData.length > 0 ? (
            <div className={styles["each-event"]}>
              <div
                className={styles["event-date"] + " " + styles.eventDateActive}
              >
                <span className={styles.date + " " + styles.dateActive}>
                  {eventDate}
                  <sup>th</sup>
                </span>
                <span className={styles.month + " " + styles.monthActive}>
                  {eventMonth}
                </span>
              </div>
              <div className={styles["event-title"]}>
                <div className={styles["event-subtitle"]}>
                  <h6 className={styles["eventTitleActive"]}>{eventTitle}</h6>
                  {/* <p className={styles["location"]}>Dubai</p> */}
                </div>
              </div>
            </div>
          ) : (
            <div className={styles.noRecords}>
              {this.state.selectedLng == "ENGLISH"
                ? "No Upcoming events"
                : "لا توجد أحداث قادمة"}
            </div>
          )}

          {eventData.length > 1 ? (
            <div className={styles["each-event"]}>
              <div
                className={styles["event-date"] + " " + styles.eventDateActive}
              >
                <span className={styles.date + " " + styles.dateActive}>
                  {eventDate1}
                  <sup>th</sup>
                </span>
                <span className={styles.month + " " + styles.monthActive}>
                  {eventMonth1}
                </span>
              </div>
              <div className={styles["event-title"]}>
                <div className={styles["event-subtitle"]}>
                  <h6 className={styles["eventTitleActive"]}>{eventTitle1}</h6>
                  {/* <p className={styles["location"]}>Dubai</p> */}
                </div>
              </div>
            </div>
          ) : (
            ""
            // <div className={styles.noRecords}>No Upcoming events</div>
          )}
        </div>
      </div>
    );
  }

  AlignTextOnLng() {
    if (document.getElementsByClassName(styles.Upcoming)[0])
      document
        .getElementsByClassName(styles.Upcoming)[0]
        .classList.add(styles.elementTextAlign);
  }
}
