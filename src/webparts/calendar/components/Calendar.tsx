import * as React from "react";
import styles from "./Calendar.module.scss";
import { ICalendarProps } from "./ICalendarProps";
import { escape } from "@microsoft/sp-lodash-subset";
import { Scrollbars } from "react-custom-scrollbars";
import axios from "axios";
import { sp, Web } from "sp-pnp-js";
import XMLParser from "react-xml-parser";
import { FontIcon, HighContrastSelectorWhite } from "office-ui-fabric-react";
const renderThumb = ({ style, ...props }) => {
  const thumbStyle = {
    borderRadius: 6,
    backgroundColor: "grey",
  };
  return <div style={{ ...style, ...thumbStyle }} {...props} />;
};
export interface StateAttributes {
  Month: any;
  Days: any;
  AcademicData: any;
  selectedLng: string;
  role: string;

  SelectedYear: string;
  YearFilterKey: string;
}
export default class Calendar extends React.Component<
  ICalendarProps,
  StateAttributes
> {
  constructor(props) {
    super(props);
    this.state = {
      Month: [
        "-",
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
      ],
      Days: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
      AcademicData: [],
      selectedLng: this.props.language.toUpperCase(),
      role: "student",
      // primaryColor: '#052942',
      SelectedYear: "current year",
      YearFilterKey: "current",
    };
  }

  componentDidMount() {
    let webUrl = this.props.context.pageContext.web.absoluteUrl
      .toLowerCase()
      .split("/");
    let arbaicSite = webUrl.filter((search) => {
      return search == "ar";
    });
    if (arbaicSite.length > 0)
      this.setState({
        selectedLng: "ARABIC",
        SelectedYear: "السنة الحالية",
      });
    axios
      .get("https://coreservices.uaeu.ac.ae/General/Calendar")
      .then((res) => {
        this.setState({
          AcademicData: res.data,
        });
      });
  }
  public render(): React.ReactElement<ICalendarProps> {
    this.FixScrollBarMargin();
    window.onclick = this.WindowOnclick.bind(this);
    const isLngEnglish = this.state.selectedLng == "ENGLISH" ? true : false;
    let combinedStyle = [styles.calendarEvents, styles.calendarEventsBlue];

   
    return (
      <div id="CalendarRootDiv" className={combinedStyle.join(" ")}>
        {/* <div className="col-lg-4"> */}
        <div className={styles.event}>
          <div className={styles["event-header"]}>
            <h5>{isLngEnglish ? "Academic Calender" : "التقويم الأكاديمي"}</h5>
            <div className={styles["event-btn"]}>
              <div className={styles.dropdown}>
                <button
                  type="button"
                  className={styles.dropbtn + " HideShow"}
                  onClick={this.NavBarDropDwnClick.bind(this)}
                >
                  {this.state.SelectedYear}
                  <FontIcon
                    iconName="CaretDownSolid8"
                    className={styles.iconColor + " HideShow"}
                  />
                </button>
                <div className={styles.dropdownContent} id="YearDropdown">
                  <a onClick={this.Change.bind(this, 1)}>
                    {this.state.selectedLng == "ENGLISH"
                      ? "Current Year"
                      : "السنة الحالية"}
                  </a>
                  <a onClick={this.Change.bind(this, 2)}>
                    {this.state.selectedLng == "ENGLISH"
                      ? "Previous Year"
                      : "السنة الماضية"}
                  </a>
                </div>
              </div>
            </div>
          </div>
          <div style={{ height: "540px" }}>{this.ConstructAcademicItems()}</div>
        </div>
      </div>
    );
  }
  FixScrollBarMargin() {
    let arrayOfScrollElemtId = [
      "NewsScrollDiv",
      "EventsScrollDiv",
      "AcademicScrollDiv",
    ];
    arrayOfScrollElemtId.map((elem) => {
      if (document.getElementById(elem) != null) {
        let elementChildDiv = document.getElementById(elem)
          .children[0] as HTMLElement;
        if (this.state.selectedLng == "ENGLISH") {
          elementChildDiv.style.marginRight = "-17px";
          elementChildDiv.style.marginLeft = "0px";
        } else {
          elementChildDiv.style.marginLeft = "-17px";
          elementChildDiv.style.marginRight = "0px";
        }
      }
    });
  }
  ConstructAcademicItems() {
 
    let childDiv = [],
      parentDiv = [];
    const columnNameExtension =
      this.state.selectedLng == "ENGLISH" ? "En" : "Ar";
    const isLngEnglish = this.state.selectedLng == "ENGLISH" ? true : false;
  ]
    const monthArray = this.state.Month;

    let academicEventData = [];
    let dateObject = new Date();
    if (this.state.YearFilterKey == "current") {
      academicEventData = this.state.AcademicData.filter((currYear) => {
        return currYear.startDate.split("-")[0] == dateObject.getFullYear();
      });
    } else {
      academicEventData = this.state.AcademicData.filter((oldYear) => {
        return oldYear.startDate.split("-")[0] < dateObject.getFullYear();
      });
    }
    academicEventData.map(function (item, key) {
      let eventTitle, eventMonth, eventDay;
      if (item.startDate != null) {
        if (item.startDate.split("-")[1].substring(0, 2) < 10)
          eventMonth = item.startDate.split("-")[1].substring(1);
        else eventMonth = item.startDate.split("-")[1].substring(0, 2);
        eventDay = item.startDate.split("-")[2].substring(0, 2);
      }

      if (key == 0) {
        childDiv.push(
          <div className={styles["event-date"]}>
            <span className={styles.calendarDate}>
              {eventDay}
              <sup>th</sup>
            </span>
            <span className={styles.calendarmonth}>
              {monthArray[eventMonth]}
            </span>
          </div>
        );
        eventTitle = (
          <h6 className={styles.eventTitleDefault}>
            {item["title" + columnNameExtension]}
          </h6>
        );
      } else {
        childDiv.push(
          <div className={styles["event-date"]}>
            <span className={styles.calendarDate}>
              {eventDay}
              <sup>th</sup>
            </span>

            <span className={styles.calendarmonth}>
              {monthArray[eventMonth]}
            </span>
          </div>
        );
        eventTitle = (
          <h6 className={styles.eventTitleDefault}>
            {item["title" + columnNameExtension]}
          </h6>
        );
      }
      parentDiv.push(
        <div className={styles["each-event"]}>
          {childDiv}
          <div className={styles["event-title"]}>
            <div className={styles["event-subtitle"]}>
              {eventTitle}
              {/* <p>{isLngEnglish ? 'Dubai' : 'دبي'}</p> */}
            </div>
          </div>
        </div>
      );
      childDiv = [];
    });
    return (
      <Scrollbars
        className="arabic-scrollbar"
        id="AcademicScrollDiv"
        universal={true}
        autoHide
        autoHideTimeout={1000}
        autoHideDuration={200}
        renderThumbVertical={renderThumb}
      >
        <div className={styles["event-body"]}>{parentDiv}</div>
      </Scrollbars>
    );
  }

  public Change(id, event) {
    this.setState({
      SelectedYear: event.currentTarget.text,
      YearFilterKey: id == 1 ? "current" : "old",
    });
  }

  public NavBarDropDwnClick() {
    document.getElementById("YearDropdown").classList.toggle(styles.show);
  }

  public WindowOnclick(event) {
    if (event.target != null && !event.target.classList.contains("HideShow")) {
      var myDropdown = document.getElementById("YearDropdown");
      if (myDropdown.classList.contains(styles.show)) {
        myDropdown.classList.remove(styles.show);
      }
    }
  }
}
