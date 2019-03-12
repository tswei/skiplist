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

interface Rectangle {
    x: number;
    y: number;
    width: number;
    height: number;
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

    coordinates(coords: [[number, number], [number, number]]): Rectangle {
        const [topLeft, bottomRight] = coords;
        const [tlx, tly] = topLeft;
        const [brx, bry] = bottomRight;
        return {
            x: tlx,
            y: tly,
            width: brx - tlx,
            height: bry - tly,
        }
    }

    render() {
        if (this.state.response.image) {
            return (
                <div className="container">
                    <div className="image-title">
                        {this.state.response.title}
                    </div>
                    <svg height="450" width="640">
                        <image href={this.state.response.image} width="640" />
                        {
                            this.state.response.canines.map((label, i) => {
                                let box = this.coordinates(label.coordinates);
                                return <rect key={i} x={box.x} y={box.y} height={box.height} width={box.width} stroke="#01ff00" stroke-width="3" fill="none" />
                            })
                        }
                    </svg>
                </div>                
            )
        }
        return null;
    }
}

export default Image;
