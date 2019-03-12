import React from 'react';
import Image from './components/Image';
import './App.css';

class App extends React.Component {
  state = {data: []};

  componentDidMount() {
    this.callBackendAPI(`/api/photos/`)
      .then(res => {
        let dataResult = res.express.map((obj: any) => obj._id);
        this.setState({data: dataResult});
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

  render() {
    return (
      <div className="app">
        <div className="app-intro">
          {this.state.data.map((value) => this.renderImage(value))}
        </div>
      </div>
    );
  }
}

export default App;
