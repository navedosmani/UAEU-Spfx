import "bootstrap/dist/css/bootstrap.min.css";
import * as React from "react";
import styles from "./Events.module.scss";
import { IEventsProps, IEventState } from "./IEventsProps";
import { sp, Web } from "sp-pnp-js";
import { Scrollbars } from "react-custom-scrollbars";
import axios from "axios";
import * as _ from "lodash";
const renderThumb = ({ style, ...props }) => {
  const thumbStyle = {
    borderRadius: 6,
    backgroundColor: "grey",
  };
  return <div style={{ ...style, ...thumbStyle }} {...props} />;
};
export default class Events extends React.Component<IEventsProps, IEventState> {
  public constructor(props: IEventsProps, state: IEventState) {
    super(props);
    this.state = {
      newslist: [],
      newsListAr: [],
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
      CalendarData: [],
      AcademicData: [],
      selectedLng: this.props.language.toUpperCase(),
      role: "student",
      primaryColor: "#052942",
      FilterBtnId: 1,
      EventMsg: "",
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
      });
    axios
      .get("https://coreservices.uaeu.ac.ae/General/AcademicEvent")
      .then((res: any) => {
        this.setState({
          CalendarData: res.data,
        });
      });
  }
  public render(): React.ReactElement<IEventsProps> {
    this.FixScrollBarMargin();
    const isLngEnglish = this.state.selectedLng == "ENGLISH" ? true : false;
    // document.documentElement.style.setProperty('--primaryColor', this.state.primaryColor);
    let combinedStyle = [styles.events, styles.eventsBlue];

    return (
      <div id="EventsRootDiv" className={combinedStyle.join(" ")}>
        {/* <div className="col-lg-4"> */}
        <div className={styles.event}>
          <div className={styles["event-header"]}>
            <h5>{isLngEnglish ? "Events" : "الأحداث"}</h5>
            <div className={styles["event-button"]}>
              <button
                type="button"
                onClick={this.FilterData.bind(this, 1)}
                className={styles.eventsFltBtnActive}
              >
                {isLngEnglish ? "UPCOMING" : "القادمة"}
              </button>
              <button type="button" onClick={this.FilterData.bind(this, 2)}>
                {isLngEnglish ? "THIS MONTH" : "هذا الشهر"}
              </button>
              <button type="button" onClick={this.FilterData.bind(this, 3)}>
                {isLngEnglish ? "VIEW ALL" : "عرض الكل"}
              </button>
            </div>
          </div>
          {/* {this.state.EventMsg == 0 && (
            <div>
              {this.state.selectedLng == "ENGLISH"
                ? "noupcoming events"
                : "no Upcoming arabic events"}
            </div>
          )} */}

          <div style={{ height: "540px" }}>{this.ConstructEventsItems()}</div>
        </div>

        {/* </div> */}
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
  ConstructEventsItems() {
  
    let childDiv = [],
      parentDiv = [];
    const columnNameExtension =
      this.state.selectedLng == "ENGLISH" ? "En" : "Ar";
    const isLngEnglish = this.state.selectedLng == "ENGLISH" ? true : false;
    //const color = this.state.primaryColor;
    const monthArray = this.state.Month;

    let eventData = [];
    let monthData = [];
    switch (this.state.FilterBtnId) {
      case 1:
        let dateObjectFuture = new Date();
        let varMonthFuture = dateObjectFuture.getMonth();
       

        eventData = this.state.CalendarData.filter((month) => {
          return (
          
            new Date(month.startDate) > new Date()
          );
        });

    
        break;
      case 2:
        let dateObject = new Date();
        let varMonth = dateObject.getMonth() + 1;
        eventData = this.state.CalendarData.filter((month) => {
          return (
            month.startDate.split("-")[1] == varMonth &&
            month.startDate.split("-")[0] == dateObject.getFullYear()
          );
        });
      
        break;
      case 3:
        
        eventData = this.state.CalendarData;
      
        break;
    }
    eventData.map(function (item, key) {
      
      let eventTitle, eventMonth, eventDay;
      if (item.startDate.split("-")[1].substring(0, 2) < 10)
        eventMonth = item.startDate.split("-")[1].substring(1);
      else eventMonth = item.startDate.split("-")[1].substring(0, 2);
      eventDay = item.startDate.split("-")[2].substring(0, 2);
      if (key == 0) {
        childDiv.push(
          <div className={styles["event-date"] + " " + styles.eventDateActive}>
            <span className={styles.date + " " + styles.dateActive}>
              {eventDay}
              <sup>th</sup>
            </span>
            <span className={styles.month + " " + styles.monthActive}>
              {monthArray[eventMonth]}
            </span>
          </div>
        );
        eventTitle = (
          <h6 className={styles.eventTitleActive}>
            {item["activity" + columnNameExtension]}
          </h6>
        );
      } else {
        childDiv.push(
          <div className={styles["event-date"]}>
            <span className={styles.date}>
              {eventDay}
              <sup>th</sup>
            </span>

            <span className={styles.month}>{monthArray[eventMonth]}</span>
          </div>
        );
        eventTitle = (
          <h6 className={styles.eventTitleDefault}>
            {item["activity" + columnNameExtension]}
          </h6>
        );
      }
      parentDiv.push(
        <div className={styles["each-event"]}>
          {childDiv}
          <div className={styles["event-title"]}>
            <div className={styles["event-subtitle"]}>
              {eventTitle}
              {/* <p className={styles.location}>
                {isLngEnglish ? "Dubai" : "دبي"}
              </p> */}
            </div>
          </div>
        </div>
      );
      childDiv = [];
    });
    return (
      <Scrollbars
        className="arabic-scrollbar"
        id="EventsScrollDiv"
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
  FilterData(btnID, event) {
    let getActiveBtn = document.getElementsByClassName(
      styles.eventsFltBtnActive
    )[0];
    if (getActiveBtn) getActiveBtn.classList.remove(styles.eventsFltBtnActive);
    event.target.classList.add(styles.eventsFltBtnActive);
    this.setState({
      FilterBtnId: btnID,
    });
  }
}
