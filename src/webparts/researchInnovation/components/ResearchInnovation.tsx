import * as React from "react";
import styles from "./ResearchInnovation.module.scss";
import { IResearchInnovationProps } from "./IResearchInnovationProps";
import { escape } from "@microsoft/sp-lodash-subset";
import { sp, Web } from "sp-pnp-js";
import CardDeck from "react-bootstrap/CardDeck";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Row from "react-bootstrap/Row";
import Card from "react-bootstrap/Card";

import { FontIcon } from "office-ui-fabric-react";
import axios from "axios";
import XMLParser from "react-xml-parser";
import * as _ from "lodash";

export interface IState {
  selectedLng: string;
  ResearchDataEn: any;
  ResearchDataAr: any;
}

export default class ResearchInnovation extends React.Component<
  IResearchInnovationProps,
  IState
> {
  constructor(props) {
    super(props);
    this.state = {
      selectedLng: this.props.language.toUpperCase(),
      ResearchDataEn: [],
      ResearchDataAr: [],
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

    let rsData = [],
      rsDataAr = [];

    if ((arbaicSite.length == 0)) {
      axios.get("https://www.uaeu.ac.ae/rss/en_news.xml").then((res) => {
        var xml = new XMLParser().parseFromString(res.data);
        rsData = xml.children[0].children;
        this.setState({
          ResearchDataEn: rsData,
        });
      });
    } else {
      axios.get("https://www.uaeu.ac.ae/rss/ar_news.xml").then((res) => {
        var xml = new XMLParser().parseFromString(res.data);
        rsDataAr = xml.children[0].children;
        this.setState({
          ResearchDataAr: rsDataAr,
        });
      });
    }

    // function myFunction() {
    //   window.open("https://www.w3schools.com");
    // }
  }

  public render(): React.ReactElement<IResearchInnovationProps> {
    let combinedStyle = [styles.ResearchDiv, styles.researchBlue];

    return (
      <div id="ResearchDivRoot" className={combinedStyle.join(" ")}>
        <Row>
          <Col md={12}>
            <p className={styles.Research}>
              {this.state.selectedLng == "ENGLISH"
                ? "Research & Innovation"
                : "البحث والابتكار"}
            </p>
          </Col>
        </Row>
        <Row>
          <Col md={12}>{this.ConstructCardDeck()}</Col>
          <Col md={12} className={styles.aligncenter}>
            <button
              type="button"
              onClick={(e) =>
                window.open(
                  "https://www.uaeu.ac.ae/en/dvcrgs/research/patents/research.shtml"
                )
              }
              className={styles.ReadMore}
            >
              {this.state.selectedLng == "ENGLISH"
                ? "All research articles"
                : "جميع المقالات البحثية"}{" "}
              <FontIcon iconName="Forward" />
            </button>
            <button
              type="button"
              onClick={(e) =>
                window.open(
                  "https://www.uaeu.ac.ae/en/dvcrgs/research/patents/"
                )
              }
              className={styles.ReadMore}
            >
              {this.state.selectedLng == "ENGLISH"
                ? "All Patents"
                : "كل براءات الاختراع"}{" "}
              <FontIcon iconName="Forward" />
            </button>
          </Col>
        </Row>

        {/* <Row style={{ padding: '10px' }}>
              <Col md={12}>
                <button className={styles.ResearchLoadMore}>{this.state.selectedLng == "ENGLISH" ? 'LOAD MORE...' : 'تحميل المزيد...'}
                  <FontIcon iconName='Forward' />
                </button>
              </Col>
            </Row> */}
      </div>
    );
  }

  ConstructCardDeck() {
    let parentDiv = [],
      childDiv = [];
    // let columnNameExtension = this.state.selectedLng == "ENGLISH" ? '' : 'Arabic';
    let learnMoreText =
      this.state.selectedLng == "ENGLISH" ? "LEARN MORE" : "يتعلم أكثر";

    let researchArray =
      this.state.selectedLng == "ENGLISH"
        ? this.state.ResearchDataEn
        : this.state.ResearchDataAr;

    let filteredResearchArray = researchArray.filter((filterKey) => {
      return filterKey.name == "item";
    });
    let categorgyBasedfilterArray = [];
    filteredResearchArray.map((item) => {
      let filterData = _.filter(item.children, {
        name: "category",
        value: "research",
      });
      if (filterData.length > 0) categorgyBasedfilterArray.push(item);
    });
    categorgyBasedfilterArray = categorgyBasedfilterArray.slice(0, 3);

    categorgyBasedfilterArray.map(function (researchItem) {
      let rsTitle = "",
        rsDesc = "",
        eventDate = "",
        link = "#";
      let img = [];
      researchItem.children.map((item) => {
        switch (item.name) {
          case "title":
            rsTitle = item.value;
            break;
          case "description":
            if (item.value.length > 200)
              rsDesc = item.value.substring(0, 190).concat("...");
            else rsDesc = item.value;
            break;
          case "media:content":
            img = item.children.filter((key) => {
              return key.name == "media:thumbnail";
            });
            break;
          case "link":
            link = item.value;
            break;
          default:
            break;
        }
      });
      let imgURLData = img.length > 0 ? img[0].attributes.url : "";
      if (imgURLData.length > 0) {
        childDiv.push(
          <Card className={styles.cardStyles}>
            <Card.Img
              className={styles.ResearchImg}
              variant="top"
              src={imgURLData}
            />
            <Card.Body>
              <Card.Text className={styles.cardDisplayText}>{rsDesc}</Card.Text>
              <Card.Link
                href={link}
                target="_blank"
                className={styles.ResearchLearMore}
              >
                {learnMoreText}
              </Card.Link>
            </Card.Body>
          </Card>
        );
      } else {
        <Card className={styles.cardStyles}>
          <Card.Body className={styles.cardBodyStyles}>
            <Card.Title className={styles.ResearchTitle}>{rsTitle}</Card.Title>
            <Card.Text className={styles.cardDisplayText}>{rsDesc}</Card.Text>
            <Card.Link
              href={link}
              target="_blank"
              className={styles.ResearchLearMore}
            >
              {learnMoreText}
            </Card.Link>
          </Card.Body>
        </Card>;
      }
    });
    parentDiv.push(<CardDeck>{childDiv}</CardDeck>);
    return parentDiv;
  }
}
