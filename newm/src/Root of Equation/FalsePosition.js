import React, { Component } from 'react'

import { Button, InputGroup, FormControl, DropdownButton, Dropdown } from 'react-bootstrap'
import './Bisection.css';
import { Table } from 'antd';
import { compile } from 'mathjs';
import { LineChart, Line, CartesianGrid, XAxis, YAxis ,Tooltip } from 'recharts';
import { Card } from 'antd';
import axios from 'axios'
var dataSource = [
],mongo;
const columns = [
    {
        title: "Iteration",
        dataIndex: "iteration",
        key: "iteration"
    },
    {
        title: "XL",
        dataIndex: "l",
        key: "l"
    },
    {
        title: "XR",
        dataIndex: "r",
        key: "r"
    },
    {
        title: "XM",
        dataIndex: "m",
        key: "m"
    },
    {
        title: "Error",
        dataIndex: "Error",
        key: "Error"
    }
];
class FalsePosition extends Component {


    constructor() {
        super();
        this.state = {
            fx: '',
            xl: '',
            xr: '',
            showTable: false,
            
        };
        this.handleChange = this.handleChange.bind(this);
    }
    componentDidMount() {
        console.log('response');
        axios.get('http://localhost:80/mongoDB/falsePosition')
            .then(function (response) {

                console.log(response);

                mongo = response

            })

    }
    handleauto(n) {
        this.setState({
            fx: mongo.data[n - 1].fx,
            xl: mongo.data[n - 1].xl,
            xr: mongo.data[n - 1].xr
        })
    }
    handleChange(event) {
        this.setState({ [event.target.name]: event.target.value });

    }

    fx(X) {
        var expr = compile(this.state.fx);
        var scope = { x: parseFloat(X) };

        return expr.evaluate(scope);
    }
    FalsePosition(xl, xr) {
        dataSource = [];
        var n = 0;
        var point, xmn;
        var xm = (xl*this.fx(xr) - xr*this.fx(xl))/(this.fx(xr)-this.fx(xl))
        if (this.fx(xm) * this.fx(xr) > 0) {
            xr = xm
        }
        else {
            xl = xm
        }
        point = 1
        dataSource.push({
            iteration: n,
            l: xl.toFixed(6),
            r: xr.toFixed(6),
            m: xm.toFixed(6),
            Error: point.toFixed(6)
        })


        do {

            xmn = (xl*this.fx(xr) - xr*this.fx(xl))/(this.fx(xr)-this.fx(xl))
            if (this.fx(xmn) * this.fx(xr) > 0) {
                xr = xmn
            }
            else {
                xl = xmn
            }
            point = Math.abs((xmn - xm) / xmn);
            xm = xmn
            dataSource.push({
                iteration: n + 1,
                l: xl.toFixed(6),
                r: xr.toFixed(6),
                m: xm.toFixed(6),
                Error: point.toFixed(6)
                
            })
            n++;
        } while (point.toFixed(6) > 0.000001)
        
        this.setState({
            showTable: true,
        })

    }
    render() {
        return (
            <div className="Bisection" >
                <h1>FalsePosition</h1>
                <div style={{ padding: "10% 20%" }}>

                <InputGroup className="mb-3" size="lg">
                        <DropdownButton
                            as={InputGroup.Prepend}
                            variant="outline-secondary"
                            title="F(X)"
                            id="input-group-dropdown-1"
                        >
                            <Dropdown.Item onClick={() => this.handleauto(1)}>x^4-13</Dropdown.Item>
                            <Dropdown.Item onClick={() => this.handleauto(2)}>43x-1</Dropdown.Item>
                            <Dropdown.Item onClick={() => this.handleauto(3)}>x^2-13</Dropdown.Item>
                            

                        </DropdownButton>
                        <FormControl aria-label="Large" aria-describedby="inputGroup-sizing-sm" name="fx" placeholder=" " value={this.state.fx} onChange={this.handleChange} />
                    </InputGroup>
                    <br />
                    <InputGroup size="lg" >
                        <InputGroup.Prepend >
                            <InputGroup.Text id="inputGroup-sizing-lg" >XL</InputGroup.Text>
                        </InputGroup.Prepend>
                        <FormControl aria-label="Large" aria-describedby="inputGroup-sizing-sm" name="xl" value={this.state.xl} placeholder=" " onChange={this.handleChange} />
                    </InputGroup>
                    <br />
                    <InputGroup size="lg" >
                        <InputGroup.Prepend >
                            <InputGroup.Text id="inputGroup-sizing-lg">XR</InputGroup.Text>
                        </InputGroup.Prepend>
                        <FormControl aria-label="Large" aria-describedby="inputGroup-sizing-sm" name="xr" value={this.state.xr} placeholder=" " onChange={this.handleChange} />
                    </InputGroup>
                    <br />
                    <Button variant="outline-primary" onClick={() => this.FalsePosition(parseFloat(this.state.xl), parseFloat(this.state.xr))}>Submit</Button>
                    <br /><br />
                    {this.state.showTable &&
                        <Table dataSource={dataSource}columns={columns}  pagination={{ pageSize: 10 }} scroll={{ y: 340 }} />
                    }
                    {this.state.showTable &&<Card className="Bisection-Gh" >
                        <LineChart width={500} height={300} data={dataSource}>
                            <Line type=" " dataKey="Error" stroke="#8884d8" />
                            <CartesianGrid stroke="#ccc" />
                            <XAxis dataKey="iteration" />
                            <YAxis />
                            <Tooltip />
                        </LineChart>
                    </Card>}
                </div>
            </div>
        )
    }




}
export default FalsePosition;
