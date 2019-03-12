import React from 'react';
import * as rx from 'rxjs';
import {first, flatMap} from 'rxjs/operators';
import CustomizedTable from './CustomizedTable';

// define data interfaces
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

interface DataRow {
    type: string;
    age: string;
    qty: number;
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

    // take provided coordinates and translate into svg rectangle components
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

    // take listed labels and convert into table row information
    tableInfo(labels: Array<Label>): Array<DataRow> {
        const counter = new Map<string, Map<string, number>>();
        labels.map(label => {
            let type = counter.get(label.type) || new Map<string, number>();
            let ageCount = type.get(label.age) || 0;
            type.set(label.age, ageCount + 1);
            counter.set(label.type, type);
        })
        const rows: Array<DataRow> = [];
        Array.from(counter).map(([type, value]) => {
            Array.from(value).map(([age, qty]) => {
                rows.push({type, age, qty});
            });
        });
        return rows;
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
                    <CustomizedTable tableData={this.tableInfo(this.state.response.canines)} />
                </div>                
            )
        }
        return null;
    }
}

export default Image;
