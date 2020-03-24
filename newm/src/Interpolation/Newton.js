import React, { Component } from 'react'
import {Card, Input, Button, Table} from 'antd';
import '../screen.scss';
import 'antd/dist/antd.css';
const InputStyle = {
    background: "#f58216",
    color: "white", 
    fontWeight: "bold", 
    fontSize: "24px"

};
var columns = [
    {
      title: "No.",
      dataIndex: "no",
      key: "no"
    },
    {
        title: "X",
        dataIndex: "x",
        key: "x"
    },
    {
        title: "Y",
        dataIndex: "y",
        key: "y"
    }
];
var x, y, tableTag,  interpolatePoint, tempTag, fx

class Newton extends Component {
    
    constructor() {
        super();
        x = []
        y = []
        interpolatePoint = []
        tempTag = []
        tableTag = []
        this.state = {
            nPoints: 0,
            X: 0,
            interpolatePoint: 0,
            showInputForm : true,
            showInputButton: true,
            showTableInput: false,
            showTableButton: false,
            showOutputCard: false
        }
        this.handleChange = this.handleChange.bind(this);
        this.newton_difference = this.newton_difference.bind(this);
    
    }  
    createTableInput(n) {
        for (var i=1 ; i<=n ; i++) {
            x.push(<Input style={{
                width: "100%",
                height: "50%", 
                backgroundColor:"black", 
                marginInlineEnd: "5%", 
                marginBlockEnd: "5%",
                color: "white",
                fontSize: "18px",
                fontWeight: "bold"
            }}
            id={"x"+i} key={"x"+i} placeholder={"x"+i}/>);
            y.push(<Input style={{
                width: "100%",
                height: "50%", 
                backgroundColor:"black", 
                marginInlineEnd: "5%", 
                marginBlockEnd: "5%",
                color: "white",
                fontSize: "18px",
                fontWeight: "bold"
            }} 
            id={"y"+i} key={"y"+i} placeholder={"y"+i}/>);   
            tableTag.push({
                no: i,
                x: x[i-1],
                y: y[i-1]
            });
        }


        this.setState({
            showInputForm: false,
            showInputButton: false,
            showTableInput: true,
            showTableButton: true
        })
    }
    createInterpolatePointInput(){
        for (var i=1 ; i<=this.state.interpolatePoint ; i++) {
            tempTag.push(<Input style={{
                width: "14%",
                height: "50%", 
                backgroundColor:"black", 
                marginInlineEnd: "5%", 
                marginBlockEnd: "5%",
                color: "white",
                fontSize: "18px",
                fontWeight: "bold"
            }} 
            id={"p"+i} key={"p"+i} placeholder={"p"+i} />)
        }
    }
    initialValue() {
        x = []
        y = []
        for (var i=1 ; i<=this.state.nPoints ; i++) {
            x[i] = parseFloat(document.getElementById("x"+i).value);
            y[i] = parseFloat(document.getElementById("y"+i).value);
        }
        for (i=1 ; i<=this.state.interpolatePoint ; i++) {
            interpolatePoint[i] = parseInt(document.getElementById("p"+i).value);
        }
    }
    C(x1, x2) {
        return (y[x1] - y[x2])/(x[x1] - x[x2]);
        
    }

    newton_difference(n, X) {
        this.initialValue()
        var C = this.C(interpolatePoint[n], interpolatePoint[1]) //initial C1
        var count = 1
        fx = y[interpolatePoint[1]] + C*(parseInt(this.state.X)-x[1]); //inital fx = C0 + C1(x-x0)
        if (n !== 2) { //if not Linear Interpolation
            do {
                for (var i=n ; i>=2 ; i--) {
                    C -= this.C(interpolatePoint[i], interpolatePoint[i-1]);
                }
                C /= (interpolatePoint[n] - interpolatePoint[1]);
                for (i=1 ; i<=n ; i++) {
                    C *= X - x[i];
                }
                fx += C;
                count++;
            }while (count !== n); 
        }
        this.setState({
            showOutputCard: true
        })

    } 


    handleChange(event) {
        this.setState({
            [event.target.name]: event.target.value
        });
    }
    render() {
        return(
            <div style={{ background: "#FFFF", padding: "30px" }}>
                <h2 style={{color: "black", fontWeight: "bold"}}>Newton's Divided Differences Interpolation</h2>
                <div>
                    <Card
                      bordered={true}
                      style={{ width: 400, background: "#f44336", color: "#FFFFFFFF", float:"left"}}
                      onChange={this.handleChange}
                    >
                        {this.state.showTableInput && 
                        <div>
                            <Table columns={columns} dataSource={tableTag} pagination={false} bordered={true} bodyStyle={{fontWeight: "bold", fontSize: "18px", color: "white" , overflowY: "scroll", minWidth: 120, maxHeight: 300}}></Table>
                            <br/><h2>interpolatePoint {parseInt(this.state.interpolatePoint) === 2 ? "(Linear)": 
                                                       parseInt(this.state.interpolatePoint) === 3 ? "(Quadratic)" :
                                                       "(Polynomial)"}</h2>{tempTag}
                        </div>}
                        
                        {this.state.showInputForm && 
                            <div>
                                <h2>Number of points(n)</h2><Input size="large" name="nPoints" style={InputStyle}></Input>
                                <h2>X</h2><Input size="large" name="X" style={InputStyle}></Input>
                                <h2>interpolatePoint</h2><Input size="large" name="interpolatePoint" style={InputStyle}></Input>
                            </div> 
                        }
                        <br></br>
                        {this.state.showInputButton && 
                            <Button id="dimention_button" onClick= {
                                ()=>{this.createTableInput(parseInt(this.state.nPoints));
                                this.createInterpolatePointInput()}
                            }  
                                style={{background: "#4caf50", color: "white", fontSize: "20px"}}>
                                Submit<br></br>
                            </Button>
                        }
                        {this.state.showTableButton && 
                            <Button 
                                id="matrix_button"  
                                style={{background: "blue", color: "white", fontSize: "20px"}}
                                onClick={()=>this.newton_difference(parseInt(this.state.interpolatePoint), parseFloat(this.state.X))}>
                                Submit
                            </Button>
                        }
                        
                    </Card>
                    

                    {this.state.showOutputCard &&
                        <Card
                        title={"Output"}
                        bordered={true}
                        style={{width: "50%", border: "2px solid black", background: "rgb(61, 104, 61) none repeat scroll 0% 0%", color: "white", float: "left", marginInlineStart: "4%"}}
                        >
                        <p style={{fontSize: "24px", fontWeight: "bold"}}>{fx}</p>
                            
                        </Card>                        
                    }

                   
                </div>

                
            </div>
        );
    }
}
export default Newton;



