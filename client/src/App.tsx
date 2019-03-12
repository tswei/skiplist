import React from 'react';
import Image from './components/Image';
import Slider from 'react-slick';
import './App.css';

class App extends React.Component {
  state = {data: [], nextImage: undefined, prevImage: undefined, currentIndex: 0};

  componentDidMount() {
    this.callBackendAPI(`/api/photos/`)
      .then(res => {
        let dataResult = res.express.map((obj: any) => obj._id);
        this.setState({data: dataResult});
        this.updateCurrentIndex(this, 0);
      })
      .catch(err => console.log(err));
  }

  callBackendAPI = async (url: string) => {
    const response = await fetch(url);
    const body = await response.json();

    if (response.status !== 200) {
      throw Error(body.message);
    }

    return body;
  }

  renderImage(id: string) {
    if (id) {
      return <Image key={id} value={id} />;
    }
  }

  getNextImage(self: any, valueChange: number, fn: () => any) {
    return () => {
      self.updateCurrentIndex(self, valueChange);
      return fn();
    }
  }

  updateCurrentIndex(self: any, value: number) {
    let cur = self.state.currentIndex;
    let samples = self.state.data.length;
    let nextIdx = (cur + value + samples) % samples;
    let nextImage = (nextIdx + 1 + samples) % samples;
    let prevImage = (nextIdx - 1 + samples) % samples;
    self.setState({currentIndex: nextIdx});
    self.callBackendAPI(`/api/photos/${self.state.data[nextImage]}`)
      .then((res: any) => {
        let result = res.express.image;
        self.setState({nextImage: result});
      })
      .catch((err: any) => console.log(err));
    self.callBackendAPI(`/api/photos/${self.state.data[prevImage]}`)
      .then((res: any) => {
        let result = res.express.image;
        self.setState({prevImage: result});
      })
      .catch((err: any) => console.log(err));
  }

  SampleNextArrow(props: any) {
    const {className, style, onClick, image, self} = props;
    const clickFunction = self.getNextImage(self, 1, onClick);

    return (
      <div
        className={className}
        style={{
          ...style,
          display: "block",
          opacity: ".6",
          transform: "rotateY(-45deg)",
        }}
        onClick={clickFunction}>
        <img src={image} className={"next-image"}/>
      </div>
    )
  }

  SamplePrevArrow(props: any) {
    const {className, style, onClick, image, self} = props;
    const clickFunction = self.getNextImage(self, -1, onClick);

    return (
      <div
        className={className}
        style={{
          ...style,
          display: "block",
          opacity: ".6",
          transform: "rotateY(45deg)",
        }}
        onClick={clickFunction}>
        <img src={image} className={"prev-image"}/>
      </div>
    )
  }

  render() {
    const settings = {
      dots: true,
      infinite: true,
      speed: 500,
      slidesToShow: 1,
      slidesToScroll: 1,
      nextArrow: <this.SampleNextArrow image={this.state.nextImage} self={this}/>,
      prevArrow: <this.SamplePrevArrow image={this.state.prevImage} self={this}/>,
    }

    return (
      <div className="app">
        <div className="app-intro">
          <Slider {...settings}>
            {this.state.data.map((value) => this.renderImage(value))}
          </Slider>
        </div>
      </div>
    );
  }
}

export default App;
