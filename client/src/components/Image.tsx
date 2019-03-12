import React from 'react';
import * as rx from 'rxjs';
import {first, flatMap} from 'rxjs/operators';

interface Label {
    type: string;
    age: string;
    coordinates: [[number, number], [number, number]];
}

interface DataShape {
    _id?: string;
    title?: string;
    image?: string;
    canines: Array<Label>;
}

interface ImageProps {
    key: string;
    value: string;
}

class Image extends React.Component<ImageProps, {}> {
    state = {
        value: null,
        response: ({canines: []} as DataShape),
    }

    constructor(props: any) {
        super(props);
    }

    componentDidMount() {
        this.setState({value: this.props})
        this.callBackendAPI(this.props.value);
    }

    callBackendAPI(id: string) {
        const observable = rx.from(fetch(`/api/photos/${id}`));
        observable
            .pipe(flatMap(res => rx.from(res.json())))
            .pipe(first())
            .subscribe(json => this.setState({response: json.express}));
    }

    render() {
        if (this.state.response.image) {
            return (
                <div className="container">
                    <div className="image-title">
                        {this.state.response.title}
                    </div>
                    <img src={this.state.response.image} />
                </div>                
            )
        }
        return null;
    }
}

export default Image;
