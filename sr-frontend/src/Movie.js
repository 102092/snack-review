import React from "react";
import PropTypes from "prop-types";
import axios from "axios";
import moment from "moment";
import querystring from "querystring";
import "./Movie.css";
//여기부터 따로 추가
import "./more.css";
import jQuery from "jquery";
//레이더차트
import RadarChart from "react-svg-radar-chart";
import "react-svg-radar-chart/build/css/index.css";
//워드클라우드
// import ReactWordcloud from "react-wordcloud";
// import words from "./words";
import word4 from "./word4.png";

window.$ = window.jQuery = jQuery;
const $ = window.$;

const count = {
  count: 0
};
//레이더차트용 변수선언
const data = [
  {
    data: {
      WSD: 0.7,
      KDS: 0.8,
      DJS: 0.9,
      JPS: 0.67,
      DCS: 0.8
    },
    meta: { color: "blue" }
  }
];

const captions = {
  // columns
  WSD: "완성도",
  KDS: "가독성",
  DJS: "대중성",
  JPS: "작품성",
  DCS: "독창성"
};

//워드클라우드용 변수선언

// const options = {
//   colors: ["#1f77b4", "#ff7f0e", "#2ca02c", "#d62728", "#9467bd", "#8c564b"],
//   enableTooltip: true,
//   deterministic: false,
//   fontFamily: "impact",
//   fontStyle: "normal",
//   fontWeight: "normal",
//   rotations: 5,
//   rotationAngles: [0, 0],
//   scale: "sqrt"
// };

class Movie extends React.Component {
  KOBIS_KEY = "e0e16996d75f4cc203eb802ace6fae55";

  KOBIS_MOVIE_URI =
    "//www.kobis.or.kr/kobisopenapi/webservice/rest/movie/searchMovieInfo.json";

  TMDB_KEY = "6d3a7fab8fd7268369688995d40bc8e5";

  TMDB_SEARCH_URI = "//api.themoviedb.org/3/search/movie";

  TMDB_POSTER_URI = "//image.tmdb.org/t/p/w185_and_h278_bestv2";

  state = {};

  getMovie = async () => {
    const {
      data: {
        movieInfoResult: { movieInfo }
      }
    } = await axios.get(
      `${this.KOBIS_MOVIE_URI}?${querystring.stringify({
        key: this.KOBIS_KEY,
        movieCd: this.props.id
      })}`
    );

    const {
      data: { results }
    } = await axios.get(
      `${this.TMDB_SEARCH_URI}?${querystring.stringify({
        api_key: this.TMDB_KEY,
        language: "ko-KR",
        query: movieInfo.movieNm,
        year: moment(movieInfo.openDt).format("YYYY")
      })}`
    );

    movieInfo["poster"] = results.length
      ? this.TMDB_POSTER_URI + results[0].poster_path
      : `//via.placeholder.com/185x278/000000?text=Not found Poster`;

    this.parseInfo(movieInfo);
  };

  parseInfo = movie => {
    this.setState({
      title: movie.movieNm,
      subtitle: movie.movieNmEn,
      openAt: moment(movie.openDt).format("YYYY-MM-DD"),
      status: movie.prdtStatNm,
      audits: movie.audits[0].watchGradeNm,
      showTimes: `${movie.showTm}분`,
      nations: movie.nations[0].nationNm,
      directors: movie.directors.map(director => director.peopleNm).join(" / "),
      genres: movie.genres.map(genre => genre.genreNm).join("/"),
      distributor: movie.companys
        .filter(company => company.companyPartNm === "배급사")
        .map(company => company.companyNm)
        .join(", "),
      poster: movie.poster,
      review_content: "TestTTTTT"
    });
  };

  componentDidMount() {
    this.getMovie();
  }

  componentDidUpdate() {
    console.log("업데이트");
    this.countPlus();
  }

  update = () => {
    console.log("여기서 데이터 바꾸는 작업");
    console.log(data[0].data.DJS);

    if ($(".Test > span").hasClass(this.state.openAt)) {
      console.log("if " + this.state.openAt);

      if ($(".Test > div").hasClass("board_" + this.state.openAt)) {
        $(".board_" + this.state.openAt).css("visibility", "visible");
      }

      $(".Test > span")
        .removeClass(this.state.openAt)
        .addClass("close" + this.state.openAt);
    } else if ($(".Test > span").hasClass("close" + this.state.openAt)) {
      console.log("else" + this.state.openAt);
      $(".Test > span")
        .removeClass("close" + this.state.openAt)
        .addClass(this.state.openAt);

      $(".Test > div").css("visibility", "hidden");
    }
  };

  countPlus() {
    count.count = count.count + 0.1;
    data[0].data.DJS = count.count;
    data[0].data.WSD = count.count;
    data[0].data.KDS = count.count;
    data[0].data.JPS = count.count;
    data[0].data.DCS = count.count;
  }

  render() {
    return (
      <div className="movie">
        <img src={this.state.poster} alt={this.state.title} />
        <div className="movie__data">
          <div className="movie__header">
            <h4 className="movie__title">{this.state.title}</h4>
            <h5 className="movie__subtitle">{this.state.subtitle}</h5>
          </div>

          <div className="movie__info">
            <p className="movie__openat">
              <span>개봉일</span> {this.state.openAt}
            </p>

            <p className="movie__status">
              <span>제작상태</span> {this.state.status}
            </p>
          </div>

          <div className="movie__info">
            <p className="movie__audits">
              <span>관람등급</span> {this.state.audits}
            </p>

            <p className="movie__showtimes">
              <span>상영시간</span> {this.state.showTimes}
            </p>

            <p className="movie__nations">
              <span>제작국가</span> {this.state.nations}
            </p>
          </div>

          <div className="movie__info">
            <p className="movie__directors">
              <span>감독</span> {this.state.directors}
            </p>

            <p className="movie__genres">
              <span>장르</span> {this.state.genres}
            </p>

            <p className="movie__distributor">
              <span>배급사</span> {this.state.distributor}
            </p>
          </div>

          <div className="movie__info">
            <p className="movie__review">
              <a href={"https://www.naver.com"}> 리뷰 더보기 </a>
            </p>
          </div>
          <div className="Test">
            <span class={this.state.openAt} onClick={this.update}>
              <span class="blind">더보기 </span>
            </span>

            <div className={"board_" + this.state.openAt}>
              <p>리뷰내용</p>
              <div class="chartdemo">
                <RadarChart captions={captions} data={data} size={160} />
              </div>
              <div class="worddemo">
                {/* <ReactWordcloud
                  minsize={[120, 100]}
                  maxWords={15}
                  options={options}
                  words={words}
                /> */}
                <img src={word4} alt="word4" width="160" height="160" />
              </div>

              {/* <div class="button_div" style={radarChart_style}>
                <input type="button" id="button1" value="버튼1" />
              </div> */}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

// const word_style = {
//   width: "150",
//   height: "150"
// };

Movie.propTypes = {
  id: PropTypes.string.isRequired
};

export default Movie;
